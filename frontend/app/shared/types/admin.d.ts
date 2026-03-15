import type { ADMIN_MENU_LABELS, ADMIN_PENDING_SORT } from '@/app/shared/constants/config/admin.config';
import type { QueryClient } from '@tanstack/react-query';
import type { AppRouterInstance } from 'next/dist/shared/lib/app-router-context.shared-runtime';
import type { ReadonlyURLSearchParams } from 'next/navigation';
import type { ChangeEvent, RefObject, Dispatch, SetStateAction } from 'react';

import type { NoticesListResponse } from '@/app/shared/types/notices';
import type { PostListResponse } from '@/app/shared/types/post';
import type { ToastOptions } from './toast';

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

// 관리자 핸들러
export type AdminUserApproveHandlerParams = {
  queryClient: QueryClient;
  mutateAsync: (userId: string) => Promise<unknown>;
  showToast: (options: ToastOptions) => void;
};

export type AdminUserRejectHandlerParams = {
  queryClient: QueryClient;
  mutateAsync: (payload: { userId: string; reason: string }) => Promise<unknown>;
  showToast: (options: ToastOptions) => void;
};

export type AdminDeleteRejectedUserHandlerParams = {
  queryClient: QueryClient;
  mutateAsync: (userId: string) => Promise<unknown>;
  showToast: (options: ToastOptions) => void;
};

export type AdminSaveAllUserRolesHandlerParams = {
  allUsers: AdminUser[];
  userRoleDrafts: Record<string, string>;
  queryClient: QueryClient;
  setIsUsersEditMode: (value: boolean) => void;
  mutateAsync: (payload: UpdateAdminUserRoleRequest) => Promise<unknown>;
  showToast: (options: ToastOptions) => void;
};

export type AdminUserApproveMutationPayload = string;

export type AdminUserRejectMutationPayload = {
  userId: string;
  reason: string;
};

export type AdminOptimisticUserParams = {
  queryClient: QueryClient;
  userId: string;
};

export type AdminOptimisticUserRolesParams = {
  queryClient: QueryClient;
  changedUsers: Array<UpdateAdminUserRoleRequest>;
};

export type AdminToggleRoleSortParams = {
  setIsPendingSortOpen: (value: boolean) => void;
  setIsCourseSortOpen: (value: boolean) => void;
  setIsRoleSortOpen: (updater: (prev: boolean) => boolean) => void;
};

export type AdminToggleCourseSortParams = {
  setIsPendingSortOpen: (value: boolean) => void;
  setIsRoleSortOpen: (value: boolean) => void;
  setIsCourseSortOpen: (updater: (prev: boolean) => boolean) => void;
};

export type AdminTogglePendingSortParams = {
  setIsRoleSortOpen: (value: boolean) => void;
  setIsCourseSortOpen: (value: boolean) => void;
  setIsPendingSortOpen: (updater: (prev: boolean) => boolean) => void;
};

export type AdminSelectRoleFilterParams = {
  setSelectedRoleFilter: (nextRole: string) => void;
  setIsRoleSortOpen: (value: boolean) => void;
};

export type AdminSelectCourseFilterParams = {
  setSelectedCourseFilter: (nextCourse: string) => void;
  setIsCourseSortOpen: (value: boolean) => void;
};

export type AdminSelectPendingSortParams = {
  handleSelectSort: (nextSort: AdminPendingSort) => void;
  setIsPendingSortOpen: (value: boolean) => void;
};

export type AdminSyncUrlStateParams = {
  router: AppRouterInstance;
  pathname: string;
  searchParams: ReadonlyURLSearchParams;
};

export type AdminSelectMenuParams = {
  pendingSort: AdminPendingSort;
  syncAdminUrlState: (nextMenu: AdminMenuLabel, nextSort: AdminPendingSort) => void;
};

export type AdminSelectSortParams = {
  selectedMenu: AdminMenuLabel;
  syncAdminUrlState: (nextMenu: AdminMenuLabel, nextSort: AdminPendingSort) => void;
};

