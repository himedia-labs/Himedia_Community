'use client';

import { useParams } from 'next/navigation';

import { PostCreatePage } from '@/app/(routes)/(private)/posts/new/page';

/**
 * 게시물 수정 페이지
 * @description 공통 작성 화면을 수정 모드로 렌더링
 */
export default function PostEditPage() {
  const params = useParams();
  const postIdParam = params.postId;
  const postId = Array.isArray(postIdParam) ? postIdParam[0] : postIdParam;

  return (
    <PostCreatePage
      mode="edit"
      postId={postId}
      headerDescription="기존 내용을 수정하고 저장하세요."
      headerTitle="게시물 수정"
      sectionLabel="게시물 수정"
      showDraftActions={false}
      submitLabel="수정하기"
    />
  );
}
