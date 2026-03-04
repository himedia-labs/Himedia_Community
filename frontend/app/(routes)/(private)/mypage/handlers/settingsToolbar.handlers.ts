/**
 * 굵게 서식 핸들러 생성
 * @description 자기소개 입력의 선택 영역을 굵게 포맷으로 감싼다
 */
export const createHandleBoldClick = (applyInlineWrap: (prefix: string, suffix?: string) => void) => {
  return () => {
    applyInlineWrap('**');
  };
};

/**
 * 기울임 서식 핸들러 생성
 * @description 자기소개 입력의 선택 영역을 기울임 포맷으로 감싼다
 */
export const createHandleItalicClick = (applyInlineWrap: (prefix: string, suffix?: string) => void) => {
  return () => {
    applyInlineWrap('_');
  };
};

/**
 * 밑줄 서식 핸들러 생성
 * @description 자기소개 입력의 선택 영역을 밑줄 태그로 감싼다
 */
export const createHandleUnderlineClick = (applyInlineWrap: (prefix: string, suffix?: string) => void) => {
  return () => {
    applyInlineWrap('<u>', '</u>');
  };
};

/**
 * 취소선 서식 핸들러 생성
 * @description 자기소개 입력의 선택 영역을 취소선 포맷으로 감싼다
 */
export const createHandleStrikeClick = (applyInlineWrap: (prefix: string, suffix?: string) => void) => {
  return () => {
    applyInlineWrap('~~');
  };
};
