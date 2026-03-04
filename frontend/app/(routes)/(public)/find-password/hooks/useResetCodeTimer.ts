import { useEffect } from 'react';

/**
 * 인증코드 타이머 훅
 * @description 인증코드 만료 카운트다운과 만료 알림을 처리
 */
export const useResetCodeTimer = (params: {
  codeSent: boolean;
  remainingSeconds: number;
  setRemainingSeconds: (updater: (prev: number) => number) => void;
  showToast: (options: { message: string; type: 'success' | 'error' | 'warning' }) => void;
}) => {
  const { codeSent, remainingSeconds, setRemainingSeconds, showToast } = params;

  // 타이머/카운트다운
  useEffect(() => {
    if (!codeSent || remainingSeconds <= 0) return undefined;

    const timerId = window.setTimeout(() => {
      setRemainingSeconds(prev => Math.max(prev - 1, 0));
    }, 1000);

    return () => window.clearTimeout(timerId);
  }, [codeSent, remainingSeconds, setRemainingSeconds]);

  // 만료/알림
  useEffect(() => {
    if (codeSent && remainingSeconds === 0) {
      showToast({ message: '인증번호가 만료되었습니다. 다시 발송해주세요.', type: 'warning' });
    }
  }, [codeSent, remainingSeconds, showToast]);
};
