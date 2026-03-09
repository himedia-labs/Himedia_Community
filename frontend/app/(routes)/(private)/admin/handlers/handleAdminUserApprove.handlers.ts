import { adminKeys } from '@/app/api/admin/admin.keys';
import { invalidateQueryTargets } from '@/app/shared/lib/query/queryCache.utils';

import type { HandleAdminUserApproveParams } from '@/app/shared/types/admin';

/**
 * 회원 승인 핸들러
 * @description 승인 처리 후 승인대기/감사로그 쿼리를 갱신
 */
export const handleAdminUserApprove = async (params: HandleAdminUserApproveParams) => {
  await params.mutateAsync(params.userId);
  await invalidateQueryTargets(params.queryClient, [
    { queryKey: adminKeys.pendingUsers() },
    { queryKey: adminKeys.users() },
    { queryKey: adminKeys.auditLogs() },
  ]);
};
