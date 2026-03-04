// 기본값
const FALLBACK = '--';
const pad = (n: number) => String(n).padStart(2, '0');

/**
 * 경과 시간 계산
 * @description 게시글 작성 시점을 기준으로 상대 시간 표시
 */
export const buildRelativeTime = (value?: string | null) => {
  if (!value) return FALLBACK;
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return FALLBACK;

  const diffMs = Date.now() - date.getTime();
  if (diffMs < 0) return FALLBACK;
  if (diffMs < 60000) return '방금 전';

  const minutes = Math.floor(diffMs / 60000);
  if (minutes < 60) return `${minutes}분 전`;

  const hours = Math.floor(diffMs / 3600000);
  if (hours < 24) return `${hours}시간 전`;

  const days = Math.floor(diffMs / 86400000);
  if (days < 30) return `${days}일 전`;

  const months = Math.floor(days / 30);
  if (months < 12) return `${months}개월 전`;

  return `${Math.floor(days / 365)}년 전`;
};

/**
 * 날짜 시간 포맷 (yyyy. MM. dd. HH:mm)
 * @description yyyy. MM. dd. HH:mm 형식으로 변환 (초 포함 가능)
 */
export const formatDate = (value?: string | null, includeSeconds = false) => {
  if (!value) return FALLBACK;
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return FALLBACK;

  const y = date.getFullYear();
  const M = pad(date.getMonth() + 1);
  const d = pad(date.getDate());
  const h = pad(date.getHours());
  const m = pad(date.getMinutes());

  if (includeSeconds) {
    const s = pad(date.getSeconds());
    return `${y}. ${M}. ${d}. ${h}:${m}:${s}`;
  }
  return `${y}. ${M}. ${d}. ${h}:${m}`;
};

