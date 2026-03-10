import Image from 'next/image';
import Link from 'next/link';

import { FaUser } from 'react-icons/fa6';
import { CiCalendar } from 'react-icons/ci';
import { FiEye, FiHeart, FiMessageCircle } from 'react-icons/fi';

import { PostListListSkeleton } from '@/app/(routes)/(public)/main/_components/postList/postList.skeleton';
import ListPostTagList from '@/app/shared/components/post/ListPostTagList';

import styles from '@/app/(routes)/(public)/main/_components/postList/postList.module.css';

import type { PostListListViewProps } from '@/app/shared/types/post';

/**
 * 포스트 리스트 뷰
 * @description 메인 포스트의 리스트형 카드와 스켈레톤을 렌더링합니다.
 */
export default function PostListListView({
  currentUserId,
  isLoading,
  isFetchingNextPage,
  filteredPosts,
  listTagSkeletonWidths,
  listSkeletons,
}: PostListListViewProps) {
  return (
    <ul className={styles.listView}>
      {isLoading ? (
        <PostListListSkeleton
          listTagSkeletonWidths={listTagSkeletonWidths}
          listSkeletons={listSkeletons}
          skeletonKeyPrefix="list-skeleton"
        />
      ) : (
        filteredPosts.map((post, index) => {
          const isMyPost = Boolean(currentUserId) && currentUserId === post.authorId;
          const thumbnailImageUrl = post.imageUrl;
          const hasThumbnail = Boolean(thumbnailImageUrl);
          const displayListTags = post.tags.slice(0, 5).map(tagName => `#${tagName}`);
          const hasListTags = displayListTags.length > 0;

          return (
              <li key={post.id}>
                <Link className={styles.postLink} href={`/posts/${post.id}`}>
                  <article className={hasThumbnail ? styles.listItem : `${styles.listItem} ${styles.listItemNoThumb}`}>
                    <div className={styles.listBody}>
                      <h3 className={styles.listTitle}>{post.title}</h3>
                      {post.content ? (
                        <p className={hasListTags ? styles.listSummaryWithTags : styles.listSummary}>{post.content}</p>
                      ) : null}
                      {hasListTags ? <ListPostTagList postId={post.id} tags={displayListTags} /> : null}
                      <div className={styles.meta}>
                        <div className={styles.metaAuthorDate}>
                          <div className={styles.cardAuthor}>
                            <div
                              className={
                                isMyPost
                                  ? `${styles.cardAuthorAvatar} ${styles.cardAuthorAvatarMine}`
                                  : styles.cardAuthorAvatar
                              }
                              aria-hidden="true"
                            >
                              {post.authorProfileImageUrl ? (
                                <Image
                                  className={styles.cardAuthorImage}
                                  src={post.authorProfileImageUrl}
                                  alt=""
                                  width={24}
                                  height={24}
                                  unoptimized
                                />
                              ) : (
                                <FaUser />
                              )}
                            </div>
                            <span className={styles.cardAuthorText}>
                              <span className={styles.cardAuthorBy}>by.</span>
                              <span className={styles.cardAuthorName}>{post.authorName}</span>
                            </span>
                          </div>
                          <span className={styles.separator} aria-hidden="true">
                            |
                          </span>
                          <span className={styles.metaGroup}>
                            <span className={styles.metaItem}>
                              <CiCalendar aria-hidden="true" /> {post.date}
                            </span>
                            <span className={styles.separator} aria-hidden="true">
                              |
                            </span>
                            <span className={styles.metaItem}>{post.timeAgo}</span>
                          </span>
                        </div>
                        <span className={styles.metaGroup}>
                          <span className={styles.metaItem}>
                            <FiEye aria-hidden="true" /> {post.views.toLocaleString()}
                          </span>
                          <span className={styles.separator} aria-hidden="true">
                            |
                          </span>
                          <span className={styles.metaItem}>
                            <FiHeart aria-hidden="true" /> {post.likeCount.toLocaleString()}
                          </span>
                          <span className={styles.separator} aria-hidden="true">
                            |
                          </span>
                          <span className={styles.metaItem}>
                            <FiMessageCircle aria-hidden="true" /> {post.commentCount.toLocaleString()}
                          </span>
                        </span>
                      </div>
                    </div>
                    {thumbnailImageUrl ? (
                      <div className={styles.listThumb} aria-hidden="true">
                        <Image
                          className={styles.listThumbImage}
                          src={thumbnailImageUrl}
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
                {index < filteredPosts.length - 1 ? (
                  <div className={styles.listDividerItem} aria-hidden="true">
                    <div className={styles.listDivider} />
                  </div>
                ) : null}
              </li>
            );
          })
      )}
      {isFetchingNextPage ? (
        <PostListListSkeleton
          listTagSkeletonWidths={listTagSkeletonWidths}
          listSkeletons={listSkeletons}
          skeletonKeyPrefix="list-more-skeleton"
        />
      ) : null}
    </ul>
  );
}
