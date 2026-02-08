export const EMAIL_VERIFICATION_CONFIG = {
  // 이메일 인증번호 유효 시간(분)
  CODE_EXPIRY_MINUTES: 10,
  // 이메일 인증번호 길이
  CODE_LENGTH: 8,
  // 인증번호 생성에 사용할 문자 집합
  CODE_CHARSET: 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789',
} as const;
