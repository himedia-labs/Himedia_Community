export type TabKey = 'posts' | 'comments' | 'likes' | 'settings' | 'account';

// 탭 판별
export const getInitialTab = (value?: string | null, defaultTab: TabKey = 'posts') => {
  if (value === 'comments' || value === 'likes' || value === 'posts' || value === 'settings' || value === 'account') {
    return value;
  }
  return defaultTab;
};

// 날짜 포맷
export const formatDateLabel = (value?: string | null) => {
  if (!value) return '--';
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return '--';
  return `${date.getFullYear()}.${String(date.getMonth() + 1).padStart(2, '0')}.${String(date.getDate()).padStart(2, '0')}`;
};

// 요약 생성
export const formatSummary = (value?: string | null) => {
  if (!value) return '내용 없음';
  return value.replace(/\s+/g, ' ').slice(0, 120);
};

// 날짜/시간 포맷
export const formatDateTimeLabel = (value?: string | null) => {
  if (!value) return '--';
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return '--';
  return `${date.getFullYear()}년 ${date.getMonth() + 1}월 ${date.getDate()}일 ${String(date.getHours()).padStart(2, '0')}:${String(date.getMinutes()).padStart(2, '0')}`;
};
