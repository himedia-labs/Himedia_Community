import { TOAST_ICON_MAP } from '@/app/shared/constants/config/toast.config';

import styles from './toast.module.css';

import type { ToastType } from '@/app/shared/types/toast';

/**
 * 토스트 아이콘
 * @description 타입별 아이콘과 배경색을 렌더링
 */
export function ToastIcon({ type }: { type: ToastType }) {
  const Icon = TOAST_ICON_MAP[type];
  return (
    <span className={`${styles.icon} ${styles[`icon${type[0].toUpperCase()}${type.slice(1)}`]}`}>
      <Icon aria-hidden focusable="false" strokeWidth={2.5} />
    </span>
  );
}
