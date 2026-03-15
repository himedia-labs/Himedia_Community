import type { NoticeReactionButtonHandler, NoticeToggleReactionMenu } from '@/app/shared/types/notices';

/**
 * 반응 메뉴 토글 핸들러 생성
 * @description 버튼 dataset에서 릴리즈 id를 읽어 반응 메뉴를 토글합니다.
 */
export const createToggleNoticeReactionMenuHandler = (
  toggleReactionMenu: NoticeToggleReactionMenu,
): NoticeReactionButtonHandler => {
  return event => {
    const { releaseId } = event.currentTarget.dataset;
    if (!releaseId) return;
    toggleReactionMenu(releaseId);
  };
};
