import { Fragment } from 'react';

import Image from 'next/image';
import Link from 'next/link';
import LinesEllipsis from 'react-lines-ellipsis';

import { CiCalendar } from 'react-icons/ci';
import { FaUser } from 'react-icons/fa';
import { FiClock, FiEdit2, FiEye, FiHeart, FiMessageCircle, FiMoreHorizontal, FiTrash2, FiTrendingUp } from 'react-icons/fi';

import { stopMenuPropagation } from '@/app/(routes)/(private)/mypage/_handlers';

import EmptyState from '@/app/shared/components/empty/EmptyState';
import ListPostTagList from '@/app/shared/components/post/ListPostTagList';
import { formatDate as formatDateLabel } from '@/app/shared/utils/date';
import { formatPostPreview } from '@/app/shared/utils/post';

import { MyPagePostListSkeleton } from '@/app/(routes)/(private)/mypage/MyPage.skeleton';

import styles from '@/app/(routes)/(private)/mypage/MyPage.module.css';
import postListStyles from '@/app/shared/components/post/PostListView.module.css';

import type { MouseEvent } from 'react';
import type { MyPageActivityTabProps } from '@/app/shared/types/mypage';

// 메뉴 클릭
const createHandlePostMenuButtonClick = (handlePostMenuToggle: (postId: string) => void) => {
  return (event: MouseEvent<HTMLButtonElement>) => {
    stopMenuPropagation(event);
    const { postId } = event.currentTarget.dataset;
    if (!postId) return;
    handlePostMenuToggle(postId);
  };
};

// 수정 클릭
const createHandlePostEditButtonClick = (handlePostEdit: (postId: string) => void) => {
  return (event: MouseEvent<HTMLButtonElement>) => {
    stopMenuPropagation(event);
    const { postId } = event.currentTarget.dataset;
    if (!postId) return;
    handlePostEdit(postId);
  };
};

// 삭제 클릭
const createHandlePostDeleteButtonClick = (handlePostDelete: (postId: string) => void) => {
  return (event: MouseEvent<HTMLButtonElement>) => {
    stopMenuPropagation(event);
    const { postId } = event.currentTarget.dataset;
    if (!postId) return;
    handlePostDelete(postId);
  };
};

/**
 * 활동 좋아요 섹션
 * @description 좋아한 포스트 목록을 렌더링한다
 */
