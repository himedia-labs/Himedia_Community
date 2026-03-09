import { FiFlag, FiHeart, FiMessageCircle } from 'react-icons/fi';

import type { NotificationType } from '@/app/shared/types/notification';

const DAY_MS = 24 * 60 * 60 * 1000;

/**
 * 알림 아이콘 반환
 * @description 알림 타입에 따른 아이콘 컴포넌트 반환
 */
export const getNotificationIcon = (type: NotificationType) => {
  if (
    type === 'REPORT_RECEIVED' ||
    type === 'REPORT_RESOLVED' ||
    type === 'REPORT_REJECTED'
  )
    return FiFlag;
  if (type === 'POST_COMMENT' || type === 'COMMENT_REPLY') return FiMessageCircle;
  return FiHeart;
};

/**
 * 알림 섹션 구분
 * @description 알림 생성 시간에 따라 오늘/이번주/이전으로 분류
 */
export const getNotificationSection = (createdAtMs: number): 'today' | 'week' | 'earlier' => {
  const now = new Date();
  const createdAt = new Date(createdAtMs);
  const isSameDate =
    now.getFullYear() === createdAt.getFullYear() &&
    now.getMonth() === createdAt.getMonth() &&
    now.getDate() === createdAt.getDate();

  if (isSameDate) return 'today';
  if (Date.now() - createdAtMs < 7 * DAY_MS) return 'week';
  return 'earlier';
};

/**
 * 알림 시간 포맷
 * @description 상대 시간 또는 절대 날짜 형식으로 변환
 */
export const formatNotificationTime = (createdAtMs: number) => {
  const diffMs = Math.max(Date.now() - createdAtMs, 0);
  const minutes = Math.floor(diffMs / 60000);
  if (minutes < 1) return '방금 전';
  if (minutes < 60) return `${minutes}분 전`;
  const hours = Math.floor(minutes / 60);
  if (hours < 24) return `${hours}시간 전`;
  const days = Math.floor(hours / 24);
  if (days < 7) return `${days}일 전`;
  const date = new Date(createdAtMs);
  const month = `${date.getMonth() + 1}`.padStart(2, '0');
  const day = `${date.getDate()}`.padStart(2, '0');
  return `${date.getFullYear()}.${month}.${day}`;
};
