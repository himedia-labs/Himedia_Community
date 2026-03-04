// 교육과정명 (고정)
export const COURSE_NAME = '심화_생성형 AI활용 인재양성과정 (조별멘토)';

// 기수 옵션
export const COURSE_TERM_OPTIONS = [
  { value: '1기', label: '1기' },
  { value: '2기', label: '2기' },
  { value: '3기', label: '3기' },
  { value: '4기', label: '4기' },
  { value: '5기', label: '5기' },
  { value: '6기', label: '6기' },
  { value: '7기', label: '7기' },
  { value: '8기', label: '8기' },
  { value: '9기', label: '9기' },
  { value: '10기', label: '10기' },
  { value: '11기', label: '11기' },
  { value: '12기', label: '12기' },
  { value: '기억안남', label: '기억 안남' },
  { value: '해당없음', label: '해당 없음' },
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
  courseTerm: '',
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
