export const TOKEN_ERROR_MESSAGES = {
  INVALID_REFRESH_TOKEN: '유효하지 않은 리프레시 토큰입니다.',
  EXPIRED_REFRESH_TOKEN: '리프레시 토큰이 만료되었습니다.',
} as const;

export const TOKEN_VALIDATION_MESSAGES = {
  REFRESH_TOKEN_STRING: '리프레시 토큰은 문자열이어야 합니다.',
  REFRESH_TOKEN_INVALID_FORMAT: '유효하지 않은 리프레시 토큰 형식입니다.',
} as const;
