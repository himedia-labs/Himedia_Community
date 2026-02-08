// 교육과정 리스트
export const COURSE_OPTIONS = [
  '프론트엔드 개발자 양성과정 1기',
  '프론트엔드 개발자 양성과정 2기',
  '백엔드 개발자 양성과정 1기',
  '백엔드 개발자 양성과정 2기',
  '풀스택 개발자 양성과정 1기',
  '풀스택 개발자 양성과정 2기',
  'AI 개발자 양성과정 1기',
  'AI 개발자 양성과정 2기',
  '데이터 분석 양성과정 1기',
  '데이터 분석 양성과정 2기',
  '기타',
] as const;

// 폼 캐시 키
export const REGISTER_FORM_CACHE_KEY = 'registerFormCache';

// 폼 캐시 보존 플래그 키
export const REGISTER_FORM_CACHE_KEEP_KEY = 'registerFormCacheKeep';

// 폼 기본값
export const REGISTER_FORM_DEFAULT = {
  name: '',
  email: '',
  birthDate: '',
  password: '',
  passwordConfirm: '',
  phone: '',
  role: '',
  course: '',
  privacyConsent: false,
};

// 생년월일 입력 설정
export const BIRTH_DATE_CONFIG = {
  DIGIT_MAX_LENGTH: 8,
  FORMATTED_MAX_LENGTH: 10,
};

// 이메일 인증 설정
export const EMAIL_VERIFICATION_CODE_LENGTH = 8;

// 전화번호 입력 설정
export const PHONE_CONFIG = {
  DIGIT_MAX_LENGTH: 11,
  FORMATTED_MAX_LENGTH: 13,
  DISPLAY_FORMAT: 'XXX XXXX XXXX',
};
