import { Injectable, Logger, NotFoundException, OnModuleInit } from '@nestjs/common';
import { Cron } from '@nestjs/schedule';
import { InjectRepository } from '@nestjs/typeorm';
import Parser from 'rss-parser';
import { LessThan, LessThanOrEqual, Repository } from 'typeorm';

import { SnowflakeService } from '../common/services/snowflake.service';

import { BLOG_FEED_SOURCES, BLOGS_CONFIG } from './blogs.constants';
import { BlogEntry } from './entities/blogEntry.entity';
import { BlogFeed } from './entities/blogFeed.entity';

import type { BlogEntriesResponse, BlogFeedSourceView } from './blogs.types';

/**
 * 블로그 서비스
 * @description RSS 피드 수집, 블로그 글 목록 조회, 조회수 관리
 */
@Injectable()
export class BlogsService implements OnModuleInit {
  private readonly logger = new Logger(BlogsService.name);
  private readonly parser = new Parser({
    timeout: BLOGS_CONFIG.FETCH_TIMEOUT_MS,
    headers: { Accept: '*/*' },
  });

  constructor(
    @InjectRepository(BlogFeed)
    private readonly feedsRepository: Repository<BlogFeed>,
    @InjectRepository(BlogEntry)
    private readonly entriesRepository: Repository<BlogEntry>,
    private readonly snowflakeService: SnowflakeService,
  ) {}

  // 초기화

  /**
   * 피드 소스 시드
   * @description 앱 시작 시 상수 피드 소스를 DB에 동기화
   */
  async onModuleInit() {
    // 신규 피드 등록
    const newFeeds: BlogFeed[] = [];

    for (const source of BLOG_FEED_SOURCES) {
      // feedUrl 또는 domain으로 기존 레코드 탐색
      const existing =
        (await this.feedsRepository.findOneBy({ feedUrl: source.feedUrl })) ||
        (await this.feedsRepository.findOneBy({ domain: source.domain }));

      if (existing) {
        // 변경된 필드 동기화
        const changed =
          existing.domain !== source.domain ||
          existing.name !== source.name ||
          existing.feedUrl !== source.feedUrl;

        if (changed) {
          existing.domain = source.domain;
          existing.name = source.name;
          existing.feedUrl = source.feedUrl;
          await this.feedsRepository.save(existing);
          this.logger.log(`피드 소스 업데이트: ${source.name}`);
        }
        continue;
      }

      const feed = this.feedsRepository.create({
        id: this.snowflakeService.generate(),
        name: source.name,
        domain: source.domain,
        feedUrl: source.feedUrl,
        active: true,
      });
      await this.feedsRepository.save(feed);
      newFeeds.push(feed);
      this.logger.log(`피드 소스 등록: ${source.name}`);
    }

    // constants에 없는 피드 삭제 (CASCADE로 엔트리도 삭제)
    const allFeeds = await this.feedsRepository.find();
    const sourceDomains = new Set<string>(BLOG_FEED_SOURCES.map(s => s.domain));
    for (const feed of allFeeds) {
      if (!sourceDomains.has(feed.domain)) {
        await this.feedsRepository.remove(feed);
        this.logger.log(`피드 소스 삭제: ${feed.name || feed.domain}`);
      }
    }

    // 엔트리 없는 피드만 수집
    const feeds = await this.feedsRepository.findBy({ active: true });
    for (const feed of feeds) {
      const hasEntries = await this.entriesRepository.existsBy({ feedId: feed.id });
      if (hasEntries) continue;

      try {
        this.logger.log(`피드 수집 시작: ${feed.name}`);
        await this.fetchFeed(feed);
      } catch (error) {
        this.logger.warn(`피드 수집 실패 [${feed.name}]: ${error}`);
      }
    }
  }

  // RSS 수집

