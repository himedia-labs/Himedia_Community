import { IoMdCheckmark } from 'react-icons/io';
import { AiOutlineInfo } from 'react-icons/ai';
import { TbExclamationMark } from 'react-icons/tb';

import type { IconType } from 'react-icons';
import type { ToastType } from '@/app/shared/types/toast';

/**
 * 토스트 설정
 * @description 토스트 동작 및 스타일 설정
 */
export const TOAST_CONFIG = {
  maxToasts: 3,
  exitDurationMs: 260,
  defaultDurationMs: 3500,
  resetOnNewToast: true,
} as const;

/**
 * 토스트 아이콘 매핑
 * @description 타입별 아이콘 컴포넌트 매핑
 */
export const TOAST_ICON_MAP: Record<ToastType, IconType> = {
  info: AiOutlineInfo,
  success: IoMdCheckmark,
  warning: TbExclamationMark,
  error: TbExclamationMark,
};
