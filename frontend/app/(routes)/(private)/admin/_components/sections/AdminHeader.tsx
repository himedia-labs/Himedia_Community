import { FiChevronRight } from 'react-icons/fi';

import {
  ADMIN_MENU_LABELS,
  ADMIN_PENDING_SORT_OPTIONS,
  ADMIN_ROLE_FILTER_OPTIONS,
} from '@/app/shared/constants/config/admin.config';
import AdminFilterDropdown from '@/app/(routes)/(private)/admin/_components/controls/AdminFilterDropdown';
import { formatRoleLabel } from '@/app/(routes)/(private)/admin/_utils/formatRoleLabel.utils';

import styles from '@/app/(routes)/(private)/admin/AdminPage.module.css';

import type { AdminHeaderProps } from '@/app/shared/types/admin';

/**
 * 관리자 헤더
 * @description 상단 타이틀과 메뉴별 필터/액션 영역을 렌더링합니다.
 */
export default function AdminHeader({
  currentUserName,
  isCourseSortOpen,
  isPendingSortOpen,
  isRoleSortOpen,
  isUsersEditMode,
  pendingSort,
  selectedCourseFilter,
  selectedMenu,
  selectedRoleFilter,
  courseFilterOptions,
  CurrentMenuIcon,
  handleCourseFilterClick,
  handlePendingSortClick,
  handleRoleFilterClick,
  handleSaveAllUserRoles,
  handleUserEdit,
  toggleCourseSort,
  togglePendingSort,
  toggleRoleSort,
}: AdminHeaderProps) {
  return (
    <>
      <header className={styles.topbar}>
        <div className={styles.topbarInner}>
          <div className={styles.topbarTitle}>
            <CurrentMenuIcon aria-hidden="true" />
            <FiChevronRight className={styles.topbarTitleDividerIcon} aria-hidden="true" />
            <span>{selectedMenu}</span>
          </div>
          <div className={styles.topbarRight}>
            <span className={styles.adminWelcome}>{currentUserName} 관리자님, 환영합니다.</span>
          </div>
        </div>
      </header>

      <header className={styles.header}>
        <div className={styles.headerTitleRow}>
          <h1 className={styles.title}>{selectedMenu}</h1>
          {selectedMenu === ADMIN_MENU_LABELS.PENDING_USERS ? (
            <div className={styles.headerActions}>
              <div className={styles.pendingFilterGroup}>
                <AdminFilterDropdown
                  label="가입일"
                  isOpen={isPendingSortOpen}
                  wrapperClassName={`${styles.filterDropdown} ${styles.roleFilterDropdown}`}
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
                    { id: 'ALL', label: '전체 과정', active: selectedCourseFilter === 'ALL', dataAttributeName: 'data-course-filter' },
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
        </div>
        {selectedMenu === ADMIN_MENU_LABELS.ACCESS_LOGS ? (
          <p className={styles.description}>※ 관리자 접속일지는 30일 이후 DB에서 자동으로 삭제됩니다.</p>
        ) : null}
      </header>
    </>
  );
}
