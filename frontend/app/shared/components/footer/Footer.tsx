'use client';

import { usePathname } from 'next/navigation';
import { FooterConfig } from './Footer.config';
import styles from './Footer.module.css';

export default function Footer() {
  const pathname = usePathname();

  // 특정 경로에서는 Footer 숨김
  if (FooterConfig.hidePaths.includes(pathname)) {
    return null;
  }

  return (
    <footer className={styles.container}>
      <div className={styles.wrap}>
        <div className={styles.footer_bottom}>
          <p className={styles.copyright}>© {new Date().getFullYear()} Himedia. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
}
