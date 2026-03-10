import type { IconType } from 'react-icons';
import type { Dispatch, ReactNode, RefObject, SetStateAction } from 'react';
import type { AppRouterInstance } from 'next/dist/shared/lib/app-router-context.shared-runtime';

import type { MyCommentItem } from '@/app/shared/types/comment';
import type { PostListItem } from '@/app/shared/types/post';

// 탭 상태
export type TabKey = 'activity' | 'profile' | 'account';
export type ActivitySortKey = 'latest' | 'popular';
export type DraftSortOrder = 'latest' | 'oldest';
export type AccountEditField = 'email' | 'phone' | 'birthDate' | 'password' | null;

// 필터
export interface FilterItem {
  id: string;
  name: string;
  count: number;
}

// 프로필 소셜 링크
export interface ProfileSocialLink {
  href: string;
  label: string;
  icon: IconType;
  external?: boolean;
}

// 비밀번호 규칙
export interface PasswordRuleStatus {
  hasInput: boolean;
  hasTypeCombination: boolean;
  hasValidLength: boolean;
  hasNoTripleRepeat: boolean;
}

// 자기소개 탭
export interface MyPageProfileTabProps {
  bioPreview: ReactNode;
  isBioUpdating: boolean;
  isUserInfoLoading: boolean;
  profileBio: string;
  showBioEditor: boolean;
  userBio: string;
  bioEditorRef: RefObject<HTMLTextAreaElement | null>;
  bioImageInputRef: RefObject<HTMLInputElement | null>;
  handlers: {
    handleBioChange: (event: React.ChangeEvent<HTMLTextAreaElement>) => void;
    handleBioImageClick: () => void;
    handleBioImageSelect: (event: React.ChangeEvent<HTMLInputElement>) => void;
    handleBioSave: () => void;
    handleBioToggle: () => void;
  };
  toolbar: {
    applyBullet: () => void;
    applyCode: () => void;
    applyHeading: (level: 1 | 2 | 3) => void;
    applyInlineWrap: (prefix: string, suffix?: string) => void;
    applyLink: () => void;
    applyNumbered: () => void;
    applyQuote: () => void;
  };
}

// 활동 탭
export interface MyPageActivityTabProps {
  currentUserId: string;
  commentSortKey: ActivitySortKey;
  draftSortOrder: DraftSortOrder;
  editingCommentId: string | null;
  editingContent: string;
  filteredPosts: PostListItem[];
  hasEditingLengthError: boolean;
  isCategoryOpen: boolean;
  isDeleting: boolean;
  isLikedPostsListLoading: boolean;
  isMyCommentsListLoading: boolean;
  isMyPostsLoading: boolean;
  isPostDeleting: boolean;
  isRecentPostsListLoading: boolean;
  isTagOpen: boolean;
  isUpdating: boolean;
  myComments: MyCommentItem[];
  myPosts: PostListItem[];
  openCommentMenuId: string | null;
  openPostMenuId: string | null;
  postCategories: FilterItem[];
  postTags: FilterItem[];
  postSortKey: ActivitySortKey;
  profileAvatarUrl: string;
  selectedCategoryId: string | null;
  selectedCategoryLabel?: string;
  selectedTagId: string | null;
  selectedTagLabel?: string;
  likedPostSortKey: ActivitySortKey;
  recentPostSortKey: ActivitySortKey;
  sortedComments: MyCommentItem[];
  sortedLikedPosts: PostListItem[];
  sortedRecentPosts: PostListItem[];
  handleCategorySelect: (categoryId: string) => void;
  handleCommentMenuToggle: (commentId: string) => void;
  handleCommentSortToggle: () => void;
  handleDeleteComment: (postId: string, commentId: string) => void;
  handleDraftSortToggle: () => void;
  handleEditCancel: () => void;
  handleEditChange: (event: React.ChangeEvent<HTMLTextAreaElement>) => void;
  handleEditStart: (commentId: string, content: string) => void;
  handleEditSubmit: (postId: string, commentId: string) => void;
  handleLikedPostSortToggle: () => void;
  handlePostDelete: (postId: string) => void;
  handlePostEdit: (postId: string) => void;
  handlePostMenuToggle: (postId: string) => void;
  handlePostSortToggle: () => void;
  handleRecentPostSortToggle: () => void;
  handleTagSelect: (tagId: string) => void;
  toggleCategory: () => void;
  toggleTag: () => void;
}

