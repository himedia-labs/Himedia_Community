'use client';

import Image from 'next/image';
import { useParams } from 'next/navigation';

import { FaUser } from 'react-icons/fa';
import { FiChevronDown, FiClock, FiTrendingUp } from 'react-icons/fi';

import { ProfilePageSkeleton, ProfilePostListSkeleton } from '@/app/(routes)/(public)/[profileId]/ProfilePage.skeleton';
import { useProfileData } from '@/app/(routes)/(public)/[profileId]/hooks/useProfileData';
import { useProfileFilters } from '@/app/(routes)/(public)/[profileId]/hooks/useProfileFilters';
import { useProfileFollow } from '@/app/(routes)/(public)/[profileId]/hooks/useProfileFollow';
import PostSummaryList from '@/app/shared/components/post/PostSummaryList';
import { useToast } from '@/app/shared/components/toast/toast';
import myPageStyles from '@/app/(routes)/(private)/mypage/MyPage.module.css';
import postListStyles from '@/app/(routes)/(public)/main/components/postList/postList.module.css';
import postDetailStyles from '@/app/(routes)/(public)/posts/[postId]/PostDetail.module.css';
import styles from '@/app/(routes)/(public)/[profileId]/ProfilePage.module.css';
import markdownStyles from '@/app/shared/components/markdown-editor/markdown.module.css';

/**
 * 프로필 페이지
 * @description 사용자 공개 프로필과 게시글 목록을 표시
 */
