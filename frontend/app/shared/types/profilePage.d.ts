import type { Dispatch, SetStateAction } from 'react';
import type { IconType } from 'react-icons';

export type ProfileSortKey = 'latest' | 'popular';

export type ProfileCounterItem = {
  id: string;
  name: string;
  count: number;
};

export type ProfileSocialLink = {
  href: string;
  label: string;
  icon: IconType;
  external?: boolean;
};

export type ProfilePageSetBool = Dispatch<SetStateAction<boolean>>;
export type ProfilePageSetNullableString = Dispatch<SetStateAction<string | null>>;
export type ProfilePageSetSortKey = Dispatch<SetStateAction<ProfileSortKey>>;

type ProfilePageToastType = 'success' | 'error' | 'warning' | 'info';
type ProfilePageShowToast = (params: { message: string; type: ProfilePageToastType }) => void;

export type UseProfileFollowParams = {
  profileId?: string;
  accessToken: string | null;
  isMyProfile: boolean;
  author?: import('@/app/shared/types/post').PostAuthorRef;
  followings?: import('@/app/shared/types/follow').FollowListResponse;
  showToast: ProfilePageShowToast;
};

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
