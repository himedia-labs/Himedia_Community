import type { MouseEvent } from 'react';

/**
 * 드롭다운 아이템 선택 핸들러 생성
 * @description 버튼 데이터의 항목 id를 읽어 상위 선택 핸들러를 호출
 */
export const createHandleFilterItemSelect = (onSelect: (itemId: string) => void) => {
  return (event: MouseEvent<HTMLButtonElement>) => {
    const { itemId } = event.currentTarget.dataset;
    if (!itemId) return;
    onSelect(itemId);
  };
};
