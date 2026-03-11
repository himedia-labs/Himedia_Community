import Skeleton from 'react-loading-skeleton';
import 'react-loading-skeleton/dist/skeleton.css';

import {
  SKELETON_ACCOUNT_ITEM_COUNT,
  SKELETON_COMMENT_LIST_COUNT,
  SKELETON_POST_LIST_COUNT,
} from '@/app/shared/constants/config/mypage.config';

import styles from '@/app/(routes)/(private)/mypage/MyPage.module.css';
import commentStyles from '@/app/shared/components/comment/CommentThread.module.css';
import postListStyles from '@/app/shared/components/post/PostListView.module.css';

import type { MyPagePostListSkeletonProps } from '@/app/shared/types/mypage';

/**
 * 마이페이지 게시글 스켈레톤
 * @description 내 블로그/좋아요 탭의 리스트 로딩 UI를 렌더링
 */
export function MyPagePostListSkeleton({
  label,
  showHeader = true,
  showFilters = true,
}: MyPagePostListSkeletonProps) {
  return (
    <div className={styles.postsMain} aria-hidden="true">
      {showHeader ? (
        <div className={styles.settingsRow}>
          <span className={styles.settingsLabel}>{label}</span>
          {showFilters ? (
            <div className={styles.settingsControlGroup}>
              <span className={styles.filterButton}>
                <Skeleton width={62} height={14} />
              </span>
              <span className={styles.filterButton}>
                <Skeleton width={52} height={14} />
              </span>
              <div className={styles.settingsDivider} />
              <span className={styles.settingsSortButton}>
                <Skeleton width={58} height={14} />
              </span>
            </div>
          ) : (
            <div className={styles.settingsSortGroup}>
              <span className={styles.settingsSortButton}>
              <Skeleton width={58} height={14} />
            </span>
          </div>
        )}
        </div>
      ) : null}
      <ul className={postListStyles.listView}>
        {Array.from({ length: SKELETON_POST_LIST_COUNT }).map((_, index) => (
          <li key={`mypage-post-list-skeleton-${index}`}>
            <article className={postListStyles.listItem}>
              <div className={postListStyles.listBody}>
                <Skeleton width="72%" height={28} />
                <Skeleton count={2} height={15} />
                <div className={postListStyles.listTagList}>
                  <Skeleton width={52} height={24} borderRadius={4} />
                  <Skeleton width={68} height={24} borderRadius={4} />
                  <Skeleton width={56} height={24} borderRadius={4} />
                </div>
                <div className={postListStyles.meta}>
                  <Skeleton width={220} height={12} />
                  <Skeleton width={170} height={12} />
                </div>
              </div>
              <div className={postListStyles.listThumb}>
                <Skeleton width="100%" height="100%" />
              </div>
            </article>
            {index < SKELETON_POST_LIST_COUNT - 1 ? <div className={postListStyles.listDivider} /> : null}
          </li>
        ))}
      </ul>
    </div>
  );
}

/**
 * 마이페이지 댓글 스켈레톤
 * @description 남긴 댓글 탭의 리스트 로딩 UI를 렌더링
 */
export function MyPageCommentsSkeleton() {
  return (
    <div aria-hidden="true">
      <div className={commentStyles.commentList}>
        {Array.from({ length: SKELETON_COMMENT_LIST_COUNT }).map((_, index) => (
          <div key={`mypage-comment-skeleton-${index}`}>
            <div className={commentStyles.commentItem}>
              <div className={commentStyles.commentInner}>
                <div className={commentStyles.commentHeaderRow}>
                  <div className={commentStyles.commentProfile}>
                    <div className={commentStyles.commentAvatarGroup}>
                      <span className={commentStyles.commentAvatar}>
                        <Skeleton circle width={30} height={30} />
                      </span>
                    </div>
                    <div className={commentStyles.commentMeta}>
                      <Skeleton width={220} height={14} />
                      <Skeleton width={110} height={12} />
                    </div>
                  </div>
                </div>
                <div className={commentStyles.commentContent}>
                  <Skeleton count={2} height={14} />
                  <div className={commentStyles.commentFooter}>
                    <Skeleton width={88} height={12} />
                  </div>
                </div>
              </div>
            </div>
            {index < SKELETON_COMMENT_LIST_COUNT - 1 ? <div className={commentStyles.commentDividerLine} /> : null}
          </div>
        ))}
      </div>
    </div>
  );
}

/**
 * 마이페이지 계정설정 스켈레톤
 * @description 계정 설정 탭의 블록 로딩 UI를 렌더링
 */
