import { useEffect, useState } from 'react';

/**
 * 스크롤 진행률
 * @description 현재 스크롤 비율을 계산
 */
export const useScrollProgress = (isEnabled: boolean) => {
  const [scrollProgress, setScrollProgress] = useState(0);

  useEffect(() => {
    if (!isEnabled) return;

    let frameId = 0;
    const updateProgress = () => {
      const { scrollHeight } = document.documentElement;
      const maxScroll = scrollHeight - window.innerHeight;
      const next = maxScroll > 0 ? (window.scrollY / maxScroll) * 100 : 0;
      setScrollProgress(Math.min(100, Math.max(0, next)));
    };

    const handleScroll = () => {
      if (frameId) return;
      frameId = window.requestAnimationFrame(() => {
        frameId = 0;
        updateProgress();
      });
    };

    handleScroll();
    window.addEventListener('scroll', handleScroll, { passive: true });
    window.addEventListener('resize', handleScroll);

    return () => {
      if (frameId) window.cancelAnimationFrame(frameId);
      window.removeEventListener('scroll', handleScroll);
      window.removeEventListener('resize', handleScroll);
    };
  }, [isEnabled]);

  return scrollProgress;
};
