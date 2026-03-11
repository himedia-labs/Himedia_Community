import MyPageAccountTab from '@/app/(routes)/(private)/mypage/_components/MyPageAccountTab';
import MyPageProfileTab from '@/app/(routes)/(private)/mypage/_components/MyPageProfileTab';
import MyPageLikesSection from '@/app/(routes)/(private)/mypage/_components/MyPageLikesSection';
import MyPagePostsSection from '@/app/(routes)/(private)/mypage/_components/MyPagePostsSection';
import MyPageDraftsSection from '@/app/(routes)/(private)/mypage/_components/MyPageDraftsSection';
import MyPageRecentSection from '@/app/(routes)/(private)/mypage/_components/MyPageRecentSection';
import MyPageCommentsSection from '@/app/(routes)/(private)/mypage/_components/MyPageCommentsSection';

import styles from '@/app/(routes)/(private)/mypage/MyPage.module.css';

import type { MyPageActivityTabProps, MyPageContentProps } from '@/app/shared/types/mypage';

/**
 * 마이페이지 콘텐츠
 * @description 활성 탭에 맞는 마이페이지 탭 컴포넌트를 렌더링합니다.
 */
export default function MyPageContent({
  activeTab,
  accountBirthDateValue,
  accountEmailValue,
  accountNameValue,
  accountPhoneValue,
  applyBullet,
  applyCode,
  applyHeading,
  applyInlineWrap,
  applyLink,
  applyNumbered,
  applyQuote,
  bioEditorRef,
  bioImageInputRef,
  bioPreview,
  birthDateValue,
  cancelEdit,
  commentSortKey,
  closeWithdrawModal,
  confirmPasswordValue,
  currentPasswordValue,
  currentUserId,
  draftSortOrder,
  editingCommentId,
  editingContent,
  emailCodeValue,
  emailValue,
  filteredPosts,
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
  hasEditingLengthError,
  isBioUpdating,
  isCategoryOpen,
  isDeleting,
  isEditingAny,
  isEditingBirthDate,
  isEditingEmail,
  isEditingPassword,
  isEditingPhone,
  isEmailCodeSent,
  isEmailVerified,
  isLikedPostsListLoading,
  isMyCommentsListLoading,
  isMyPostsLoading,
  isPostDeleting,
  isRecentPostsListLoading,
  isSaving,
  isSendingEmailCode,
  isTagOpen,
  isUpdating,
  isUserInfoLoading,
  isVerifyingEmailCode,
  isWithdrawing,
  isWithdrawModalOpen,
  myComments,
  myPosts,
  newPasswordValue,
  openCommentMenuId,
  openPostMenuId,
  openWithdrawModal,
  passwordRuleStatus,
  phoneValue,
  likedPostSortKey,
  postSortKey,
  postCategories,
  postTags,
  profileAvatarUrl,
  profileBio,
  recentPostSortKey,
  saveBirthDate,
  saveEmail,
  savePassword,
  savePhone,
  selectedCategoryId,
  selectedCategoryLabel,
  selectedTagId,
  selectedTagLabel,
  sendEmailVerificationCode,
  setConfirmPasswordValue,
  setCurrentPasswordValue,
  setNewPasswordValue,
  setShowWithdrawPassword,
  setWithdrawPassword,
  showBioEditor,
  showConfirmPassword,
  showCurrentPassword,
  showNewPassword,
  showWithdrawPassword,
  sortedComments,
  sortedLikedPosts,
  sortedRecentPosts,
  startBirthDateEdit,
  startEmailEdit,
  startPasswordEdit,
  startPhoneEdit,
  toggleCategory,
  toggleConfirmPasswordVisibility,
  toggleCurrentPasswordVisibility,
  toggleNewPasswordVisibility,
  toggleTag,
  userBio,
  withdrawPassword,
}: MyPageContentProps) {
  // 활동/props 구성
  const activityProps: MyPageActivityTabProps = {
    commentSortKey,
    currentUserId,
    draftSortOrder,
    editingCommentId,
    editingContent,
    filteredPosts,
    hasEditingLengthError,
    isCategoryOpen,
    isDeleting,
    isLikedPostsListLoading,
    isMyCommentsListLoading,
    isMyPostsLoading,
    isPostDeleting,
    isRecentPostsListLoading,
    isTagOpen,
    isUpdating,
    likedPostSortKey,
    myComments,
    myPosts,
    openCommentMenuId,
    openPostMenuId,
    postCategories,
    postSortKey,
    postTags,
    profileAvatarUrl,
    recentPostSortKey,
    selectedCategoryId,
    selectedCategoryLabel,
    selectedTagId,
    selectedTagLabel,
    sortedComments,
    sortedLikedPosts,
    sortedRecentPosts,
    handleCategorySelect,
    handleCommentMenuToggle,
    handleCommentSortToggle,
    handleDeleteComment,
    handleDraftSortToggle,
    handleEditCancel,
    handleEditChange,
    handleEditStart,
    handleEditSubmit,
    handleLikedPostSortToggle,
    handlePostDelete,
    handlePostEdit,
    handlePostMenuToggle,
    handlePostSortToggle,
    handleRecentPostSortToggle,
    handleTagSelect,
    toggleCategory,
    toggleTag,
  };

  return (
    <div className={styles.content}>
      {activeTab === 'settings' ? (
        <MyPageProfileTab
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
        <MyPagePostsSection {...activityProps} />
      ) : activeTab === 'drafts' ? (
        <MyPageDraftsSection {...activityProps} />
      ) : activeTab === 'recent' ? (
        <MyPageRecentSection {...activityProps} />
      ) : activeTab === 'comments' ? (
        <MyPageCommentsSection {...activityProps} />
      ) : activeTab === 'likes' ? (
        <MyPageLikesSection {...activityProps} />
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
      ) : null}
    </div>
  );
}
