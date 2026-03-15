import type { NoticeReactionButtonHandler, NoticeSelectReaction } from '@/app/shared/types/notices';

/**
 * 반응 선택 핸들러 생성
 * @description 버튼 dataset에서 릴리즈 id와 이모지를 읽어 반응을 추가합니다.
 */
export const createSelectNoticeReactionHandler = (
  selectReaction: NoticeSelectReaction,
): NoticeReactionButtonHandler => {
  return event => {
    const { releaseId, reactionEmoji } = event.currentTarget.dataset;
    if (!releaseId || !reactionEmoji) return;
    selectReaction(releaseId, reactionEmoji);
  };
};
