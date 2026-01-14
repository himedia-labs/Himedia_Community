import type { IconType } from 'react-icons';

export type ToastType = 'info' | 'success' | 'error' | 'warning';

export type ToastAction = {
  id: string;
  label: string;
  ariaLabel?: string;
  icon: IconType;
  className?: 'action' | 'close';
  onClick: () => void;
};

export type ToastOptions = {
  message: string;
  type?: ToastType;
  duration?: number | null;
  actions?: ToastAction[];
};

export type ToastItem = ToastOptions & {
  id: string;
  leaving?: boolean;
};

export type ToastContextValue = {
  showToast: (options: ToastOptions) => void;
  hideToast: (id: string) => void;
};
