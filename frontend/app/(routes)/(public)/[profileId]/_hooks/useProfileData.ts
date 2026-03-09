import { useMemo } from 'react';

import { useCurrentUserQuery, useProfileByHandleQuery } from '@/app/api/auth/auth.queries';
import { useFollowingsQuery } from '@/app/api/follows/follows.queries';
import { usePostsQuery } from '@/app/api/posts/posts.queries';
import { useAuthStore } from '@/app/shared/store/authStore';
import { renderMarkdownPreview } from '@/app/shared/utils/markdown';
import { buildProfileSocialLinks, resolveProfileRoute } from '@/app/(routes)/(public)/[profileId]/_utils';

/**
 * 공개 프로필 데이터 훅
 * @description 라우트/프로필/게시글 조회와 기본 파생값을 제공합니다.
 */
export const useProfileData = (profileIdParam: string | string[] | undefined) => {
  // 인증 상태
  const { accessToken } = useAuthStore();

  // 라우트 파라미터
  const { hasAtPrefix, decodedProfileId, normalizedProfileId } = resolveProfileRoute(profileIdParam);

  // 조회 데이터
  const { data: currentUser } = useCurrentUserQuery();
  const { data: followings } = useFollowingsQuery({ enabled: Boolean(accessToken) });
  const { data: profile, isLoading: isProfileLoading } = useProfileByHandleQuery(normalizedProfileId);
  const { data: postsData, isLoading: isPostsLoading } = usePostsQuery(
    {
      authorId: profile?.id,
      status: 'PUBLISHED',
      sort: 'publishedAt',
      order: 'DESC',
      limit: 30,
    },
    { enabled: Boolean(profile?.id) },
  );

  // 파생 데이터
  const posts = postsData?.items ?? [];
  const author = posts[0]?.author;
  const postCount = posts.length;
  const isMyProfile = Boolean(currentUser?.id && profile?.id && currentUser.id === profile.id);
  const followingCount = author?.followingCount ?? 0;
  const handleText = profile?.profileHandle ? `@${profile.profileHandle}` : `@${normalizedProfileId}`;
  const bioPreview = useMemo(() => renderMarkdownPreview(profile?.profileBio ?? ''), [profile?.profileBio]);
  const profileSocialLinks = useMemo(() => buildProfileSocialLinks(profile), [profile]);

  return {
    accessToken,
    author,
    bioPreview,
    currentUser,
    decodedProfileId,
    followings,
    followingCount,
    handleText,
    hasAtPrefix,
    isMyProfile,
    isPostsLoading,
    isProfileLoading,
    postCount,
    posts,
    profile,
    profileSocialLinks,
  };
};
