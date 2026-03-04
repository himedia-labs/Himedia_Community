import { FiChevronDown } from 'react-icons/fi';

import styles from '@/app/(routes)/(private)/mypage/MyPage.module.css';
import { createHandleFilterItemSelect } from '@/app/(routes)/(private)/mypage/handlers';

import type { MyPageFilterDropdownProps } from '@/app/shared/types/mypage';

/**
 * 마이페이지 필터 드롭다운
 * @description 카테고리/태그 필터 드롭다운 공통 컴포넌트
 */
export default function MyPageFilterDropdown({
  type,
  items,
  selectedId,
  selectedLabel,
  isOpen,
  onToggle,
  onSelect,
}: MyPageFilterDropdownProps) {
  const isTag = type === 'tag';
  const defaultLabel = isTag ? '#태그' : '카테고리';
  const displayLabel = selectedLabel ? (isTag ? `#${selectedLabel}` : selectedLabel) : defaultLabel;
  const handleItemSelect = createHandleFilterItemSelect(onSelect);

  return (
    <div className={styles.filterDropdown}>
      <button type="button" className={styles.filterButton} onClick={onToggle} disabled={!items.length}>
        {isTag ? <span className={styles.tagFilterLabel}>{displayLabel}</span> : displayLabel}
        <FiChevronDown className={styles.filterChevron} aria-hidden="true" />
      </button>
      {isOpen ? (
        <div className={isTag ? `${styles.filterMenu} ${styles.tagFilterMenu}` : styles.filterMenu}>
          {items.map(item => (
            <button
              key={item.id}
              type="button"
              className={
                selectedId === item.id
                  ? isTag
                    ? `${styles.filterItem} ${styles.filterItemActive} ${styles.tagFilterItemActive}`
                    : `${styles.filterItem} ${styles.filterItemActive}`
                  : styles.filterItem
              }
              data-item-id={item.id}
              onClick={handleItemSelect}
            >
              <span className={isTag ? styles.tagFilterName : undefined}>{isTag ? `#${item.name}` : item.name}</span>
              <span className={styles.filterCount}>{item.count}</span>
            </button>
          ))}
        </div>
      ) : null}
    </div>
  );
}
