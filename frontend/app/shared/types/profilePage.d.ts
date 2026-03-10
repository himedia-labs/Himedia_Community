import type { Dispatch, ReactNode, SetStateAction } from 'react';
import type { IconType } from 'react-icons';
import type { ToastOptions } from '@/app/shared/types/toast';
import type { PostListItem } from '@/app/shared/types/post';

// 프로필 상태
export type ProfileSortKey = 'latest' | 'popular';

// 프로필 지표
export type ProfileCounterItem = {
  id: string;
  name: string;
  count: number;
};

// 프로필 소셜 링크
export type ProfileSocialLink = {
  href: string;
  label: string;
  icon: IconType;
  external?: boolean;
};

export interface ProfileSocialLinksProps {
  links: ProfileSocialLink[];
  containerClassName: string;
  linkClassName: string;
}

export interface ProfilePageEmptyStateProps {
  message: string;
}

export interface ProfilePageHeaderProps {
  name: string;
  handleText: string;
  postCount: number;
  followerCount: number;
  followingCount: number;
  isFollowHover: boolean;
  isFollowLoading: boolean;
  isFollowing: boolean;
  isMyProfile: boolean;
  profileImageUrl?: string | null;
  profileSocialLinks: ProfileSocialLink[];
  handleFollowToggle: () => void;
  handleFollowMouseEnter: () => void;
  handleFollowMouseLeave: () => void;
}

export interface ProfilePageIntroProps {
  bioPreview: ReactNode;
  profileBio?: string | null;
}

export interface ProfilePagePostsSectionProps {
  emptyText: string;
  sortKey: ProfileSortKey;
  isTagOpen: boolean;
  isCategoryOpen: boolean;
  filteredPosts: PostListItem[];
  postCategories: ProfileCounterItem[];
  postTags: ProfileCounterItem[];
  selectedTagId: string | null;
  selectedCategoryId: string | null;
  selectedTagLabel?: string;
  selectedCategoryLabel?: string;
  handleSortToggle: () => void;
  toggleCategory: () => void;
  toggleTag: () => void;
  handleCategoryButtonClick: (event: React.MouseEvent<HTMLButtonElement>) => void;
  handleTagButtonClick: (event: React.MouseEvent<HTMLButtonElement>) => void;
}

export type ProfilePageSetBool = Dispatch<SetStateAction<boolean>>;
export type ProfilePageSetNullableString = Dispatch<SetStateAction<string | null>>;
export type ProfilePageSetSortKey = Dispatch<SetStateAction<ProfileSortKey>>;

// 프로필 토스트
type ProfilePageShowToast = (options: ToastOptions) => void;

// 프로필 훅 파라미터
export type UseProfileFollowParams = {
  profileId?: string;
  accessToken: string | null;
  isMyProfile: boolean;
  author?: import('@/app/shared/types/post').PostAuthorRef;
  followings?: import('@/app/shared/types/follow').FollowListResponse;
  showToast: ProfilePageShowToast;
};

// 프로필 핸들러 파라미터
export type ProfileFollowToggleHandlerParams = {
  profileId?: string;
  accessToken: string | null;
  isFollowing: boolean;
  isMyProfile: boolean;
  isFollowLoading: boolean;
  showToast: ProfilePageShowToast;
  setIsFollowing: Dispatch<SetStateAction<boolean>>;
  setFollowerCount: Dispatch<SetStateAction<number>>;
  setIsFollowHover: Dispatch<SetStateAction<boolean>>;
  setIsFollowLoading: Dispatch<SetStateAction<boolean>>;
};
