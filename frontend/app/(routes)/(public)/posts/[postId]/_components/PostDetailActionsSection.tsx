import { FaHeart } from 'react-icons/fa';
import NumberFlow from '@number-flow/react';
import { FiEye, FiHeart, FiShare2 } from 'react-icons/fi';

import styles from '@/app/(routes)/(public)/posts/[postId]/PostDetail.module.css';

import type { PostDetailActionsSectionProps } from '@/app/shared/types/post';

/**
 * 게시물 반응 섹션
 * @description 좋아요, 조회수, 공유 반응 UI를 렌더링합니다.
 */
export default function PostDetailActionsSection({
  isLiked,
  likeCount,
  shareCount,
  viewCount,
  handleLikeClick,
  handleShareCopy,
}: PostDetailActionsSectionProps) {
  return (
    <aside className={styles.actions} aria-label="게시물 반응">
      <div className={styles.actionsInner}>
        <button
          type="button"
          className={`${styles.actionButton} ${isLiked ? styles.actionButtonActive : ''}`}
          aria-label="좋아요"
          onClick={handleLikeClick}
        >
          {isLiked ? <FaHeart aria-hidden="true" /> : <FiHeart aria-hidden="true" />}
          <span className={styles.actionValue}>
            <NumberFlow value={likeCount} />
          </span>
        </button>
        <div className={styles.actionItem} aria-label="조회수">
          <FiEye aria-hidden="true" />
          <span className={styles.actionValue}>
            <NumberFlow value={viewCount} />
          </span>
        </div>
        <button type="button" className={styles.actionButton} onClick={handleShareCopy} aria-label="공유">
          <FiShare2 aria-hidden="true" />
          <span className={styles.actionValue}>
            <NumberFlow value={shareCount} />
          </span>
        </button>
      </div>
    </aside>
  );
}
