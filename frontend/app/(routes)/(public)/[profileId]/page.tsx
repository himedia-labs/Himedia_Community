'use client';

import { Fragment, useMemo } from 'react';

import Link from 'next/link';
import { useParams } from 'next/navigation';

import { CiCalendar } from 'react-icons/ci';
import { FiEye, FiHeart, FiMessageCircle } from 'react-icons/fi';

import { useProfileByHandleQuery } from '@/app/api/auth/auth.queries';
import { usePostsQuery } from '@/app/api/posts/posts.queries';
import markdownStyles from '@/app/shared/styles/markdown.module.css';
import { renderMarkdownPreview } from '@/app/shared/utils/markdownPreview';

import styles from './ProfilePage.module.css';

const formatDateLabel = (value?: string | null) => {
  if (!value) return '--';
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return '--';
  return `${date.getFullYear()}.${String(date.getMonth() + 1).padStart(2, '0')}.${String(date.getDate()).padStart(2, '0')}`;
};

const formatSummary = (value?: string | null) => {
  if (!value) return '내용 없음';
  return value.replace(/\s+/g, ' ').slice(0, 120);
};

export default function ProfilePage() {
  const params = useParams();
  const profileId = Array.isArray(params?.profileId) ? params.profileId[0] : params?.profileId ?? '';
  const { data: profile, isLoading: isProfileLoading } = useProfileByHandleQuery(profileId);
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

  const posts = postsData?.items ?? [];
  const handleText = profile?.profileHandle ? `@${profile.profileHandle}` : profileId;
  const bioPreview = useMemo(() => renderMarkdownPreview(profile?.profileBio ?? ''), [profile?.profileBio]);

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
