import { useMutation } from '@tanstack/react-query';

import { adminApi } from '@/app/api/admin/admin.api';

import type {
  RejectAdminUserRequest,
  UpdateAdminReportStatusRequest,
  UpdateAdminUserRoleRequest,
} from '@/app/shared/types/admin';

// 관리자 신고 상태 변경
export const useUpdateAdminReportStatusMutation = () => {
  return useMutation<unknown, Error, UpdateAdminReportStatusRequest>({
    mutationFn: adminApi.updateReportStatus,
  });
};

// 관리자 회원 승인
export const useApproveAdminUserMutation = () => {
  return useMutation<unknown, Error, string>({
    mutationFn: adminApi.approveUser,
  });
};

// 관리자 회원 승인 거절
export const useRejectAdminUserMutation = () => {
  return useMutation<unknown, Error, RejectAdminUserRequest>({
    mutationFn: adminApi.rejectUser,
  });
};

// 관리자 승인 거절 계정 삭제
export const useDeleteRejectedAdminUserMutation = () => {
  return useMutation<unknown, Error, string>({
    mutationFn: adminApi.deleteRejectedUser,
  });
};

// 관리자 회원 역할 변경
export const useUpdateAdminUserRoleMutation = () => {
  return useMutation<unknown, Error, UpdateAdminUserRoleRequest>({
    mutationFn: adminApi.updateUserRole,
  });
};

// 관리자 접속 기록
export const useTrackAdminAccessMutation = () => {
  return useMutation<unknown, Error, void>({
    mutationFn: adminApi.trackAccessLog,
  });
};

// 관리자 게시글 강제 임시저장
export const useForcePostDraftMutation = () => {
  return useMutation<unknown, Error, string>({
    mutationFn: adminApi.forcePostToDraft,
  });
};
