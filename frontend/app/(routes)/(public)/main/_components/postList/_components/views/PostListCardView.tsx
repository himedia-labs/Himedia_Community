import Image from 'next/image';
import Link from 'next/link';

import { FaUser } from 'react-icons/fa6';
import { FiEye, FiHeart, FiShare2 } from 'react-icons/fi';

import CardPostSkeletonItem from '@/app/(routes)/(public)/main/_components/postList/postList.skeleton';
import { getVisibleTags } from '@/app/shared/utils/post';

import styles from '@/app/(routes)/(public)/main/_components/postList/postList.module.css';

import type { PostListCardViewProps } from '@/app/shared/types/post';

/**
 * 포스트 카드 뷰
 * @description 메인 포스트의 카드형 레이아웃과 스켈레톤을 렌더링합니다.
 */
export default function PostListCardView({
  currentUserId,
  isLoading,
  isFetchingNextPage,
  filteredPosts,
  cardTagSkeletonWidths,
  cardSkeletons,
}: PostListCardViewProps) {
  return (
    <ul className={styles.cardGrid}>
      {isLoading
        ? cardSkeletons.map((_, index) => (
            <CardPostSkeletonItem
              key={`card-skeleton-${index}`}
              index={index}
              cardTagSkeletonWidths={cardTagSkeletonWidths}
              skeletonKeyPrefix="card-skeleton"
            />
          ))
        : filteredPosts.map(post => {
            const thumbnailImageUrl = post.imageUrl;
            const hasThumbnail = Boolean(thumbnailImageUrl);
            const displayCardTags = post.tags.slice(0, 5).map(tagName => `#${tagName}`);
            const { hiddenCount, visibleTags } = getVisibleTags(displayCardTags);
            const hasCardTags = post.tags.length > 0;
            const noThumbNoTag = !hasThumbnail && !hasCardTags;
            const hasVisibleCardTags = visibleTags.length > 0;
            const hasTagsWithThumbnail = hasThumbnail && hasVisibleCardTags;
            const hasTagsWithoutThumbnail = !hasThumbnail && hasVisibleCardTags;
            const isMyPost = Boolean(currentUserId) && currentUserId === post.authorId;
            const cardItemClassName = noThumbNoTag ? `${styles.cardItem} ${styles.cardItemNoThumbNoTags}` : styles.cardItem;
            const cardBodyClassName = hasThumbnail
              ? styles.cardBody
              : `${styles.cardBody} ${styles.cardBodyNoThumb} ${hasCardTags ? styles.cardBodyNoThumbWithTags : ''} ${
                  noThumbNoTag ? styles.cardBodyNoThumbNoTags : ''
                }`;
            const cardTagListClassName = hasThumbnail ? `${styles.cardTagList} ${styles.cardTagListWithThumb}` : styles.cardTagList;
            const cardTextClassName = hasThumbnail ? `${styles.cardText} ${styles.cardTextWithThumb}` : styles.cardText;

            return (
            <li key={post.id}>
              <Link className={styles.postLink} href={`/posts/${post.id}`}>
                <article className={cardItemClassName}>
                  <div className={styles.cardTop}>
                    {thumbnailImageUrl ? (
                      <div className={styles.cardThumb} aria-hidden="true">
                        <Image
                          className={styles.cardThumbImage}
                          src={thumbnailImageUrl}
                          alt=""
                          width={0}
                          height={0}
                          sizes="100vw"
                          unoptimized
                        />
                      </div>
                    ) : null}
                    <div className={cardBodyClassName}>
                      <div className={cardTextClassName}>
                        <h3 className={styles.cardTitle}>{post.title}</h3>
                        {post.content ? (
                          <p
                            className={
                              hasTagsWithThumbnail
                                ? styles.cardSummaryThumbTag
                                : hasThumbnail
                                  ? styles.cardSummaryThumb
                                  : hasTagsWithoutThumbnail
                                    ? styles.cardSummaryTag
                                    : styles.cardSummary
                            }
                          >
                            {post.content}
                          </p>
                        ) : null}
                      </div>
                    </div>
                  </div>
                  <div className={styles.cardBottom}>
                    {hasVisibleCardTags ? (
                      <ul className={cardTagListClassName} aria-label="태그 목록">
                        {visibleTags.map((displayTag, index) => (
                          <li key={`${post.id}-card-${index}-${displayTag}`} className={styles.cardTagItem}>
                            {displayTag}
                          </li>
                        ))}
                        {hiddenCount > 0 ? (
                          <li className={styles.cardTagItem} aria-label={`숨겨진 태그 ${hiddenCount}개`}>
                            +{hiddenCount}
                          </li>
                        ) : null}
                      </ul>
                    ) : null}
                    <div className={`${styles.cardFooter} ${styles.cardFooterWithThumb}`}>
                      <div className={styles.cardDateRow}>
                        <span>{post.date}</span>
                        <span>·</span>
                        <span>{post.timeAgo}</span>
                      </div>
                      <div className={styles.cardFooterDivider} aria-hidden="true" />
                      <div className={styles.cardMetaRow}>
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
                        <div className={styles.cardStats}>
                          <span className={styles.cardStat}>
                            <span className={styles.cardStatIcon}>
                              <FiHeart aria-hidden="true" />
                            </span>
                            <span className={styles.cardStatCount}>{post.likeCount.toLocaleString()}</span>
                          </span>
                          <span className={styles.cardStat}>
                            <span className={styles.cardStatIcon}>
                              <FiEye aria-hidden="true" />
                            </span>
                            <span className={styles.cardStatCount}>{post.views.toLocaleString()}</span>
                          </span>
                          <span className={styles.cardStat}>
                            <span className={styles.cardStatIcon}>
                              <FiShare2 aria-hidden="true" />
                            </span>
                            <span className={styles.cardStatCount}>{post.shareCount.toLocaleString()}</span>
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>
                </article>
              </Link>
            </li>
          );
          })}
      {isFetchingNextPage
        ? cardSkeletons.map((_, index) => (
            <CardPostSkeletonItem
              key={`card-more-skeleton-${index}`}
              index={index}
              cardTagSkeletonWidths={cardTagSkeletonWidths}
              skeletonKeyPrefix="card-more-skeleton"
            />
          ))
        : null}
    </ul>
  );
}
