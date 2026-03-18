/**
 * 블로그 글 클릭 핸들러 생성
 * @description data-entry-id 속성에서 ID를 읽어 조회수 증가
 */
export const createHandleEntryClick = (incrementViews: (id: string) => void) => {
  return (e: React.MouseEvent<HTMLUListElement>) => {
    const link = (e.target as HTMLElement).closest<HTMLAnchorElement>('[data-entry-id]');
    if (!link) return;
    const entryId = link.dataset.entryId;
    if (entryId) incrementViews(entryId);
  };
};