// 계정 설정 탭
export interface MyPageAccountTabProps {
  accountBirthDateValue: ReactNode;
  accountEmailValue: ReactNode;
  accountNameValue: ReactNode;
  accountPhoneValue: ReactNode;
  birthDateValue: string;
  confirmPasswordValue: string;
  currentPasswordValue: string;
  emailCodeValue: string;
  emailValue: string;
  isEditingAny: boolean;
  isEditingBirthDate: boolean;
  isEditingEmail: boolean;
  isEditingPassword: boolean;
  isEditingPhone: boolean;
  isEmailCodeSent: boolean;
  isEmailVerified: boolean;
  isSaving: boolean;
  isSendingEmailCode: boolean;
  isUserInfoLoading: boolean;
  isVerifyingEmailCode: boolean;
  isWithdrawing: boolean;
  isWithdrawModalOpen: boolean;
  newPasswordValue: string;
  passwordRuleStatus: PasswordRuleStatus;
  phoneValue: string;
  showConfirmPassword: boolean;
  showCurrentPassword: boolean;
  showNewPassword: boolean;
  showWithdrawPassword: boolean;
  withdrawPassword: string;
  cancelEdit: () => void;
  closeWithdrawModal: () => void;
  handleBirthDateChange: (event: React.ChangeEvent<HTMLInputElement>) => void;
  handleEmailChange: (event: React.ChangeEvent<HTMLInputElement>) => void;
  handleEmailCodeChange: (event: React.ChangeEvent<HTMLInputElement>) => void;
  handlePhoneChange: (event: React.ChangeEvent<HTMLInputElement>) => void;
  handleWithdraw: () => void;
  openWithdrawModal: () => void;
  saveBirthDate: () => void;
  saveEmail: () => void;
  savePassword: () => void;
  savePhone: () => void;
  sendEmailVerificationCode: () => void;
  setConfirmPasswordValue: (value: string) => void;
  setCurrentPasswordValue: (value: string) => void;
  setNewPasswordValue: (value: string) => void;
  setShowWithdrawPassword: (value: boolean) => void;
  setWithdrawPassword: (value: string) => void;
  startBirthDateEdit: () => void;
  startEmailEdit: () => void;
  startPasswordEdit: () => void;
  startPhoneEdit: () => void;
  toggleConfirmPasswordVisibility: () => void;
  toggleCurrentPasswordVisibility: () => void;
  toggleNewPasswordVisibility: () => void;
}


// 필터 드롭다운
export interface MyPageFilterDropdownProps {
  type: 'category' | 'tag';
  items: FilterItem[];
  selectedId: string | null;
  selectedLabel?: string;
  isOpen: boolean;
  onToggle: () => void;
  onSelect: (id: string) => void;
}

// 스켈레톤
// 임시저장 컴포넌트
export interface MyPageDraftsProps {
  sortOrder: 'latest' | 'oldest';
}

// 레이아웃
export interface MyPageLayoutProps {
  children: ReactNode;
}

// 사이드바
export interface MyPageSidebarProps {
  activeTab: TabKey;
}

// 헤더 스켈레톤
export interface MyPagePostListSkeletonProps {
  label: string;
  showFilters?: boolean;
}

