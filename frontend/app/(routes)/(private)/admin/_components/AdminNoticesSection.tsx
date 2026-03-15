import NoticesAnnouncementsSection from '@/app/(routes)/(public)/notices/_components/NoticesAnnouncementsSection';
import NoticesUpdatesSection from '@/app/(routes)/(public)/notices/_components/NoticesUpdatesSection';
import { ADMIN_MENU_LABELS } from '@/app/shared/constants/config/admin.config';
import styles from '@/app/(routes)/(private)/admin/AdminPage.module.css';

import type { AdminNoticesSectionProps } from '@/app/shared/types/admin';

/**
 * 공지 관리 섹션
 * @description 관리자 화면에서도 공용 공지 리스트 UI를 그대로 재사용합니다.
 */
export default function AdminNoticesSection({ noticesData, selectedMenu }: AdminNoticesSectionProps) {
  // 목록 상태
  const isAnnouncementsMenu = selectedMenu === ADMIN_MENU_LABELS.NOTICE_ANNOUNCEMENTS;
  const announcements = noticesData?.announcements ?? [];
  const updates = noticesData?.updates ?? [];

  return (
    <section className={styles.noticeListSection}>
      {isAnnouncementsMenu ? (
        <NoticesAnnouncementsSection notices={announcements} />
      ) : (
        <NoticesUpdatesSection releases={updates} />
      )}
    </section>
  );
}
