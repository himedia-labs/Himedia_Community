/**
 * 인라인 마크다운 제거
 * @description 마크다운 서식을 제거하고 순수 텍스트 반환
 */
export const stripInlineMarkdown = (value: string) =>
  value
    .replace(/!\[([^\]]*)]\([^)]+\)/g, '$1')
    .replace(/\[([^\]]+)\]\([^)]+\)/g, '$1')
    .replace(/`([^`]+)`/g, '$1')
    .replace(/\*\*([^*]+)\*\*/g, '$1')
    .replace(/~~([^~]+)~~/g, '$1')
    .replace(/<u>(.*?)<\/u>/g, '$1')
    .replace(/_([^_]+)_/g, '$1')
    .replace(/\*([^*]+)\*/g, '$1')
    .trim();

/**
 * 링크 주소 정규화
 * @description 안전한 스킴만 허용해 링크 주소를 보정
 */
export const normalizeHref = (href: string) => {
  const safeHrefFallback = '#';
  const allowedProtocols = new Set(['http:', 'https:', 'mailto:', 'tel:']);
  const trimmedHref = href.trim();

  if (!trimmedHref) return safeHrefFallback;
  if (trimmedHref.startsWith('#') || trimmedHref.startsWith('/')) return trimmedHref;
  if (trimmedHref.startsWith('//')) return `https:${trimmedHref}`;

  const hasProtocol = /^[a-z][a-z0-9+.-]*:/i.test(trimmedHref);
  if (!hasProtocol) return `https://${trimmedHref}`;

  try {
    const parsedUrl = new URL(trimmedHref);
    return allowedProtocols.has(parsedUrl.protocol) ? trimmedHref : safeHrefFallback;
  } catch {
    return safeHrefFallback;
  }
};

/**
 * 자동 링크 뒤 문장부호 분리
 * @description URL 뒤에 붙은 문장부호를 분리
 */
export const splitTrailingPunctuation = (value: string) => {
  let href = value;
  let trailing = '';
  while (/[),.!?:;]$/.test(href)) {
    trailing = href.slice(-1) + trailing;
    href = href.slice(0, -1);
  }
  return { href, trailing };
};

/**
 * 제목 ID 생성 팩토리
 * @description 중복 방지 제목 ID 생성기 반환
 */
export const createHeadingIdFactory = () => {
  const used = new Map<string, number>();
  let sequence = 0;

  return (value: string) => {
    sequence += 1;
    const baseValue = value
      .toLowerCase()
      .replace(/\s+/g, '-')
      .replace(/[^a-z0-9\u3131-\u318E\uAC00-\uD7A3-]/g, '');
    const base = baseValue || `section-${sequence}`;
    const count = used.get(base) ?? 0;
    used.set(base, count + 1);
    if (count === 0) return base;
    return `${base}-${count + 1}`;
  };
};
