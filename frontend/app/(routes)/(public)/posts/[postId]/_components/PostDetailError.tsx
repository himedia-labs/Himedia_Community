import Link from 'next/link';

import styles from '@/app/(routes)/(public)/posts/[postId]/PostDetail.module.css';

/**
 * 게시글 상세 에러 뷰
 * @description 게시글 조회 실패 시 안내 문구와 이동 링크를 표시
 */
export const PostDetailError = () => {
  return (
    <section className={styles.container} aria-label="게시물 상세">
      <div className={styles.error}>게시물을 불러올 수 없습니다.</div>
      <Link className={styles.backLink} href="/">
        메인으로 돌아가기
      </Link>
    </section>
  );
};
