// 에러 메시지
export const EMAIL_VERIFICATION_ERROR_MESSAGES = {
  INVALID_CODE: '유효하지 않은 인증번호입니다.',
  EMAIL_SEND_FAILED: '인증 메일 발송에 실패했습니다. 잠시 후 다시 시도해주세요.',
  TOO_MANY_REQUESTS: '인증번호 요청이 많습니다. 잠시 후 다시 시도해주세요.',
} as const;

// 성공 메시지
export const EMAIL_VERIFICATION_SUCCESS_MESSAGES = {
  CODE_SENT: '인증번호가 이메일로 발송되었습니다.',
  CODE_VERIFIED: '인증번호가 확인되었습니다.',
} as const;