// 프로필 헤더
export interface MyPageProfileHeaderProps {
  editingHandle: string;
  followerCount: number;
  followingCount: number;
  isProfileEditing: boolean;
  isProfileActionPending: boolean;
  isUserInfoLoading: boolean;
  myPostCount: number;
  profileAvatarUrl: string;
  profileHandleValue: ReactNode;
  profileNameValue: ReactNode;
  editingContactEmail: string;
  editingGithubUrl: string;
  editingLinkedinUrl: string;
  editingTwitterUrl: string;
  editingFacebookUrl: string;
  editingWebsiteUrl: string;
  profileSocialLinks: ProfileSocialLink[];
  avatarInputRef: RefObject<HTMLInputElement | null>;
  handleAvatarClick: () => void;
  handleAvatarRemove: () => void;
  handleProfileAction: () => void;
  handleProfileCancelAll: () => void;
  handleAvatarChange: (event: React.ChangeEvent<HTMLInputElement>) => void;
  handleProfileHandleChange: (event: React.ChangeEvent<HTMLInputElement>) => void;
  handleProfileContactEmailChange: (event: React.ChangeEvent<HTMLInputElement>) => void;
  handleProfileGithubUrlChange: (event: React.ChangeEvent<HTMLInputElement>) => void;
  handleProfileLinkedinUrlChange: (event: React.ChangeEvent<HTMLInputElement>) => void;
  handleProfileTwitterUrlChange: (event: React.ChangeEvent<HTMLInputElement>) => void;
  handleProfileFacebookUrlChange: (event: React.ChangeEvent<HTMLInputElement>) => void;
  handleProfileWebsiteUrlChange: (event: React.ChangeEvent<HTMLInputElement>) => void;
}

