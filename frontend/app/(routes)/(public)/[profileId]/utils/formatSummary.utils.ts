/**
 * 요약 생성
 * @description 본문을 간단한 요약 문자열로 변환
 */
export const formatSummary = (value?: string | null) => {
  if (!value) return '내용 없음';
  return value.replace(/\s+/g, ' ').slice(0, 120);
};
