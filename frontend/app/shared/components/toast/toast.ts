'use client';

import { useContext } from 'react';

import { ToastContext } from '@/app/shared/components/toast/ToastContext';

import type { ToastContextValue } from '@/app/shared/types/toast';

/**
 * 토스트 훅
 * @description 토스트 컨텍스트를 반환
 */
export const useToast = (): ToastContextValue => {
  const context = useContext(ToastContext);

  if (!context) {
    throw new Error('useToast must be used within ToastProvider.');
  }

  return context;
};
