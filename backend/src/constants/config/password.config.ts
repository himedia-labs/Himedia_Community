export const PASSWORD_CONFIG = {
  // 비밀번호 재설정 인증번호 유효 시간(분)
  RESET_CODE_EXPIRY_MINUTES: 10,
  // 비밀번호 재설정 인증번호 길이
  RESET_CODE_LENGTH: 8,
  // 인증번호 생성에 사용할 문자 집합
  RESET_CODE_CHARSET: 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789',
} as const;
