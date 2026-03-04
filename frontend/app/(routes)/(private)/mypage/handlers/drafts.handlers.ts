import type { MouseEvent } from 'react';

import { postsKeys } from '@/app/api/posts/posts.keys';

/**
 * 임시저장 삭제 핸들러 생성
 * @description 확인 후 임시저장을 삭제하고 목록 캐시를 갱신
 */
export const createHandleDeleteDraft = (params: {
  deleteDraft: (postId: string) => Promise<unknown>;
  invalidateDrafts: (queryKey: readonly unknown[]) => Promise<unknown>;
  showToast: (options: { message: string; type: 'success' | 'error' | 'warning' }) => void;
}) => {
  return async (event: MouseEvent<HTMLButtonElement>, postId: string) => {
    event.preventDefault();
    event.stopPropagation();

    const confirmed = window.confirm('임시저장을 삭제할까요?');
    if (!confirmed) return;

    await params.deleteDraft(postId);
    await params.invalidateDrafts(postsKeys.drafts());
    params.showToast({ message: '임시저장을 삭제했습니다.', type: 'success' });
  };
};

/**
 * 임시저장 삭제 버튼 핸들러 생성
 * @description 버튼 데이터의 임시저장 id를 읽어 삭제 핸들러를 실행
 */
export const createHandleDeleteDraftClick = (
  handleDeleteDraft: (event: MouseEvent<HTMLButtonElement>, postId: string) => Promise<void>,
) => {
  return (event: MouseEvent<HTMLButtonElement>) => {
    const { postId } = event.currentTarget.dataset;
    if (!postId) return;
    void handleDeleteDraft(event, postId);
  };
};
