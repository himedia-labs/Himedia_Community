import styles from '@/app/(routes)/(public)/[profileId]/ProfilePage.module.css';

import type { ProfilePageEmptyStateProps } from '@/app/shared/types/profilePage';

/**
 * 프로필 빈 상태
 * @description 프로필 조회 실패 메시지를 렌더링합니다.
 */
export default function ProfilePageEmptyState({ message }: ProfilePageEmptyStateProps) {
  return (
    <section className={styles.container} aria-label="프로필">
      <div className={styles.empty}>{message}</div>
    </section>
  );
}