export type AdminStatusChangeHandlerParams = {
  queryClient: QueryClient;
  mutateAsync: (payload: UpdateAdminReportStatusRequest) => Promise<unknown>;
  showToast: (options: ToastOptions) => void;
};

export type HandleAdminReportStatusChangeParams = {
  reportId: string;
  status: AdminReportStatus;
  queryClient: QueryClient;
  mutateAsync: (payload: UpdateAdminReportStatusRequest) => Promise<unknown>;
};

export type HandleAdminUserApproveParams = {
  userId: string;
  queryClient: QueryClient;
  mutateAsync: (userId: string) => Promise<unknown>;
};

// 관리자 훅
export type UseAdminAccessGuardParams = {
  isAdmin: boolean;
  accessToken: string | null;
  isInitialized: boolean;
  isUserLoading: boolean;
};

export type UseTrackAdminAccessParams = {
  canAccess: boolean;
  queryClient: QueryClient;
  mutate: (payload: undefined, options: { onSuccess: () => Promise<void> }) => void;
};

export type UseAccessLogsInfiniteScrollParams = {
  selectedMenu: string;
  hasNextPage: boolean;
  isFetchingNextPage: boolean;
  loadMoreRef: RefObject<HTMLDivElement | null>;
  fetchNextPage: () => Promise<unknown>;
};

export type UseAdminPageFiltersParams = {
  router: AppRouterInstance;
  pathname: string;
  searchParams: ReadonlyURLSearchParams;
};

export type UseAdminPageDataParams = {
  pendingSort: AdminPendingSort;
  selectedMenu: AdminMenuLabel;
  selectedRoleFilter: string;
  selectedCourseFilter: string;
  pendingUsersData?: AdminPendingUsersResponse;
  rejectedUsersData?: AdminRejectedUsersResponse;
  usersData?: AdminUsersResponse;
  logsData?: AdminAuditLogsResponse;
  accessLogsData?: { pages: AdminAccessLogsResponse[] };
  noticesData?: NoticesListResponse;
  postsData?: PostListResponse;
};

export type UseAdminUserActionsParams = {
  allUsers: AdminUser[];
  queryClient: QueryClient;
  showToast: (options: ToastOptions) => void;
  approveUser: (userId: string) => Promise<unknown>;
  rejectUser: (payload: { userId: string; reason: string }) => Promise<unknown>;
  deleteRejectedUser: (userId: string) => Promise<unknown>;
  updateUserRole: (payload: UpdateAdminUserRoleRequest) => Promise<unknown>;
};

export type AdminRejectModalOpenParams = {
  setRejectReason: Dispatch<SetStateAction<string>>;
  setRejectTargetUserId: Dispatch<SetStateAction<string | null>>;
};

export type AdminRejectModalCloseParams = {
  setRejectReason: Dispatch<SetStateAction<string>>;
  setRejectTargetUserId: Dispatch<SetStateAction<string | null>>;
};

export type AdminRejectReasonChangeParams = {
  setRejectReason: Dispatch<SetStateAction<string>>;
};

export type AdminDropdownState = {
  isRoleSortOpen: boolean;
  isCourseSortOpen: boolean;
  isPendingSortOpen: boolean;
};

export type AdminUserEditState = {
  isUsersEditMode: boolean;
  userRoleDrafts: Record<string, string>;
  setIsUsersEditMode: Dispatch<SetStateAction<boolean>>;
  setUserRoleDrafts: Dispatch<SetStateAction<Record<string, string>>>;
};

// 관리자 레이아웃
export interface AdminSidebarProps {
  handleMenuButtonClick: (event: React.MouseEvent<HTMLButtonElement>) => void;
  handleLogoutClick: () => void;
}

