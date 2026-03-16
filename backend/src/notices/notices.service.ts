import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

import { User } from '../auth/entities/user.entity';
import { SnowflakeService } from '../common/services/snowflake.service';

import { CreateNoticeDto } from './dto/createNotice.dto';
import { UpdateNoticeDto } from './dto/updateNotice.dto';
import { NoticeReaction } from './entities/noticeReaction.entity';
import { Notice, NoticeType } from './entities/notice.entity';

import type {
  CreateNoticeView,
  NoticeDetailView,
  NoticeReactionItemView,
  NoticesListView,
  ToggleNoticeReactionView,
} from './notices.types';

@Injectable()
export class NoticesService {
  /**
   * 공지 서비스
   * @description 공지 목록 조회와 리액션 토글을 처리합니다.
   */
  constructor(
    @InjectRepository(User)
    private readonly usersRepository: Repository<User>,
    @InjectRepository(Notice)
    private readonly noticesRepository: Repository<Notice>,
    @InjectRepository(NoticeReaction)
    private readonly noticeReactionsRepository: Repository<NoticeReaction>,
    private readonly snowflakeService: SnowflakeService,
  ) {}

  /**
   * 공지 목록 조회
   * @description 공지사항과 업데이트 내역을 현재 사용자 기준으로 조회합니다.
   */
  async getNotices(userId?: string): Promise<NoticesListView> {
    // 목록/조회
    const notices = await this.noticesRepository.find({
      order: { publishedAt: 'DESC' },
      relations: { reactions: true, admin: true },
    });

    return {
      announcements: notices
        .filter(notice => notice.type === NoticeType.ANNOUNCEMENT)
        .map(notice => ({
          id: notice.id,
          title: notice.title,
          publishedAt: this.formatNoticeDate(notice.publishedAt),
        })),
      updates: notices
        .filter(notice => notice.type === NoticeType.UPDATE)
        .map(notice => ({
          id: notice.id,
          version: notice.version ?? '',
          title: notice.title,
          publishedAt: this.formatNoticeDate(notice.publishedAt),
          publishedLabel: this.buildPublishedLabel(notice.publishedAt),
          adminName: notice.admin?.name ?? notice.adminName ?? '운영팀',
          adminInitial: notice.admin?.name?.trim().charAt(0) ?? notice.adminInitial ?? '운',
          adminProfileImageUrl: notice.admin?.profileImageUrl ?? null,
          releaseType: notice.releaseType ?? 'Update',
          releaseScope: notice.releaseScope ?? 'Web',
          reactorCount: this.countReactors(notice.reactions),
          selectedEmojis: this.getSelectedEmojis(notice.reactions, userId),
          reactions: this.buildReactionItems(notice.reactions),
          markdownContent: notice.markdownContent ?? '',
        })),
    };
  }

  /**
   * 공지 상세 조회
   * @description 공지사항 ID로 단건 조회합니다.
   */
  async getNotice(noticeId: string): Promise<NoticeDetailView> {
    const notice = await this.noticesRepository.findOne({
      where: { id: this.normalizeId(noticeId) },
    });

    if (!notice) {
      throw new NotFoundException('공지를 찾을 수 없습니다.');
    }

    return {
      id: notice.id,
      type: notice.type,
      title: notice.title,
      publishedAt: this.formatNoticeDate(notice.publishedAt),
      markdownContent: notice.markdownContent ?? '',
      version: notice.version ?? null,
      releaseType: notice.releaseType ?? null,
      releaseScope: notice.releaseScope ?? null,
    };
  }

  /**
   * 공지 생성
   * @description 관리자 작성 입력값으로 공지사항 또는 업데이트 내역을 생성합니다.
   */
  async createNotice(body: CreateNoticeDto, adminUserId: string): Promise<CreateNoticeView> {
    // 관리자/조회
    const adminUser = await this.usersRepository.findOne({
      where: { id: this.normalizeId(adminUserId) },
    });

    if (!adminUser) {
      throw new NotFoundException('관리자 정보를 찾을 수 없습니다.');
    }

    // 값/생성
    const notice = this.noticesRepository.create({
      id: this.snowflakeService.generate(),
      type: body.type,
      title: body.title.trim(),
      version: body.version?.trim() || null,
      adminId: adminUser.id,
      adminName: adminUser.name,
      adminInitial: adminUser.name.trim().charAt(0) || '운',
      releaseType: body.releaseType?.trim() || null,
      releaseScope: body.releaseScope?.trim() || null,
      markdownContent: body.markdownContent.trim(),
      publishedAt: body.publishedAt ? new Date(body.publishedAt) : new Date(),
    });

    await this.noticesRepository.save(notice);

    return {
      id: notice.id,
      type: notice.type,
    };
  }

  /**
   * 공지 수정
   * @description 공지사항 ID로 공지를 수정합니다.
   */
  async updateNotice(noticeId: string, body: UpdateNoticeDto): Promise<{ id: string }> {
    const safeNoticeId = this.normalizeId(noticeId);

    const notice = await this.noticesRepository.findOne({
      where: { id: safeNoticeId },
    });

    if (!notice) {
      throw new NotFoundException('공지를 찾을 수 없습니다.');
    }

    if (body.title !== undefined) notice.title = body.title.trim();
    if (body.version !== undefined) notice.version = body.version.trim() || null;
    if (body.releaseType !== undefined) notice.releaseType = body.releaseType.trim() || null;
    if (body.releaseScope !== undefined) notice.releaseScope = body.releaseScope.trim() || null;
    if (body.markdownContent !== undefined) notice.markdownContent = body.markdownContent.trim();
    if (body.publishedAt !== undefined) notice.publishedAt = new Date(body.publishedAt);

    await this.noticesRepository.save(notice);

    return { id: safeNoticeId };
  }

