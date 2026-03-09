import styles from '@/app/shared/components/empty/EmptyState.module.css';

import type { EmptyStateProps } from '@/app/shared/types/empty-state';

/**
 * 공통 빈 상태
 * @description 목록/섹션 비어있을 때 공통 UI를 렌더링
 */
export default function EmptyState({
  title,
  description,
  className,
  size = 'default',
  align = 'center',
}: EmptyStateProps) {
  // 클래스 구성
  const classNames = [styles.container];
  if (size === 'compact') classNames.push(styles.compact);
  if (align === 'left') classNames.push(styles.left);
  if (className) classNames.push(className);

  return (
    <div className={classNames.join(' ')} role="status">
      <p className={styles.title}>{title}</p>
      <p className={styles.description}>{description}</p>
    </div>
  );
}