  /**
   * RSS 전체 수집
   * @description 활성 피드를 순회하며 새 글을 수집
   */
  @Cron(BLOGS_CONFIG.FETCH_CRON)
  async fetchAllFeeds() {
    const feeds = await this.feedsRepository.findBy({ active: true });
    let totalNew = 0;

    for (const feed of feeds) {
      try {
        const count = await this.fetchFeed(feed);
        totalNew += count;
      } catch (error) {
        this.logger.warn(`피드 수집 실패 [${feed.name}]: ${error}`);
      }
    }

    this.logger.log(`RSS 수집 완료: 신규 ${totalNew}건`);

    // 보존 기간 초과 엔트리 정리
    const cutoff = new Date();
    cutoff.setDate(cutoff.getDate() - BLOGS_CONFIG.RETENTION_DAYS);
    const { affected } = await this.entriesRepository.delete({ publishedAt: LessThanOrEqual(cutoff) });
    if (affected && affected > 0) {
      this.logger.log(`만료 엔트리 삭제: ${affected}건`);
    }
  }

  // 소스 목록

  /**
   * 피드 소스 목록
   * @description 등록된 블로그 피드 소스를 상수 정의 순서로 반환
   */
  async getSources(): Promise<BlogFeedSourceView[]> {
    const feeds = await this.feedsRepository.findBy({ active: true });

    // 상수 순서 기준 정렬
    const orderMap = new Map<string, number>(BLOG_FEED_SOURCES.map((s, i) => [s.domain, i]));

    return feeds
      .sort((a, b) => (orderMap.get(a.domain) ?? Infinity) - (orderMap.get(b.domain) ?? Infinity))
      .map(feed => ({ name: feed.name, domain: feed.domain }));
  }

  // 목록 조회

  /**
   * 블로그 글 목록
   * @description 커서 기반 페이지네이션으로 최신 글 반환
   */
  async getEntries(cursor?: string): Promise<BlogEntriesResponse> {
    const take = BLOGS_CONFIG.PAGE_SIZE;

    const where = cursor ? { publishedAt: LessThan(new Date(cursor)) } : {};

    const entries = await this.entriesRepository.find({
      where,
      relations: ['feed'],
      order: { publishedAt: 'DESC' },
      take: take + 1,
    });

    const hasNext = entries.length > take;
    if (hasNext) entries.pop();

    const items = entries.map(entry => ({
      id: entry.id,
      title: entry.title,
      source: entry.feed.name,
      domain: entry.feed.domain,
      url: entry.url,
      views: entry.views,
      publishedAt: entry.publishedAt.toISOString(),
    }));

    const nextCursor = hasNext ? items[items.length - 1].publishedAt : null;

    return { items, nextCursor };
  }

  // 조회수

  /**
   * 조회수 증가
   * @description 블로그 글의 조회수를 1 증가시키고 결과를 반환
   */
  async incrementViews(entryId: string): Promise<{ id: string; views: number }> {
    const entry = await this.entriesRepository.findOneBy({ id: entryId });
    if (!entry) throw new NotFoundException('블로그 글을 찾을 수 없습니다.');

    await this.entriesRepository.increment({ id: entryId }, 'views', 1);
    return { id: entryId, views: entry.views + 1 };
  }

  // 피드 파싱

  /**
   * 단일 피드 수집
   * @description 하나의 RSS 피드를 파싱하여 새 글을 저장
   */
  private async fetchFeed(feed: BlogFeed): Promise<number> {
    const parsed = await this.parser.parseURL(feed.feedUrl);
    let newCount = 0;

    for (const item of parsed.items) {
      if (!item.link || !item.title) continue;

      const exists = await this.entriesRepository.existsBy({ url: item.link });
      if (exists) continue;

      const entry = this.entriesRepository.create({
        id: this.snowflakeService.generate(),
        feedId: feed.id,
        title: item.title,
        url: item.link,
        publishedAt: item.pubDate ? new Date(item.pubDate) : new Date(),
        views: 0,
      });

      await this.entriesRepository.save(entry);
      newCount++;
    }

    return newCount;
  }
}
