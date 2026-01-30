'use client';

import { Fragment, useMemo } from 'react';

import Link from 'next/link';
import { useParams } from 'next/navigation';

import { CiCalendar } from 'react-icons/ci';
import { FiEye, FiHeart, FiMessageCircle } from 'react-icons/fi';

import { usePostsQuery } from '@/app/api/posts/posts.queries';
import { useProfileByHandleQuery } from '@/app/api/auth/auth.queries';
import { renderMarkdownPreview } from '@/app/shared/utils/markdownPreview';
import { formatDateLabel, formatSummary } from '@/app/(routes)/(public)/[profileId]/utils';

import markdownStyles from '@/app/shared/styles/markdown.module.css';
import styles from '@/app/(routes)/(public)/[profileId]/ProfilePage.module.css';

/**
 * 프로필 페이지
 * @description 사용자 공개 프로필과 게시글 목록을 표시
 */
export default function ProfilePage() {
  // 라우트 파라미터
  const params = useParams();
  const profileId = Array.isArray(params?.profileId) ? params.profileId[0] : (params?.profileId ?? '');
  const decodedProfileId = decodeURIComponent(profileId);
  const hasAtPrefix = decodedProfileId.startsWith('@');
  const normalizedProfileId = decodedProfileId.replace(/^@/, '');

  // 조회 데이터
  const { data: profile, isLoading: isProfileLoading } = useProfileByHandleQuery(normalizedProfileId);
  const { data: postsData, isLoading: isPostsLoading } = usePostsQuery(
    {
      authorId: profile?.id,
      status: 'PUBLISHED',
      sort: 'publishedAt',
      order: 'DESC',
      limit: 30,
    },
    { enabled: Boolean(profile?.id) },
  );

  // 파생 데이터
  const posts = postsData?.items ?? [];
  const handleText = profile?.profileHandle ? `@${profile.profileHandle}` : `@${normalizedProfileId}`;
  const bioPreview = useMemo(() => renderMarkdownPreview(profile?.profileBio ?? ''), [profile?.profileBio]);

  // 프로필 : 파라미터 대기
  if (!decodedProfileId) {
    return (
      <section className={styles.container} aria-label="프로필">
        <div className={styles.empty}>프로필을 불러오는 중입니다.</div>
      </section>
    );
  }

  // 프로필 : @ 없는 요청 차단
  if (!hasAtPrefix) {
    return (
      <section className={styles.container} aria-label="프로필">
        <div className={styles.empty}>프로필을 찾을 수 없습니다.</div>
      </section>
    );
  }

  if (isProfileLoading) {
    return (
      <section className={styles.container} aria-label="프로필">
        <div className={styles.empty}>프로필을 불러오는 중입니다.</div>
      </section>
    );
  }

  if (!profile) {
    return (
      <section className={styles.container} aria-label="프로필">
        <div className={styles.empty}>프로필을 찾을 수 없습니다.</div>
      </section>
    );
  }

  return (
    <section className={styles.container} aria-label="프로필">
      <header className={styles.header}>
        <div className={styles.headerMain}>
          <h1 className={styles.name}>{profile.name}</h1>
          <span className={styles.handle}>{handleText}</span>
        </div>
        {profile.profileBio ? <div className={markdownStyles.markdown}>{bioPreview}</div> : null}
      </header>

      {isPostsLoading ? (
        <div className={styles.empty}>게시글을 불러오는 중입니다.</div>
      ) : posts.length ? (
        <ul className={styles.listView}>
          {posts.map((post, index) => (
            <Fragment key={post.id}>
              <li>
                <Link className={styles.postLink} href={`/posts/${post.id}`}>
                  <article className={styles.listItem}>
                    <div className={styles.listBody}>
                      <h3>{post.title || '제목 없음'}</h3>
                      <p className={styles.summary}>{formatSummary(post.content)}</p>
                      <div className={styles.meta}>
                        <span className={styles.metaGroup}>
                          <span className={styles.metaItem}>
                            <CiCalendar aria-hidden="true" /> {formatDateLabel(post.publishedAt ?? post.createdAt)}
                          </span>
                        </span>
                        <span className={styles.metaGroup}>
                          <span className={styles.metaItem}>
                            <FiEye aria-hidden="true" /> {post.viewCount.toLocaleString()}
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
                    {post.thumbnailUrl ? (
                      <div
                        className={styles.listThumb}
                        style={{ backgroundImage: `url(${post.thumbnailUrl})` }}
                        aria-hidden="true"
                      />
                    ) : null}
                  </article>
                </Link>
              </li>
              {index < posts.length - 1 ? (
                <li className={styles.listDividerItem} aria-hidden="true">
                  <div className={styles.listDivider} />
                </li>
              ) : null}
            </Fragment>
          ))}
        </ul>
      ) : (
        <div className={styles.empty}>아직 작성한 게시물이 없습니다.</div>
      )}
    </section>
  );
}
