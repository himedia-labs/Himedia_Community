/**
 * 공지사항 날짜 포맷
 * @description 같은 해는 연도를 생략하고, 다른 해는 연도를 포함한 날짜를 반환합니다.
 */
export function formatNoticePublishedDate(publishedAt: string) {
  const [year, month, day] = publishedAt.split('.').map(Number);

  if (![year, month, day].every(Number.isFinite)) {
    return publishedAt;
  }

  const currentYear = new Date().getFullYear();
  const monthLabel = String(month).padStart(2, '0');
  const dayLabel = String(day).padStart(2, '0');

  if (year === currentYear) {
    return `${monthLabel}.${dayLabel}`;
  }

  return `${year}.${monthLabel}.${dayLabel}`;
}
