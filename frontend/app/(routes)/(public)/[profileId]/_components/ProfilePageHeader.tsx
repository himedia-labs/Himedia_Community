import Image from 'next/image';

import { FaUser } from 'react-icons/fa';

import ProfileSocialLinks from '@/app/shared/components/profile/ProfileSocialLinks';

import layoutStyles from '@/app/(routes)/(public)/[profileId]/ProfilePageLayout.module.css';
import styles from '@/app/(routes)/(public)/[profileId]/ProfilePage.module.css';

import type { ProfilePageHeaderProps } from '@/app/shared/types/profilePage';

/**
 * 프로필 헤더
 * @description 공개 프로필 상단 카드와 팔로우 버튼을 렌더링합니다.
 */
export default function ProfilePageHeader({
  name,
  handleText,
  postCount,
  followerCount,
  followingCount,
  isFollowHover,
  isFollowLoading,
  isFollowing,
  isMyProfile,
  profileImageUrl,
  profileSocialLinks,
  handleFollowToggle,
  handleFollowMouseEnter,
  handleFollowMouseLeave,
}: ProfilePageHeaderProps) {
  return (
    <div className={styles.headerBlock}>
      <header className={layoutStyles.header}>
        <div className={layoutStyles.profileCard}>
          <div className={layoutStyles.profileMain}>
            <div className={layoutStyles.avatar} aria-hidden="true">
              {profileImageUrl ? (
                <Image
                  className={layoutStyles.avatarImage}
                  src={profileImageUrl}
                  alt=""
                  width={62}
                  height={62}
                  sizes="62px"
                  unoptimized
                />
              ) : (
                <FaUser className={layoutStyles.avatarIcon} />
              )}
            </div>
            <div className={layoutStyles.profileInfo}>
              <div className={layoutStyles.profileNameRow}>
                <span className={layoutStyles.profileName}>{name}</span>
                <span className={layoutStyles.profileHandle}>{handleText}</span>
              </div>
              <div className={layoutStyles.profileStatsRow}>
                <div className={layoutStyles.profileStats}>
                  <span className={layoutStyles.profileStat}>
                    글 <strong>{postCount}</strong>
                  </span>
                  <span className={layoutStyles.profileDivider}>·</span>
                  <span className={layoutStyles.profileStat}>
                    팔로워 <strong>{followerCount}</strong>
                  </span>
                  <span className={layoutStyles.profileDivider}>·</span>
                  <span className={layoutStyles.profileStat}>
                    팔로잉 <strong>{followingCount}</strong>
                  </span>
                </div>
              </div>
            </div>
            <div className={styles.profileSide}>
              {!isMyProfile ? (
                <button
                  type="button"
                  className={`${styles.authorFollowButton} ${isFollowing ? styles.authorFollowButtonActive : ''}`}
                  disabled={isFollowLoading}
                  onMouseEnter={handleFollowMouseEnter}
                  onMouseLeave={handleFollowMouseLeave}
                  onClick={handleFollowToggle}
                >
                  {isFollowing ? (isFollowHover ? '언팔로우' : '팔로잉') : '팔로우'}
                </button>
              ) : null}
              {profileSocialLinks.length ? (
                <div className={styles.profileSocialBottom}>
                  <ProfileSocialLinks
                    links={profileSocialLinks}
                    containerClassName={layoutStyles.profileSocialRow}
                    linkClassName={layoutStyles.profileSocialLink}
                  />
                </div>
              ) : null}
            </div>
          </div>
        </div>
      </header>
      <div className={layoutStyles.headerDivider} aria-hidden="true" />
    </div>
  );
}
