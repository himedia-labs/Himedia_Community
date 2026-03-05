import Link from 'next/link';

import { renderMarkdownPreview } from '@/app/shared/utils/markdown';
import styles from '@/app/(routes)/(public)/docs/_components/docsPageTemplate.module.css';

import type { PolicyDocument } from '@/app/shared/types/docs';

/**
 * 정책 문서 템플릿
 * @description 정책 페이지 공통 레이아웃을 렌더링한다
 */
export default function DocsPageTemplate({ document }: { document: PolicyDocument }) {
  const termsTabClassName =
    document.type === 'terms' ? `${styles.tabButton} ${styles.tabButtonActive}` : styles.tabButton;
  const privacyTabClassName =
    document.type === 'privacy' ? `${styles.tabButton} ${styles.tabButtonActive}` : styles.tabButton;

  return (
    <main className={styles.page}>
      <article className={styles.article}>
        <nav className={styles.tabs} aria-label="문서 탭">
          <Link className={termsTabClassName} href="/docs/terms">
            이용약관
          </Link>
          <Link className={privacyTabClassName} href="/docs/privacy">
            개인정보처리방침
          </Link>
        </nav>
        <header className={styles.header}>
          <div className={styles.titleRow}>
            <h1 className={styles.title}>{document.title}</h1>
          </div>
          <p className={styles.meta}>개정이력: {document.revisionHistory}</p>
        </header>
        <section className={styles.markdownBody}>{renderMarkdownPreview(document.markdownContent)}</section>
      </article>
    </main>
  );
}
