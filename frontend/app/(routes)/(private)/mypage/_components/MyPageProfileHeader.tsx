import Image from 'next/image';

import { FaUser, FaUserEdit } from 'react-icons/fa';

import ProfileSocialLinks from '@/app/shared/components/profile/ProfileSocialLinks';

import styles from '@/app/(routes)/(private)/mypage/MyPage.module.css';

import type { MyPageProfileHeaderProps } from '@/app/shared/types/mypage';

/**
 * 마이페이지 프로필 헤더
 * @description 프로필 이미지, 기본 정보, 소셜 링크 편집 영역을 렌더링합니다.
 */
export default function MyPageProfileHeader({
  editingContactEmail,
  editingFacebookUrl,
  editingGithubUrl,
  editingHandle,
  editingLinkedinUrl,
  editingTwitterUrl,
  editingWebsiteUrl,
  followerCount,
  followingCount,
  isProfileActionPending,
  isProfileEditing,
  myPostCount,
  profileAvatarUrl,
  profileHandleValue,
  profileNameValue,
  profileSocialLinks,
  avatarInputRef,
  handleAvatarChange,
  handleAvatarClick,
  handleAvatarRemove,
  handleProfileAction,
  handleProfileCancelAll,
  handleProfileContactEmailChange,
  handleProfileFacebookUrlChange,
  handleProfileGithubUrlChange,
  handleProfileHandleChange,
  handleProfileLinkedinUrlChange,
  handleProfileTwitterUrlChange,
  handleProfileWebsiteUrlChange,
}: MyPageProfileHeaderProps) {
  return (
    <header className={styles.header}>
      <div className={styles.profileCard}>
        <div className={styles.profileMain}>
          <button
            type="button"
            className={styles.avatarButton}
            aria-label="프로필 이미지 업로드"
            onClick={handleAvatarClick}
          >
            <div className={styles.avatar} aria-hidden="true">
              {profileAvatarUrl ? (
                <Image
                  className={styles.avatarImage}
                  src={profileAvatarUrl}
                  alt=""
                  width={62}
                  height={62}
                  sizes="62px"
                  unoptimized
                />
              ) : isProfileEditing ? (
                <FaUserEdit className={`${styles.avatarIcon} ${styles.avatarIconEdit}`} />
              ) : (
                <FaUser className={styles.avatarIcon} />
              )}
            </div>
            <input
              ref={avatarInputRef}
              className={styles.avatarInput}
              type="file"
              accept="image/*"
              disabled={!isProfileEditing}
              onChange={handleAvatarChange}
            />
          </button>
          <div className={styles.profileInfo}>
            {isProfileEditing ? (
              <div className={styles.profileNameRow}>
                <span className={styles.profileName}>{profileNameValue}</span>
                <span className={styles.profileHandleInputGroup}>
                  <span className={styles.profileHandlePrefix}>@</span>
                  <input
                    className={styles.profileHandleInput}
                    value={editingHandle}
                    onChange={handleProfileHandleChange}
                    placeholder="아이디"
                  />
                </span>
              </div>
            ) : (
              <div className={styles.profileNameRow}>
                <span className={styles.profileName}>{profileNameValue}</span>
                <span className={styles.profileHandle}>{profileHandleValue}</span>
              </div>
            )}
            <div className={styles.profileStatsRow}>
              <div className={styles.profileStats}>
                <span className={styles.profileStat}>
                  글 <strong>{myPostCount}</strong>
                </span>
                <span className={styles.profileDivider}>·</span>
                <span className={styles.profileStat}>
                  팔로워 <strong>{followerCount}</strong>
                </span>
                <span className={styles.profileDivider}>·</span>
                <span className={styles.profileStat}>
                  팔로잉 <strong>{followingCount}</strong>
                </span>
              </div>
            </div>
          </div>
          <div className={styles.profileSide}>
            <div className={styles.profileActions}>
              {isProfileEditing ? (
                <>
                  <button
                    type="button"
                    className={styles.profileDeleteButton}
                    disabled={isProfileActionPending}
                    onClick={handleAvatarRemove}
                  >
                    사진 지우기
                  </button>
                  <span className={styles.profileActionDivider} aria-hidden="true">
                    |
                  </span>
                  <button
                    type="button"
                    className={styles.profileCancelButton}
                    disabled={isProfileActionPending}
                    onClick={handleProfileCancelAll}
                  >
                    취소
                  </button>
                </>
              ) : null}
              <button
                type="button"
                className={styles.profileEditButton}
                disabled={isProfileActionPending}
                onClick={handleProfileAction}
              >
                {isProfileEditing ? '저장' : '프로필 수정'}
              </button>
            </div>
            {profileSocialLinks.length ? (
              <ProfileSocialLinks
                links={profileSocialLinks}
                containerClassName={styles.profileSocialRow}
                linkClassName={styles.profileSocialLink}
              />
            ) : null}
          </div>
        </div>
        {isProfileEditing ? (
          <div className={styles.profileSocialEditor}>
            <div className={styles.profileSocialEditorGrid}>
              <label className={styles.profileSocialEditorField}>
                <span className={styles.profileSocialEditorLabel}>이메일</span>
                <div className={styles.profileSocialEditorInputRow}>
                  <input
                    type="email"
                    className={styles.profileSocialEditorInput}
                    placeholder="example@email.com"
                    value={editingContactEmail}
                    disabled={isProfileActionPending}
                    onChange={handleProfileContactEmailChange}
                  />
                </div>
              </label>
              <label className={styles.profileSocialEditorField}>
                <span className={styles.profileSocialEditorLabel}>깃허브</span>
                <div className={styles.profileSocialEditorInputRow}>
                  <span className={styles.profileSocialEditorPrefix}>https://github.com/</span>
                  <input
                    type="text"
                    className={styles.profileSocialEditorInput}
                    placeholder="username"
                    value={editingGithubUrl}
                    disabled={isProfileActionPending}
                    onChange={handleProfileGithubUrlChange}
                  />
                </div>
              </label>
              <label className={styles.profileSocialEditorField}>
                <span className={styles.profileSocialEditorLabel}>링크드인</span>
                <div className={styles.profileSocialEditorInputRow}>
                  <span className={styles.profileSocialEditorPrefix}>https://www.linkedin.com/in/</span>
                  <input
                    type="text"
                    className={styles.profileSocialEditorInput}
                    placeholder="username"
                    value={editingLinkedinUrl}
                    disabled={isProfileActionPending}
                    onChange={handleProfileLinkedinUrlChange}
                  />
                </div>
              </label>
              <label className={styles.profileSocialEditorField}>
                <span className={styles.profileSocialEditorLabel}>X (Twitter)</span>
                <div className={styles.profileSocialEditorInputRow}>
                  <span className={styles.profileSocialEditorPrefix}>https://x.com/</span>
                  <input
                    type="text"
                    className={styles.profileSocialEditorInput}
                    placeholder="username"
                    value={editingTwitterUrl}
                    disabled={isProfileActionPending}
                    onChange={handleProfileTwitterUrlChange}
                  />
                </div>
              </label>
              <label className={styles.profileSocialEditorField}>
                <span className={styles.profileSocialEditorLabel}>페이스북</span>
                <div className={styles.profileSocialEditorInputRow}>
                  <span className={styles.profileSocialEditorPrefix}>https://www.facebook.com/</span>
                  <input
                    type="text"
                    className={styles.profileSocialEditorInput}
                    placeholder="username"
                    value={editingFacebookUrl}
                    disabled={isProfileActionPending}
                    onChange={handleProfileFacebookUrlChange}
                  />
                </div>
              </label>
              <label className={styles.profileSocialEditorField}>
                <span className={styles.profileSocialEditorLabel}>홈페이지</span>
                <div className={styles.profileSocialEditorInputRow}>
                  <input
                    type="text"
                    className={styles.profileSocialEditorInput}
                    placeholder="https://example.com"
                    value={editingWebsiteUrl}
                    disabled={isProfileActionPending}
                    onChange={handleProfileWebsiteUrlChange}
                  />
                </div>
              </label>
            </div>
          </div>
        ) : null}
      </div>
    </header>
  );
}
