'use client';

import { useMemo, useState } from 'react';

import Link from 'next/link';
import Image from 'next/image';
import { useRouter } from 'next/navigation';

import { FaUser, FaUserEdit } from 'react-icons/fa';

import { MYPAGE_TABS } from '@/app/shared/constants/config/mypage.config';

import { PROFILE_SOCIAL_SKELETON_COUNT } from '@/app/(routes)/(private)/mypage/constants';
import {
  createCloseWithdrawModal,
  createHandleCategorySelect,
  createHandleProfileAction,
  createHandleProfileCancelAll,
  createHandleProfileSaveAll,
  createHandleTagSelect,
  createHandleWithdraw,
  createOpenWithdrawModal,
  createToggleCategory,
  createToggleTag,
} from '@/app/(routes)/(private)/mypage/handlers';
import {
  MyPageAccountTab,
  MyPageCommentsTab,
  MyPageDraftsTab,
  MyPageLikesTab,
  MyPagePostsTab,
  MyPageRecentTab,
  MyPageSettingsTab,
} from '@/app/(routes)/(private)/mypage/components/tabs';
import { MyPageValueSkeleton } from '@/app/(routes)/(private)/mypage/MyPage.skeleton';
import { formatProfileSocialLinks, sortPostsByKey } from '@/app/(routes)/(private)/mypage/utils';
import {
  useAccountSettings,
  useActivitySort,
  useBioEditor,
  useCommentEditor,
  useMyPageData,
  useMyPageTab,
  usePostMenu,
  usePostSidebarData,
  useProfileEditor,
  useProfileImageEditor,
} from '@/app/(routes)/(private)/mypage/hooks';
import { useWithdrawAccountMutation } from '@/app/api/auth/auth.mutations';

import { useToast } from '@/app/shared/components/toast/toast';
import { useAuthStore } from '@/app/shared/store/authStore';

import styles from '@/app/(routes)/(private)/mypage/MyPage.module.css';

/**
 * 마이페이지
 * @description 내 정보/활동/계정 설정을 관리하는 화면
 */
