import { FiChevronDown } from 'react-icons/fi';

import styles from '@/app/(routes)/(private)/admin/AdminPage.module.css';

import type { AdminFilterDropdownProps } from '@/app/shared/types/admin';

/**
 * 관리자 필터 드롭다운
 * @description 버튼과 항목 목록으로 구성된 관리자 필터 드롭다운을 렌더링합니다.
 */
export default function AdminFilterDropdown({
  label,
  isOpen,
  buttonClassName,
  wrapperClassName,
  onToggle,
  items,
  onItemClick,
}: AdminFilterDropdownProps) {
  return (
    <div className={wrapperClassName ?? styles.filterDropdown}>
      <button type="button" className={buttonClassName ?? styles.filterButton} onClick={onToggle}>
        {label}
        <FiChevronDown className={styles.filterChevron} aria-hidden="true" />
      </button>
      {isOpen ? (
        <div className={styles.filterMenu}>
          {items.map(item => (
            <button
              key={item.id}
              type="button"
              className={`${styles.filterItem} ${item.active ? styles.filterItemActive : ''}`}
              {...{ [item.dataAttributeName]: item.id }}
              onClick={onItemClick}
            >
              {item.label}
            </button>
          ))}
        </div>
      ) : null}
    </div>
  );
}