export default function MyPageLikesSection({
  currentUserId,
  isLikedPostsListLoading,
  isPostDeleting,
  likedPostSortKey,
  openPostMenuId,
  sortedLikedPosts,
  handleLikedPostSortToggle,
  handlePostDelete,
  handlePostEdit,
  handlePostMenuToggle,
}: MyPageActivityTabProps) {
  const handlePostMenuButtonClick = createHandlePostMenuButtonClick(handlePostMenuToggle);
  const handlePostEditButtonClick = createHandlePostEditButtonClick(handlePostEdit);
  const handlePostDeleteButtonClick = createHandlePostDeleteButtonClick(handlePostDelete);

  return (
    <section className={styles.activitySection}>
      <div className={styles.settingsRow}>
        <span className={styles.settingsLabel}>좋아한 포스트</span>
        <div className={styles.settingsSortGroup}>
          <button
            type="button"
            className={`${styles.settingsSortButton} ${styles.settingsSortButtonActive}`}
            onClick={handleLikedPostSortToggle}
          >
            {likedPostSortKey === 'popular' ? (
              <>
                <FiTrendingUp className={styles.settingsSortIcon} aria-hidden="true" />
                인기순
              </>
            ) : (
              <>
                <FiClock className={styles.settingsSortIcon} aria-hidden="true" />
                최신순
              </>
            )}
          </button>
        </div>
      </div>
      {isLikedPostsListLoading ? (
        <MyPagePostListSkeleton label="좋아한 포스트" showFilters={false} />
      ) : sortedLikedPosts.length ? (
        <ul className={postListStyles.listView}>
          {sortedLikedPosts.map((post, index) => {
            const isMyPost = Boolean(currentUserId) && post.author?.id === currentUserId;
            const thumbnailUrl = post.thumbnailUrl ?? '';
            const hasThumbnail = Boolean(thumbnailUrl);
            const tagNames = (post.tags ?? []).slice(0, 5).map(tag => `#${tag.name}`);
            const hasListTags = tagNames.length > 0;

            return (
              <Fragment key={post.id}>
                <li>
                  <Link className={postListStyles.postLink} href={`/posts/${post.id}`}>
                    <article
                      className={
                        hasThumbnail
                          ? postListStyles.listItem
                          : `${postListStyles.listItem} ${postListStyles.listItemNoThumb}`
                      }
                    >
                      <div className={postListStyles.listBody}>
                        <div className={styles.listHeaderRow}>
                          <h3 className={postListStyles.listTitle}>{post.title || '제목 없음'}</h3>
                          {isMyPost ? (
                            <div className={styles.listMenuWrapper}>
                              <button
                                type="button"
                                className={styles.listMenuButton}
                                aria-label="게시글 옵션"
                                data-post-id={post.id}
                                onClick={handlePostMenuButtonClick}
                              >
                                <FiMoreHorizontal aria-hidden="true" />
                              </button>
                              {openPostMenuId === post.id ? (
                                <div className={styles.listMenu} role="menu" onClick={stopMenuPropagation}>
                                  <button
                                    type="button"
                                    className={styles.listMenuItem}
                                    role="menuitem"
                                    data-post-id={post.id}
                                    onClick={handlePostEditButtonClick}
                                  >
                                    <FiEdit2 aria-hidden="true" />
                                    수정
                                  </button>
                                  <button
                                    type="button"
                                    className={styles.listMenuItem}
                                    role="menuitem"
                                    disabled={isPostDeleting}
                                    data-post-id={post.id}
                                    onClick={handlePostDeleteButtonClick}
                                  >
                                    <FiTrash2 aria-hidden="true" />
                                    삭제
                                  </button>
                                </div>
                              ) : null}
                            </div>
                          ) : null}
                        </div>
                        <LinesEllipsis
                          text={formatPostPreview(post.content, { emptyText: '내용 없음' })}
                          maxLine={hasListTags ? '2' : '3'}
                          ellipsis="..."
                          trimRight
                          basedOn="letters"
                          className={hasListTags ? postListStyles.listSummaryWithTags : postListStyles.listSummary}
                        />
                        {hasListTags ? <ListPostTagList postId={post.id} tags={tagNames} /> : null}
                        <div className={postListStyles.meta}>
                          <div className={postListStyles.metaAuthorDate}>
                            <div className={postListStyles.cardAuthor}>
                              <div
                                className={
                                  isMyPost
                                    ? `${postListStyles.cardAuthorAvatar} ${postListStyles.cardAuthorAvatarMine}`
                                    : postListStyles.cardAuthorAvatar
                                }
                                aria-hidden="true"
                              >
                                {post.author?.profileImageUrl ? (
                                  <Image
                                    className={postListStyles.cardAuthorImage}
                                    src={post.author.profileImageUrl}
                                    alt=""
                                    width={24}
                                    height={24}
                                    unoptimized
                                  />
                                ) : (
                                  <FaUser />
                                )}
                              </div>
                              <span className={postListStyles.cardAuthorText}>
                                <span className={postListStyles.cardAuthorBy}>by.</span>
                                <span className={postListStyles.cardAuthorName}>{post.author?.name ?? '알 수 없음'}</span>
                              </span>
                            </div>
                            <span className={postListStyles.separator} aria-hidden="true">
                              |
                            </span>
                            <span className={postListStyles.metaGroup}>
                              <span className={postListStyles.metaItem}>
                                <CiCalendar aria-hidden="true" /> {formatDateLabel(post.publishedAt ?? post.createdAt)}
                              </span>
                            </span>
                          </div>
                          <span className={postListStyles.metaGroup}>
                            <span className={postListStyles.metaItem}>
                              <FiEye aria-hidden="true" /> {post.viewCount.toLocaleString()}
                            </span>
                            <span className={postListStyles.separator} aria-hidden="true">
                              |
                            </span>
                            <span className={postListStyles.metaItem}>
                              <FiHeart aria-hidden="true" /> {post.likeCount.toLocaleString()}
                            </span>
                            <span className={postListStyles.separator} aria-hidden="true">
                              |
                            </span>
                            <span className={postListStyles.metaItem}>
                              <FiMessageCircle aria-hidden="true" /> {post.commentCount.toLocaleString()}
                            </span>
                          </span>
                        </div>
                      </div>
                      {hasThumbnail ? (
                        <div className={postListStyles.listThumb} aria-hidden="true">
                          <Image
                            className={postListStyles.listThumbImage}
                            src={thumbnailUrl}
                            alt=""
                            width={0}
                            height={0}
                            sizes="100vw"
                            unoptimized
                          />
                        </div>
                      ) : null}
                    </article>
                  </Link>
                </li>
                {index < sortedLikedPosts.length - 1 ? (
                  <li className={postListStyles.listDividerItem} aria-hidden="true">
                    <div className={postListStyles.listDivider} />
                  </li>
                ) : null}
              </Fragment>
            );
          })}
        </ul>
      ) : (
        <EmptyState title="아직 좋아요한 게시물이 없습니다." description="좋아요한 게시글이 이곳에 표시됩니다." />
      )}
    </section>
  );
}
