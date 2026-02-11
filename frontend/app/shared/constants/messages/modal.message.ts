export const WITHDRAW_MODAL_MESSAGES = {
  cancel: '취소',
  title: '회원탈퇴 전 안내사항',
  confirm: '탈퇴',
  placeholder: '현재 비밀번호',
  warning: '탈퇴를 진행하면 위 안내사항에 동의한 것으로 간주됩니다.',
  description: '현재 비밀번호를 입력하면 탈퇴가 완료됩니다.',
  guides: [
    '회원탈퇴 즉시 모든 기기에서 로그아웃되며 계정 접근이 차단됩니다.',
    '계정 복원은 탈퇴 후 30일 이내에만 가능하며, 기간 내 로그인 화면에서 동일 이메일/비밀번호 입력 후 이메일 인증을 완료해야 합니다. 기간 경과 시 로그인은 계정이 없는 것처럼 처리됩니다.',
    '탈퇴한 계정의 이메일은 재회원가입 및 다른 계정의 이메일 변경에 재사용하실 수 없습니다.',
    '게시글/댓글 등 활동 데이터는 회원탈퇴만으로 삭제되지 않습니다. 삭제를 원하신다면 회원탈퇴 전에 직접 삭제해 주세요.',
  ],
  fallbackError: '회원탈퇴에 실패했습니다.',
  missingPassword: '현재 비밀번호를 입력해주세요.',
} as const;

export const LOGIN_WITHDRAW_MODAL_MESSAGES = {
  sendCode: '인증번호 발송',
  resendCode: '재전송',
  cancel: '닫기',
  title: '탈퇴 계정 복원',
  confirm: '복원',
  codePlaceholder: '8자리 인증번호',
  missingCode: '인증번호를 입력해주세요.',
  restoredSuccess: '계정이 복원되었습니다.',
  description: '30일 이내 탈퇴 계정은 이메일 인증으로 복원할 수 있습니다.',
} as const;
