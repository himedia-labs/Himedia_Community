import { useState } from 'react';

import {
  createHandleDeleteRejectedUser,
  createHandleUserEdit,
  createHandleUserReject,
  createHandleUserApprove,
  createHandleSaveAllUserRoles,
  createHandleChangeUserRoleDraft,
} from '@/app/(routes)/(private)/admin/_handlers/adminUser.handlers';
import {
  createHandleDeleteRejectedUserClick,
  createHandleApproveUserClick,
  createHandleRejectUserClick,
  createHandleUserRoleDraftChange,
} from '@/app/(routes)/(private)/admin/_handlers/adminUi.handlers';

import type { UseAdminUserActionsParams } from '@/app/shared/types/admin';

/**
 * 관리자 회원 액션 훅
 * @description 회원 승인/거절/역할 변경 관련 상태와 핸들러를 조합한다
 */
export const useAdminUserActions = (params: UseAdminUserActionsParams) => {
  // 편집 상태
  const [isUsersEditMode, setIsUsersEditMode] = useState(false);
  const [userRoleDrafts, setUserRoleDrafts] = useState<Record<string, string>>({});

  // 비즈니스 핸들러
  const handleUserApprove = createHandleUserApprove({
    queryClient: params.queryClient,
    mutateAsync: params.approveUser,
    showToast: params.showToast,
  });
  const handleUserReject = createHandleUserReject({
    queryClient: params.queryClient,
    mutateAsync: params.rejectUser,
    showToast: params.showToast,
  });
  const handleDeleteRejectedUser = createHandleDeleteRejectedUser({
    queryClient: params.queryClient,
    mutateAsync: params.deleteRejectedUser,
    showToast: params.showToast,
  });
  const handleUserEdit = createHandleUserEdit(setIsUsersEditMode);
  const handleSaveAllUserRoles = createHandleSaveAllUserRoles({
    allUsers: params.allUsers,
    userRoleDrafts,
    queryClient: params.queryClient,
    setIsUsersEditMode,
    mutateAsync: params.updateUserRole,
    showToast: params.showToast,
  });
  const handleChangeUserRoleDraft = createHandleChangeUserRoleDraft(setUserRoleDrafts);

  // UI 핸들러
  const handleApproveUserClick = createHandleApproveUserClick(handleUserApprove);
  const handleRejectUserWithReason = async (userId: string) => {
    const reasonInput = window.prompt('거절 사유를 입력해주세요.');
    const reason = reasonInput?.trim() ?? '';
    if (!reason) {
      params.showToast({ message: '거절 사유를 입력해야 합니다.', type: 'warning' });
      return;
    }
    await handleUserReject(userId, reason);
  };
  const handleRejectUserClick = createHandleRejectUserClick(handleRejectUserWithReason);
  const handleDeleteRejectedUserClick = createHandleDeleteRejectedUserClick(handleDeleteRejectedUser);
  const handleUserRoleDraftChange = createHandleUserRoleDraftChange(handleChangeUserRoleDraft);

  return {
    isUsersEditMode,
    userRoleDrafts,
    handlers: {
      handleUserEdit,
      handleApproveUserClick,
      handleRejectUserClick,
      handleSaveAllUserRoles,
      handleDeleteRejectedUserClick,
      handleUserRoleDraftChange,
    },
  };
};
