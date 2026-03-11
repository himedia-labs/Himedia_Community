import Skeleton from 'react-loading-skeleton';
import 'react-loading-skeleton/dist/skeleton.css';

import styles from '@/app/(routes)/(public)/main/_components/postList/postList.module.css';
import type { CardPostSkeletonItemProps, PostListListSkeletonProps } from '@/app/shared/types/post';

/**
 * 카드 포스트 스켈레톤 아이템
 * @description 카드 분기(썸네일/태그 유무)와 동일한 구조로 표시
 */
export default function CardPostSkeletonItem({
  index,
  skeletonKeyPrefix,
  cardTagSkeletonWidths,
}: CardPostSkeletonItemProps) {
  const summaryLineCount = 4;

  const cardItemClassName = styles.cardItem;
  const cardBodyClassName = styles.cardBody;
  const cardTextClassName = `${styles.cardText} ${styles.cardTextWithThumb}`;
  const cardTagListClassName = `${styles.cardTagList} ${styles.cardTagListWithThumb}`;
  const summarySkeletonLines = Array.from({ length: summaryLineCount });

  return (
    <li>
      <article className={cardItemClassName} aria-hidden="true">
        <div className={styles.cardTop}>
          <div className={styles.cardThumb}>
            <Skeleton width="100%" height="100%" />
          </div>
          <div className={cardBodyClassName}>
            <div className={cardTextClassName}>
              <Skeleton height={18} width="50%" />
              <div className={`${styles.skeletonSummary} ${styles.cardSkeletonSummary}`}>
                {summarySkeletonLines.map((_, lineIndex) => (
                  <Skeleton key={`${skeletonKeyPrefix}-summary-${index}-${lineIndex}`} height={14} width="100%" />
                ))}
              </div>
            </div>
          </div>
        </div>
        <ul className={cardTagListClassName} aria-hidden="true">
          {cardTagSkeletonWidths.map(width => (
            <li key={`${skeletonKeyPrefix}-tag-${index}-${width}`} className={styles.cardTagItem}>
              <Skeleton height={12} width={width} />
            </li>
          ))}
        </ul>
        <div className={`${styles.cardFooter} ${styles.cardFooterWithThumb}`}>
          <div className={styles.cardDateRow}>
            <Skeleton width={140} height={12} />
          </div>
          <div className={styles.cardFooterDivider} aria-hidden="true" />
          <div className={styles.cardMetaRow}>
            <div className={styles.cardAuthor}>
              <Skeleton circle width={24} height={24} />
              <Skeleton width={80} height={12} />
            </div>
            <div className={styles.cardStats}>
              <Skeleton width={36} height={12} />
              <Skeleton width={36} height={12} />
              <Skeleton width={36} height={12} />
            </div>
          </div>
        </div>
      </article>
    </li>
  );
}

/**
 * 리스트 포스트 스켈레톤
 * @description 리스트형 포스트 로딩 묶음을 렌더링합니다.
 */
export function PostListListSkeleton({
  listTagSkeletonWidths,
  listSkeletons,
  skeletonKeyPrefix,
}: PostListListSkeletonProps) {
  return (
    <>
      {listSkeletons.map((_, index) => (
        <li key={`${skeletonKeyPrefix}-${index}`}>
          <article className={styles.listItem} aria-hidden="true">
            <div className={styles.listBody}>
              <Skeleton height={26} width="70%" />
              <div className={styles.skeletonSummary}>
                <Skeleton count={2} height={16} />
              </div>
              <ul className={styles.listTagList} aria-hidden="true">
                {listTagSkeletonWidths.map(width => (
                  <li key={`${skeletonKeyPrefix}-tag-${index}-${width}`}>
                    <Skeleton height={24} width={width} borderRadius={4} />
                  </li>
                ))}
              </ul>
              <div className={styles.meta}>
                <div className={styles.metaAuthorDate}>
                  <div className={styles.cardAuthor}>
                    <Skeleton circle width={24} height={24} />
                    <Skeleton width={80} height={12} />
                  </div>
                  <span className={styles.separator} aria-hidden="true">
                    |
                  </span>
                  <span className={styles.metaGroup}>
                    <Skeleton width={140} height={12} />
                  </span>
                </div>
                <span className={styles.metaGroup}>
                  <Skeleton width={160} height={12} />
                </span>
              </div>
            </div>
            <Skeleton height={180} width="100%" borderRadius={12} />
          </article>
          {index < listSkeletons.length - 1 ? (
            <div className={styles.listDividerItem} aria-hidden="true">
              <div className={styles.listDivider} />
            </div>
          ) : null}
        </li>
      ))}
    </>
  );
}

