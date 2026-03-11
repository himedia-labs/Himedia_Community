import Skeleton from 'react-loading-skeleton';
import 'react-loading-skeleton/dist/skeleton.css';

import styles from '@/app/(routes)/(public)/main/_components/postList/postList.module.css';

import type { PostListSidebarSkeletonProps } from '@/app/shared/types/post';

/**
 * 포스트 사이드바 스켈레톤
 * @description 메인 우측 사이드바 로딩 UI를 렌더링합니다.
 */
export default function PostListSidebarSkeleton({ categorySkeletons, topSkeletons }: PostListSidebarSkeletonProps) {
  return (
    <aside className={styles.sidebar} aria-label="TOP 5 인기글">
      <div className={styles.sidebarHeader}>
        <p className={styles.sidebarLabel}>
          TOP 5 <span className={styles.sidebarSubLabel}>(인기있는 글)</span>
        </p>
      </div>
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
      <div className={styles.sidebarDivider} aria-hidden="true" />
      <div className={styles.sidebarHeader}>
        <p className={styles.sidebarLabel}>
          CATEGORY <span className={styles.sidebarSubLabel}>(카테고리)</span>
        </p>
      </div>
      <div className={styles.categoryList}>
        {categorySkeletons.map((_, index) => (
          <Skeleton key={`category-skeleton-${index}`} height={32} width={80} borderRadius={20} />
        ))}
      </div>
    </aside>
  );
}
