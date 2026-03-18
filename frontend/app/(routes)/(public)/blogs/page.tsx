'use client';

import { Fragment, useRef } from 'react';

import { useRouter, useSearchParams } from 'next/navigation';
import { PiList } from 'react-icons/pi';
import { CiCalendar, CiGrid41, CiRead } from 'react-icons/ci';

import { useBlogsQuery, useBlogSourcesQuery } from '@/app/api/blogs/blogs.queries';
import { useIncrementViewsMutation } from '@/app/api/blogs/blogs.mutations';

import { useInfiniteScrollObserver } from '@/app/shared/hooks/useInfiniteScrollObserver';
import { buildRelativeTime, formatDate } from '@/app/shared/utils/date';

import { BLOG_MARQUEE_ITEMS } from '@/app/(routes)/(public)/blogs/_constants/marquee.constants';
import { createHandleToggleView } from '@/app/(routes)/(public)/blogs/_handlers/toggleView.handlers';
import { createHandleEntryClick } from '@/app/(routes)/(public)/blogs/_handlers/entryClick.handlers';
import { handleFaviconError } from '@/app/(routes)/(public)/blogs/_utils/favicon.utils';

import styles from '@/app/(routes)/(public)/blogs/BlogsPage.module.css';

/**
 * 기술 블로그 페이지
 * @description 외부 기술 블로그 게시글을 모아서 보여주는 목록 페이지
 */
export default function BlogsPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const sentinelRef = useRef<HTMLDivElement>(null);
  const activeView = searchParams.get('view') === 'sources' ? 'sources' : 'feeds';
  const { data: sourcesData } = useBlogSourcesQuery();
  const { data, hasNextPage, isFetchingNextPage, fetchNextPage } = useBlogsQuery();
  const { mutate: incrementViews } = useIncrementViewsMutation();

  // 핸들러
  const handleToggleView = createHandleToggleView(router, activeView);
  const handleEntryClick = createHandleEntryClick(incrementViews);

  // 무한스크롤
  const entries = data?.pages.flatMap(page => page.items) ?? [];

  useInfiniteScrollObserver({
    targetRef: sentinelRef,
    hasNextPage,
    isFetchingNextPage,
    fetchNextPage,
    enabled: activeView === 'feeds',
  });

  // 파비콘 목록 (무한 반복을 위해 2배로 복제)
  const marqueeItems = [...BLOG_MARQUEE_ITEMS, ...BLOG_MARQUEE_ITEMS];

  return (
    <main className={styles.page}>
      <div className={styles.marqueeWrapper}>
        <div className={styles.marqueeTrack}>
          {marqueeItems.map((item, i) => (
            <a
              key={`${item.favicon}-${i}`}
              href={item.url}
              target="_blank"
              rel="noopener noreferrer"
            >
              <img
                className={styles.marqueeFavicon}
                src={`https://www.google.com/s2/favicons?domain=${item.favicon}&sz=64`}
                alt=""
                loading="lazy"
              />
            </a>
          ))}
        </div>
      </div>

      <section className={styles.shell} aria-label="기술 블로그">
        {/* 뷰 모드 토글 */}
        <button
          type="button"
          className={styles.toggleButton}
          onClick={handleToggleView}
          aria-label={activeView === 'feeds' ? '등록된 블로그 보기' : '글 목록 보기'}
        >
          {activeView === 'feeds' ? <CiGrid41 /> : <PiList />}
        </button>

        {activeView === 'sources' ? (
          <ul className={styles.sourcesList} onError={handleFaviconError}>
            {(sourcesData ?? []).map(source => (
              <li key={source.name} className={styles.sourcesItem}>
                <a
                  href={source.domain}
                  target="_blank"
                  rel="noopener noreferrer"
                  className={styles.sourcesLink}
                >
                  <img
                    className={styles.sourcesFavicon}
                    src={`https://www.google.com/s2/favicons?domain=${source.domain}&sz=32`}
                    alt=""
                    data-domain={source.domain}
                  />
                  <span className={styles.sourcesName}>{source.name}</span>
                </a>
              </li>
            ))}
          </ul>
        ) : (
          <>
            <ul className={styles.blogList} onClick={handleEntryClick} onError={handleFaviconError}>
              {entries.map((entry, index) => (
                <Fragment key={entry.id}>
                  {index > 0 && <div className={styles.blogDivider} aria-hidden="true" />}
                  <li>
                    <a
                      href={entry.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className={styles.blogItemLink}
                      data-entry-id={entry.id}
                    >
                      <article className={styles.blogItemCard}>
                        <div className={styles.blogItemContent}>
                          <h3 className={styles.blogItemTitle}>{entry.title}</h3>
                          <p className={styles.blogItemMeta}>
                            <span className={styles.blogItemMetaItem}>
                              <img
                                className={styles.blogItemFavicon}
                                src={`https://www.google.com/s2/favicons?domain=${entry.domain}&sz=32`}
                                alt=""
                                data-domain={entry.domain}
                              />
                              {entry.source}
                            </span>
                            <span className={styles.separator}>|</span>
                            <span className={styles.blogItemMetaItem}>
                              <CiCalendar />
                              {formatDate(entry.publishedAt, 'date-only')}
                            </span>
                            <span className={styles.separator}>|</span>
                            <span className={styles.blogItemMetaItem}>
                              <CiRead />
                              {entry.views.toLocaleString()}
                            </span>
                          </p>
                        </div>
                        <span className={styles.blogItemTime}>{buildRelativeTime(entry.publishedAt)}</span>
                      </article>
                    </a>
                  </li>
                </Fragment>
              ))}
            </ul>
            <div ref={sentinelRef} />
          </>
        )}
      </section>
    </main>
  );
}
