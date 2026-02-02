'use client';

import { usePathname } from 'next/navigation';

import { SlArrowUp } from 'react-icons/sl';

import { useScroll } from '@/app/shared/hooks/useScroll';
import { ScrollTopButtonConfig } from '@/app/shared/constants/config/scrollTopButton.config';

import styles from './ScrollTopButton.module.css';

/**
 * 스크롤 탑 버튼
 * @description 상단 이동 버튼을 표시
 */
export default function ScrollTopButton() {
  const isVisible = useScroll();
  const pathname = usePathname();

  if (ScrollTopButtonConfig.hidePaths.includes(pathname)) {
    return null;
  }

  const isHome = pathname === '/';
  const handleClick = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const positionClass = isHome ? styles.homePosition : styles.innerPosition;

  return (
    <button
      type="button"
      className={`${styles.scrollButton} ${positionClass} ${isVisible ? styles.visible : ''}`}
      onClick={handleClick}
      aria-label="상단으로 이동"
    >
      <SlArrowUp aria-hidden />
    </button>
  );
}
