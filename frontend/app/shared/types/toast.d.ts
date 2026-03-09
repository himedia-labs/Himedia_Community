import type { IconType } from 'react-icons';

// 토스트 종류
export type ToastType = 'info' | 'success' | 'error' | 'warning';

// 토스트 액션
export type ToastAction = {
  id: string;
  label: string;
  ariaLabel?: string;
  icon: IconType;
  className?: 'action' | 'close';
  onClick: () => void;
};

// 토스트 입력
export type ToastOptions = {
  message: string;
  type?: ToastType;
  duration?: number | null;
  actions?: ToastAction[];
};

// 토스트 아이템
export type ToastItem = ToastOptions & {
  id: string;
  leaving?: boolean;
};

// 토스트 컨텍스트
export type ToastContextValue = {
  showToast: (options: ToastOptions) => void;
  hideToast: (id: string) => void;
};
