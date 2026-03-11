import Image from 'next/image';
import Link from 'next/link';

import { FaUser } from 'react-icons/fa6';
import { FiExternalLink } from 'react-icons/fi';

import { formatRole } from '@/app/(routes)/(public)/posts/[postId]/_utils';

import styles from '@/app/(routes)/(public)/posts/[postId]/PostDetail.module.css';

import type { PostDetailAuthorSectionProps } from '@/app/shared/types/post';

/**
 * 작성자 프로필 섹션
 * @description 작성자 정보와 팔로우 버튼, 소셜 링크를 렌더링합니다.
 */
export default function PostDetailAuthorSection({
  author,
  authorFollowerCount,
  authorFollowingCount,
  authorPostCount,
  authorProfilePath,
  canShowAuthorFollowButton,
  isAuthorFollowHover,
  isAuthorFollowLoading,
  isAuthorFollowing,
  postAuthorId,
  authorProfileBioPreview,
  authorSocialLinks,
  handleAuthorFollowToggle,
  handleAuthorFollowMouseEnter,
  handleAuthorFollowMouseLeave,
}: PostDetailAuthorSectionProps) {
  return (
    <section className={styles.authorProfileCard} aria-label="작성자 프로필">
      <div className={styles.authorProfileMain}>
        <div className={styles.authorProfileAvatar} aria-hidden="true">
          {author.profileImageUrl ? (
            <Image
              className={styles.authorProfileAvatarImage}
              src={author.profileImageUrl}
              alt=""
              width={72}
              height={72}
              unoptimized
            />
          ) : (
            <FaUser />
          )}
        </div>
        <div className={styles.authorProfileInfo}>
          <div className={styles.authorProfileNameRow}>
            <div className={styles.authorProfileNameGroup}>
              {authorProfilePath ? (
                <Link className={styles.authorProfileNameLink} href={authorProfilePath}>
                  <span className={styles.authorProfileName}>{author.name}</span>
                  <span className={`${styles.authorProfileRole} ${styles.authorProfileRoleLink}`}>
                    <span>{formatRole(author.role)}</span>
                    <FiExternalLink className={styles.authorProfileNameLinkIcon} aria-hidden="true" />
                  </span>
                </Link>
              ) : (
                <>
                  <span className={styles.authorProfileName}>{author.name}</span>
                  <span className={styles.authorProfileRole}>{formatRole(author.role)}</span>
                </>
              )}
            </div>
            {canShowAuthorFollowButton ? (
              <button
                type="button"
                className={`${styles.authorFollowButton} ${isAuthorFollowing ? styles.authorFollowButtonActive : ''}`}
                disabled={isAuthorFollowLoading || !postAuthorId}
                onMouseEnter={handleAuthorFollowMouseEnter}
                onMouseLeave={handleAuthorFollowMouseLeave}
                onClick={handleAuthorFollowToggle}
              >
                {isAuthorFollowing ? (isAuthorFollowHover ? '언팔로우' : '팔로잉') : '팔로우'}
              </button>
            ) : null}
          </div>
          {authorProfileBioPreview ? <p className={styles.authorProfileBio}>{authorProfileBioPreview}</p> : null}
          <span className={styles.authorProfileMeta}>
            글 {authorPostCount.toLocaleString()} · 팔로워 {authorFollowerCount.toLocaleString()} · 팔로잉{' '}
            {authorFollowingCount.toLocaleString()}
          </span>
        </div>
      </div>
      {authorSocialLinks.length ? (
        <>
          <div className={styles.authorProfileSocialDivider} aria-hidden="true" />
          <div className={styles.authorProfileSocialRow} aria-label="작성자 소셜 링크">
            {authorSocialLinks.map(({ href, label, icon: Icon, external }) => (
              <a
                key={label}
                className={styles.authorProfileSocialLink}
                href={href}
                aria-label={label}
                target={external ? '_blank' : undefined}
                rel={external ? 'noreferrer' : undefined}
              >
                <Icon aria-hidden="true" />
              </a>
            ))}
          </div>
        </>
      ) : null}
    </section>
  );
}
