import type { MouseEvent } from 'react';

// TOC 클릭 (목차)
export const createTocClickHandler = () => (id: string) => (event: MouseEvent<HTMLAnchorElement>) => {
  event.preventDefault();
  const target = document.getElementById(id);
  if (!target) return;
  target.scrollIntoView({ behavior: 'smooth', block: 'start' });
  window.history.replaceState(null, '', `#${id}`);
};
