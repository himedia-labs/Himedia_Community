import MyPageCommentsSection from '@/app/(routes)/(private)/mypage/_components/features/sections/MyPageCommentsSection';
import MyPageDraftsSection from '@/app/(routes)/(private)/mypage/_components/features/sections/MyPageDraftsSection';
import MyPageLikesSection from '@/app/(routes)/(private)/mypage/_components/features/sections/MyPageLikesSection';
import MyPagePostsSection from '@/app/(routes)/(private)/mypage/_components/features/sections/MyPagePostsSection';
import MyPageRecentSection from '@/app/(routes)/(private)/mypage/_components/features/sections/MyPageRecentSection';

import styles from '@/app/(routes)/(private)/mypage/MyPage.module.css';

import type { MyPageActivityTabProps } from '@/app/shared/types/mypage';

/**
 * 활동 탭
 * @description 활동 하위 섹션들을 조합해 하나의 탭으로 렌더링한다
 */
export default function MyPageActivityTab(props: MyPageActivityTabProps) {
  return (
    <>
      <MyPagePostsSection {...props} />
      <div className={styles.activityDivider} aria-hidden="true" />
      <MyPageDraftsSection draftSortOrder={props.draftSortOrder} handleDraftSortToggle={props.handleDraftSortToggle} />
      <div className={styles.activityDivider} aria-hidden="true" />
      <MyPageCommentsSection {...props} />
      <div className={styles.activityDivider} aria-hidden="true" />
      <MyPageLikesSection {...props} />
      <div className={styles.activityDivider} aria-hidden="true" />
      <MyPageRecentSection {...props} />
    </>
  );
}