export default function ProfilePage() {
  // 라우트 파라미터
  const params = useParams();
  const profileIdParam = Array.isArray(params?.profileId) ? params.profileId[0] : params?.profileId;
  const { showToast } = useToast();

  // 데이터 상태
  const {
    accessToken,
    author,
    profileSocialLinks,
    bioPreview,
    decodedProfileId,
    followings,
    hasAtPrefix,
    handleText,
    isMyProfile,
    isPostsLoading,
    isProfileLoading,
    postCount,
    posts,
    profile,
    followingCount,
  } = useProfileData(profileIdParam);

  // 필터 상태
  const {
    isCategoryOpen,
    isTagOpen,
    postCategories,
    postTags,
    sortKey,
    selectedTagId,
    selectedTagLabel,
    selectedCategoryId,
    selectedCategoryLabel,
    filteredPosts,
    emptyText,
    toggleCategory,
    handleSortToggle,
    handleTagSelect,
    toggleTag,
    handleCategorySelect,
  } = useProfileFilters(posts);

  // 팔로우 상태
  const { isFollowHover, isFollowLoading, isFollowing, followerCount, setIsFollowHover, handleFollowToggle } =
    useProfileFollow({
      accessToken,
      isMyProfile,
      showToast,
      profileId: profile?.id,
      author: author ?? undefined,
      followings,
    });

  // 프로필 : 파라미터 대기
  if (!decodedProfileId) {
    return <ProfilePageSkeleton />;
  }

  // 프로필 : @ 없는 요청 차단
  if (!hasAtPrefix) {
    return (
      <section className={styles.container} aria-label="프로필">
        <div className={styles.empty}>프로필을 찾을 수 없습니다.</div>
      </section>
    );
  }

  // 프로필 : 로딩
  if (isProfileLoading) {
    return <ProfilePageSkeleton />;
  }

  // 프로필 : 없음
  if (!profile) {
    return (
      <section className={styles.container} aria-label="프로필">
        <div className={styles.empty}>프로필을 찾을 수 없습니다.</div>
      </section>
    );
  }

  return (
    <section className={styles.container} aria-label="프로필">
      <div className={styles.headerBlock}>
        <header className={myPageStyles.header}>
          <div className={myPageStyles.profileCard}>
            <div className={myPageStyles.profileMain}>
              <div className={myPageStyles.avatar} aria-hidden="true">
                {profile.profileImageUrl ? (
                  <Image
                    className={myPageStyles.avatarImage}
                    src={profile.profileImageUrl}
                    alt=""
                    width={62}
                    height={62}
                    sizes="62px"
                    unoptimized
                  />
                ) : (
                  <FaUser className={myPageStyles.avatarIcon} />
                )}
              </div>
              <div className={myPageStyles.profileInfo}>
                <div className={myPageStyles.profileNameRow}>
                  <span className={myPageStyles.profileName}>{profile.name}</span>
                  <span className={myPageStyles.profileHandle}>{handleText}</span>
                </div>
                <div className={myPageStyles.profileStatsRow}>
                  <div className={myPageStyles.profileStats}>
                    <span className={myPageStyles.profileStat}>
                      글 <strong>{postCount}</strong>
                    </span>
                    <span className={myPageStyles.profileDivider}>·</span>
                    <span className={myPageStyles.profileStat}>
                      팔로워 <strong>{followerCount}</strong>
                    </span>
                    <span className={myPageStyles.profileDivider}>·</span>
                    <span className={myPageStyles.profileStat}>
                      팔로잉 <strong>{followingCount}</strong>
                    </span>
                  </div>
                </div>
              </div>
              <div className={styles.profileSide}>
                {!isMyProfile ? (
                  <button
                    type="button"
                    className={`${postDetailStyles.authorFollowButton} ${
                      isFollowing ? postDetailStyles.authorFollowButtonActive : ''
                    }`}
                    disabled={isFollowLoading}
                    onMouseEnter={() => setIsFollowHover(true)}
                    onMouseLeave={() => setIsFollowHover(false)}
                    onClick={handleFollowToggle}
                  >
                    {isFollowing ? (isFollowHover ? '언팔로우' : '팔로잉') : '팔로우'}
                  </button>
                ) : null}
                {profileSocialLinks.length ? (
                  <div className={styles.profileSocialBottom}>
                    <div className={myPageStyles.profileSocialRow} aria-label="소셜 링크">
                      {profileSocialLinks.map(({ href, label, icon: Icon, external }) => (
                        <a
                          key={label}
                          className={myPageStyles.profileSocialLink}
                          href={href}
                          aria-label={label}
                          target={external ? '_blank' : undefined}
                          rel={external ? 'noreferrer' : undefined}
                        >
                          <Icon aria-hidden="true" />
                        </a>
                      ))}
                    </div>
                  </div>
                ) : null}
              </div>
            </div>
          </div>
        </header>
        <div className={myPageStyles.headerDivider} aria-hidden="true" />
      </div>
      <section className={myPageStyles.settingsSection} aria-label="소개">
        <div className={myPageStyles.settingsRow}>
          <span className={myPageStyles.settingsLabel}>소개</span>
        </div>
        <div className={myPageStyles.settingsBody}>
          {profile.profileBio ? (
            <div className={markdownStyles.markdown}>{bioPreview}</div>
          ) : (
            <div className={postListStyles.emptyState}>
              <p className={postListStyles.emptyTitle}>아직 소개가 없어요</p>
              <p className={postListStyles.emptyDescription}>첫 소개가 등록되면 여기에 보여드릴게요.</p>
            </div>
          )}
        </div>
      </section>
      <div className={myPageStyles.headerDivider} aria-hidden="true" />

      {isPostsLoading ? (
        <ProfilePostListSkeleton />
      ) : (
        <section className={myPageStyles.settingsSection} aria-label="게시글 목록">
          <div className={myPageStyles.settingsRow}>
            <span className={myPageStyles.settingsLabel}>게시글</span>
            <div className={myPageStyles.settingsControlGroup}>
              <div className={myPageStyles.filterDropdown}>
                <button
                  type="button"
                  className={myPageStyles.filterButton}
                  onClick={toggleCategory}
                  disabled={!postCategories.length}
                >
                  {selectedCategoryLabel ?? '카테고리'}
                  <FiChevronDown className={myPageStyles.filterChevron} aria-hidden="true" />
                </button>
                {isCategoryOpen ? (
                  <div className={myPageStyles.filterMenu}>
                    {postCategories.map(category => (
                      <button
                        key={category.id}
                        type="button"
                        className={`${myPageStyles.filterItem} ${
                          selectedCategoryId === category.id ? myPageStyles.filterItemActive : ''
                        }`}
                        onClick={() => handleCategorySelect(category.id)}
                      >
                        <span>{category.name}</span>
                        <span className={myPageStyles.filterCount}>{category.count}</span>
                      </button>
                    ))}
                  </div>
                ) : null}
              </div>
              <div className={myPageStyles.filterDropdown}>
                <button
                  type="button"
                  className={myPageStyles.filterButton}
                  onClick={toggleTag}
                  disabled={!postTags.length}
                >
                  <span className={myPageStyles.tagFilterLabel}>
                    {selectedTagLabel ? `#${selectedTagLabel}` : '#태그'}
                  </span>
                  <FiChevronDown className={myPageStyles.filterChevron} aria-hidden="true" />
                </button>
                {isTagOpen ? (
                  <div className={`${myPageStyles.filterMenu} ${myPageStyles.tagFilterMenu}`}>
                    {postTags.map(tag => (
                      <button
                        key={tag.id}
                        type="button"
                        className={`${myPageStyles.filterItem} ${
                          selectedTagId === tag.id
                            ? `${myPageStyles.filterItemActive} ${myPageStyles.tagFilterItemActive}`
                            : ''
                        }`}
                        onClick={() => handleTagSelect(tag.id)}
                      >
                        <span className={myPageStyles.tagFilterName}>#{tag.name}</span>
                        <span className={myPageStyles.filterCount}>{tag.count}</span>
                      </button>
                    ))}
                  </div>
                ) : null}
              </div>
              <div className={myPageStyles.settingsDivider} aria-hidden="true" />
              <div className={myPageStyles.settingsSortGroup}>
                <button
                  type="button"
                  className={`${myPageStyles.settingsSortButton} ${myPageStyles.settingsSortButtonActive}`}
                  onClick={handleSortToggle}
                >
                  {sortKey === 'popular' ? (
                    <>
                      <FiTrendingUp className={myPageStyles.settingsSortIcon} aria-hidden="true" />
                      인기순
                    </>
                  ) : (
                    <>
                      <FiClock className={myPageStyles.settingsSortIcon} aria-hidden="true" />
                      최신순
                    </>
                  )}
                </button>
              </div>
            </div>
          </div>
          <PostSummaryList posts={filteredPosts} emptyText={emptyText} emptyClassName={styles.empty} />
        </section>
      )}
    </section>
  );
}
