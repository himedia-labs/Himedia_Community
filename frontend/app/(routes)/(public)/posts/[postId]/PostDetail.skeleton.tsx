import Skeleton from 'react-loading-skeleton';
import 'react-loading-skeleton/dist/skeleton.css';

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
        <div className={styles.categoryRow}>
          <div className={styles.category}>
            <Skeleton width={50} height={16} />
          </div>
        </div>
        <h1 className={styles.title}>
          <Skeleton width="60%" height={42} />
        </h1>
        <div className={styles.metaRow}>
          <span className={styles.metaItem}>
            <Skeleton width={200} height={14} />
          </span>
          <span className={styles.metaDivider} aria-hidden="true">
            ·
          </span>
          <span className={styles.metaItem}>
            <Skeleton width={100} height={14} />
          </span>
        </div>
      </div>
      <div className={styles.headerDivider} aria-hidden="true" />

      <div className={styles.body}>
        <aside className={styles.toc} aria-label="본문 목차">
          <div className={styles.tocInner}>
            <div className={styles.tocTitle}>목차</div>
            <ul className={styles.tocList}>
              <li className={styles.tocItem}>
                <Skeleton width="85%" height={16} />
              </li>
              <li className={styles.tocItem}>
                <Skeleton width="75%" height={16} />
              </li>
              <li className={styles.tocItem}>
                <Skeleton width="90%" height={16} />
              </li>
              <li className={styles.tocItem}>
                <Skeleton width="80%" height={16} />
              </li>
            </ul>
          </div>
        </aside>

        <div className={styles.mainContent}>
          <article className={markdownStyles.markdown}>
            <Skeleton height={16} count={3} />
            <Skeleton height={24} width="55%" style={{ marginTop: '20px' }} />
            <Skeleton height={16} count={2} />
            <Skeleton height={16} count={3} style={{ marginTop: '16px' }} />
          </article>
          <aside className={styles.actions} aria-label="게시물 반응">
            <div className={styles.actionsInner}>
              <div className={styles.actionButton} aria-hidden="true">
                <Skeleton circle height={20} width={20} />
                <span className={styles.actionValue}>
                  <Skeleton height={12} width={32} />
                </span>
              </div>
              <div className={styles.actionItem} aria-hidden="true">
                <Skeleton circle height={20} width={20} />
                <span className={styles.actionValue}>
                  <Skeleton height={12} width={32} />
                </span>
              </div>
              <div className={styles.actionButton} aria-hidden="true">
                <Skeleton circle height={20} width={20} />
                <span className={styles.actionValue}>
                  <Skeleton height={12} width={32} />
                </span>
              </div>
            </div>
          </aside>

          <section className={styles.authorProfileCard} aria-label="작성자 프로필">
            <div className={styles.authorProfileMain}>
              <div className={styles.authorProfileAvatar} aria-hidden="true">
                <Skeleton circle width={72} height={72} />
              </div>
              <div className={styles.authorProfileInfo}>
                <div className={styles.authorProfileNameRow}>
                  <div className={styles.authorProfileNameGroup}>
                    <span className={styles.authorProfileName}>
                      <Skeleton width={100} height={22} />
                    </span>
                    <span className={styles.authorProfileRole}>
                      <Skeleton width={70} height={16} />
                    </span>
                  </div>
                </div>
                <p className={styles.authorProfileBio}>
                  <Skeleton width="95%" height={16} />
                </p>
                <span className={styles.authorProfileMeta}>
                  <Skeleton width={220} height={14} />
                </span>
              </div>
            </div>
            <div className={styles.authorProfileSocialDivider} aria-hidden="true" />
            <div className={styles.authorProfileSocialRow} aria-label="작성자 소셜 링크">
              {Array.from({ length: 4 }).map((_, index) => (
                <span key={`author-social-skeleton-${index}`} className={styles.authorProfileSocialLink}>
                  <Skeleton width={18} height={18} />
                </span>
              ))}
            </div>
          </section>
        </div>
      </div>
    </section>
  );
};

/**
 * 댓글 스켈레톤
 * @description 댓글 목록 로딩 UI를 렌더링합니다.
 */
export const PostDetailCommentsSkeleton = () => {
  return (
    <div aria-hidden="true">
      {Array.from({ length: 3 }).map((_, index) => (
        <div key={`comment-skeleton-${index}`} style={{ marginBottom: '24px' }}>
          <div style={{ display: 'flex', gap: '12px', marginBottom: '12px' }}>
            <Skeleton circle width={36} height={36} />
            <div style={{ flex: 1 }}>
              <div style={{ marginBottom: '4px' }}>
                <Skeleton width={120} height={14} />
              </div>
              <Skeleton width={80} height={12} />
            </div>
          </div>
          <Skeleton height={16} count={2} />
        </div>
      ))}
    </div>
  );
};
