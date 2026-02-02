'use client';

import { usePathVisibility } from '@/app/shared/hooks/usePathVisibility';
import { LayoutVisibilityConfig } from '@/app/shared/constants/config/layout.config';

import styles from './Footer.module.css';

/**
 * 공통 푸터
 * @description 서비스 하단 정보를 표시
 */
export default function Footer() {
  const isVisible = usePathVisibility(LayoutVisibilityConfig);
  if (!isVisible) return null;

  return (
    <footer className={styles.container}>
      <div className={styles.wrap}>
        <p className={styles.copyright}>© {new Date().getFullYear()} Himedia. All rights reserved.</p>
      </div>
    </footer>
  );
}
