import Link from 'next/link';
import Skeleton from 'react-loading-skeleton';

import EmptyState from '@/app/shared/components/empty/EmptyState';
import { createHandleSelectCategory } from '@/app/(routes)/(public)/main/_components/postList/_handlers';

import styles from '@/app/(routes)/(public)/main/_components/postList/postList.module.css';

import type { PostListSidebarProps } from '@/app/shared/types/post';

/**
 * 포스트 리스트 사이드바
 * @description 인기글과 카테고리 버튼 영역을 렌더링합니다.
 */
export default function PostListSidebar({
  selectedCategory,
  isSearchMode,
  isTopPostsLoading,
  isCategoriesLoading,
  topPosts,
  categoryNames,
  categorySkeletons,
  topSkeletons,
  setSelectedCategory,
}: PostListSidebarProps) {
  if (isSearchMode) {
    return null;
  }

  return (
    <aside className={styles.sidebar} aria-label="TOP 5 인기글">
      <div className={styles.sidebarHeader}>
        <p className={styles.sidebarLabel}>
          TOP 5 <span className={styles.sidebarSubLabel}>(인기있는 글)</span>
        </p>
      </div>
      {isTopPostsLoading ? (
        <ol className={styles.topList}>
          {topSkeletons.map((_, index) => (
            <li key={`top-skeleton-${index}`} aria-hidden="true">
              <span className={styles.rank}>
                <Skeleton width="1.2ch" height={14} />
              </span>
              <span className={styles.topTitle}>
                <Skeleton height={14} width="80%" />
              </span>
            </li>
          ))}
        </ol>
      ) : (
        <>
          <ol className={styles.topList}>
            {topPosts.map((item, index) => (
              <li key={item.id}>
                <span className={styles.rank}>{index + 1}</span>
                <Link className={styles.topTitle} href={`/posts/${item.id}`}>
                  {item.title}
                </Link>
              </li>
            ))}
            {topPosts.length === 0 ? (
              <li className={styles.topListEmpty}>
                <EmptyState
                  title="아직 인기 게시물이 없어요."
                  description="첫 번째 인기 글이 이곳에 표시됩니다."
                  size="compact"
                  align="left"
                  className={styles.topListEmptyState}
                />
              </li>
            ) : null}
          </ol>
        </>
      )}
      <div className={styles.sidebarDivider} aria-hidden="true" />
      <div className={styles.sidebarHeader}>
        <p className={styles.sidebarLabel}>
          CATEGORY <span className={styles.sidebarSubLabel}>(카테고리)</span>
        </p>
      </div>
      <div className={styles.categoryList}>
        {isCategoriesLoading
          ? categorySkeletons.map((_, index) => (
              <Skeleton key={`category-skeleton-${index}`} height={32} width={80} borderRadius={20} />
            ))
          : categoryNames.map(category => (
              <button
                key={category}
                type="button"
                className={selectedCategory === category ? `${styles.categoryButton} ${styles.active}` : styles.categoryButton}
                onClick={createHandleSelectCategory({ category, setSelectedCategory })}
              >
                {category}
              </button>
            ))}
      </div>
    </aside>
  );
}
