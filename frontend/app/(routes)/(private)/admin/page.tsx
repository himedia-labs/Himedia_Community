'use client';

import { useMemo, useRef, useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { usePathname, useRouter, useSearchParams } from 'next/navigation';
import { useQueryClient } from '@tanstack/react-query';
import { FiChevronDown, FiChevronRight, FiFileText, FiLogIn, FiUserCheck, FiUsers } from 'react-icons/fi';

import { useCurrentUserQuery } from '@/app/api/auth/auth.queries';
import { useToast } from '@/app/shared/components/toast/toast';
import { useAuthStore } from '@/app/shared/store/authStore';
import {
  useAdminAccessLogsQuery,
  useAdminAuditLogsQuery,
  useAdminPendingUsersQuery,
  useAdminRejectedUsersQuery,
  useAdminUsersQuery,
} from '@/app/api/admin/admin.queries';
import {
  useApproveAdminUserMutation,
  useDeleteRejectedAdminUserMutation,
  useRejectAdminUserMutation,
  useTrackAdminAccessMutation,
  useUpdateAdminUserRoleMutation,
} from '@/app/api/admin/admin.mutations';

import { ADMIN_MENU_LABELS, ADMIN_PENDING_SORT, ADMIN_QUERY_KEYS } from '@/app/shared/constants/config/admin.config';

import {
  createHandleSelectMenu,
  createHandleSelectSort,
  createSyncAdminUrlState,
} from '@/app/(routes)/(private)/admin/handlers/adminUrl.handlers';
import {
  createToggleRoleSort,
  createToggleCourseSort,
  createTogglePendingSort,
  createHandleSelectRoleFilter,
  createHandleSelectCourseFilter,
  createHandleSelectPendingSort,
} from '@/app/(routes)/(private)/admin/handlers/adminFilter.handlers';
import {
  createHandleDeleteRejectedUser,
  createHandleUserEdit,
  createHandleUserReject,
  createHandleUserApprove,
  createHandleSaveAllUserRoles,
  createHandleChangeUserRoleDraft,
} from '@/app/(routes)/(private)/admin/handlers/adminUser.handlers';
import {
  createHandleDeleteRejectedUserClick,
  createHandleMenuButtonClick,
  createHandlePendingSortClick,
  createHandleRoleFilterClick,
  createHandleCourseFilterClick,
  createHandleApproveUserClick,
  createHandleRejectUserClick,
  createHandleUserRoleDraftChange,
} from '@/app/(routes)/(private)/admin/handlers/adminUi.handlers';
import { formatDate } from '@/app/shared/utils/date.utils';

import { useAdminAccessGuard } from '@/app/(routes)/(private)/admin/hooks/useAdminAccessGuard';
import { useTrackAdminAccess } from '@/app/(routes)/(private)/admin/hooks/useTrackAdminAccess';
import { useAccessLogsInfiniteScroll } from '@/app/(routes)/(private)/admin/hooks/useAccessLogsInfiniteScroll';
import { usePendingUsersSort } from '@/app/(routes)/(private)/admin/hooks/usePendingUsersSort';
import {
  getRoleBadgeClassName,
  getAccessStatusBadgeClassName,
  getAuditResultBadgeClassName,
} from '@/app/(routes)/(private)/admin/utils/adminDisplay.utils';
import {
  parseAdminMenuFromQuery,
  parseAdminSortFromQuery,
} from '@/app/(routes)/(private)/admin/utils/adminUrlState.utils';
import { formatRoleLabel } from '@/app/(routes)/(private)/admin/utils/formatRoleLabel.utils';
import { formatPhoneNumber } from '@/app/(routes)/(private)/admin/utils/formatPhoneNumber.utils';
import { getRelativeTimeLabel } from '@/app/(routes)/(private)/admin/utils/getRelativeTimeLabel.utils';
import { formatUserAgentLabel } from '@/app/(routes)/(private)/admin/utils/formatUserAgentLabel.utils';
import { formatSessionDuration } from '@/app/(routes)/(private)/admin/utils/formatSessionDuration.utils';
import {
  formatAuditAfterLabel,
  formatAuditActionLabel,
  formatAuditBeforeLabel,
  formatAuditResultLabel,
  formatAuditTargetLabel,
} from '@/app/(routes)/(private)/admin/utils/formatAuditLog.utils';

import styles from '@/app/(routes)/(private)/admin/AdminPage.module.css';

import type { IconType } from 'react-icons';

/**
 * 관리자 페이지
 * @description 신고 목록 조회와 상태 변경 기능을 제공
 */
export default function AdminPage() {
  // 라우팅/공용 훅
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const queryClient = useQueryClient();
  const { showToast } = useToast();

  // 인증/권한 상태
  const accessToken = useAuthStore(state => state.accessToken);
  const isInitialized = useAuthStore(state => state.isInitialized);
  const { data: currentUser, isLoading: isUserLoading } = useCurrentUserQuery();
  const isAdmin = currentUser?.role === 'ADMIN';
  const canAccess = Boolean(accessToken) && isAdmin;

  // 조회/뮤테이션 훅
  const { data: pendingUsersData, isLoading: isPendingUsersLoading } = useAdminPendingUsersQuery(canAccess);
  const { data: rejectedUsersData, isLoading: isRejectedUsersLoading } = useAdminRejectedUsersQuery(canAccess);
  const { data: usersData, isLoading: isUsersLoading } = useAdminUsersQuery(canAccess);
  const { data: logsData, isLoading: isLogsLoading } = useAdminAuditLogsQuery(canAccess);
  const {
    data: accessLogsData,
    isLoading: isAccessLogsLoading,
    isFetchingNextPage: isAccessLogsFetchingMore,
    hasNextPage: hasNextAccessLogsPage,
    fetchNextPage: fetchNextAccessLogsPage,
  } = useAdminAccessLogsQuery(canAccess);
  const approveUserMutation = useApproveAdminUserMutation();
  const rejectUserMutation = useRejectAdminUserMutation();
  const deleteRejectedUserMutation = useDeleteRejectedAdminUserMutation();
  const updateUserRoleMutation = useUpdateAdminUserRoleMutation();
  const trackAdminAccessMutation = useTrackAdminAccessMutation();

  // UI/편집 상태
  const accessLogsLoadMoreRef = useRef<HTMLDivElement | null>(null);
  const [isRoleSortOpen, setIsRoleSortOpen] = useState(false);
  const [isCourseSortOpen, setIsCourseSortOpen] = useState(false);
  const [isPendingSortOpen, setIsPendingSortOpen] = useState(false);
  const [isUsersEditMode, setIsUsersEditMode] = useState(false);
  const [userRoleDrafts, setUserRoleDrafts] = useState<Record<string, string>>({});
  const [selectedRoleFilter, setSelectedRoleFilter] = useState<string>('ALL');
  const [selectedCourseFilter, setSelectedCourseFilter] = useState<string>('ALL');

  // URL/메뉴 상태
  const selectedMenu = parseAdminMenuFromQuery(searchParams.get(ADMIN_QUERY_KEYS.TAB));
  const pendingSort = parseAdminSortFromQuery(searchParams.get(ADMIN_QUERY_KEYS.SORT));

  // 원본/목록 데이터
  const pendingUsers = useMemo(() => pendingUsersData?.items ?? [], [pendingUsersData]);
  const allUsers = useMemo(() => usersData?.items ?? [], [usersData]);
  const rejectedUsers = useMemo(() => rejectedUsersData?.items ?? [], [rejectedUsersData]);
  const adminUsers = useMemo(() => allUsers.filter(user => user.role === 'ADMIN'), [allUsers]);
  const auditLogs = logsData?.items ?? [];
  const accessLogs = useMemo(() => {
    return accessLogsData?.pages.flatMap(page => page.items) ?? [];
  }, [accessLogsData]);

  // 정렬/필터 파생
  const sortedPendingUsers = usePendingUsersSort(pendingUsers, pendingSort);
  const courseFilterOptions = useMemo(() => {
    const options = Array.from(new Set(pendingUsers.map(user => user.course).filter(Boolean))) as string[];
    return options.sort((a, b) => a.localeCompare(b, 'ko'));
  }, [pendingUsers]);
  const filteredPendingUsers = useMemo(() => {
    return sortedPendingUsers.filter(user => {
      const userRole = user.requestedRole ?? user.role;
      const matchedRole = selectedRoleFilter === 'ALL' || userRole === selectedRoleFilter;
      const matchedCourse = selectedCourseFilter === 'ALL' || user.course === selectedCourseFilter;
      return matchedRole && matchedCourse;
    });
  }, [selectedCourseFilter, selectedRoleFilter, sortedPendingUsers]);

  // 메뉴/아이콘 매핑
  const menuIconMap: Record<string, IconType> = {
    [ADMIN_MENU_LABELS.PENDING_USERS]: FiUserCheck,
    [ADMIN_MENU_LABELS.REJECTED_USERS]: FiUserCheck,
    [ADMIN_MENU_LABELS.USERS]: FiUsers,
    [ADMIN_MENU_LABELS.ADMINS]: FiUsers,
    [ADMIN_MENU_LABELS.AUDIT_LOGS]: FiFileText,
    [ADMIN_MENU_LABELS.ACCESS_LOGS]: FiLogIn,
  };
  const CurrentMenuIcon = menuIconMap[selectedMenu] ?? FiUserCheck;

  // 접근/추적 훅
  useAdminAccessGuard({ accessToken, isInitialized, isUserLoading, isAdmin });
  useTrackAdminAccess({
    canAccess,
    queryClient,
    mutate: trackAdminAccessMutation.mutate,
  });
  useAccessLogsInfiniteScroll({
    selectedMenu,
    hasNextPage: hasNextAccessLogsPage,
    isFetchingNextPage: isAccessLogsFetchingMore,
    loadMoreRef: accessLogsLoadMoreRef,
    fetchNextPage: fetchNextAccessLogsPage,
  });

  // 이벤트/핸들러 생성
  const syncAdminUrlState = createSyncAdminUrlState({ pathname, router, searchParams });
  const handleSelectMenu = createHandleSelectMenu({ pendingSort, syncAdminUrlState });
  const handleSelectSort = createHandleSelectSort({ selectedMenu, syncAdminUrlState });
  const toggleRoleSort = createToggleRoleSort({ setIsRoleSortOpen, setIsCourseSortOpen, setIsPendingSortOpen });
  const toggleCourseSort = createToggleCourseSort({ setIsRoleSortOpen, setIsCourseSortOpen, setIsPendingSortOpen });
  const togglePendingSort = createTogglePendingSort({ setIsRoleSortOpen, setIsCourseSortOpen, setIsPendingSortOpen });
  const handleSelectRoleFilter = createHandleSelectRoleFilter({ setSelectedRoleFilter, setIsRoleSortOpen });
  const handleSelectCourseFilter = createHandleSelectCourseFilter({ setSelectedCourseFilter, setIsCourseSortOpen });
  const handleSelectPendingSort = createHandleSelectPendingSort({ handleSelectSort, setIsPendingSortOpen });
  const handleUserApprove = createHandleUserApprove({
    queryClient,
    mutateAsync: approveUserMutation.mutateAsync,
    showToast,
  });
  const handleUserReject = createHandleUserReject({
    queryClient,
    mutateAsync: rejectUserMutation.mutateAsync,
    showToast,
  });
  const handleDeleteRejectedUser = createHandleDeleteRejectedUser({
    queryClient,
    mutateAsync: deleteRejectedUserMutation.mutateAsync,
    showToast,
  });
  const handleUserEdit = createHandleUserEdit(setIsUsersEditMode);
  const handleSaveAllUserRoles = createHandleSaveAllUserRoles({
    allUsers,
    userRoleDrafts,
    queryClient,
    setIsUsersEditMode,
    mutateAsync: updateUserRoleMutation.mutateAsync,
    showToast,
  });
  const handleChangeUserRoleDraft = createHandleChangeUserRoleDraft(setUserRoleDrafts);
  const handleMenuButtonClick = createHandleMenuButtonClick(handleSelectMenu);
  const handlePendingSortClick = createHandlePendingSortClick(handleSelectPendingSort);
  const handleRoleFilterClick = createHandleRoleFilterClick(handleSelectRoleFilter);
  const handleCourseFilterClick = createHandleCourseFilterClick(handleSelectCourseFilter);
  const handleRejectUserWithReason = async (userId: string) => {
    const reasonInput = window.prompt('거절 사유를 입력해주세요.');
    const reason = reasonInput?.trim() ?? '';
    if (!reason) {
      showToast({ message: '거절 사유를 입력해야 합니다.', type: 'warning' });
      return;
    }
    await handleUserReject(userId, reason);
  };
  const handleApproveUserClick = createHandleApproveUserClick(handleUserApprove);
  const handleRejectUserClick = createHandleRejectUserClick(handleRejectUserWithReason);
  const handleDeleteRejectedUserClick = createHandleDeleteRejectedUserClick(handleDeleteRejectedUser);
  const handleUserRoleDraftChange = createHandleUserRoleDraftChange(handleChangeUserRoleDraft);

  if (!isInitialized || !accessToken || isUserLoading || !isAdmin) {
    return null;
  }

  return (
    <section className={styles.container} aria-label="관리자 페이지">
      <header className={styles.topbar}>
        <div className={styles.topbarInner}>
          <div className={styles.topbarTitle}>
            <CurrentMenuIcon aria-hidden="true" />
            <FiChevronRight className={styles.topbarTitleDividerIcon} aria-hidden="true" />
            <span>{selectedMenu}</span>
          </div>
          <div className={styles.topbarRight}>
            <span className={styles.adminWelcome}>{currentUser?.name} 관리자님, 환영합니다.</span>
          </div>
        </div>
      </header>

      <div className={styles.dashboard}>
        <aside className={styles.sidebar} aria-label="관리자 사이드바">
          <Link href="/" className={styles.sidebarBrand}>
            <span className={styles.brandMark}>
              <Image src="/icon/logo.png" alt="하이미디어 로고" fill sizes="40px" draggable={false} />
            </span>
            <span className={styles.brandText}>
              하이미디어커뮤니티
              <span className={styles.brandSub}>HIMEDIA COMMUNITY</span>
            </span>
          </Link>
          <nav className={styles.sidebarNav}>
            <div className={styles.sidebarSection}>
              <p className={styles.sidebarSectionLabel}>관리</p>
              <button
                type="button"
                className={`${styles.sidebarItem} ${selectedMenu === ADMIN_MENU_LABELS.USERS ? styles.sidebarItemActive : ''}`}
                data-menu-label={ADMIN_MENU_LABELS.USERS}
                onClick={handleMenuButtonClick}
              >
                <FiUsers aria-hidden="true" />
                사용자
              </button>
              <button
                type="button"
                className={`${styles.sidebarItem} ${selectedMenu === ADMIN_MENU_LABELS.ADMINS ? styles.sidebarItemActive : ''}`}
                data-menu-label={ADMIN_MENU_LABELS.ADMINS}
                onClick={handleMenuButtonClick}
              >
                <FiUsers aria-hidden="true" />
                관리자
              </button>
              <button
                type="button"
                className={`${styles.sidebarItem} ${selectedMenu === ADMIN_MENU_LABELS.PENDING_USERS ? styles.sidebarItemActive : ''}`}
                data-menu-label={ADMIN_MENU_LABELS.PENDING_USERS}
                onClick={handleMenuButtonClick}
              >
                <FiUserCheck aria-hidden="true" />
                가입 요청
              </button>
              <button
                type="button"
                className={`${styles.sidebarItem} ${selectedMenu === ADMIN_MENU_LABELS.REJECTED_USERS ? styles.sidebarItemActive : ''}`}
                data-menu-label={ADMIN_MENU_LABELS.REJECTED_USERS}
                onClick={handleMenuButtonClick}
              >
                <FiUserCheck aria-hidden="true" />
                거절 계정
              </button>
            </div>

            <div className={styles.sidebarSection}>
              <p className={styles.sidebarSectionLabel}>모니터링</p>
              <button
                type="button"
                className={`${styles.sidebarItem} ${selectedMenu === ADMIN_MENU_LABELS.AUDIT_LOGS ? styles.sidebarItemActive : ''}`}
                data-menu-label={ADMIN_MENU_LABELS.AUDIT_LOGS}
                onClick={handleMenuButtonClick}
              >
                <FiFileText aria-hidden="true" />
                감사 로그
              </button>
              <button
                type="button"
                className={`${styles.sidebarItem} ${selectedMenu === ADMIN_MENU_LABELS.ACCESS_LOGS ? styles.sidebarItemActive : ''}`}
                data-menu-label={ADMIN_MENU_LABELS.ACCESS_LOGS}
                onClick={handleMenuButtonClick}
              >
                <FiLogIn aria-hidden="true" />
                관리자 접속일지
              </button>
            </div>
          </nav>
        </aside>

        <main className={styles.content}>
          <div className={styles.contentInner}>
            <header className={styles.header}>
              <div className={styles.headerTitleRow}>
                <h1 className={styles.title}>{selectedMenu}</h1>
                {selectedMenu === ADMIN_MENU_LABELS.PENDING_USERS ? (
                  <div className={styles.headerActions}>
                    <div className={styles.pendingFilterGroup}>
                      <div className={`${styles.filterDropdown} ${styles.roleFilterDropdown}`}>
                        <button type="button" className={styles.filterButton} onClick={togglePendingSort}>
                          가입일
                          <FiChevronDown className={styles.filterChevron} aria-hidden="true" />
                        </button>
                        {isPendingSortOpen ? (
                          <div className={styles.filterMenu}>
                            <button
                              type="button"
                              className={`${styles.filterItem} ${pendingSort === ADMIN_PENDING_SORT.OLDEST ? styles.filterItemActive : ''}`}
                              data-pending-sort={ADMIN_PENDING_SORT.OLDEST}
                              onClick={handlePendingSortClick}
                            >
                              오래된 가입 순
                            </button>
                            <button
                              type="button"
                              className={`${styles.filterItem} ${pendingSort === ADMIN_PENDING_SORT.NEWEST ? styles.filterItemActive : ''}`}
                              data-pending-sort={ADMIN_PENDING_SORT.NEWEST}
                              onClick={handlePendingSortClick}
                            >
                              최근 가입 순
                            </button>
                          </div>
                        ) : null}
                      </div>
                      <div className={`${styles.filterDropdown} ${styles.roleFilterDropdown}`}>
                        <button type="button" className={styles.filterButton} onClick={toggleRoleSort}>
                          {selectedRoleFilter === 'ALL' ? '역할' : formatRoleLabel(selectedRoleFilter)}
                          <FiChevronDown className={styles.filterChevron} aria-hidden="true" />
                        </button>
                        {isRoleSortOpen ? (
                          <div className={styles.filterMenu}>
                            <button
                              type="button"
                              className={`${styles.filterItem} ${selectedRoleFilter === 'ALL' ? styles.filterItemActive : ''}`}
                              data-role-filter="ALL"
                              onClick={handleRoleFilterClick}
                            >
                              전체 역할
                            </button>
                            <button
                              type="button"
                              className={`${styles.filterItem} ${
                                selectedRoleFilter === 'TRAINEE' ? styles.filterItemActive : ''
                              }`}
                              data-role-filter="TRAINEE"
                              onClick={handleRoleFilterClick}
                            >
                              훈련생
                            </button>
                            <button
                              type="button"
                              className={`${styles.filterItem} ${
                                selectedRoleFilter === 'GRADUATE' ? styles.filterItemActive : ''
                              }`}
                              data-role-filter="GRADUATE"
                              onClick={handleRoleFilterClick}
                            >
                              수료생
                            </button>
                            <button
                              type="button"
                              className={`${styles.filterItem} ${selectedRoleFilter === 'MENTOR' ? styles.filterItemActive : ''}`}
                              data-role-filter="MENTOR"
                              onClick={handleRoleFilterClick}
                            >
                              멘토
                            </button>
                            <button
                              type="button"
                              className={`${styles.filterItem} ${
                                selectedRoleFilter === 'INSTRUCTOR' ? styles.filterItemActive : ''
                              }`}
                              data-role-filter="INSTRUCTOR"
                              onClick={handleRoleFilterClick}
                            >
                              강사
                            </button>
                          </div>
                        ) : null}
                      </div>

                      <div className={styles.filterDropdown}>
                        <button type="button" className={styles.filterButton} onClick={toggleCourseSort}>
                          {selectedCourseFilter === 'ALL' ? '과정' : selectedCourseFilter}
                          <FiChevronDown className={styles.filterChevron} aria-hidden="true" />
                        </button>
                        {isCourseSortOpen ? (
                          <div className={styles.filterMenu}>
                            <button
                              type="button"
                              className={`${styles.filterItem} ${selectedCourseFilter === 'ALL' ? styles.filterItemActive : ''}`}
                              data-course-filter="ALL"
                              onClick={handleCourseFilterClick}
                            >
                              전체 과정
                            </button>
                            {courseFilterOptions.map(course => (
                              <button
                                key={course}
                                type="button"
                                className={`${styles.filterItem} ${
                                  selectedCourseFilter === course ? styles.filterItemActive : ''
                                }`}
                                data-course-filter={course}
                                onClick={handleCourseFilterClick}
                              >
                                {course}
                              </button>
                            ))}
                          </div>
                        ) : null}
                      </div>
                    </div>
                  </div>
                ) : null}
                {selectedMenu === ADMIN_MENU_LABELS.USERS ? (
                  <div className={styles.usersActionDropdown}>
                    <button
                      type="button"
                      className={`${styles.filterButton} ${styles.usersActionButton}`}
                      onClick={isUsersEditMode ? handleSaveAllUserRoles : handleUserEdit}
                    >
                      {isUsersEditMode ? '저장' : '회원 편집'}
                    </button>
                  </div>
                ) : null}
              </div>
              {selectedMenu === ADMIN_MENU_LABELS.ACCESS_LOGS ? (
                <p className={styles.description}>※ 관리자 접속일지는 30일 이후 DB에서 자동으로 삭제됩니다.</p>
              ) : null}
            </header>

            <div className={styles.singleGrid}>
              {selectedMenu === ADMIN_MENU_LABELS.PENDING_USERS ? (
                <article className={`${styles.card} ${styles.tableCard}`}>
                  {isPendingUsersLoading ? (
                    <p className={styles.notice}>불러오는 중입니다.</p>
                  ) : filteredPendingUsers.length ? (
                    <>
                      <div className={styles.tableWrap}>
                        <table className={styles.pendingTable}>
                          <thead className={styles.pendingTableHead}>
                            <tr>
                              <th>순서</th>
                              <th>이름</th>
                              <th>이메일</th>
                              <th>전화번호</th>
                              <th>생년월일</th>
                              <th>신청 역할</th>
                              <th>과정</th>
                              <th>가입일</th>
                              <th>처리</th>
                            </tr>
                          </thead>
                          <tbody className={styles.pendingTableBody}>
                            {filteredPendingUsers.map((user, index) => (
                              <tr key={user.id}>
                                <td>
                                  <div className={styles.orderCell}>
                                    <strong className={styles.orderIndex}>#{index + 1}</strong>
                                    <span className={styles.orderAgo}>({getRelativeTimeLabel(user.createdAt)})</span>
                                  </div>
                                </td>
                                <td>{user.name}</td>
                                <td>{user.email}</td>
                                <td>{formatPhoneNumber(user.phone)}</td>
                                <td>{user.birthDate ?? '-'}</td>
                                <td>
                                  <span
                                    className={`${styles.roleBadge} ${getRoleBadgeClassName(styles, user.requestedRole ?? user.role)}`}
                                  >
                                    {formatRoleLabel(user.requestedRole ?? user.role)}
                                  </span>
                                </td>
                                <td>{user.course ?? 'N/A'}</td>
                                <td>{formatDate(user.createdAt)}</td>
                                <td>
                                  <div className={styles.actions}>
                                    <button
                                      type="button"
                                      className={`${styles.actionButton} ${styles.approveActionButton}`}
                                      data-user-id={user.id}
                                      onClick={handleApproveUserClick}
                                    >
                                      승인
                                    </button>
                                    <button
                                      type="button"
                                      className={`${styles.actionButton} ${styles.rejectActionButton}`}
                                      data-user-id={user.id}
                                      onClick={handleRejectUserClick}
                                    >
                                      거절
                                    </button>
                                  </div>
                                </td>
                              </tr>
                            ))}
                          </tbody>
                        </table>
                      </div>
                    </>
                  ) : (
                    <p className={styles.notice}>승인 대기 회원이 없습니다.</p>
                  )}
                </article>
              ) : null}

              {selectedMenu === ADMIN_MENU_LABELS.REJECTED_USERS ? (
                <article className={`${styles.card} ${styles.tableCard}`}>
                  {isRejectedUsersLoading ? (
                    <p className={styles.notice}>불러오는 중입니다.</p>
                  ) : rejectedUsers.length ? (
                    <div className={styles.tableWrap}>
                      <table className={styles.pendingTable}>
                        <thead className={styles.pendingTableHead}>
                          <tr>
                            <th>순서</th>
                            <th>이름</th>
                            <th>이메일</th>
                            <th>전화번호</th>
                            <th>생년월일</th>
                            <th>거절일(가입일)</th>
                            <th>거절 사유</th>
                            <th>처리</th>
                          </tr>
                        </thead>
                        <tbody className={styles.pendingTableBody}>
                          {rejectedUsers.map((user, index) => (
                            <tr key={user.id}>
                              <td>#{index + 1}</td>
                              <td>{user.name}</td>
                              <td>{user.email}</td>
                              <td>{formatPhoneNumber(user.phone)}</td>
                              <td>{user.birthDate ?? '-'}</td>
                              <td>{formatDate(user.createdAt)}</td>
                              <td>{user.rejectedReason ?? '-'}</td>
                              <td>
                                <div className={styles.actions}>
                                  <button
                                    type="button"
                                    className={`${styles.actionButton} ${styles.rejectActionButton}`}
                                    data-user-id={user.id}
                                    onClick={handleDeleteRejectedUserClick}
                                  >
                                    재가입 허용
                                  </button>
                                </div>
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  ) : (
                    <p className={styles.notice}>거절된 계정이 없습니다.</p>
                  )}
                </article>
              ) : null}

              {selectedMenu === ADMIN_MENU_LABELS.USERS ? (
                <article className={`${styles.card} ${styles.tableCard}`}>
                  {isUsersLoading ? (
                    <p className={styles.notice}>불러오는 중입니다.</p>
                  ) : allUsers.length ? (
                    <div className={styles.tableWrap}>
                      <table className={styles.pendingTable}>
                        <thead className={styles.pendingTableHead}>
                          <tr>
                            <th>순서</th>
                            <th>이름</th>
                            <th>이메일</th>
                            <th>회원번호</th>
                            <th>전화번호</th>
                            <th>생년월일</th>
                            <th>역할</th>
                            <th>과정</th>
                            <th>가입일</th>
                          </tr>
                        </thead>
                        <tbody className={styles.pendingTableBody}>
                          {allUsers.map((user, index) => (
                            <tr key={user.id}>
                              <td>#{index + 1}</td>
                              <td>{user.name}</td>
                              <td>{user.email}</td>
                              <td>{user.id}</td>
                              <td>{formatPhoneNumber(user.phone)}</td>
                              <td>{user.birthDate ?? '-'}</td>
                              <td>
                                {isUsersEditMode && user.role !== 'ADMIN' ? (
                                  <select
                                    className={styles.userRoleSelect}
                                    value={userRoleDrafts[user.id] ?? user.requestedRole ?? user.role}
                                    data-user-id={user.id}
                                    onChange={handleUserRoleDraftChange}
                                  >
                                    <option value="TRAINEE">훈련생</option>
                                    <option value="GRADUATE">수료생</option>
                                    <option value="MENTOR">멘토</option>
                                    <option value="INSTRUCTOR">강사</option>
                                  </select>
                                ) : (
                                  <span
                                    className={`${styles.roleBadge} ${getRoleBadgeClassName(styles, user.requestedRole ?? user.role)}`}
                                  >
                                    {formatRoleLabel(user.requestedRole ?? user.role)}
                                  </span>
                                )}
                              </td>
                              <td>{user.course ?? 'N/A'}</td>
                              <td>{formatDate(user.createdAt)}</td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  ) : (
                    <p className={styles.notice}>회원 목록이 없습니다.</p>
                  )}
                </article>
              ) : null}

              {selectedMenu === ADMIN_MENU_LABELS.ADMINS ? (
                <article className={`${styles.card} ${styles.tableCard}`}>
                  {isUsersLoading ? (
                    <p className={styles.notice}>불러오는 중입니다.</p>
                  ) : adminUsers.length ? (
                    <div className={styles.tableWrap}>
                      <table className={styles.pendingTable}>
                        <thead className={styles.pendingTableHead}>
                          <tr>
                            <th>순서</th>
                            <th>이름</th>
                            <th>이메일</th>
                            <th>회원번호</th>
                            <th>전화번호</th>
                            <th>가입일</th>
                          </tr>
                        </thead>
                        <tbody className={styles.pendingTableBody}>
                          {adminUsers.map((user, index) => (
                            <tr key={user.id}>
                              <td>#{index + 1}</td>
                              <td>{user.name}</td>
                              <td>{user.email}</td>
                              <td>{user.id}</td>
                              <td>{formatPhoneNumber(user.phone)}</td>
                              <td>{formatDate(user.createdAt)}</td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  ) : (
                    <p className={styles.notice}>관리자 목록이 없습니다.</p>
                  )}
                </article>
              ) : null}

              {selectedMenu === ADMIN_MENU_LABELS.AUDIT_LOGS ? (
                <article className={`${styles.card} ${styles.tableCard}`}>
                  {isLogsLoading ? (
                    <p className={styles.notice}>불러오는 중입니다.</p>
                  ) : auditLogs.length ? (
                    <div className={styles.tableWrap}>
                      <table className={styles.pendingTable}>
                        <thead className={styles.pendingTableHead}>
                          <tr>
                            <th>순서</th>
                            <th>작업</th>
                            <th>대상</th>
                            <th>변경 전</th>
                            <th className={styles.auditDiffArrowCell} aria-label="변경 방향">
                              <FiChevronRight aria-hidden="true" />
                            </th>
                            <th>변경 후</th>
                            <th>시각</th>
                            <th>결과</th>
                          </tr>
                        </thead>
                        <tbody className={styles.pendingTableBody}>
                          {auditLogs.map((log, index) => (
                            <tr key={log.id}>
                              <td>#{index + 1}</td>
                              <td>{formatAuditActionLabel(log.action)}</td>
                              <td>
                                {formatAuditTargetLabel(log.targetType, log.targetId, log.targetName, log.targetEmail)}
                              </td>
                              <td>{formatAuditBeforeLabel(log.action, log.payload)}</td>
                              <td className={styles.auditDiffArrowCell}>
                                <FiChevronRight aria-hidden="true" />
                              </td>
                              <td>{formatAuditAfterLabel(log.action, log.payload)}</td>
                              <td>{formatDate(log.createdAt)}</td>
                              <td>
                                <span
                                  className={`${styles.auditResultBadge} ${getAuditResultBadgeClassName(styles, log.payload)}`}
                                >
                                  <span className={styles.auditResultDot} aria-hidden="true" />
                                  {formatAuditResultLabel(log.payload)}
                                </span>
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  ) : (
                    <p className={styles.notice}>감사 로그가 없습니다.</p>
                  )}
                </article>
              ) : null}

              {selectedMenu === ADMIN_MENU_LABELS.ACCESS_LOGS ? (
                <article className={`${styles.card} ${styles.tableCard}`}>
                  {isAccessLogsLoading ? (
                    <p className={styles.notice}>불러오는 중입니다.</p>
                  ) : accessLogs.length ? (
                    <>
                      <div className={styles.tableWrap}>
                        <table className={styles.pendingTable}>
                          <thead className={styles.pendingTableHead}>
                            <tr>
                              <th>순서</th>
                              <th>관리자</th>
                              <th>로그인 시각</th>
                              <th>로그아웃 시각</th>
                              <th>접속 IP</th>
                              <th>브라우저</th>
                              <th>세션 시간</th>
                              <th>상태</th>
                            </tr>
                          </thead>
                          <tbody className={styles.pendingTableBody}>
                            {accessLogs.map((log, index) => (
                              <tr key={log.id}>
                                <td>#{index + 1}</td>
                                <td>{`${log.adminName} (${log.adminEmail})`}</td>
                                <td>{formatDate(log.loginAt)}</td>
                                <td>{log.logoutAt ? formatDate(log.logoutAt) : 'N/A'}</td>
                                <td>{log.ipAddress}</td>
                                <td>{formatUserAgentLabel(log.userAgent)}</td>
                                <td>{formatSessionDuration(log.sessionDurationSec)}</td>
                                <td>
                                  <span
                                    className={`${styles.auditResultBadge} ${getAccessStatusBadgeClassName(styles, log.status)}`}
                                  >
                                    <span className={styles.auditResultDot} aria-hidden="true" />
                                    {log.status}
                                  </span>
                                </td>
                              </tr>
                            ))}
                          </tbody>
                        </table>
                        <div
                          ref={accessLogsLoadMoreRef}
                          className={styles.accessLogsLoadMoreTrigger}
                          aria-hidden="true"
                        />
                      </div>
                      {isAccessLogsFetchingMore ? (
                        <p className={styles.notice}>다음 로그를 불러오는 중입니다.</p>
                      ) : null}
                      {!hasNextAccessLogsPage ? <p className={styles.notice}>모든 로그를 확인했습니다.</p> : null}
                    </>
                  ) : (
                    <p className={styles.notice}>접속 이력이 없습니다.</p>
                  )}
                </article>
              ) : null}
            </div>
          </div>
        </main>
      </div>
    </section>
  );
}
