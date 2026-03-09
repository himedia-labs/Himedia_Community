/**
 * 인증번호 포맷
 * @description 영문/숫자만 남기고 대문자로 변환한 뒤 8자로 제한
 */
export const formatCode = (value: string) =>
  value
    .replace(/[^a-zA-Z0-9]/g, '')
    .toUpperCase()
    .slice(0, 8);