// 콘텐츠
export interface MyPageContentProps {
  activeTab: TabKey;
  commentSortKey: ActivitySortKey;
  currentUserId: string;
  filteredPosts: PostListItem[];
  sortedComments: MyCommentItem[];
  sortedLikedPosts: PostListItem[];
  sortedRecentPosts: PostListItem[];
  myComments: MyCommentItem[];
  myPosts: PostListItem[];
  draftSortOrder: DraftSortOrder;
  likedPostSortKey: ActivitySortKey;
  postSortKey: ActivitySortKey;
  postCategories: FilterItem[];
  postTags: FilterItem[];
  recentPostSortKey: ActivitySortKey;
  selectedCategoryId: string | null;
  selectedTagId: string | null;
  selectedCategoryLabel?: string;
  selectedTagLabel?: string;
  openPostMenuId: string | null;
  openCommentMenuId: string | null;
  profileAvatarUrl: string;
  editingCommentId: string | null;
  editingContent: string;
  hasEditingLengthError: boolean;
  isBioUpdating: boolean;
  isDeleting: boolean;
  isMyCommentsListLoading: boolean;
  isMyPostsLoading: boolean;
  isLikedPostsListLoading: boolean;
  isRecentPostsListLoading: boolean;
  isPostDeleting: boolean;
  isTagOpen: boolean;
  isCategoryOpen: boolean;
  isUpdating: boolean;
  isUserInfoLoading: boolean;
  showBioEditor: boolean;
  profileBio: string;
  userBio: string;
  bioPreview: ReactNode;
  bioEditorRef: RefObject<HTMLTextAreaElement | null>;
  bioImageInputRef: RefObject<HTMLInputElement | null>;
  accountBirthDateValue: ReactNode;
  accountEmailValue: ReactNode;
  accountNameValue: ReactNode;
  accountPhoneValue: ReactNode;
  birthDateValue: string;
  confirmPasswordValue: string;
  currentPasswordValue: string;
  emailCodeValue: string;
  emailValue: string;
  isEditingAny: boolean;
  isEditingBirthDate: boolean;
  isEditingEmail: boolean;
  isEditingPassword: boolean;
  isEditingPhone: boolean;
  isEmailCodeSent: boolean;
  isEmailVerified: boolean;
  isSaving: boolean;
  isSendingEmailCode: boolean;
  isVerifyingEmailCode: boolean;
  isWithdrawing: boolean;
  isWithdrawModalOpen: boolean;
  newPasswordValue: string;
  passwordRuleStatus: PasswordRuleStatus;
  phoneValue: string;
  showConfirmPassword: boolean;
  showCurrentPassword: boolean;
  showNewPassword: boolean;
  showWithdrawPassword: boolean;
  withdrawPassword: string;
  cancelEdit: () => void;
  closeWithdrawModal: () => void;
  handleBirthDateChange: (event: React.ChangeEvent<HTMLInputElement>) => void;
  handleBioChange: (event: React.ChangeEvent<HTMLTextAreaElement>) => void;
  handleBioImageClick: () => void;
  handleBioImageSelect: (event: React.ChangeEvent<HTMLInputElement>) => void;
  handleBioSave: () => void;
  handleBioToggle: () => void;
  handleCategorySelect: (categoryId: string) => void;
  handleCommentMenuToggle: (commentId: string) => void;
  handleCommentSortToggle: () => void;
  handleDeleteComment: (postId: string, commentId: string) => void;
  handleDraftSortToggle: () => void;
  handleEditCancel: () => void;
  handleEditChange: (event: React.ChangeEvent<HTMLTextAreaElement>) => void;
  handleEditStart: (commentId: string, content: string) => void;
  handleEditSubmit: (postId: string, commentId: string) => void;
  handleEmailChange: (event: React.ChangeEvent<HTMLInputElement>) => void;
  handleEmailCodeChange: (event: React.ChangeEvent<HTMLInputElement>) => void;
  handleLikedPostSortToggle: () => void;
  handlePhoneChange: (event: React.ChangeEvent<HTMLInputElement>) => void;
  handlePostDelete: (postId: string) => void;
  handlePostEdit: (postId: string) => void;
  handlePostMenuToggle: (postId: string) => void;
  handlePostSortToggle: () => void;
  handleRecentPostSortToggle: () => void;
  handleTagSelect: (tagId: string) => void;
  handleWithdraw: () => void;
  openWithdrawModal: () => void;
  saveBirthDate: () => void;
  saveEmail: () => void;
  savePassword: () => void;
  savePhone: () => void;
  sendEmailVerificationCode: () => void;
  setConfirmPasswordValue: (value: string) => void;
  setCurrentPasswordValue: (value: string) => void;
  setNewPasswordValue: (value: string) => void;
  setShowWithdrawPassword: (value: boolean) => void;
  setWithdrawPassword: (value: string) => void;
  startBirthDateEdit: () => void;
  startEmailEdit: () => void;
  startPasswordEdit: () => void;
  startPhoneEdit: () => void;
  toggleCategory: () => void;
  toggleConfirmPasswordVisibility: () => void;
  toggleCurrentPasswordVisibility: () => void;
  toggleNewPasswordVisibility: () => void;
  toggleTag: () => void;
  applyBullet: () => void;
  applyCode: () => void;
  applyHeading: (level: 1 | 2 | 3) => void;
  applyInlineWrap: (prefix: string, suffix?: string) => void;
  applyLink: () => void;
  applyNumbered: () => void;
  applyQuote: () => void;
}

// 훅 파라미터
export interface UseProfileEditorParams {
  name?: string;
  handle?: string;
  contactEmail?: string;
  githubUrl?: string;
  linkedinUrl?: string;
  twitterUrl?: string;
  facebookUrl?: string;
  websiteUrl?: string;
}

export type UseAccountSettingsParams = {
  birthDate: string;
  email: string;
  phone: string;
};

export type MyPageProfileActionParams = {
  isProfileActionPending: boolean;
  isProfileEditing: boolean;
  handleProfileEditStart: () => void;
  handleProfileSaveAll: () => Promise<void>;
};

export type MyPageProfileSaveAllParams = {
  isProfileActionPending: boolean;
  handleProfileSave: () => Promise<boolean>;
  handleAvatarSave: () => Promise<boolean>;
  handleProfileEditComplete: () => void;
};

export type MyPageProfileCancelAllParams = {
  isProfileActionPending: boolean;
  handleAvatarCancel: () => void;
  handleProfileCancel: () => void;
};

export type MyPageCloseWithdrawModalParams = {
  isWithdrawing: boolean;
  setIsWithdrawModalOpen: (value: boolean) => void;
  setShowWithdrawPassword: (value: boolean) => void;
  setWithdrawPassword: (value: string) => void;
};