  /**
   * 공지 삭제
   * @description 공지사항 ID로 공지와 관련 리액션을 삭제합니다.
   */
  async deleteNotice(noticeId: string): Promise<{ id: string }> {
    const safeNoticeId = this.normalizeId(noticeId);

    const notice = await this.noticesRepository.findOne({
      where: { id: safeNoticeId },
    });

    if (!notice) {
      throw new NotFoundException('공지를 찾을 수 없습니다.');
    }

    await this.noticeReactionsRepository.delete({ noticeId: safeNoticeId });
    await this.noticesRepository.remove(notice);

    return { id: safeNoticeId };
  }

  /**
   * 공지 리액션 토글
   * @description 특정 업데이트 공지에 대한 사용자 이모지 리액션을 토글합니다.
   */
  async toggleReaction(noticeId: string, userId: string, emoji: string): Promise<ToggleNoticeReactionView> {
    // 입력/정규화
    const safeEmoji = this.normalizeEmoji(emoji);
    const safeUserId = this.normalizeId(userId);
    const safeNoticeId = this.normalizeId(noticeId);

    // 공지/조회
    const notice = await this.noticesRepository.findOne({
      where: { id: safeNoticeId, type: NoticeType.UPDATE },
    });

    if (!notice) {
      throw new NotFoundException('업데이트 공지를 찾을 수 없습니다.');
    }

    // 기존/조회
    const existing = await this.noticeReactionsRepository.findOne({
      where: { emoji: safeEmoji, noticeId: safeNoticeId, userId: safeUserId },
    });

    // 토글/처리
    if (existing) {
      await this.noticeReactionsRepository.remove(existing);
    } else {
      await this.noticeReactionsRepository.save(
        this.noticeReactionsRepository.create({
          emoji: safeEmoji,
          noticeId: safeNoticeId,
          userId: safeUserId,
        }),
      );
    }

    // 결과/조회
    const reactions = await this.noticeReactionsRepository.find({
      where: { noticeId: safeNoticeId },
      order: { createdAt: 'ASC' },
    });

    const selectedEmojis = reactions.filter(reaction => reaction.userId === safeUserId).map(reaction => reaction.emoji);

    return {
      noticeId: safeNoticeId,
      reactorCount: this.countReactors(reactions),
      reactions: this.buildReactionItems(reactions),
      selectedEmojis,
    };
  }

  /**
   * 공지 날짜 포맷
   * @description 서버 응답용 공지 날짜를 YYYY.MM.DD 형식으로 변환합니다.
   */
  private formatNoticeDate(value: Date) {
    const year = value.getFullYear();
    const month = String(value.getMonth() + 1).padStart(2, '0');
    const day = String(value.getDate()).padStart(2, '0');

    return `${year}.${month}.${day}`;
  }

  /**
   * 공지 상대 라벨 생성
   * @description 게시일 기준 상대 시간 라벨을 계산합니다.
   */
  private buildPublishedLabel(value: Date) {
    const today = new Date();
    const target = new Date(value);

    today.setHours(0, 0, 0, 0);
    target.setHours(0, 0, 0, 0);

    const diffDays = Math.floor((today.getTime() - target.getTime()) / (1000 * 60 * 60 * 24));

    if (diffDays <= 0) return '오늘 업데이트';
    if (diffDays === 1) return '어제 업데이트';
    if (diffDays < 30) return `${diffDays}일 전 업데이트`;

    const diffMonths = Math.floor(diffDays / 30);
    if (diffMonths < 12) return `${diffMonths}개월 전 업데이트`;

    const diffYears = Math.floor(diffMonths / 12);
    return `${diffYears}년 전 업데이트`;
  }

  /**
   * 반응 아이템 생성
   * @description 리액션 엔티티 배열을 이모지별 개수 목록으로 변환합니다.
   */
  private buildReactionItems(reactions: Array<Pick<NoticeReaction, 'emoji'>>) {
    // 개수/집계
    const counter = new Map<string, number>();

    reactions.forEach(reaction => {
      const count = counter.get(reaction.emoji) ?? 0;
      counter.set(reaction.emoji, count + 1);
    });

    return Array.from(counter.entries()).map<NoticeReactionItemView>(([emoji, count]) => ({
      emoji,
      count,
    }));
  }

  /**
   * 반응 사용자 수
   * @description 리액션을 남긴 고유 사용자 수를 계산합니다.
   */
  private countReactors(reactions: Array<Pick<NoticeReaction, 'userId'>>) {
    return new Set(reactions.map(reaction => reaction.userId)).size;
  }

  /**
   * 선택 이모지 목록
   * @description 현재 사용자 기준으로 선택된 이모지 배열을 추출합니다.
   */
  private getSelectedEmojis(reactions: NoticeReaction[], userId?: string) {
    if (!userId) {
      return [];
    }

    return reactions.filter(reaction => reaction.userId === userId).map(reaction => reaction.emoji);
  }

  /**
   * 문자열 ID 정규화
   * @description bigint 문자열 입력값을 검증 후 trim 처리합니다.
   */
  private normalizeId(value: string) {
    const normalized = value.trim();

    if (!normalized || !/^\d+$/.test(normalized)) {
      throw new BadRequestException('유효하지 않은 ID 형식입니다.');
    }

    return normalized;
  }

  /**
   * 이모지 정규화
   * @description 이모지 문자열 입력값을 trim 처리합니다.
   */
  private normalizeEmoji(value: string) {
    return value.trim();
  }
}
