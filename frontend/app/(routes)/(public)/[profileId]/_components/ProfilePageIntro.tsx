import postListStyles from '@/app/shared/components/post/PostListView.module.css';

import layoutStyles from '@/app/(routes)/(public)/[profileId]/ProfilePageLayout.module.css';
import markdownStyles from '@/app/shared/components/markdown-editor/markdown.module.css';

import type { ProfilePageIntroProps } from '@/app/shared/types/profilePage';

/**
 * 프로필 소개 섹션
 * @description 소개 본문 또는 소개 없음 상태를 렌더링합니다.
 */
export default function ProfilePageIntro({ bioPreview, profileBio }: ProfilePageIntroProps) {
  return (
    <section className={layoutStyles.settingsSection} aria-label="소개">
      <div className={layoutStyles.settingsRow}>
        <span className={layoutStyles.settingsLabel}>소개</span>
      </div>
      <div className={layoutStyles.settingsBody}>
        {profileBio ? (
          <div className={markdownStyles.markdown}>{bioPreview}</div>
        ) : (
          <div className={postListStyles.emptyState}>
            <p className={postListStyles.emptyTitle}>아직 소개가 없어요</p>
            <p className={postListStyles.emptyDescription}>첫 소개가 등록되면 여기에 보여드릴게요.</p>
          </div>
        )}
      </div>
    </section>
  );
}
