import type { ADMIN_MENU_LABELS } from '@/app/(routes)/(private)/admin/constants/menu.constants';
import type { ADMIN_PENDING_SORT } from '@/app/(routes)/(private)/admin/constants/sort.constants';

// 공통 응답
type AdminItemsResponse<T> = {
  items: T[];
};

// 메뉴/상태
export type AdminMenuLabel = (typeof ADMIN_MENU_LABELS)[keyof typeof ADMIN_MENU_LABELS];
export type AdminPendingSort = (typeof ADMIN_PENDING_SORT)[keyof typeof ADMIN_PENDING_SORT];
export type AdminReportStatus = 'OPEN' | 'IN_PROGRESS' | 'RESOLVED' | 'REJECTED';
export type AdminStyleMap = Record<string, string>;

// 신고 데이터
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

export type AdminReportsResponse = AdminItemsResponse<AdminReport>;

export type AdminMyReportsResponse = AdminItemsResponse<AdminReport>;

// 감사 로그 데이터
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

export type AdminAuditLogsResponse = AdminItemsResponse<AdminAuditLog>;

// 접속 로그 데이터
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

// 승인 대기 데이터
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
  rejectedReason?: string | null;
}

export type AdminPendingUsersResponse = AdminItemsResponse<AdminPendingUser>;

export type AdminRejectedUsersResponse = AdminItemsResponse<AdminPendingUser>;

// 회원 데이터
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

export type AdminUsersResponse = AdminItemsResponse<AdminUser>;

// 신고 요청
export interface UpdateAdminReportStatusRequest {
  reportId: string;
  status: AdminReportStatus;
}

// 회원 요청
export interface UpdateAdminUserRoleRequest {
  userId: string;
  role: 'TRAINEE' | 'GRADUATE' | 'MENTOR' | 'INSTRUCTOR';
}

export interface RejectAdminUserRequest {
  userId: string;
  reason: string;
}

// 신고 생성 요청
export interface CreateAdminReportRequest {
  title: string;
  content: string;
}
