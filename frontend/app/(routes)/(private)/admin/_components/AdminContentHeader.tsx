import Link from 'next/link';

import {
  ADMIN_MENU_LABELS,
  ADMIN_PENDING_SORT_OPTIONS,
  ADMIN_ROLE_FILTER_OPTIONS,
} from '@/app/shared/constants/config/admin.config';
import AdminFilterDropdown from '@/app/(routes)/(private)/admin/_components/AdminFilterDropdown';
import { formatRoleLabel } from '@/app/(routes)/(private)/admin/_utils/formatRoleLabel.utils';

import styles from '@/app/(routes)/(private)/admin/AdminPage.module.css';

import type { AdminHeaderProps } from '@/app/shared/types/admin';

/**
 * 관리자 콘텐츠 헤더
 * @description 본문 상단의 제목, 설명, 필터와 액션 영역을 렌더링합니다.
 */
export default function AdminContentHeader({
  isCourseSortOpen,
  isPendingSortOpen,
  isRoleSortOpen,
  isUsersEditMode,
  pendingSort,
  selectedCourseFilter,
  selectedMenu,
  selectedRoleFilter,
  courseFilterOptions,
  handleCourseFilterClick,
  handlePendingSortClick,
  handleRoleFilterClick,
  handleSaveAllUserRoles,
  handleUserEdit,
  toggleCourseSort,
  togglePendingSort,
  toggleRoleSort,
}: AdminHeaderProps) {
  // 메뉴 설명
  const menuDescriptionMap: Partial<Record<(typeof ADMIN_MENU_LABELS)[keyof typeof ADMIN_MENU_LABELS], string>> = {
    [ADMIN_MENU_LABELS.PENDING_USERS]: '가입 승인 대기 목록을 확인하고 승인 또는 거절을 처리합니다.',
    [ADMIN_MENU_LABELS.REJECTED_USERS]: '거절된 가입 계정과 사유를 확인하고 정리합니다.',
    [ADMIN_MENU_LABELS.USERS]: '전체 회원 목록과 역할 정보를 관리합니다.',
    [ADMIN_MENU_LABELS.ADMINS]: '관리자 권한 보유 계정을 확인합니다.',
    [ADMIN_MENU_LABELS.NOTICE_ANNOUNCEMENTS]: '공지사항 게시물을 확인하고 관리합니다.',
    [ADMIN_MENU_LABELS.NOTICE_UPDATES]: '업데이트 내역 게시물을 확인하고 관리합니다.',
    [ADMIN_MENU_LABELS.NOTICE_POST_CREATE]: '공지사항 글 작성 화면을 관리합니다.',
    [ADMIN_MENU_LABELS.NOTICE_UPDATE_CREATE]: '업데이트 내역 작성 화면을 관리합니다.',
    [ADMIN_MENU_LABELS.AUDIT_LOGS]: '관리자 작업 이력을 확인합니다.',
    [ADMIN_MENU_LABELS.ACCESS_LOGS]: '관리자 로그인과 접속 기록을 확인합니다.',
  };

  const contentDescription =
    selectedMenu === ADMIN_MENU_LABELS.ACCESS_LOGS
      ? '관리자 접속일지는 30일 이후 DB에서 자동으로 삭제됩니다.'
      : menuDescriptionMap[selectedMenu];
  const pendingSortLabel = ADMIN_PENDING_SORT_OPTIONS.find(item => item.id === pendingSort)?.label ?? '오래된 가입 순';

  return (
    <header className={styles.contentHeader}>
      <div className={styles.contentHeaderTitleRow}>
        <h1>{selectedMenu}</h1>
        {selectedMenu === ADMIN_MENU_LABELS.PENDING_USERS ? (
          <div className={styles.headerActions}>
            <div className={styles.pendingFilterGroup}>
              <AdminFilterDropdown
                label={pendingSortLabel}
                isOpen={isPendingSortOpen}
                buttonClassName={`${styles.filterButton} ${styles.pendingSortButton}`}
                wrapperClassName={`${styles.filterDropdown} ${styles.pendingSortDropdown}`}
                onToggle={togglePendingSort}
                items={ADMIN_PENDING_SORT_OPTIONS.map(item => ({
                  id: item.id,
                  label: item.label,
                  active: pendingSort === item.id,
                  dataAttributeName: 'data-pending-sort',
                }))}
                onItemClick={handlePendingSortClick}
              />
              <AdminFilterDropdown
                label={selectedRoleFilter === 'ALL' ? '역할' : formatRoleLabel(selectedRoleFilter)}
                isOpen={isRoleSortOpen}
                wrapperClassName={`${styles.filterDropdown} ${styles.roleFilterDropdown}`}
                onToggle={toggleRoleSort}
                items={ADMIN_ROLE_FILTER_OPTIONS.map(item => ({
                  id: item.id,
                  label: item.label,
                  active: selectedRoleFilter === item.id,
                  dataAttributeName: 'data-role-filter',
                }))}
                onItemClick={handleRoleFilterClick}
              />
              <AdminFilterDropdown
                label={selectedCourseFilter === 'ALL' ? '과정' : selectedCourseFilter}
                isOpen={isCourseSortOpen}
                onToggle={toggleCourseSort}
                items={[
                  {
                    id: 'ALL',
                    label: '전체 과정',
                    active: selectedCourseFilter === 'ALL',
                    dataAttributeName: 'data-course-filter',
                  },
                  ...courseFilterOptions.map(course => ({
                    id: course,
                    label: course,
                    active: selectedCourseFilter === course,
                    dataAttributeName: 'data-course-filter',
                  })),
                ]}
                onItemClick={handleCourseFilterClick}
              />
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
        {selectedMenu === ADMIN_MENU_LABELS.NOTICE_ANNOUNCEMENTS ? (
          <div className={styles.usersActionDropdown}>
            <Link
              href="/admin/notices/new?type=announcement"
              className={`${styles.filterButton} ${styles.usersActionButton}`}
            >
              공지사항 글 쓰기
            </Link>
          </div>
        ) : null}
        {selectedMenu === ADMIN_MENU_LABELS.NOTICE_UPDATES ? (
          <div className={styles.usersActionDropdown}>
            <Link
              href="/admin/notices/new?type=update"
              className={`${styles.filterButton} ${styles.usersActionButton}`}
            >
              업데이트 글 쓰기
            </Link>
          </div>
        ) : null}
      </div>
      {contentDescription ? <p className={styles.contentDescription}>{contentDescription}</p> : null}
    </header>
  );
}
