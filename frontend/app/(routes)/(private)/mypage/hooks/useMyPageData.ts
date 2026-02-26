import { useMemo } from 'react';

import { useCurrentUserQuery } from '@/app/api/auth/auth.queries';
import { useMyCommentsQuery } from '@/app/api/comments/comments.queries';
import { useLikedPostsQuery, usePostsQuery } from '@/app/api/posts/posts.queries';
import { useFollowersQuery, useFollowingsQuery } from '@/app/api/follows/follows.queries';

import { useAuthStore } from '@/app/shared/store/authStore';

/**
 * 마이페이지 데이터 훅
 * @description 내 정보/활동 데이터를 조회하고 파생값을 구성
 */
export const useMyPageData = () => {
  const { accessToken, isInitialized } = useAuthStore();

  // 데이터 조회
  const {
    data: currentUser,
    isFetching: isCurrentUserFetching,
    isLoading: isCurrentUserLoading,
  } = useCurrentUserQuery();
  const { data: followersData } = useFollowersQuery({ enabled: Boolean(accessToken) });
  const { data: followingsData } = useFollowingsQuery({ enabled: Boolean(accessToken) });
  const {
    data: myCommentsData,
    isFetching: isMyCommentsFetching,
    isLoading: isMyCommentsLoading,
  } = useMyCommentsQuery({ enabled: Boolean(accessToken) });
  const {
    data: likedPostsData,
    isFetching: isLikedPostsFetching,
    isLoading: isLikedPostsLoading,
  } = useLikedPostsQuery(
    { sort: 'createdAt', order: 'DESC', limit: 30 },
    { enabled: Boolean(accessToken) },
  );
  const {
    data: postsData,
    isFetching: isPostsFetching,
    isLoading: isPostsLoading,
  } = usePostsQuery(
    { sort: 'createdAt', order: 'DESC', limit: 30 },
    { enabled: Boolean(accessToken) },
  );

  // 파생 데이터
  const isAuthInitializing = !isInitialized;
  const isCurrentUserPending = Boolean(accessToken) && (isCurrentUserLoading || isCurrentUserFetching || !currentUser);
  const isPostsPending = Boolean(accessToken) && (isPostsLoading || isPostsFetching) && !postsData;
  const isCommentsPending = Boolean(accessToken) && (isMyCommentsLoading || isMyCommentsFetching) && !myCommentsData;
  const isLikedPostsPending = Boolean(accessToken) && (isLikedPostsLoading || isLikedPostsFetching) && !likedPostsData;
  const isUserInfoLoading = isAuthInitializing || isCurrentUserPending;
  const isMyPostsLoading = isUserInfoLoading || isPostsPending;
  const isMyCommentsListLoading = isUserInfoLoading || isCommentsPending;
  const isLikedPostsListLoading = isUserInfoLoading || isLikedPostsPending;
  const myComments = myCommentsData ?? [];
  const likedPosts = likedPostsData?.items ?? [];
  const userBio = currentUser?.profileBio ?? '';
  const profileContactEmail = currentUser?.profileContactEmail ?? '';
  const profileGithubUrl = currentUser?.profileGithubUrl ?? '';
  const profileLinkedinUrl = currentUser?.profileLinkedinUrl ?? '';
  const profileTwitterUrl = currentUser?.profileTwitterUrl ?? '';
  const profileFacebookUrl = currentUser?.profileFacebookUrl ?? '';
  const profileWebsiteUrl = currentUser?.profileWebsiteUrl ?? '';
  const profileImageUrl = currentUser?.profileImageUrl ?? '';
  const displayName = currentUser?.name ?? '';
  const userEmail = currentUser?.email ?? '';
  const userPhone = currentUser?.phone ?? '';
  const userBirthDate = currentUser?.birthDate ?? '';
  const profileHandle = currentUser?.profileHandle ?? currentUser?.email?.split('@')[0] ?? '';
  const currentUserId = currentUser?.id ?? '';
  const followerCount = followersData?.length ?? 0;
  const followingCount = followingsData?.length ?? 0;

  // 내 게시글 필터링
  const myPosts = useMemo(() => {
    const postItems = postsData?.items;
    if (!postItems?.length || !currentUserId) return [];
    return postItems.filter(item => item.author?.id === currentUserId && item.status === 'PUBLISHED');
  }, [currentUserId, postsData?.items]);

  return {
    accessToken,
    currentUserId,
    displayName,
    followerCount,
    followingCount,
    isMyCommentsListLoading,
    isLikedPostsListLoading,
    isMyPostsLoading,
    isUserInfoLoading,
    userBirthDate,
    userEmail,
    userPhone,
    likedPosts,
    myComments,
    myPosts,
    profileImageUrl,
    profileHandle,
    profileContactEmail,
    profileGithubUrl,
    profileLinkedinUrl,
    profileTwitterUrl,
    profileFacebookUrl,
    profileWebsiteUrl,
    userBio,
  };
};
