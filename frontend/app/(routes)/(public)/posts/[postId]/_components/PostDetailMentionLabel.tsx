import { Fragment } from 'react';

import { getMentionHighlightSegments } from '@/app/(routes)/(public)/posts/[postId]/_utils';

import styles from '@/app/(routes)/(public)/posts/[postId]/PostDetail.module.css';

/**
 * 멘션 이름 렌더링
 * @description 검색어와 일치하는 멘션 텍스트를 강조해 출력
 */
export function PostDetailMentionLabel({ name, query }: { name: string; query: string | null }) {
  const segments = getMentionHighlightSegments(name, query);

  return (
    <span className={styles.commentMentionName}>
      {segments.map((segment, index) =>
        segment.type === 'match' ? (
          <span key={`${segment.value}-${index}`} className={styles.commentMentionMatch}>
            {segment.value}
          </span>
        ) : (
          <Fragment key={`${segment.value}-${index}`}>{segment.value}</Fragment>
        ),
      )}
    </span>
  );
}