export default function MyPage() {
  // 라우팅/인증
  const router = useRouter();
  const { showToast } = useToast();
  const { clearAuth } = useAuthStore();
  const activeTab = useMyPageTab('settings');
  const { mutateAsync: withdrawAccount, isPending: isWithdrawing } = useWithdrawAccountMutation();

  // 데이터 조회
  const {
    currentUserId,
    displayName,
    followerCount,
    followingCount,
    isMyCommentsListLoading,
    isLikedPostsListLoading,
    isRecentPostsListLoading,
    isMyPostsLoading,
    isUserInfoLoading,
    likedPosts,
    recentPosts,
    myComments,
    myPosts,
    userBirthDate,
    userEmail,
    userPhone,
    profileHandle,
    profileContactEmail,
    profileGithubUrl,
    profileLinkedinUrl,
    profileTwitterUrl,
    profileFacebookUrl,
    profileWebsiteUrl,
    profileImageUrl,
    userBio,
  } = useMyPageData();

  // 정렬/필터
  const { sortKey, sortedPosts, sortedComments, handleSortChange } = useActivitySort(myPosts, myComments);
  const handleSortToggle = () => handleSortChange(sortKey === 'latest' ? 'popular' : 'latest');
  const { categories: postCategories, tags: postTags } = usePostSidebarData(myPosts);
  const sortedLikedPosts = useMemo(() => sortPostsByKey(likedPosts, sortKey), [likedPosts, sortKey]);
  const sortedRecentPosts = useMemo(() => sortPostsByKey(recentPosts, sortKey), [recentPosts, sortKey]);

  // 프로필 편집
  const {
    isProfileEditing,
    isProfileSaving,
    profileHandle: editingHandle,
    profileContactEmail: editingContactEmail,
    profileGithubUrl: editingGithubUrl,
    profileLinkedinUrl: editingLinkedinUrl,
    profileTwitterUrl: editingTwitterUrl,
    profileFacebookUrl: editingFacebookUrl,
    profileWebsiteUrl: editingWebsiteUrl,
    handlers: {
      setProfileContactEmail,
      setProfileGithubUrl,
      setProfileLinkedinUrl,
      setProfileTwitterUrl,
      setProfileFacebookUrl,
      setProfileWebsiteUrl,
      handleProfileSave,
      handleProfileEditStart,
      handleProfileEditComplete,
      handleProfileHandleChange,
      handleProfileCancel,
    },
  } = useProfileEditor({
    name: displayName,
    handle: profileHandle,
    contactEmail: profileContactEmail,
    githubUrl: profileGithubUrl,
    linkedinUrl: profileLinkedinUrl,
    twitterUrl: profileTwitterUrl,
    facebookUrl: profileFacebookUrl,
    websiteUrl: profileWebsiteUrl,
  });

  // 프로필 이미지
  const {
    isProfileUpdating,
    profileImageUrl: profileAvatarUrl,
    refs: { avatarInputRef },
    handlers: { handleAvatarClick, handleAvatarChange, handleAvatarRemove, handleAvatarSave, handleAvatarCancel },
  } = useProfileImageEditor(profileImageUrl, isProfileEditing);

  // 게시글 메뉴
  const { isPostDeleting, openPostMenuId, handlePostDelete, handlePostEdit, handlePostMenuToggle } = usePostMenu();

  // 댓글 편집
  const {
    editingCommentId,
    editingContent,
    hasEditingLengthError,
    isDeleting,
    isUpdating,
    openCommentMenuId,
    handleCommentMenuToggle,
    handleDeleteComment,
    handleEditCancel,
    handleEditChange,
    handleEditStart,
    handleEditSubmit,
  } = useCommentEditor();

  // 계정 설정
  const {
    birthDateValue,
    confirmPasswordValue,
    currentPasswordValue,
    emailCodeValue,
    emailValue,
    isEmailCodeSent,
    isEmailVerified,
    isEditingAny,
    isEditingBirthDate,
    isEditingEmail,
    isEditingPassword,
    isEditingPhone,
    isSaving,
    isSendingEmailCode,
    isVerifyingEmailCode,
    showConfirmPassword,
    showCurrentPassword,
    showNewPassword,
    newPasswordValue,
    passwordRuleStatus,
    phoneValue,
    cancelEdit,
    saveBirthDate,
    saveEmail,
    savePassword,
    savePhone,
    sendEmailVerificationCode,
    setConfirmPasswordValue,
    setCurrentPasswordValue,
    setNewPasswordValue,
    handleEmailChange,
    handleEmailCodeChange,
    handleBirthDateChange,
    handlePhoneChange,
    toggleConfirmPasswordVisibility,
    toggleCurrentPasswordVisibility,
    toggleNewPasswordVisibility,
    startBirthDateEdit,
    startEmailEdit,
    startPasswordEdit,
    startPhoneEdit,
  } = useAccountSettings({
    birthDate: userBirthDate,
    email: userEmail,
    phone: userPhone,
  });

  // 자기소개 편집
  const {
    bioPreview,
    profileBio,
    showBioEditor,
    isBioUpdating,
    refs: { bioEditorRef, bioImageInputRef },
    handlers: { handleBioChange, handleBioSave, handleBioToggle, handleBioImageClick, handleBioImageSelect },
    toolbar: { applyBullet, applyCode, applyHeading, applyInlineWrap, applyLink, applyNumbered, applyQuote },
  } = useBioEditor(userBio);

  // 필터 상태
  const [isCategoryOpen, setIsCategoryOpen] = useState(false);
  const [isTagOpen, setIsTagOpen] = useState(false);
  const [draftSortOrder, setDraftSortOrder] = useState<'latest' | 'oldest'>('latest');
  const [showWithdrawPassword, setShowWithdrawPassword] = useState(false);
  const [withdrawPassword, setWithdrawPassword] = useState('');
  const [isWithdrawModalOpen, setIsWithdrawModalOpen] = useState(false);
  const [selectedCategoryId, setSelectedCategoryId] = useState<string | null>(null);
  const [selectedTagId, setSelectedTagId] = useState<string | null>(null);

  // 필터 핸들러
  const toggleCategory = createToggleCategory({ setIsTagOpen, setIsCategoryOpen });
  const toggleTag = createToggleTag({ setIsCategoryOpen, setIsTagOpen });
  const handleCategorySelect = createHandleCategorySelect({ setSelectedCategoryId, setIsCategoryOpen });
  const handleTagSelect = createHandleTagSelect({ setSelectedTagId, setIsTagOpen });
  const selectedCategoryLabel = postCategories.find(category => category.id === selectedCategoryId)?.name;
  const selectedTagLabel = postTags.find(tag => tag.id === selectedTagId)?.name;

  // 필터링
  const filteredPosts = useMemo(() => {
    if (!selectedCategoryId && !selectedTagId) return sortedPosts;
    return sortedPosts.filter(post => {
      const matchesCategory = selectedCategoryId ? post.category?.id === selectedCategoryId : true;
      const matchesTag = selectedTagId ? post.tags?.some(tag => tag.id === selectedTagId) : true;
      return matchesCategory && matchesTag;
    });
  }, [selectedCategoryId, selectedTagId, sortedPosts]);

  // 포맷팅
  const accountNameValue = isUserInfoLoading ? <MyPageValueSkeleton width={88} height={18} /> : displayName || '사용자';
  const accountEmailValue = isUserInfoLoading ? <MyPageValueSkeleton width={180} height={18} /> : userEmail || '미등록';
  const accountPhoneValue = isUserInfoLoading ? <MyPageValueSkeleton width={140} height={18} /> : userPhone || '미등록';
  const accountBirthDateValue = isUserInfoLoading ? (
    <MyPageValueSkeleton width={120} height={18} />
  ) : (
    userBirthDate || '미등록'
  );
  const profileNameValue = isUserInfoLoading ? <MyPageValueSkeleton width={96} height={34} /> : displayName || '사용자';
  const profileHandleValue = isUserInfoLoading ? <MyPageValueSkeleton width={86} height={18} /> : `@${profileHandle}`;
  const isProfileActionPending = isProfileSaving || isProfileUpdating;
  const profileSocialLinks = formatProfileSocialLinks({
    profileContactEmail,
    profileGithubUrl,
    profileLinkedinUrl,
    profileTwitterUrl,
    profileFacebookUrl,
    profileWebsiteUrl,
  });

  // 프로필 액션
  const handleProfileSaveAll = createHandleProfileSaveAll({
    isProfileActionPending,
    handleProfileSave,
    handleAvatarSave,
    handleProfileEditComplete,
  });
  const handleProfileAction = createHandleProfileAction({
    isProfileActionPending,
    isProfileEditing,
    handleProfileEditStart,
    handleProfileSaveAll,
  });
  const handleProfileCancelAll = createHandleProfileCancelAll({
    isProfileActionPending,
    handleAvatarCancel,
    handleProfileCancel,
  });

  // 회원탈퇴
  const closeWithdrawModal = createCloseWithdrawModal({
    isWithdrawing,
    setIsWithdrawModalOpen,
    setShowWithdrawPassword,
    setWithdrawPassword,
  });
  const openWithdrawModal = createOpenWithdrawModal({
    isWithdrawing,
    setShowWithdrawPassword,
    setWithdrawPassword,
    setIsWithdrawModalOpen,
  });
  const handleWithdraw = createHandleWithdraw({
    isWithdrawing,
    withdrawPassword,
    withdrawAccount,
    setIsWithdrawModalOpen,
    setShowWithdrawPassword,
    setWithdrawPassword,
    clearAuth,
    showToast,
    router,
  });

  return (
    <section className={styles.container} aria-label="마이페이지">
      <div className={styles.layout}>
        <aside className={styles.leftPanel}>
          <nav className={styles.list} aria-label="마이페이지 메뉴">
            <div className={styles.listSection}>
              <Link
                className={
                  activeTab === MYPAGE_TABS[0].key ? `${styles.listLink} ${styles.listLinkActive}` : styles.listLink
                }
                href={MYPAGE_TABS[0].href}
              >
                {MYPAGE_TABS[0].label}
              </Link>
              <div className={styles.listDividerLine} aria-hidden="true" />
              <span className={styles.listGroupTitle}>활동</span>
              <Link
                className={
                  activeTab === MYPAGE_TABS[1].key ? `${styles.listLink} ${styles.listLinkActive}` : styles.listLink
                }
                href={MYPAGE_TABS[1].href}
              >
                {MYPAGE_TABS[1].label}
              </Link>
              <Link
                className={
                  activeTab === MYPAGE_TABS[2].key ? `${styles.listLink} ${styles.listLinkActive}` : styles.listLink
                }
                href={MYPAGE_TABS[2].href}
              >
                {MYPAGE_TABS[2].label}
              </Link>
              <Link
                className={
                  activeTab === MYPAGE_TABS[3].key ? `${styles.listLink} ${styles.listLinkActive}` : styles.listLink
                }
                href={MYPAGE_TABS[3].href}
              >
                {MYPAGE_TABS[3].label}
              </Link>
              <div className={styles.listDividerLine} aria-hidden="true" />
              <span className={styles.listGroupTitle}>반응</span>
              <Link
                className={
                  activeTab === MYPAGE_TABS[4].key ? `${styles.listLink} ${styles.listLinkActive}` : styles.listLink
                }
                href={MYPAGE_TABS[4].href}
              >
                {MYPAGE_TABS[4].label}
              </Link>
              <Link
                className={
                  activeTab === MYPAGE_TABS[5].key ? `${styles.listLink} ${styles.listLinkActive}` : styles.listLink
                }
                href={MYPAGE_TABS[5].href}
              >
                {MYPAGE_TABS[5].label}
              </Link>
              <div className={styles.listDividerLine} aria-hidden="true" />
              <span className={styles.listGroupTitle}>설정</span>
              <Link
                className={
                  activeTab === MYPAGE_TABS[6].key ? `${styles.listLink} ${styles.listLinkActive}` : styles.listLink
                }
                href={MYPAGE_TABS[6].href}
              >
                {MYPAGE_TABS[6].label}
              </Link>
            </div>
          </nav>
        </aside>
        <div className={styles.main}>
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
                        글 <strong>{myPosts.length}</strong>
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
                    {isUserInfoLoading ? (
                      <span
                        className={`${styles.profileEditButton} ${styles.profileButtonSkeleton}`}
                        aria-hidden="true"
                      >
                        <MyPageValueSkeleton width={54} height={14} />
                      </span>
                    ) : (
                      <>
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
                      </>
                    )}
                  </div>
                  {isUserInfoLoading ? (
                    <div className={styles.profileSocialRow} aria-hidden="true">
                      {Array.from({ length: PROFILE_SOCIAL_SKELETON_COUNT }).map((_, index) => (
                        <span
                          key={`profile-social-skeleton-${index}`}
                          className={`${styles.profileSocialLink} ${styles.profileSocialLinkSkeleton}`}
                        >
                          <MyPageValueSkeleton width={16} height={16} />
                        </span>
                      ))}
                    </div>
                  ) : profileSocialLinks.length ? (
                    <div className={styles.profileSocialRow} aria-label="소셜 링크">
                      {profileSocialLinks.map(({ href, label, icon: Icon, external }) => (
                        <a
                          key={label}
                          className={styles.profileSocialLink}
                          href={href}
                          aria-label={label}
                          target={external ? '_blank' : undefined}
                          rel={external ? 'noreferrer' : undefined}
                        >
                          <Icon aria-hidden="true" />
                        </a>
                      ))}
                    </div>
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
                          onChange={event => setProfileContactEmail(event.target.value)}
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
                          onChange={event => setProfileGithubUrl(event.target.value)}
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
                          onChange={event => setProfileLinkedinUrl(event.target.value)}
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
                          onChange={event => setProfileTwitterUrl(event.target.value)}
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
                          onChange={event => setProfileFacebookUrl(event.target.value)}
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
                          onChange={event => setProfileWebsiteUrl(event.target.value)}
                        />
                      </div>
                    </label>
                  </div>
                </div>
              ) : null}
            </div>
          </header>
          <div className={styles.headerDivider} aria-hidden="true" />

          <div className={styles.content}>
            {activeTab === 'settings' ? (
              <MyPageSettingsTab
                bioPreview={bioPreview}
                isBioUpdating={isBioUpdating}
                isUserInfoLoading={isUserInfoLoading}
                profileBio={profileBio}
                showBioEditor={showBioEditor}
                userBio={userBio}
                bioEditorRef={bioEditorRef}
                bioImageInputRef={bioImageInputRef}
                handlers={{ handleBioChange, handleBioSave, handleBioToggle, handleBioImageClick, handleBioImageSelect }}
                toolbar={{ applyBullet, applyCode, applyHeading, applyInlineWrap, applyLink, applyNumbered, applyQuote }}
              />
            ) : activeTab === 'posts' ? (
              <MyPagePostsTab
                currentUserId={currentUserId}
                filteredPosts={filteredPosts}
                isCategoryOpen={isCategoryOpen}
                isMyPostsLoading={isMyPostsLoading}
                isPostDeleting={isPostDeleting}
                isTagOpen={isTagOpen}
                myPosts={myPosts}
                openPostMenuId={openPostMenuId}
                postCategories={postCategories}
                postTags={postTags}
                selectedCategoryId={selectedCategoryId}
                selectedCategoryLabel={selectedCategoryLabel}
                selectedTagId={selectedTagId}
                selectedTagLabel={selectedTagLabel}
                sortKey={sortKey}
                handleCategorySelect={handleCategorySelect}
                handlePostDelete={handlePostDelete}
                handlePostEdit={handlePostEdit}
                handlePostMenuToggle={handlePostMenuToggle}
                handleSortToggle={handleSortToggle}
                handleTagSelect={handleTagSelect}
                toggleCategory={toggleCategory}
                toggleTag={toggleTag}
              />
            ) : activeTab === 'drafts' ? (
              <MyPageDraftsTab
                draftSortOrder={draftSortOrder}
                onSortChange={() => setDraftSortOrder(prev => (prev === 'latest' ? 'oldest' : 'latest'))}
              />
            ) : activeTab === 'account' ? (
              <MyPageAccountTab
                accountBirthDateValue={accountBirthDateValue}
                accountEmailValue={accountEmailValue}
                accountNameValue={accountNameValue}
                accountPhoneValue={accountPhoneValue}
                birthDateValue={birthDateValue}
                confirmPasswordValue={confirmPasswordValue}
                currentPasswordValue={currentPasswordValue}
                emailCodeValue={emailCodeValue}
                emailValue={emailValue}
                isEditingAny={isEditingAny}
                isEditingBirthDate={isEditingBirthDate}
                isEditingEmail={isEditingEmail}
                isEditingPassword={isEditingPassword}
                isEditingPhone={isEditingPhone}
                isEmailCodeSent={isEmailCodeSent}
                isEmailVerified={isEmailVerified}
                isSaving={isSaving}
                isSendingEmailCode={isSendingEmailCode}
                isUserInfoLoading={isUserInfoLoading}
                isVerifyingEmailCode={isVerifyingEmailCode}
                isWithdrawing={isWithdrawing}
                isWithdrawModalOpen={isWithdrawModalOpen}
                newPasswordValue={newPasswordValue}
                passwordRuleStatus={passwordRuleStatus}
                phoneValue={phoneValue}
                showConfirmPassword={showConfirmPassword}
                showCurrentPassword={showCurrentPassword}
                showNewPassword={showNewPassword}
                showWithdrawPassword={showWithdrawPassword}
                withdrawPassword={withdrawPassword}
                cancelEdit={cancelEdit}
                closeWithdrawModal={closeWithdrawModal}
                handleBirthDateChange={handleBirthDateChange}
                handleEmailChange={handleEmailChange}
                handleEmailCodeChange={handleEmailCodeChange}
                handlePhoneChange={handlePhoneChange}
                handleWithdraw={handleWithdraw}
                openWithdrawModal={openWithdrawModal}
                saveBirthDate={saveBirthDate}
                saveEmail={saveEmail}
                savePassword={savePassword}
                savePhone={savePhone}
                sendEmailVerificationCode={sendEmailVerificationCode}
                setConfirmPasswordValue={setConfirmPasswordValue}
                setCurrentPasswordValue={setCurrentPasswordValue}
                setNewPasswordValue={setNewPasswordValue}
                setShowWithdrawPassword={setShowWithdrawPassword}
                setWithdrawPassword={setWithdrawPassword}
                startBirthDateEdit={startBirthDateEdit}
                startEmailEdit={startEmailEdit}
                startPasswordEdit={startPasswordEdit}
                startPhoneEdit={startPhoneEdit}
                toggleConfirmPasswordVisibility={toggleConfirmPasswordVisibility}
                toggleCurrentPasswordVisibility={toggleCurrentPasswordVisibility}
                toggleNewPasswordVisibility={toggleNewPasswordVisibility}
              />
            ) : activeTab === 'comments' ? (
              <MyPageCommentsTab
                editingCommentId={editingCommentId}
                editingContent={editingContent}
                hasEditingLengthError={hasEditingLengthError}
                isDeleting={isDeleting}
                isMyCommentsListLoading={isMyCommentsListLoading}
                isUpdating={isUpdating}
                myComments={myComments}
                openCommentMenuId={openCommentMenuId}
                profileAvatarUrl={profileAvatarUrl}
                sortKey={sortKey}
                sortedComments={sortedComments}
                handleCommentMenuToggle={handleCommentMenuToggle}
                handleDeleteComment={handleDeleteComment}
                handleEditCancel={handleEditCancel}
                handleEditChange={handleEditChange}
                handleEditStart={handleEditStart}
                handleEditSubmit={handleEditSubmit}
                handleSortToggle={handleSortToggle}
              />
            ) : activeTab === 'likes' ? (
              <MyPageLikesTab
                currentUserId={currentUserId}
                isLikedPostsListLoading={isLikedPostsListLoading}
                isPostDeleting={isPostDeleting}
                openPostMenuId={openPostMenuId}
                sortKey={sortKey}
                sortedLikedPosts={sortedLikedPosts}
                handlePostDelete={handlePostDelete}
                handlePostEdit={handlePostEdit}
                handlePostMenuToggle={handlePostMenuToggle}
                handleSortToggle={handleSortToggle}
              />
            ) : activeTab === 'recent' ? (
              <MyPageRecentTab
                currentUserId={currentUserId}
                isPostDeleting={isPostDeleting}
                isRecentPostsListLoading={isRecentPostsListLoading}
                openPostMenuId={openPostMenuId}
                sortKey={sortKey}
                sortedRecentPosts={sortedRecentPosts}
                handlePostDelete={handlePostDelete}
                handlePostEdit={handlePostEdit}
                handlePostMenuToggle={handlePostMenuToggle}
                handleSortToggle={handleSortToggle}
              />
            ) : null}
          </div>
        </div>
      </div>
    </section>
  );
}