export function MyPageAccountSkeleton() {
  return (
    <div className={styles.settingsSection} aria-hidden="true">
      <div className={styles.settingsRow}>
        <span className={styles.settingsLabel}>계정 설정</span>
      </div>
      <div className={styles.settingsBlock}>
        <div className={styles.settingsBlockTitle}>기본 정보</div>
        <div className={styles.settingsGroup}>
          {Array.from({ length: SKELETON_ACCOUNT_ITEM_COUNT }).map((_, index) => (
            <div key={`mypage-account-skeleton-${index}`} className={styles.settingsItem}>
              <div className={styles.settingsItemLabel}>
                <Skeleton width={84} height={14} />
              </div>
              <div className={styles.settingsItemValue}>
                <Skeleton width={220} height={18} />
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

/**
 * 마이페이지 프로필 헤더 스켈레톤
 * @description 프로필 헤더 로딩 UI를 렌더링
 */
export function MyPageProfileHeaderSkeleton() {
  return (
    <header className={styles.header} aria-hidden="true">
      <div className={styles.profileCard}>
        <div className={styles.profileMain}>
          <span className={styles.avatar}>
            <Skeleton circle width={62} height={62} />
          </span>
          <div className={styles.profileInfo}>
            <div className={styles.profileNameRow}>
              <Skeleton width={96} height={34} />
              <Skeleton width={86} height={18} />
            </div>
            <div className={styles.profileStatsRow}>
              <Skeleton width={220} height={18} />
            </div>
          </div>
          <div className={styles.profileSide}>
            <div className={styles.profileActions}>
              <Skeleton width={88} height={32} />
            </div>
            <div className={styles.profileSocialRow}>
              {Array.from({ length: 4 }).map((_, index) => (
                <span key={`profile-social-skeleton-${index}`} className={styles.profileSocialLink}>
                  <Skeleton width={16} height={16} />
                </span>
              ))}
            </div>
          </div>
        </div>
      </div>
    </header>
  );
}

/**
 * 마이페이지 소개 스켈레톤
 * @description 내 정보 탭 소개 영역 로딩 UI를 렌더링
 */
export function MyPageIntroSkeleton() {
  return (
    <div className={styles.settingsBody} aria-hidden="true">
      <Skeleton width="100%" height={18} />
      <Skeleton width="92%" height={18} />
      <Skeleton width="78%" height={18} />
    </div>
  );
}

/**
 * 마이페이지 임시저장 스켈레톤
 * @description 임시저장 목록 로딩 UI를 렌더링합니다.
 */
export function MyPageDraftsSkeleton() {
  const listTagSkeletonWidths = [48, 64, 56];

  return (
    <ul className={postListStyles.listView} aria-label="임시저장 로딩">
      {Array.from({ length: SKELETON_POST_LIST_COUNT }).map((_, index) => (
        <li key={`mypage-draft-skeleton-${index}`}>
          <article className={postListStyles.listItem} aria-hidden="true">
            <div className={postListStyles.listBody}>
              <Skeleton height={26} width="70%" />
              <div className={postListStyles.skeletonSummary}>
                <Skeleton count={2} height={16} />
              </div>
              <ul className={postListStyles.listTagList} aria-hidden="true">
                {listTagSkeletonWidths.map(width => (
                  <li key={`mypage-draft-tag-skeleton-${index}-${width}`}>
                    <Skeleton height={24} width={width} borderRadius={4} />
                  </li>
                ))}
              </ul>
              <div className={postListStyles.meta}>
                <div className={postListStyles.metaAuthorDate}>
                  <span className={postListStyles.metaGroup}>
                    <Skeleton width={170} height={12} />
                  </span>
                </div>
                <span className={postListStyles.metaGroup}>
                  <Skeleton width={32} height={12} />
                </span>
              </div>
            </div>
            <Skeleton height={180} width="100%" borderRadius={12} />
          </article>
          {index < SKELETON_POST_LIST_COUNT - 1 ? <div className={postListStyles.listDivider} /> : null}
        </li>
      ))}
    </ul>
  );
}

/**
 * 마이페이지 전체 스켈레톤
 * @description 페이지 로딩 시 전체 레이아웃 스켈레톤 표시
 */
export function MyPageSkeleton() {
  return (
    <section className={styles.container} aria-label="마이페이지">
      <div className={styles.layout}>
        <aside className={styles.leftPanel} aria-hidden="true">
          <nav className={styles.list}>
            <div className={styles.listSection}>
              <span className={styles.listLink}>
                <Skeleton width={60} height={16} />
              </span>
              <div className={styles.listDividerLine} aria-hidden="true" />
              <span className={styles.listGroupTitle}>활동</span>
              <span className={styles.listLink}>
                <Skeleton width={70} height={16} />
              </span>
              <span className={styles.listLink}>
                <Skeleton width={96} height={16} />
              </span>
              <span className={styles.listLink}>
                <Skeleton width={126} height={16} />
              </span>
              <div className={styles.listDividerLine} aria-hidden="true" />
              <span className={styles.listGroupTitle}>반응</span>
              <span className={styles.listLink}>
                <Skeleton width={70} height={16} />
              </span>
              <span className={styles.listLink}>
                <Skeleton width={96} height={16} />
              </span>
              <div className={styles.listDividerLine} aria-hidden="true" />
              <span className={styles.listGroupTitle}>설정</span>
              <span className={styles.listLink}>
                <Skeleton width={70} height={16} />
              </span>
            </div>
          </nav>
        </aside>
        <div className={styles.main}>
          <header className={styles.header} aria-hidden="true">
            <div className={styles.profileCard}>
              <div className={styles.profileMain}>
                <span className={styles.avatar}>
                  <Skeleton circle width={62} height={62} />
                </span>
                <div className={styles.profileInfo}>
                  <div className={styles.profileNameRow}>
                    <Skeleton width={96} height={34} />
                    <Skeleton width={86} height={18} />
                  </div>
                  <div className={styles.profileStatsRow}>
                    <Skeleton width={220} height={18} />
                  </div>
                </div>
                <div className={styles.profileSide}>
                  <div className={styles.profileActions}>
                    <Skeleton width={88} height={32} />
                  </div>
                  <div className={styles.profileSocialRow}>
                    {Array.from({ length: 4 }).map((_, index) => (
                      <span key={`profile-social-skeleton-${index}`} className={styles.profileSocialLink}>
                        <Skeleton width={16} height={16} />
                      </span>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </header>
          <div className={styles.headerDivider} aria-hidden="true" />
          <div aria-hidden="true">
            <MyPageAccountSkeleton />
          </div>
        </div>
      </div>
    </section>
  );
}
