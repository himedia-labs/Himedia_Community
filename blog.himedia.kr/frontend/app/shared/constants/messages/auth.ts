export const LOGIN_MESSAGES = {
  emailRequired: '이메일을 입력해주세요.',
  passwordRequired: '비밀번호를 입력해주세요.',
  success: '로그인 되었습니다.',
  fallbackError: '로그인에 실패했습니다. 잠시 후 다시 시도해주세요.',
  pendingApproval: '관리자 승인 대기 중입니다.',
} as const;

export const REGISTER_MESSAGES = {
  nameRequired: '이름을 입력해주세요.',
  emailRequired: '이메일을 입력해주세요.',
  passwordRequired: '비밀번호를 입력해주세요.',
  passwordInvalid: '최소 8자의 영문, 숫자, 특수문자를 입력해주세요.',
  passwordConfirmRequired: '비밀번호 확인을 입력해주세요.',
  passwordMismatch: '비밀번호가 일치하지 않습니다.',
  passwordMismatchFriendly: '두 비밀번호가 달라요!',
  phoneRequired: '전화번호를 입력해주세요.',
  roleRequired: '역할을 선택해주세요.',
  courseRequired: '과정명을 선택해주세요.',
  privacyRequired: '개인정보 수집 및 이용에 동의해주세요.',
  validationToast: '입력 내용을 한 번만 더 확인해주세요.',
  success: '회원가입이 완료되었습니다.\n관리자 승인 후 로그인하실 수 있습니다.',
  fallbackError: '회원가입에 실패했습니다. 잠시 후 다시 시도해주세요.',
} as const;
