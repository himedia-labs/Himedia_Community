/**
 * 댓글 멘션 분리
 * @description 댓글 본문을 일반 텍스트와 멘션 토큰으로 분리
 */
export const splitCommentMentions = (value: string) => {
  const result: Array<{ type: 'text' | 'mention'; value: string }> = [];
  const mentionPattern = /(^|\s)@([a-zA-Z0-9._-]+)/g;
  let lastIndex = 0;

  value.replace(mentionPattern, (match, prefix, mention, offset) => {
    const mentionStart = offset + prefix.length;
    if (lastIndex < mentionStart) {
      result.push({ type: 'text', value: value.slice(lastIndex, mentionStart) });
    }
    result.push({ type: 'mention', value: `@${mention}` });
    lastIndex = mentionStart + `@${mention}`.length;
    return match;
  });

  if (lastIndex < value.length) {
    result.push({ type: 'text', value: value.slice(lastIndex) });
  }

  return result;
};
