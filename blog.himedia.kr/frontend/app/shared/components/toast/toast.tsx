'use client';

import { createContext, ReactNode, useCallback, useContext, useMemo, useState } from 'react';
import { createPortal } from 'react-dom';
import { TbExclamationMark } from 'react-icons/tb';
import { IoMdCheckmark } from 'react-icons/io';
import { AiOutlineInfo } from 'react-icons/ai';

import styles from './toast.module.css';
import type { ToastContextValue, ToastItem, ToastOptions, ToastType } from './toast.types';
import type { IconType } from 'react-icons';

const ToastContext = createContext<ToastContextValue | undefined>(undefined);

const iconStyles: Record<ToastType, { bg: string; color: string }> = {
  info: { bg: '#e7eefc', color: '#3050a6' },
  success: { bg: '#e7f6ec', color: '#15803d' },
  warning: { bg: '#ffdf8f', color: '#333D4B' },
  error: { bg: '#ffe4e6', color: '#b91c1c' },
};

const exitDuration = 200;
const defaultDuration: number | null = 3000;

const iconMap: Record<ToastType, IconType> = {
  info: AiOutlineInfo,
  success: IoMdCheckmark,
  warning: TbExclamationMark,
  error: TbExclamationMark,
};

function ToastIcon({ type }: { type: ToastType }) {
  const Icon = iconMap[type];
  const { bg, color } = iconStyles[type];
  return (
    <span className={styles.icon} style={{ backgroundColor: bg, color }}>
      <Icon aria-hidden focusable="false" strokeWidth={2.5} />
    </span>
  );
}

function ToastCard({ toast, onClose }: { toast: ToastItem; onClose: (id: string) => void }) {
  return (
    <div className={`${styles.toast} ${toast.leaving ? styles.leaving : ''}`} role="status" aria-live="polite">
      <ToastIcon type={toast.type ?? 'info'} />
      <div className={styles.message}>{toast.message}</div>
      <button type="button" className={styles.close} aria-label="토스트 닫기" onClick={() => onClose(toast.id)}>
        ×
      </button>
    </div>
  );
}

export default function ToastProvider({ children }: { children: ReactNode }) {
  const [toasts, setToasts] = useState<ToastItem[]>([]);
  const mounted = typeof window !== 'undefined';

  const hideToast = useCallback((id: string) => {
    setToasts(prev => {
      const target = prev.find(toast => toast.id === id);
      if (!target || target.leaving) return prev;
      return prev.map(toast => (toast.id === id ? { ...toast, leaving: true } : toast));
    });

    window.setTimeout(() => {
      setToasts(prev => prev.filter(toast => toast.id !== id));
    }, exitDuration);
  }, []);

  const showToast = useCallback(
    ({ message, type = 'warning', duration = defaultDuration }: ToastOptions) => {
      const id =
        typeof crypto !== 'undefined' && 'randomUUID' in crypto
          ? crypto.randomUUID()
          : `${Date.now()}-${Math.random()}`;

      setToasts(prev => [...prev, { id, message, type, duration }]);

      if (typeof duration === 'number' && duration > 0) {
        window.setTimeout(() => {
          hideToast(id);
        }, duration);
      }
    },
    [hideToast],
  );

  const contextValue = useMemo(() => ({ showToast, hideToast }), [showToast, hideToast]);

  return (
    <ToastContext.Provider value={contextValue}>
      {children}
      {mounted &&
        createPortal(
          <div className={styles.container} aria-live="polite" aria-atomic="true">
            {toasts.map(toast => (
              <ToastCard key={toast.id} toast={toast} onClose={hideToast} />
            ))}
          </div>,
          document.body,
        )}
    </ToastContext.Provider>
  );
}

export function useToast() {
  const context = useContext(ToastContext);
  if (!context) {
    throw new Error('useToast는 ToastProvider 내부에서만 사용할 수 있습니다.');
  }
  return context;
}
