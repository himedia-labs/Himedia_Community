import { Fragment } from 'react';

import Image from 'next/image';
import Link from 'next/link';

import LinesEllipsis from 'react-lines-ellipsis';
import { CiCalendar } from 'react-icons/ci';
import { FaUser } from 'react-icons/fa';
import { FiEdit2, FiEye, FiHeart, FiMessageCircle, FiMoreHorizontal, FiTrash2 } from 'react-icons/fi';

import ListPostTagList from '@/app/(routes)/(public)/main/components/postList/components/ListPostTagList';
import { formatDateLabel } from '@/app/(routes)/(private)/mypage/utils';
import { formatPostPreview } from '@/app/shared/utils/formatPostPreview.utils';

import postListStyles from '@/app/(routes)/(public)/main/components/postList/postList.module.css';
import styles from '@/app/shared/components/post/PostSummaryList.module.css';

import type { MouseEvent } from 'react';
import type { PostSummaryListProps } from '@/app/shared/types/post';

/**
 * 링크 이동 중단
 * @description 메뉴 버튼 클릭 시 게시글 상세 이동을 막습니다.
 */
const stopLinkNavigation = (event: MouseEvent<HTMLElement>) => {
  event.preventDefault();
  event.stopPropagation();
};

/**
 * 게시글 요약 리스트
 * @description 마이페이지/공개 프로필에서 공통으로 사용하는 리스트 뷰를 렌더링합니다.
 */
export default function PostSummaryList({
  posts,
  emptyText,
  currentUserId,
  emptyClassName,
  actionHandlers,
}: PostSummaryListProps) {
  // 메뉴 활성화 상태
  const hasActionMenu = Boolean(
    actionHandlers?.onPostDelete && actionHandlers?.onPostEdit && actionHandlers?.onPostMenuToggle,
  );

  // 빈 목록 처리
  if (!posts.length) {
    return <div className={emptyClassName}>{emptyText}</div>;
  }

  return (
    <ul className={postListStyles.listView}>
      {posts.map((post, index) => {
        const thumbnailUrl = post.thumbnailUrl ?? '';
        const isMyPost = Boolean(currentUserId) && post.author?.id === currentUserId;
        const hasThumbnail = Boolean(thumbnailUrl);
        const tagNames = (post.tags ?? [])
          .slice(0, 5)
          .map(tag => `#${tag.name}`);
        const hasListTags = tagNames.length > 0;

        return (
          <Fragment key={post.id}>
            <li>
              <Link className={postListStyles.postLink} href={`/posts/${post.id}`}>
                <article
                  className={
                    hasThumbnail ? postListStyles.listItem : `${postListStyles.listItem} ${postListStyles.listItemNoThumb}`
                  }
                >
                  <div className={postListStyles.listBody}>
                    <div className={styles.listHeaderRow}>
                      <h3 className={postListStyles.listTitle}>{post.title || '제목 없음'}</h3>
                      {hasActionMenu ? (
                        <div className={styles.listMenuWrapper}>
                          <button
                            type="button"
                            className={styles.listMenuButton}
                            aria-label="게시글 옵션"
                            onClick={event => {
                              stopLinkNavigation(event);
                              actionHandlers?.onPostMenuToggle?.(post.id);
                            }}
                          >
                            <FiMoreHorizontal aria-hidden="true" />
                          </button>
                          {actionHandlers?.openPostMenuId === post.id ? (
                            <div className={styles.listMenu} role="menu" onClick={stopLinkNavigation}>
                              <button
                                type="button"
                                className={styles.listMenuItem}
                                role="menuitem"
                                onClick={event => {
                                  stopLinkNavigation(event);
                                  actionHandlers?.onPostEdit?.(post.id);
                                }}
                              >
                                <FiEdit2 aria-hidden="true" />
                                수정
                              </button>
                              <button
                                type="button"
                                className={styles.listMenuItem}
                                role="menuitem"
                                disabled={actionHandlers?.isPostDeleting}
                                onClick={event => {
                                  stopLinkNavigation(event);
                                  actionHandlers?.onPostDelete?.(post.id);
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
                        width={1000}
                        height={700}
                        unoptimized
                      />
                    </div>
                  ) : null}
                </article>
              </Link>
            </li>
            {index < posts.length - 1 ? (
              <li className={postListStyles.listDividerItem} aria-hidden="true">
                <div className={postListStyles.listDivider} />
              </li>
            ) : null}
          </Fragment>
        );
      })}
    </ul>
  );
}
