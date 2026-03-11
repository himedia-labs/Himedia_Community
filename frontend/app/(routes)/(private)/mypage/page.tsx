'use client';

import { useRouter } from 'next/navigation';

import {
  MyPageContent,
  MyPageProfileHeader,
  MyPageSidebar,
} from '@/app/(routes)/(private)/mypage/_components';
import { MyPageProfileHeaderSkeleton } from '@/app/(routes)/(private)/mypage/MyPage.skeleton';
import {
  useAccountSettings,
  useBioEditor,
  useCommentEditor,
  useMyData,
  useMyPageActivity,
  useMyPageProfileActions,
  useMyTabState,
  useMyPageWithdraw,
  usePostMenu,
  useProfileEditor,
  useProfileImageEditor,
} from '@/app/(routes)/(private)/mypage/_hooks';
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
  const activeTab = useMyTabState('settings');
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
  } = useMyData();

  // 정렬/필터
  const {
    commentSortKey,
    filteredPosts,
    likedPostSortKey,
    postSortKey,
    recentPostSortKey,
    sortedComments,
    sortedLikedPosts,
    sortedRecentPosts,
    draftSortOrder,
    isCategoryOpen,
    isTagOpen,
    postCategories,
    postTags,
    selectedCategoryId,
    selectedCategoryLabel,
    selectedTagId,
    selectedTagLabel,
    handlers: {
      handleCommentSortToggle,
      handleLikedPostSortToggle,
      handlePostSortToggle,
      handleRecentPostSortToggle,
      handleTagSelect,
      toggleTag,
      toggleCategory,
      handleCategorySelect,
      handleDraftSortToggle,
    },
  } = useMyPageActivity({
    likedPosts,
    recentPosts,
    myComments,
    myPosts,
  });

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

  // 프로필 액션
  const {
    isProfileActionPending,
    profileSocialLinks,
    handlers: {
      handleProfileAction,
      handleProfileCancelAll,
      handleProfileContactEmailChange,
      handleProfileGithubUrlChange,
      handleProfileLinkedinUrlChange,
      handleProfileTwitterUrlChange,
      handleProfileFacebookUrlChange,
      handleProfileWebsiteUrlChange,
    },
  } = useMyPageProfileActions({
    isProfileSaving,
    isProfileUpdating,
    isProfileEditing,
    profileContactEmail,
    profileGithubUrl,
    profileLinkedinUrl,
    profileTwitterUrl,
    profileFacebookUrl,
    profileWebsiteUrl,
    setProfileContactEmail,
    setProfileGithubUrl,
    setProfileLinkedinUrl,
    setProfileTwitterUrl,
    setProfileFacebookUrl,
    setProfileWebsiteUrl,
    handleProfileSave,
    handleAvatarSave,
    handleProfileEditStart,
    handleProfileEditComplete,
    handleAvatarCancel,
    handleProfileCancel,
  });

  // 회원탈퇴
  const {
    showWithdrawPassword,
    withdrawPassword,
    isWithdrawModalOpen,
    setShowWithdrawPassword,
    setWithdrawPassword,
    handlers: { handleWithdraw, openWithdrawModal, closeWithdrawModal },
  } = useMyPageWithdraw({
    isWithdrawing,
    withdrawAccount,
    clearAuth,
    showToast,
    router,
  });

  // 포맷팅
  const accountNameValue = displayName || '사용자';
  const accountEmailValue = userEmail || '미등록';
  const accountPhoneValue = userPhone || '미등록';
  const accountBirthDateValue = userBirthDate || '미등록';
  const profileNameValue = displayName || '사용자';
  const profileHandleValue = `@${profileHandle}`;

  const profileHeaderProps = {
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
    myPostCount: myPosts.length,
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
  };
  const contentProps = {
    activeTab,
    commentSortKey,
    currentUserId,
    filteredPosts,
    likedPostSortKey,
    postSortKey,
    recentPostSortKey,
    sortedComments,
    sortedLikedPosts,
    sortedRecentPosts,
    myComments,
    myPosts,
    draftSortOrder,
    postCategories,
    postTags,
    selectedCategoryId,
    selectedTagId,
    selectedCategoryLabel,
    selectedTagLabel,
    openPostMenuId,
    openCommentMenuId,
    profileAvatarUrl,
    editingCommentId,
    editingContent,
    hasEditingLengthError,
    isBioUpdating,
    isDeleting,
    isMyCommentsListLoading,
    isMyPostsLoading,
    isLikedPostsListLoading,
    isRecentPostsListLoading,
    isPostDeleting,
    isTagOpen,
    isCategoryOpen,
    isUpdating,
    isUserInfoLoading,
    showBioEditor,
    profileBio,
    userBio,
    bioPreview,
    bioEditorRef,
    bioImageInputRef,
    accountBirthDateValue,
    accountEmailValue,
    accountNameValue,
    accountPhoneValue,
    birthDateValue,
    confirmPasswordValue,
    currentPasswordValue,
    emailCodeValue,
    emailValue,
    isEditingAny,
    isEditingBirthDate,
    isEditingEmail,
    isEditingPassword,
    isEditingPhone,
    isEmailCodeSent,
    isEmailVerified,
    isSaving,
    isSendingEmailCode,
    isVerifyingEmailCode,
    isWithdrawing,
    isWithdrawModalOpen,
    newPasswordValue,
    passwordRuleStatus,
    phoneValue,
    showConfirmPassword,
    showCurrentPassword,
    showNewPassword,
    showWithdrawPassword,
    withdrawPassword,
    cancelEdit,
    closeWithdrawModal,
    handleBirthDateChange,
    handleBioChange,
    handleBioImageClick,
    handleBioImageSelect,
    handleBioSave,
    handleBioToggle,
    handleCategorySelect,
    handleCommentMenuToggle,
    handleCommentSortToggle,
    handleDeleteComment,
    handleDraftSortToggle,
    handleEditCancel,
    handleEditChange,
    handleEditStart,
    handleEditSubmit,
    handleEmailChange,
    handleEmailCodeChange,
    handleLikedPostSortToggle,
    handlePhoneChange,
    handlePostDelete,
    handlePostEdit,
    handlePostMenuToggle,
    handlePostSortToggle,
    handleRecentPostSortToggle,
    handleTagSelect,
    handleWithdraw,
    openWithdrawModal,
    saveBirthDate,
    saveEmail,
    savePassword,
    savePhone,
    sendEmailVerificationCode,
    setConfirmPasswordValue,
    setCurrentPasswordValue,
    setNewPasswordValue,
    setShowWithdrawPassword,
    setWithdrawPassword,
    startBirthDateEdit,
    startEmailEdit,
    startPasswordEdit,
    startPhoneEdit,
    toggleCategory,
    toggleConfirmPasswordVisibility,
    toggleCurrentPasswordVisibility,
    toggleNewPasswordVisibility,
    toggleTag,
    applyBullet,
    applyCode,
    applyHeading,
    applyInlineWrap,
    applyLink,
    applyNumbered,
    applyQuote,
  };

  return (
    <section className={styles.container} aria-label="마이페이지">
      <div className={styles.layout}>
        <MyPageSidebar activeTab={activeTab} />
        <div className={styles.main}>
          {isUserInfoLoading ? <MyPageProfileHeaderSkeleton /> : <MyPageProfileHeader {...profileHeaderProps} />}
          <div className={styles.headerDivider} aria-hidden="true" />
          <MyPageContent {...contentProps} />
        </div>
      </div>
    </section>
  );
}
