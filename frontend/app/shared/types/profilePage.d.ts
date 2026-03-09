import type { Dispatch, SetStateAction } from 'react';
import type { IconType } from 'react-icons';
import type { ToastOptions } from '@/app/shared/types/toast';

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
