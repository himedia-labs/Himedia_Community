/**
 * 남은 시간 포맷
 * @description 남은 시간을 mm:ss 형식으로 변환
 */
export const formatRemainingTime = (seconds: number) => {
  const clamped = Math.max(seconds, 0);
  const minutes = Math.floor(clamped / 60)
    .toString()
    .padStart(2, '0');
  const secs = Math.floor(clamped % 60)
    .toString()
    .padStart(2, '0');
  return `${minutes}:${secs}`;
};
