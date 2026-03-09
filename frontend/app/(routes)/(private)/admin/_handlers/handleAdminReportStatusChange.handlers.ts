import { adminKeys } from '@/app/api/admin/admin.keys';
import { notificationsKeys } from '@/app/api/notifications/notifications.keys';
import { invalidateQueryTargets } from '@/app/shared/lib/query/queryCache.utils';

import type { HandleAdminReportStatusChangeParams } from '@/app/shared/types/admin';

/**
 * 신고 상태 변경 핸들러
 * @description 신고 상태를 업데이트하고 관련 쿼리를 갱신
 */
export const handleAdminReportStatusChange = async (params: HandleAdminReportStatusChangeParams) => {
  await params.mutateAsync({ reportId: params.reportId, status: params.status });
  await invalidateQueryTargets(params.queryClient, [
    { queryKey: adminKeys.reports() },
    { queryKey: adminKeys.pendingUsers() },
    { queryKey: adminKeys.auditLogs() },
    { queryKey: notificationsKeys.list() },
  ]);
};
