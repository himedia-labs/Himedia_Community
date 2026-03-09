import type { ChangeEvent } from 'react';

/**
 * 프로필 입력 변경 핸들러 생성
 * @description 입력 이벤트 값을 setter에 전달해 프로필 필드를 갱신
 */
export const createProfileInputChangeHandler = (setValue: (value: string) => void) => {
  return (event: ChangeEvent<HTMLInputElement>) => {
    setValue(event.target.value);
  };
};

/**
 * 임시저장 정렬 토글 핸들러 생성
 * @description latest/oldest 정렬 값을 토글
 */
export const createDraftSortToggleHandler = (setDraftSortOrder: (updater: (prev: 'latest' | 'oldest') => 'latest' | 'oldest') => void) => {
  return () => {
    setDraftSortOrder(prev => (prev === 'latest' ? 'oldest' : 'latest'));
  };
};
