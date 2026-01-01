'use client';

import { CiCalendar, CiGrid41 } from 'react-icons/ci';
import { FiEye } from 'react-icons/fi';
import { PiList } from 'react-icons/pi';

import usePostList from './postList.hooks';
import styles from './postList.module.css';
import type { TopPost } from '@/app/shared/types/post';

// 사이드바 상위 인기글(임시)
const TOP_POSTS: TopPost[] = [
  { id: 'backend-dream', title: '[무물보] 응답하라, 백엔드 개발자를 꿈꾸는 이유' },
  { id: 'fe-ground', title: "[FE Ground] 'AI x Front-End: 코딩 보조에서 동료로'" },
  { id: 'maft', title: 'AI로 E2E 테스트를 찍어내다: MAFT' },
  { id: 'student-backend', title: '백엔드를 꿈꾸는 학생개발자에게 해주고 싶은 말' },
  { id: 'copilot', title: '나만의 Visual Studio Code Copilot 세팅 가이드' },
];

export default function PostListSection() {
  const { viewMode, setViewMode, selectedCategory, setSelectedCategory, categoryNames, filteredPosts } = usePostList();

  return (
    <section className={styles.container} aria-label="포스트 하이라이트">
      <div className={styles.main}>
        <div className={styles.header}>
          <button
            type="button"
            className={styles.toggleButton}
            onClick={() => setViewMode(viewMode === 'list' ? 'card' : 'list')}
            aria-label={viewMode === 'list' ? '카드 보기' : '리스트 보기'}
          >
            {viewMode === 'list' ? <CiGrid41 /> : <PiList />}
          </button>
        </div>

        {viewMode === 'list' ? (
          <ul className={styles.listView}>
            {filteredPosts.map(post => (
              <li key={post.id}>
                <article className={styles.listItem}>
                  <div className={styles.listBody}>
                    <h3>{post.title}</h3>
                    <p className={styles.summary}>{post.summary}</p>
                    <div className={styles.meta}>
                      <span className={styles.metaItem}>
                        <CiCalendar aria-hidden="true" /> {post.date}
                      </span>
                      <span className={styles.separator} aria-hidden="true">
                        |
                      </span>
                      <span className={styles.metaItem}>
                        <FiEye aria-hidden="true" /> {post.views.toLocaleString()}
                      </span>
                      <span className={styles.separator} aria-hidden="true">
                        |
                      </span>
                      <span className={styles.metaItem}>{post.timeAgo}</span>
                    </div>
                  </div>
                  {post.imageUrl ? (
                    <div
                      className={styles.listThumb}
                      style={{
                        backgroundImage: `url(${post.imageUrl})`,
                      }}
                      aria-hidden="true"
                    />
                  ) : null}
                </article>
              </li>
            ))}
          </ul>
        ) : (
          <ul className={styles.cardGrid}>
            {filteredPosts.map(post => (
              <li key={post.id}>
                <article className={styles.cardItem}>
                  {post.imageUrl ? (
                    <div
                      className={styles.cardThumb}
                      style={{
                        backgroundImage: `url(${post.imageUrl})`,
                      }}
                      aria-hidden="true"
                    />
                  ) : null}
                  <div className={styles.cardBody}>
                    <h3>{post.title}</h3>
                    <p className={styles.summary}>{post.summary}</p>
                  </div>
                  <div className={styles.cardFooter}>
                    <span>{post.date}</span>
                    <span>·</span>
                    <span>{post.timeAgo}</span>
                  </div>
                </article>
              </li>
            ))}
          </ul>
        )}
      </div>

      <aside className={styles.sidebar} aria-label="TOP 5 인기글">
        <div className={styles.sidebarHeader}>
          <p className={styles.sidebarLabel}>
            TOP 5 <span className={styles.sidebarSubLabel}>(인기있는 글)</span>
          </p>
        </div>
        <ol className={styles.topList}>
          {TOP_POSTS.map((item, index) => (
            <li key={item.id}>
              <span className={styles.rank}>{index + 1}</span>
              <span className={styles.topTitle}>{item.title}</span>
            </li>
          ))}
        </ol>

        <div className={styles.categorySection}>
          <div className={styles.sidebarHeader}>
            <p className={styles.sidebarLabel}>
              CATEGORY <span className={styles.sidebarSubLabel}>(카테고리)</span>
            </p>
          </div>
          <div className={styles.categoryList}>
            {categoryNames.map(category => (
              <button
                key={category}
                type="button"
                className={
                  selectedCategory === category ? `${styles.categoryButton} ${styles.active}` : styles.categoryButton
                }
                onClick={() => setSelectedCategory(category)}
              >
                {category}
              </button>
            ))}
          </div>
        </div>
      </aside>
    </section>
  );
}