export type MyPageOpenWithdrawModalParams = {
  isWithdrawing: boolean;
  setShowWithdrawPassword: (value: boolean) => void;
  setWithdrawPassword: (value: string) => void;
  setIsWithdrawModalOpen: (value: boolean) => void;
};

export type MyPageHandleWithdrawParams = {
  isWithdrawing: boolean;
  withdrawPassword: string;
  withdrawAccount: (data: { currentPassword: string }) => Promise<{ message: string }>;
  setIsWithdrawModalOpen: (value: boolean) => void;
  setShowWithdrawPassword: (value: boolean) => void;
  setWithdrawPassword: (value: string) => void;
  clearAuth: () => void;
  showToast: (options: { message: string; type: 'success' | 'error' | 'warning' }) => void;
  router: { replace: (path: string) => void };
};

export type MyPageToggleCategoryParams = {
  setIsTagOpen: (value: boolean) => void;
  setIsCategoryOpen: (updater: (prev: boolean) => boolean) => void;
};

export type MyPageToggleTagParams = {
  setIsCategoryOpen: (value: boolean) => void;
  setIsTagOpen: (updater: (prev: boolean) => boolean) => void;
};

export type MyPageHandleCategorySelectParams = {
  setSelectedCategoryId: (updater: (prev: string | null) => string | null) => void;
  setIsCategoryOpen: (value: boolean) => void;
};

export type MyPageHandleTagSelectParams = {
  setSelectedTagId: (updater: (prev: string | null) => string | null) => void;
  setIsTagOpen: (value: boolean) => void;
};

export type MyPageDeleteDraftParams = {
  deleteDraft: (postId: string) => Promise<unknown>;
  invalidateDrafts: (queryKey: readonly unknown[]) => Promise<unknown>;
  showToast: (options: { message: string; type: 'success' | 'error' | 'warning' }) => void;
};

export type FormatProfileSocialLinksParams = {
  profileContactEmail: string;
  profileGithubUrl: string;
  profileLinkedinUrl: string;
  profileTwitterUrl: string;
  profileFacebookUrl: string;
  profileWebsiteUrl: string;
};

export type UseMyPageActivityParams = {
  likedPosts: PostListItem[];
  recentPosts: PostListItem[];
  myComments: MyCommentItem[];
  myPosts: PostListItem[];
};

export type UseMyPageProfileActionsParams = {
  isProfileSaving: boolean;
  isProfileUpdating: boolean;
  isProfileEditing: boolean;
  profileContactEmail: string;
  profileGithubUrl: string;
  profileLinkedinUrl: string;
  profileTwitterUrl: string;
  profileFacebookUrl: string;
  profileWebsiteUrl: string;
  setProfileContactEmail: (value: string) => void;
  setProfileGithubUrl: (value: string) => void;
  setProfileLinkedinUrl: (value: string) => void;
  setProfileTwitterUrl: (value: string) => void;
  setProfileFacebookUrl: (value: string) => void;
  setProfileWebsiteUrl: (value: string) => void;
  handleProfileSave: () => Promise<boolean>;
  handleAvatarSave: () => Promise<boolean>;
  handleProfileEditStart: () => void;
  handleProfileEditComplete: () => void;
  handleAvatarCancel: () => void;
  handleProfileCancel: () => void;
};

export type UseMyPageWithdrawParams = {
  isWithdrawing: boolean;
  withdrawAccount: (data: { currentPassword: string }) => Promise<{ message: string }>;
  clearAuth: () => void;
  showToast: (options: { message: string; type: 'success' | 'error' | 'warning' }) => void;
  router: AppRouterInstance;
};

export type MyPageFilterState = {
  isCategoryOpen: boolean;
  isTagOpen: boolean;
  draftSortOrder: DraftSortOrder;
  selectedCategoryId: string | null;
  selectedTagId: string | null;
  setShowWithdrawPassword: Dispatch<SetStateAction<boolean>>;
  setWithdrawPassword: Dispatch<SetStateAction<string>>;
};
