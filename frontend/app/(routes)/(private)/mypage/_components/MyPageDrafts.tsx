'use client';

import { Fragment, useMemo } from 'react';

import Image from 'next/image';
import Link from 'next/link';
import { useMutation, useQueryClient } from '@tanstack/react-query';

import { CiCalendar } from 'react-icons/ci';

import { MyPageDraftsSkeleton } from '@/app/(routes)/(private)/mypage/MyPage.skeleton';

import { postsApi } from '@/app/api/posts/posts.api';
import { useDraftsQuery } from '@/app/api/posts/posts.queries';

import EmptyState from '@/app/shared/components/empty/EmptyState';
import ListPostTagList from '@/app/shared/components/post/ListPostTagList';
import { useToast } from '@/app/shared/components/toast/toast';
import {
  createHandleDeleteDraft,
  createHandleDeleteDraftClick,
} from '@/app/(routes)/(private)/mypage/_handlers';

import { useAuthStore } from '@/app/shared/store/authStore';
import { formatDate } from '@/app/shared/utils/date';
import { formatPostPreview } from '@/app/shared/utils/post';
import { invalidateQueryTargets } from '@/app/shared/lib/query/queryCache.utils';

import postListStyles from '@/app/shared/components/post/PostListView.module.css';
import styles from '@/app/(routes)/(private)/mypage/_components/MyPageDrafts.module.css';

import type { MyPageDraftsProps } from '@/app/shared/types/mypage';
import type { PostListItem } from '@/app/shared/types/post';

/**
 * 마이페이지 임시저장 목록
 * @description 임시저장 게시물을 postList 스타일로 표시
 */
export default function MyPageDrafts({ sortOrder }: MyPageDraftsProps) {
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
      return sortOrder === 'latest' ? bTime - aTime : aTime - bTime;
    });
    return nextDrafts;
  }, [drafts, sortOrder]);

  const handleDeleteDraft = createHandleDeleteDraft({
    deleteDraft,
    showToast,
    invalidateDrafts: queryKey => invalidateQueryTargets(queryClient, [{ queryKey, exact: false }]),
  });
  const handleDeleteDraftClick = createHandleDeleteDraftClick(handleDeleteDraft);

  if (isLoading) {
    return <MyPageDraftsSkeleton />;
  }

  if (!drafts.length) {
    return <EmptyState title="임시저장된 게시물이 없습니다." description="임시저장한 글이 생기면 이곳에 표시됩니다." />;
  }

  return (
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
  );
}
