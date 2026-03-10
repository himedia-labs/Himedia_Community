'use client';

import { Fragment, useMemo } from 'react';

import Image from 'next/image';
import Link from 'next/link';
import { useMutation, useQueryClient } from '@tanstack/react-query';

import { CiCalendar } from 'react-icons/ci';
import { FiArrowDown, FiArrowUp } from 'react-icons/fi';

import { MyPageDraftsSkeleton } from '@/app/(routes)/(private)/mypage/MyPage.skeleton';
import {
  createHandleDeleteDraft,
  createHandleDeleteDraftClick,
} from '@/app/(routes)/(private)/mypage/_handlers';
import { postsApi } from '@/app/api/posts/posts.api';
import { useDraftsQuery } from '@/app/api/posts/posts.queries';

import EmptyState from '@/app/shared/components/empty/EmptyState';
import ListPostTagList from '@/app/shared/components/post/ListPostTagList';
import { useToast } from '@/app/shared/components/toast/toast';

import { useAuthStore } from '@/app/shared/store/authStore';
import { invalidateQueryTargets } from '@/app/shared/lib/query/queryCache.utils';
import { formatDate } from '@/app/shared/utils/date';
import { formatPostPreview } from '@/app/shared/utils/post';

import sectionStyles from '@/app/(routes)/(private)/mypage/MyPage.module.css';
import postListStyles from '@/app/shared/components/post/PostListView.module.css';
import styles from '@/app/(routes)/(private)/mypage/_components/MyPageDraftsSection.module.css';

import type { DraftSortOrder } from '@/app/shared/types/mypage';
import type { PostListItem } from '@/app/shared/types/post';

/**
 * 활동 임시저장 섹션
 * @description 임시저장 목록과 정렬 버튼을 렌더링한다
 */
export default function MyPageDraftsSection({
  draftSortOrder,
  handleDraftSortToggle,
}: {
  draftSortOrder: DraftSortOrder;
  handleDraftSortToggle: () => void;
}) {
  // 상태
  const { accessToken } = useAuthStore();
  const { showToast } = useToast();
  const queryClient = useQueryClient();

  // 데이터 조회
  const { data, isLoading } = useDraftsQuery(undefined, { enabled: !!accessToken });
  const { mutateAsync: deleteDraft, isPending: isDeletingDraft } = useMutation({
    mutationFn: (postId: string) => postsApi.deletePost(postId),
  });
  const drafts = useMemo<PostListItem[]>(() => data?.items ?? [], [data?.items]);
  const sortedDrafts = useMemo(() => {
    const nextDrafts = [...drafts];
    nextDrafts.sort((a, b) => {
      const aTime = new Date(a.updatedAt || a.createdAt || '').getTime() || 0;
      const bTime = new Date(b.updatedAt || b.createdAt || '').getTime() || 0;
      return draftSortOrder === 'latest' ? bTime - aTime : aTime - bTime;
    });
    return nextDrafts;
  }, [draftSortOrder, drafts]);

  const handleDeleteDraft = createHandleDeleteDraft({
    deleteDraft,
    showToast,
    invalidateDrafts: queryKey => invalidateQueryTargets(queryClient, [{ queryKey, exact: false }]),
  });
  const handleDeleteDraftClick = createHandleDeleteDraftClick(handleDeleteDraft);

  return (
    <section className={sectionStyles.activitySection}>
      <div className={sectionStyles.settingsRow}>
        <span className={sectionStyles.settingsLabel}>임시저장 목록</span>
        <div className={sectionStyles.settingsSortGroup}>
          <button
            type="button"
            className={`${sectionStyles.settingsSortButton} ${sectionStyles.settingsSortButtonActive}`}
            onClick={handleDraftSortToggle}
          >
            {draftSortOrder === 'latest' ? (
              <>
                <FiArrowDown className={sectionStyles.settingsSortIcon} aria-hidden="true" />
                최근 저장순
              </>
            ) : (
              <>
                <FiArrowUp className={sectionStyles.settingsSortIcon} aria-hidden="true" />
                오래된 저장순
              </>
            )}
          </button>
        </div>
      </div>
      {isLoading ? (
        <MyPageDraftsSkeleton />
      ) : !drafts.length ? (
        <EmptyState title="임시저장된 게시물이 없습니다." description="임시저장한 글이 생기면 이곳에 표시됩니다." />
      ) : (
        <ul className={postListStyles.listView}>
          {sortedDrafts.map((draft, index) => {
            const hasThumbnail = Boolean(draft.thumbnailUrl);
            const displayTags = (draft.tags ?? []).slice(0, 5).map(tag => `#${tag.name}`);
            const hasListTags = displayTags.length > 0;
            const summary = formatPostPreview(draft.content, { emptyText: '내용 없음' });

            return (
              <Fragment key={draft.id}>
                <li>
                  <Link className={postListStyles.postLink} href={`/posts/drafts/${draft.id}`}>
                    <article
                      className={
                        hasThumbnail
                          ? postListStyles.listItem
                          : `${postListStyles.listItem} ${postListStyles.listItemNoThumb}`
                      }
                    >
                      <div className={postListStyles.listBody}>
                        <h3 className={postListStyles.listTitle}>{draft.title || '제목 없음'}</h3>
                        <p className={hasListTags ? postListStyles.listSummaryWithTags : postListStyles.listSummary}>
                          {summary}
                        </p>
                        {hasListTags ? <ListPostTagList postId={draft.id} tags={displayTags} /> : null}
                        <div className={styles.draftMeta}>
                          <div className={postListStyles.metaAuthorDate}>
                            <span className={postListStyles.metaGroup}>
                              <span className={postListStyles.metaItem}>
                                <CiCalendar aria-hidden="true" />
                                {formatDate(draft.updatedAt ?? draft.createdAt)}
                              </span>
                            </span>
                          </div>
                          <span className={postListStyles.metaGroup}>
                            <button
                              type="button"
                              className={styles.deleteLinkButton}
                              disabled={isDeletingDraft}
                              data-post-id={draft.id}
                              onClick={handleDeleteDraftClick}
                            >
                              삭제
                            </button>
                          </span>
                        </div>
                      </div>
                      {hasThumbnail ? (
                        <div className={postListStyles.listThumb} aria-hidden="true">
                          <Image
                            className={postListStyles.listThumbImage}
                            src={draft.thumbnailUrl ?? ''}
                            alt=""
                            width={1000}
                            height={700}
                            unoptimized
                          />
                        </div>
                      ) : null}
                    </article>
                  </Link>
                </li>
                {index < sortedDrafts.length - 1 ? (
                  <li className={postListStyles.listDividerItem} aria-hidden="true">
                    <div className={postListStyles.listDivider} />
                  </li>
                ) : null}
              </Fragment>
            );
          })}
        </ul>
      )}
    </section>
  );
}
