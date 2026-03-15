/**
 * 공지 반응 요약 포맷
 * @description 반응한 사람 수와 사용자 선택 여부를 기존 노출 문구 형식으로 변환합니다.
 */
export function formatNoticeReactionSummary(reactorCount: number, hasSelectedReaction: boolean) {
  if (reactorCount <= 0) {
    return null;
  }

  if (hasSelectedReaction && reactorCount <= 1) {
    return '회원님이 반응했어요';
  }

  if (hasSelectedReaction) {
    return `회원님 외 ${reactorCount - 1}명이 반응했어요`;
  }

  return `${reactorCount}명이 반응했어요`;
}
