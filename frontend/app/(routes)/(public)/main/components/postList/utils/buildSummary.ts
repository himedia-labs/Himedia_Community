type BuildSummaryOptions = {
  maxLength?: number;
  previewLength?: number;
};

/**
 * 요약 생성
 * @description 마크다운/HTML 제거 후 요약 텍스트 생성
 */
export const buildSummary = (content?: string, options?: BuildSummaryOptions) => {
  const maxLength = options?.maxLength ?? 154;
  const previewLength = options?.previewLength ?? 134;
  if (!content) return '';
  const trimmed = content.trim();
  if (!trimmed) return '';
  const withoutCodeBlocks = trimmed
    .replace(/```[\s\S]*?```/g, ' ')
    .replace(/~~~[\s\S]*?~~~/g, ' ')
    .replace(/(```|~~~)[^\n]*\n?/g, ' ');
  const withoutInlineCode = withoutCodeBlocks.replace(/`([^`]+)`/g, '$1');
  const withoutImages = withoutInlineCode.replace(/!\[([^\]]*)\]\(([^)]+)\)/g, '$1');
  const withoutLinks = withoutImages.replace(/\[([^\]]+)\]\(([^)]+)\)/g, '$1');
  const withoutHtml = withoutLinks.replace(/<[^>]+>/g, ' ');
  const withoutDecorators = withoutHtml
    .replace(/^>\s+/gm, '')
    .replace(/^#{1,6}\s+/gm, '')
    .replace(/^[-*+]\s+/gm, '')
    .replace(/^\d+\.\s+/gm, '')
    .replace(/(\*\*|__|~~|_)/g, '');
  const withoutBackticks = withoutDecorators.replace(/`+/g, ' ');
  const plainText = withoutBackticks.replace(/\s+/g, ' ').trim();
  if (!plainText) return '';
  return plainText.length > maxLength ? `${plainText.slice(0, previewLength).trimEnd()} ...` : plainText;
};
