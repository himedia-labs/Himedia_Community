/**
 * 공지 반응 이미지 경로 생성
 * @description 문자 이모지를 트위모지 SVG 경로로 변환합니다.
 */
export function getNoticeReactionImageSrc(emoji: string) {
  const unicode = Array.from(emoji)
    .map(character => character.codePointAt(0))
    .filter(codePoint => codePoint && codePoint !== 0xfe0f)
    .map(codePoint => codePoint?.toString(16))
    .join('-');

  return `https://cdn.jsdelivr.net/gh/jdecked/twemoji@15.1.0/assets/svg/${unicode}.svg`;
}
