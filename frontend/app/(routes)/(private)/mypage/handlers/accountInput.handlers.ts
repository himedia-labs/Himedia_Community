import type { ChangeEvent } from 'react';

/**
 * 계정 비밀번호 입력 변경 핸들러 생성
 * @description 입력 이벤트 값을 setter에 전달해 비밀번호 필드를 갱신
 */
export const createPasswordInputChangeHandler = (setValue: (value: string) => void) => {
  return (event: ChangeEvent<HTMLInputElement>) => {
    setValue(event.target.value);
  };
};

/**
 * 탈퇴 비밀번호 표시 토글 핸들러 생성
 * @description 현재 표시 상태를 반전해 입력 타입을 전환
 */
export const createToggleWithdrawPasswordHandler = (
  setShowWithdrawPassword: (value: boolean) => void,
  showWithdrawPassword: boolean,
) => {
  return () => {
    setShowWithdrawPassword(!showWithdrawPassword);
  };
};
