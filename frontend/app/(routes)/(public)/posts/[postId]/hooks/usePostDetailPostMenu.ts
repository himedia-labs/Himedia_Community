import { useCallback, useState } from 'react';

import { postsApi } from '@/app/api/posts/posts.api';
import { useToast } from '@/app/shared/components/toast/toast';

import type { UsePostDetailPostMenuParams } from '@/app/shared/types/post';

/**
 * 게시글 메뉴 훅
 * @description 게시글 수정/삭제 메뉴 상태와 이벤트를 관리
 */
export const usePostDetailPostMenu = ({ postId }: UsePostDetailPostMenuParams) => {
  // 상태/역할
  const { showToast } = useToast();
  const [isPostDeleting, setIsPostDeleting] = useState(false);
  const [isPostMenuOpen, setIsPostMenuOpen] = useState(false);

  // 핸들러/메뉴
  /**
   * 게시글 메뉴 토글
   * @description 게시글 옵션 메뉴의 열림 상태를 전환
   */
  const handlePostMenuToggle = useCallback(() => {
    setIsPostMenuOpen(prev => !prev);
  }, []);

  /**
   * 게시글 수정 이동
   * @description 수정 페이지로 이동
   */
  const handlePostEdit = useCallback(() => {
    if (!postId) return;
    window.location.href = `/posts/edit/${postId}`;
  }, [postId]);

  /**
   * 게시글 삭제 처리
   * @description 삭제 확인 후 게시글을 삭제하고 메인으로 이동
   */
  const handlePostDelete = useCallback(async () => {
    if (!postId || isPostDeleting) return;
    const confirmed = window.confirm('게시글을 삭제할까요?');
    if (!confirmed) return;

    try {
      setIsPostDeleting(true);
      await postsApi.deletePost(postId);
      window.location.href = '/';
    } catch {
      showToast({ message: '게시글 삭제에 실패했습니다.', type: 'error' });
    } finally {
      setIsPostDeleting(false);
      setIsPostMenuOpen(false);
    }
  }, [isPostDeleting, postId, showToast]);

  return {
    isPostDeleting,
    isPostMenuOpen,
    handlePostEdit,
    handlePostDelete,
    handlePostMenuToggle,
  };
};
