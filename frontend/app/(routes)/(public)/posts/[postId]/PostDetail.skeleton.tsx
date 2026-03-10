import Skeleton from 'react-loading-skeleton';

import markdownStyles from '@/app/shared/components/markdown-editor/markdown.module.css';
import styles from '@/app/(routes)/(public)/posts/[postId]/PostDetail.module.css';

/**
 * 게시글 상세 로딩 뷰
 * @description 상세 데이터를 불러오는 동안 스켈레톤 UI를 표시
 */
export const PostDetailSkeleton = () => {
  return (
    <section className={styles.container} aria-label="게시물 상세">
      <div className={styles.header}>
        <Skeleton width={90} height={12} />
        <Skeleton width="75%" height={38} />
        <div className={styles.metaRow}>
          <Skeleton width={120} height={14} />
          <span className={styles.metaDivider} aria-hidden="true">
            ·
          </span>
          <Skeleton width={140} height={14} />
        </div>
      </div>
      <div className={styles.headerDivider} aria-hidden="true" />
      <div className={styles.body}>
        <aside className={styles.actions} aria-label="게시물 반응">
          <div className={styles.actionsInner}>
            <div className={styles.actionButton} aria-hidden="true">
              <Skeleton circle height={18} width={18} />
              <Skeleton height={10} width={24} />
            </div>
            <div className={styles.actionButton} aria-hidden="true">
              <Skeleton circle height={18} width={18} />
              <Skeleton height={10} width={24} />
            </div>
            <div className={styles.actionButton} aria-hidden="true">
              <Skeleton circle height={18} width={18} />
              <Skeleton height={10} width={24} />
            </div>
          </div>
        </aside>
        <div className={styles.mainContent}>
          <div className={markdownStyles.markdown}>
            <Skeleton height={16} />
            <Skeleton height={16} />
            <Skeleton height={16} />
            <Skeleton height={16} />
          </div>
        </div>
      </div>
    </section>
  );
};

/**
 * 댓글 스켈레톤
 * @description 댓글 섹션 로딩 UI를 렌더링합니다.
 */
export const PostDetailCommentsSkeleton = () => {
  return (
    <>
      {Array.from({ length: 3 }).map((_, index) => (
        <div key={`comment-skeleton-${index}`} className={styles.commentItem} aria-hidden="true">
          <div className={styles.commentHeaderRow}>
            <Skeleton width={120} height={12} />
            <Skeleton width={60} height={12} />
          </div>
          <Skeleton height={16} count={2} />
        </div>
      ))}
    </>
  );
};
