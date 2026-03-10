'use client';

import { useParams } from 'next/navigation';

import { ProfilePageSkeleton, ProfilePostListSkeleton } from '@/app/(routes)/(public)/[profileId]/ProfilePage.skeleton';
import {
  ProfilePageEmptyState,
  ProfilePageHeader,
  ProfilePageIntro,
  ProfilePagePostsSection,
} from '@/app/(routes)/(public)/[profileId]/_components';
import {
  createHandleCategoryButtonClick,
  createHandleFollowMouseEnter,
  createHandleFollowMouseLeave,
  createHandleTagButtonClick,
} from '@/app/(routes)/(public)/[profileId]/_handlers';
import { useProfileData } from '@/app/(routes)/(public)/[profileId]/_hooks/useProfileData';
import { useProfileFilters } from '@/app/(routes)/(public)/[profileId]/_hooks/useProfileFilters';
import { useProfileFollow } from '@/app/(routes)/(public)/[profileId]/_hooks/useProfileFollow';
import { useToast } from '@/app/shared/components/toast/toast';
import layoutStyles from '@/app/(routes)/(public)/[profileId]/ProfilePageLayout.module.css';
import styles from '@/app/(routes)/(public)/[profileId]/ProfilePage.module.css';

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
  const handleFollowMouseEnter = createHandleFollowMouseEnter(setIsFollowHover);
  const handleFollowMouseLeave = createHandleFollowMouseLeave(setIsFollowHover);
  const handleCategoryButtonClick = createHandleCategoryButtonClick(handleCategorySelect);
  const handleTagButtonClick = createHandleTagButtonClick(handleTagSelect);

  // 프로필 : 파라미터 대기
  if (!decodedProfileId) {
    return <ProfilePageSkeleton />;
  }

  // 프로필 : @ 없는 요청 차단
  if (!hasAtPrefix) {
    return <ProfilePageEmptyState message="프로필을 찾을 수 없습니다." />;
  }

  // 프로필 : 로딩
  if (isProfileLoading) {
    return <ProfilePageSkeleton />;
  }

  // 프로필 : 없음
  if (!profile) {
    return <ProfilePageEmptyState message="프로필을 찾을 수 없습니다." />;
  }

  return (
    <section className={styles.container} aria-label="프로필">
      <ProfilePageHeader
        name={profile.name}
        handleText={handleText}
        postCount={postCount}
        followerCount={followerCount}
        followingCount={followingCount}
        isFollowHover={isFollowHover}
        isFollowLoading={isFollowLoading}
        isFollowing={isFollowing}
        isMyProfile={isMyProfile}
        profileImageUrl={profile.profileImageUrl}
        profileSocialLinks={profileSocialLinks}
        handleFollowToggle={handleFollowToggle}
        handleFollowMouseEnter={handleFollowMouseEnter}
        handleFollowMouseLeave={handleFollowMouseLeave}
      />
      <ProfilePageIntro bioPreview={bioPreview} profileBio={profile.profileBio} />
      <div className={layoutStyles.headerDivider} aria-hidden="true" />

      {isPostsLoading ? (
        <ProfilePostListSkeleton />
      ) : (
        <ProfilePagePostsSection
          emptyText={emptyText}
          sortKey={sortKey}
          isTagOpen={isTagOpen}
          isCategoryOpen={isCategoryOpen}
          filteredPosts={filteredPosts}
          postCategories={postCategories}
          postTags={postTags}
          selectedTagId={selectedTagId}
          selectedCategoryId={selectedCategoryId}
          selectedTagLabel={selectedTagLabel}
          selectedCategoryLabel={selectedCategoryLabel}
          handleSortToggle={handleSortToggle}
          toggleCategory={toggleCategory}
          toggleTag={toggleTag}
          handleCategoryButtonClick={handleCategoryButtonClick}
          handleTagButtonClick={handleTagButtonClick}
        />
      )}
    </section>
  );
}
