import { CiShoppingTag } from 'react-icons/ci';
import { FiEdit2, FiMoreHorizontal, FiTrash2 } from 'react-icons/fi';

import { formatRole } from '@/app/(routes)/(public)/posts/[postId]/_utils';
import { buildRelativeTime, formatDate } from '@/app/shared/utils/date';

import styles from '@/app/(routes)/(public)/posts/[postId]/PostDetail.module.css';

import type { PostDetailHeaderSectionProps } from '@/app/shared/types/post';

/**
 * 게시물 헤더 섹션
 * @description 카테고리, 제목, 메타 정보, 관리 메뉴를 렌더링합니다.
 */
export default function PostDetailHeaderSection({
  canManagePost,
  data,
  isAdmin,
  isMyPost,
  isPostDeleting,
  isForcingPostDraft,
  isPostMenuOpen,
  handlePostDelete,
  handlePostEdit,
  handlePostMenuToggle,
  handleForcePostDraft,
}: PostDetailHeaderSectionProps) {
  return (
    <div className={styles.header}>
      <div className={styles.categoryRow}>
        <div className={styles.category}>{data.category?.name ?? 'ALL'}</div>
        {canManagePost ? (
          <div className={styles.postMoreWrapper}>
            <button type="button" className={styles.postMoreButton} aria-label="게시글 옵션" onClick={handlePostMenuToggle}>
              <FiMoreHorizontal aria-hidden="true" />
            </button>
            {isPostMenuOpen ? (
              <div className={styles.postMoreMenu} role="menu">
                {isMyPost ? (
                  <button type="button" className={styles.postMoreItem} role="menuitem" onClick={handlePostEdit}>
                    <FiEdit2 aria-hidden="true" />
                    수정
                  </button>
                ) : null}
                {isMyPost ? (
                  <button
                    type="button"
                    className={styles.postMoreItem}
                    role="menuitem"
                    disabled={isPostDeleting}
                    onClick={handlePostDelete}
                  >
                    <FiTrash2 aria-hidden="true" />
                    삭제
                  </button>
                ) : null}
                {isAdmin && !isMyPost ? (
                  <button
                    type="button"
                    className={`${styles.postMoreItem} ${styles.postMoreItemDanger}`}
                    role="menuitem"
                    disabled={isForcingPostDraft}
                    onClick={handleForcePostDraft}
                  >
                    <FiTrash2 aria-hidden="true" />
                    강제삭제 (임시저장)
                  </button>
                ) : null}
              </div>
            ) : null}
          </div>
        ) : null}
      </div>
      <h1 className={styles.title}>{data.title}</h1>
      <div className={styles.metaRow}>
        <span className={styles.metaItem}>
          {formatDate(data.publishedAt ?? data.createdAt)} ({buildRelativeTime(data.publishedAt ?? data.createdAt)})
        </span>
        <span className={styles.metaDivider} aria-hidden="true">
          ·
        </span>
        <span className={styles.metaItem}>
          {data.author?.name ?? '익명'} {data.author?.role && `${formatRole(data.author.role)}`}
        </span>
      </div>
      {data.tags.length ? (
        <div className={styles.metaTagRow}>
          <CiShoppingTag className={styles.metaTagIcon} aria-hidden="true" />
          <div className={styles.metaTagList}>
            {data.tags.map(tag => (
              <span key={tag.id} className={styles.metaTagItem}>
                #{tag.name}
              </span>
            ))}
          </div>
        </div>
      ) : null}
    </div>
  );
}