export interface AdminHeaderProps {
  currentUserName?: string;
  isUsersEditMode: boolean;
  pendingSort: AdminPendingSort;
  selectedMenu: AdminMenuLabel;
  selectedRoleFilter: string;
  selectedCourseFilter: string;
  isRoleSortOpen: boolean;
  isCourseSortOpen: boolean;
  isPendingSortOpen: boolean;
  courseFilterOptions: string[];
  handleUserEdit: () => void;
  handleSaveAllUserRoles: () => Promise<void>;
  toggleRoleSort: () => void;
  toggleCourseSort: () => void;
  togglePendingSort: () => void;
  handlePendingSortClick: (event: React.MouseEvent<HTMLButtonElement>) => void;
  handleRoleFilterClick: (event: React.MouseEvent<HTMLButtonElement>) => void;
  handleCourseFilterClick: (event: React.MouseEvent<HTMLButtonElement>) => void;
}

export interface AdminContentProps extends AdminHeaderProps {
  allUsers: AdminUser[];
  auditLogs: AdminAuditLog[];
  accessLogs: AdminAccessLog[];
  adminUsers: AdminUser[];
  noticesData?: NoticesListResponse;
  rejectedUsers: AdminPendingUser[];
  filteredPendingUsers: AdminPendingUser[];
  hasNextAccessLogsPage: boolean;
  isAccessLogsFetchingMore: boolean;
  isAccessLogsLoading: boolean;
  isLogsLoading: boolean;
  isPendingUsersLoading: boolean;
  isRejectedUsersLoading: boolean;
  isUsersLoading: boolean;
  userRoleDrafts: Record<string, string>;
  accessLogsLoadMoreRef: RefObject<HTMLDivElement | null>;
  handleApproveUserClick: (event: React.MouseEvent<HTMLButtonElement>) => void;
  handleDeleteRejectedUserClick: (event: React.MouseEvent<HTMLButtonElement>) => void;
  handleRejectUserClick: (event: React.MouseEvent<HTMLButtonElement>) => void;
  handleUserRoleDraftChange: (event: React.ChangeEvent<HTMLSelectElement>) => void;
}

export interface AdminNoticesSectionProps {
  noticesData?: NoticesListResponse;
  selectedMenu: AdminMenuLabel;
}

export interface AdminPendingUsersSectionProps {
  filteredPendingUsers: AdminPendingUser[];
  isPendingUsersLoading: boolean;
  handleApproveUserClick: (event: React.MouseEvent<HTMLButtonElement>) => void;
  handleRejectUserClick: (event: React.MouseEvent<HTMLButtonElement>) => void;
}

export interface AdminRejectedUsersSectionProps {
  rejectedUsers: AdminPendingUser[];
  isRejectedUsersLoading: boolean;
  handleDeleteRejectedUserClick: (event: React.MouseEvent<HTMLButtonElement>) => void;
}

export interface AdminUsersSectionProps {
  allUsers: AdminUser[];
  isUsersEditMode: boolean;
  isUsersLoading: boolean;
  userRoleDrafts: Record<string, string>;
  handleUserRoleDraftChange: (event: React.ChangeEvent<HTMLSelectElement>) => void;
}

export interface AdminAdminsSectionProps {
  adminUsers: AdminUser[];
  isUsersLoading: boolean;
}

export interface AdminAuditLogsSectionProps {
  auditLogs: AdminAuditLog[];
  isLogsLoading: boolean;
}

export interface AdminAccessLogsSectionProps {
  accessLogs: AdminAccessLog[];
  hasNextAccessLogsPage: boolean;
  isAccessLogsFetchingMore: boolean;
  isAccessLogsLoading: boolean;
  accessLogsLoadMoreRef: RefObject<HTMLDivElement | null>;
}

export interface AdminFilterDropdownProps {
  label: string;
  isOpen: boolean;
  buttonClassName?: string;
  wrapperClassName?: string;
  onToggle: () => void;
  items: Array<{
    id: string;
    label: string;
    active: boolean;
    dataAttributeName: string;
  }>;
  onItemClick: (event: React.MouseEvent<HTMLButtonElement>) => void;
}

export interface AdminRejectUserModalProps {
  rejectReason: string;
  isRejectingUser: boolean;
  onClose: () => void;
  onConfirm: () => Promise<void>;
  onChange: (event: ChangeEvent<HTMLTextAreaElement>) => void;
}
