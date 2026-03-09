'use client';

import { useParams } from 'next/navigation';

import { PostCreatePage } from '@/app/(routes)/(private)/posts/new/page';

/**
 * 임시저장 게시물 페이지
 * @description 공통 작성 화면을 draft 모드로 렌더링
 */
export default function DraftPostPage() {
  const params = useParams();
  const draftIdParam = params.draftId;
  const draftId = Array.isArray(draftIdParam) ? draftIdParam[0] : draftIdParam;

  return (
    <PostCreatePage
      draftId={draftId}
      mode="draft"
      headerDescription="임시저장한 내용을 이어서 작성하고 게시하세요."
      headerTitle="임시저장 이어쓰기"
      sectionLabel="임시저장 이어쓰기"
      showDraftActions
      submitLabel="게시하기"
    />
  );
}
