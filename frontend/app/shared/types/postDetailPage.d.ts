import type { IconType } from 'react-icons';

import type { PostAuthorRef } from './post';

export interface PostDetailAuthorSocialLink {
  external: boolean;
  href: string;
  icon: IconType;
  label: string;
}

export interface UsePostDetailAuthorFollowParams {
  accessToken: string | null;
  isMyPost: boolean;
  postAuthorId: string | null;
  author: PostAuthorRef | null | undefined;
}

export interface UsePostDetailPostMenuParams {
  postId: string;
}
