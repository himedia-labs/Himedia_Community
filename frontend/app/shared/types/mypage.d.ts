import type { ReactNode, RefObject } from 'react';

import type { MyCommentItem } from '@/app/shared/types/comment';
import type { PostListItem } from '@/app/shared/types/post';

export type TabKey = 'posts' | 'drafts' | 'comments' | 'likes' | 'recent' | 'settings' | 'account';
export type ActivitySortKey = 'latest' | 'popular';
export type DraftSortOrder = 'latest' | 'oldest';

// 필터
export interface PostFilterItem {
  id: string;
  name: string;
  count: number;
}

export interface FilterItem {
  id: string;
  name: string;
  count: number;
}

// 비밀번호 규칙
export interface PasswordRuleStatus {
  hasInput: boolean;
  hasTypeCombination: boolean;
  hasValidLength: boolean;
  hasNoTripleRepeat: boolean;
}

// 자기소개 탭
export interface MyPageSettingsTabProps {
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

// 게시글 탭
export interface MyPagePostsTabProps {
  currentUserId: string;
  filteredPosts: PostListItem[];
  isCategoryOpen: boolean;
  isMyPostsLoading: boolean;
  isPostDeleting: boolean;
  isTagOpen: boolean;
  myPosts: PostListItem[];
  openPostMenuId: string | null;
  postCategories: PostFilterItem[];
  postTags: PostFilterItem[];
  selectedCategoryId: string | null;
  selectedCategoryLabel?: string;
  selectedTagId: string | null;
  selectedTagLabel?: string;
  sortKey: ActivitySortKey;
  handleCategorySelect: (categoryId: string) => void;
  handlePostDelete: (postId: string) => void;
  handlePostEdit: (postId: string) => void;
  handlePostMenuToggle: (postId: string) => void;
  handleSortToggle: () => void;
  handleTagSelect: (tagId: string) => void;
  toggleCategory: () => void;
  toggleTag: () => void;
}

// 임시저장 탭
export interface MyPageDraftsTabProps {
  draftSortOrder: DraftSortOrder;
  onSortChange: () => void;
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

// 댓글 탭
export interface MyPageCommentsTabProps {
  editingCommentId: string | null;
  editingContent: string;
  hasEditingLengthError: boolean;
  isDeleting: boolean;
  isMyCommentsListLoading: boolean;
  isUpdating: boolean;
  myComments: MyCommentItem[];
  openCommentMenuId: string | null;
  profileAvatarUrl: string;
  sortKey: ActivitySortKey;
  sortedComments: MyCommentItem[];
  handleCommentMenuToggle: (commentId: string) => void;
  handleDeleteComment: (postId: string, commentId: string) => void;
  handleEditCancel: () => void;
  handleEditChange: (event: React.ChangeEvent<HTMLTextAreaElement>) => void;
  handleEditStart: (commentId: string, content: string) => void;
  handleEditSubmit: (postId: string, commentId: string) => void;
  handleSortToggle: () => void;
}

// 좋아요 탭
export interface MyPageLikesTabProps {
  currentUserId: string;
  isLikedPostsListLoading: boolean;
  isPostDeleting: boolean;
  openPostMenuId: string | null;
  sortKey: ActivitySortKey;
  sortedLikedPosts: PostListItem[];
  handlePostDelete: (postId: string) => void;
  handlePostEdit: (postId: string) => void;
  handlePostMenuToggle: (postId: string) => void;
  handleSortToggle: () => void;
}

// 최근 읽은 포스트 탭
export interface MyPageRecentTabProps {
  currentUserId: string;
  isPostDeleting: boolean;
  isRecentPostsListLoading: boolean;
  openPostMenuId: string | null;
  sortKey: ActivitySortKey;
  sortedRecentPosts: PostListItem[];
  handlePostDelete: (postId: string) => void;
  handlePostEdit: (postId: string) => void;
  handlePostMenuToggle: (postId: string) => void;
  handleSortToggle: () => void;
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
