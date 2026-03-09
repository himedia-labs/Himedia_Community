'use client';

import Image from 'next/image';
import { useParams } from 'next/navigation';

import { FaUser } from 'react-icons/fa';
import { FiChevronDown, FiClock, FiTrendingUp } from 'react-icons/fi';

import { ProfilePageSkeleton, ProfilePostListSkeleton } from '@/app/(routes)/(public)/[profileId]/ProfilePage.skeleton';
import {
  createHandleCategoryButtonClick,
  createHandleFollowMouseEnter,
  createHandleFollowMouseLeave,
  createHandleTagButtonClick,
} from '@/app/(routes)/(public)/[profileId]/handlers';
import { useProfileData } from '@/app/(routes)/(public)/[profileId]/hooks/useProfileData';
import { useProfileFilters } from '@/app/(routes)/(public)/[profileId]/hooks/useProfileFilters';
import { useProfileFollow } from '@/app/(routes)/(public)/[profileId]/hooks/useProfileFollow';
import PostSummaryList from '@/app/shared/components/post/PostSummaryList';
import { useToast } from '@/app/shared/components/toast/toast';
import postListStyles from '@/app/shared/components/post/PostListView.module.css';
import layoutStyles from '@/app/(routes)/(public)/[profileId]/ProfilePageLayout.module.css';
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
        <header className={layoutStyles.header}>
          <div className={layoutStyles.profileCard}>
            <div className={layoutStyles.profileMain}>
              <div className={layoutStyles.avatar} aria-hidden="true">
                {profile.profileImageUrl ? (
                  <Image
                    className={layoutStyles.avatarImage}
                    src={profile.profileImageUrl}
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
                  <span className={layoutStyles.profileName}>{profile.name}</span>
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
                    className={`${styles.authorFollowButton} ${
                      isFollowing ? styles.authorFollowButtonActive : ''
                    }`}
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
                    <div className={layoutStyles.profileSocialRow} aria-label="소셜 링크">
                      {profileSocialLinks.map(({ href, label, icon: Icon, external }) => (
                        <a
                          key={label}
                          className={layoutStyles.profileSocialLink}
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
        <div className={layoutStyles.headerDivider} aria-hidden="true" />
      </div>
      <section className={layoutStyles.settingsSection} aria-label="소개">
        <div className={layoutStyles.settingsRow}>
          <span className={layoutStyles.settingsLabel}>소개</span>
        </div>
        <div className={layoutStyles.settingsBody}>
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
      <div className={layoutStyles.headerDivider} aria-hidden="true" />

      {isPostsLoading ? (
        <ProfilePostListSkeleton />
      ) : (
        <section className={layoutStyles.settingsSection} aria-label="게시글 목록">
          <div className={layoutStyles.settingsRow}>
            <span className={layoutStyles.settingsLabel}>게시글</span>
            <div className={layoutStyles.settingsControlGroup}>
              <div className={layoutStyles.filterDropdown}>
                <button
                  type="button"
                  className={layoutStyles.filterButton}
                  onClick={toggleCategory}
                  disabled={!postCategories.length}
                >
                  {selectedCategoryLabel ?? '카테고리'}
                  <FiChevronDown className={layoutStyles.filterChevron} aria-hidden="true" />
                </button>
                {isCategoryOpen ? (
                  <div className={layoutStyles.filterMenu}>
                    {postCategories.map(category => (
                      <button
                        key={category.id}
                        type="button"
                        className={`${layoutStyles.filterItem} ${
                          selectedCategoryId === category.id ? layoutStyles.filterItemActive : ''
                        }`}
                        data-category-id={category.id}
                        onClick={handleCategoryButtonClick}
                      >
                        <span>{category.name}</span>
                        <span className={layoutStyles.filterCount}>{category.count}</span>
                      </button>
                    ))}
                  </div>
                ) : null}
              </div>
              <div className={layoutStyles.filterDropdown}>
                <button
                  type="button"
                  className={layoutStyles.filterButton}
                  onClick={toggleTag}
                  disabled={!postTags.length}
                >
                  <span className={layoutStyles.tagFilterLabel}>
                    {selectedTagLabel ? `#${selectedTagLabel}` : '#태그'}
                  </span>
                  <FiChevronDown className={layoutStyles.filterChevron} aria-hidden="true" />
                </button>
                {isTagOpen ? (
                  <div className={`${layoutStyles.filterMenu} ${layoutStyles.tagFilterMenu}`}>
                    {postTags.map(tag => (
                      <button
                        key={tag.id}
                        type="button"
                        className={`${layoutStyles.filterItem} ${
                          selectedTagId === tag.id
                            ? `${layoutStyles.filterItemActive} ${layoutStyles.tagFilterItemActive}`
                            : ''
                        }`}
                        data-tag-id={tag.id}
                        onClick={handleTagButtonClick}
                      >
                        <span className={layoutStyles.tagFilterName}>#{tag.name}</span>
                        <span className={layoutStyles.filterCount}>{tag.count}</span>
                      </button>
                    ))}
                  </div>
                ) : null}
              </div>
              <div className={layoutStyles.settingsDivider} aria-hidden="true" />
              <div className={layoutStyles.settingsSortGroup}>
                <button
                  type="button"
                  className={`${layoutStyles.settingsSortButton} ${layoutStyles.settingsSortButtonActive}`}
                  onClick={handleSortToggle}
                >
                  {sortKey === 'popular' ? (
                    <>
                      <FiTrendingUp className={layoutStyles.settingsSortIcon} aria-hidden="true" />
                      인기순
                    </>
                  ) : (
                    <>
                      <FiClock className={layoutStyles.settingsSortIcon} aria-hidden="true" />
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
