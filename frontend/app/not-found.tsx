import Link from 'next/link';

import styles from '@/app/not-found.module.css';

/**
 * 404 페이지
 * @description 존재하지 않는 경로 접근 시 표시
 */
export default function NotFound() {
  return (
    <div className={styles.container}>
      <span className={styles.code}>404 Error</span>
      <p className={styles.message}>
        요청하신 페이지를 찾을 수 없습니다.
        <br />
        입력하신 주소가 정확한지 다시 한번 확인해주세요.
      </p>
      <Link href="/" className={styles.link}>
        이전 페이지로 돌아가기
      </Link>
    </div>
  );
}
