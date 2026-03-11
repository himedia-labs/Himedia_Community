import styles from '@/app/(routes)/(public)/posts/[postId]/PostDetail.module.css';

import type { PostDetailTocSectionProps } from '@/app/shared/types/post';

/**
 * 게시물 목차 섹션
 * @description 본문 목차 링크 목록을 렌더링합니다.
 */
export default function PostDetailTocSection({ tocItems, handleTocClick }: PostDetailTocSectionProps) {
  return (
    <aside className={styles.toc} aria-label="본문 목차">
      <div className={styles.tocInner}>
        <div className={styles.tocTitle}>목차</div>
        <ul className={styles.tocList}>
          {tocItems.map(item => (
            <li key={item.id} className={styles.tocItem}>
              <a
                href={`#${item.id}`}
                onClick={handleTocClick(item.id)}
                className={`${styles.tocLink} ${item.level === 2 ? styles.tocLevel2 : item.level === 3 ? styles.tocLevel3 : ''}`}
              >
                {item.text}
              </a>
            </li>
          ))}
        </ul>
      </div>
    </aside>
  );
}
