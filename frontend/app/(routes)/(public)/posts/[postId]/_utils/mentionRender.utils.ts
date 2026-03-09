import { splitCommentMentions } from '@/app/shared/utils/comment';

// HTML 이스케이프
const escapeHtml = (value: string) =>
  value.replace(/[&<>"']/g, match => {
    const escapeMap: Record<string, string> = {
      '&': '&amp;',
      '<': '&lt;',
      '>': '&gt;',
      '"': '&quot;',
      "'": '&#39;',
    };

    return escapeMap[match] ?? match;
  });

/**
 * 멘션 HTML 변환
 * @description 멘션 강조용 HTML을 생성
 */
export const renderMentionHtml = (
  value: string,
  mentionClass: string,
  allowList?: Set<string>,
  preserveSpaces = false,
) =>
  splitCommentMentions(value)
    .map(part => {
      const escaped = escapeHtml(part.value).replace(/\n/g, '<br>');
      const normalized = preserveSpaces ? escaped.replace(/ /g, '&nbsp;') : escaped;

      if (part.type === 'mention') {
        if (!allowList || allowList.has(part.value)) {
          return `<span class="${mentionClass}">${normalized}</span>`;
        }
        return normalized;
      }

      return normalized;
    })
    .join('');
