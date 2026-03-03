import type { ADMIN_MENU_LABELS } from '@/app/(routes)/(private)/admin/constants/menu.constants';
import type { ADMIN_PENDING_SORT } from '@/app/(routes)/(private)/admin/constants/sort.constants';

export type AdminMenuLabel = (typeof ADMIN_MENU_LABELS)[keyof typeof ADMIN_MENU_LABELS];
export type AdminPendingSort = (typeof ADMIN_PENDING_SORT)[keyof typeof ADMIN_PENDING_SORT];

export type AdminReportStatus = 'OPEN' | 'IN_PROGRESS' | 'RESOLVED' | 'REJECTED';

export interface AdminReport {
  id: string;
  title: string;
  content: string;
  status: AdminReportStatus;
  reporterUserId: string | null;
  reporterName: string | null;
  reporterEmail: string | null;
  handlerAdminId: string | null;
  handledAt: string | null;
  createdAt: string;
  updatedAt: string;
}

export interface AdminReportsResponse {
  items: AdminReport[];
}

export interface AdminMyReportsResponse {
  items: AdminReport[];
}

export interface AdminAuditLog {
  id: string;
  adminUserId: string;
  targetType: string;
  targetId: string;
  targetName: string | null;
  targetEmail: string | null;
  action: string;
  payload: Record<string, unknown> | null;
  createdAt: string;
}

export interface AdminAuditLogsResponse {
  items: AdminAuditLog[];
}

export interface AdminAccessLog {
  id: string;
  action: string;
  targetType: string;
  targetId: string;
  adminUserId: string;
  adminName: string;
  adminEmail: string;
  loginAt: string;
  logoutAt: string | null;
  ipAddress: string;
  userAgent: string;
  sessionDurationSec: number | null;
  status: '접속중' | '종료' | '강제 만료' | string;
  createdAt: string;
}

export interface AdminAccessLogsResponse {
  items: AdminAccessLog[];
  hasMore: boolean;
  page: number;
}

export interface AdminPendingUser {
  id: string;
  name: string;
  email: string;
  phone: string;
  birthDate: string | null;
  requestedRole: 'TRAINEE' | 'GRADUATE' | 'MENTOR' | 'INSTRUCTOR' | null;
  role: 'TRAINEE' | 'GRADUATE' | 'MENTOR' | 'INSTRUCTOR' | 'ADMIN';
  course: string | null;
  approved: boolean;
  createdAt: string;
}

export interface AdminPendingUsersResponse {
  items: AdminPendingUser[];
}

export interface AdminUser {
  id: string;
  name: string;
  email: string;
  phone: string;
  birthDate: string | null;
  requestedRole: 'TRAINEE' | 'GRADUATE' | 'MENTOR' | 'INSTRUCTOR' | null;
  role: 'TRAINEE' | 'GRADUATE' | 'MENTOR' | 'INSTRUCTOR' | 'ADMIN';
  course: string | null;
  approved: boolean;
  withdrawn: boolean;
  createdAt: string;
}

export interface AdminUsersResponse {
  items: AdminUser[];
}

export interface UpdateAdminReportStatusRequest {
  reportId: string;
  status: AdminReportStatus;
}

export interface UpdateAdminUserRoleRequest {
  userId: string;
  role: 'TRAINEE' | 'GRADUATE' | 'MENTOR' | 'INSTRUCTOR';
}

export interface CreateAdminReportRequest {
  title: string;
  content: string;
}
