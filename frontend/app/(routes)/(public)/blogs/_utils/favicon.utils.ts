/**
 * 파비콘 에러 이벤트 위임 핸들러
 * @description 컨테이너 레벨에서 파비콘 로드 실패를 캡처해 메인 도메인 fallback 처리
 */
export const handleFaviconError = (e: React.SyntheticEvent<HTMLElement>) => {
  const target = e.target as HTMLImageElement;
  if (target.tagName !== 'IMG') return;

  const domain = target.dataset.domain;
  if (!domain) return;

  const mainDomain = domain.split('.').slice(-2).join('.');

  if (!target.src.includes(mainDomain + '&')) {
    target.src = `https://www.google.com/s2/favicons?domain=${mainDomain}&sz=32`;
  } else {
    target.style.display = 'none';
  }
};
