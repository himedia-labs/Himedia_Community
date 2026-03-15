import type { NoticeReactionItem, NoticeReactionOption } from '@/app/shared/types/notices';

/**
 * 공지 반응 정렬
 * @description 반응 목록을 옵션 순서 기준으로 정렬하고 미등록 이모지는 뒤에 유지합니다.
 */
export function sortNoticeReactions(reactions: NoticeReactionItem[], options: NoticeReactionOption[]) {
  // 순서 기준
  const orderMap = new Map(options.map((option, index) => [option.emoji, index]));

  return reactions
    .map((reaction, index) => ({ index, reaction }))
    .sort((left, right) => {
      const leftOrder = orderMap.get(left.reaction.emoji) ?? Number.MAX_SAFE_INTEGER;
      const rightOrder = orderMap.get(right.reaction.emoji) ?? Number.MAX_SAFE_INTEGER;

      if (leftOrder !== rightOrder) {
        return leftOrder - rightOrder;
      }

      return left.index - right.index;
    })
    .map(({ reaction }) => reaction);
}
