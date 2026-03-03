import { Fragment } from 'react';

import Link from 'next/link';
import Image from 'next/image';
import LinesEllipsis from 'react-lines-ellipsis';

import { CiCalendar } from 'react-icons/ci';
import { FaUser } from 'react-icons/fa';
import { FiClock, FiEdit2, FiEye, FiHeart, FiMessageCircle, FiMoreHorizontal, FiTrash2, FiTrendingUp } from 'react-icons/fi';

import EmptyState from '@/app/shared/components/empty/EmptyState';
import ListPostTagList from '@/app/(routes)/(public)/main/components/postList/components/ListPostTagList';
import { MyPagePostListSkeleton } from '@/app/(routes)/(private)/mypage/MyPage.skeleton';
import { stopMenuPropagation } from '@/app/(routes)/(private)/mypage/handlers';
import { formatDateLabel } from '@/app/(routes)/(private)/mypage/utils';
import { formatPostPreview } from '@/app/shared/utils/formatPostPreview.utils';

import styles from '@/app/(routes)/(private)/mypage/MyPage.module.css';
import postListStyles from '@/app/(routes)/(public)/main/components/postList/postList.module.css';

import type { MyPageLikesTabProps } from '@/app/shared/types/mypage';

/**
 * 좋아한 포스트 탭
 * @description 사용자가 좋아요한 게시글 목록을 표시한다
 */
export default function MyPageLikesTab({
  currentUserId,
  isLikedPostsListLoading,
  isPostDeleting,
  openPostMenuId,
  sortKey,
  sortedLikedPosts,
  handlePostDelete,
  handlePostEdit,
  handlePostMenuToggle,
  handleSortToggle,
}: MyPageLikesTabProps) {
  if (isLikedPostsListLoading) {
    return <MyPagePostListSkeleton label="좋아한 포스트" showFilters={false} />;
  }

  return (
    <>
      <div className={styles.settingsRow}>
        <span className={styles.settingsLabel}>좋아한 포스트</span>
        <div className={styles.settingsSortGroup}>
          <button
            type="button"
            className={`${styles.settingsSortButton} ${styles.settingsSortButtonActive}`}
            onClick={handleSortToggle}
          >
            {sortKey === 'popular' ? (
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
      {sortedLikedPosts.length ? (
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
                                onClick={event => {
                                  stopMenuPropagation(event);
                                  handlePostMenuToggle(post.id);
                                }}
                              >
                                <FiMoreHorizontal aria-hidden="true" />
                              </button>
                              {openPostMenuId === post.id ? (
                                <div className={styles.listMenu} role="menu" onClick={stopMenuPropagation}>
                                  <button
                                    type="button"
                                    className={styles.listMenuItem}
                                    role="menuitem"
                                    onClick={event => {
                                      stopMenuPropagation(event);
                                      handlePostEdit(post.id);
                                    }}
                                  >
                                    <FiEdit2 aria-hidden="true" />
                                    수정
                                  </button>
                                  <button
                                    type="button"
                                    className={styles.listMenuItem}
                                    role="menuitem"
                                    disabled={isPostDeleting}
                                    onClick={event => {
                                      stopMenuPropagation(event);
                                      handlePostDelete(post.id);
                                    }}
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
        <EmptyState
          title="아직 좋아요한 게시물이 없습니다."
          description="좋아요한 게시글이 이곳에 표시됩니다."
        />
      )}
    </>
  );
}
