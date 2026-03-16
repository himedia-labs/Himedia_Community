'use client';

import { Fragment } from 'react';

import { CiCalendar, CiRead } from 'react-icons/ci';

import { BLOG_ENTRIES } from '@/app/(routes)/(public)/blogs/_constants/blogEntries.constants';
import { formatDate, getRelativeTimeLabel } from '@/app/shared/utils/date';

import styles from '@/app/(routes)/(public)/blogs/BlogsPage.module.css';

/**
 * 기술 블로그 페이지
 * @description 외부 기술 블로그 게시글을 모아서 보여주는 목록 페이지
 */
export default function BlogsPage() {
  return (
    <main className={styles.page}>
      <section className={styles.shell} aria-label="기술 블로그">
        <ul className={styles.blogList}>
          {BLOG_ENTRIES.map((entry, index) => (
            <Fragment key={entry.id}>
              {index > 0 && <div className={styles.blogDivider} aria-hidden="true" />}
              <li>
                <a href={entry.url} target="_blank" rel="noopener noreferrer" className={styles.blogItemLink}>
                  <article className={styles.blogItemCard}>
                    <div className={styles.blogItemContent}>
                      <h3 className={styles.blogItemTitle}>{entry.title}</h3>
                      <p className={styles.blogItemMeta}>
                        <span className={styles.blogItemMetaItem}>
                          <img
                            className={styles.blogItemFavicon}
                            src={`https://www.google.com/s2/favicons?domain=${entry.domain}&sz=32`}
                            alt=""
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
                    <span className={styles.blogItemTime}>{getRelativeTimeLabel(entry.publishedAt)}</span>
                  </article>
                </a>
              </li>
            </Fragment>
          ))}
        </ul>
      </section>
    </main>
  );
}
