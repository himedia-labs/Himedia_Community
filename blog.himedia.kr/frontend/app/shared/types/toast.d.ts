export type ToastType = 'info' | 'success' | 'error' | 'warning';

export type ToastOptions = {
  message: string;
  type?: ToastType;
  duration?: number | null;
};

export type ToastItem = ToastOptions & {
  id: string;
  leaving?: boolean;
};

export type ToastContextValue = {
  showToast: (options: ToastOptions) => void;
  hideToast: (id: string) => void;
};
