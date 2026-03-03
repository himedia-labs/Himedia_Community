'use client';

import { Fragment, useMemo } from 'react';

import Image from 'next/image';
import Link from 'next/link';
import { useMutation, useQueryClient } from '@tanstack/react-query';

import { CiCalendar } from 'react-icons/ci';
import Skeleton from 'react-loading-skeleton';

import { postsApi } from '@/app/api/posts/posts.api';
import { postsKeys } from '@/app/api/posts/posts.keys';
import { useDraftsQuery } from '@/app/api/posts/posts.queries';
import EmptyState from '@/app/shared/components/empty/EmptyState';
import { useToast } from '@/app/shared/components/toast/toast';
import { useAuthStore } from '@/app/shared/store/authStore';
import { formatPostPreview } from '@/app/shared/utils/formatPostPreview.utils';

import ListPostTagList from '@/app/(routes)/(public)/main/components/postList/components/ListPostTagList';

import 'react-loading-skeleton/dist/skeleton.css';
import postListStyles from '@/app/(routes)/(public)/main/components/postList/postList.module.css';
import styles from '@/app/(routes)/(private)/mypage/components/MyPageDrafts.module.css';

import type { MouseEvent } from 'react';
import type { PostListItem } from '@/app/shared/types/post';

type MyPageDraftsProps = {
  sortOrder: 'latest' | 'oldest';
};

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
  const listTagSkeletonWidths = [48, 64, 56];
  const sortedDrafts = useMemo(() => {
    const nextDrafts = [...drafts];
    nextDrafts.sort((a, b) => {
      const aTime = new Date(a.updatedAt || a.createdAt || '').getTime() || 0;
      const bTime = new Date(b.updatedAt || b.createdAt || '').getTime() || 0;
      return sortOrder === 'latest' ? bTime - aTime : aTime - bTime;
    });
    return nextDrafts;
  }, [drafts, sortOrder]);

  // 날짜 포맷
  const formatDraftDate = (updatedAt?: string | null, createdAt?: string | null) => {
    const source = updatedAt || createdAt || '';
    const date = new Date(source);
    if (Number.isNaN(date.getTime())) return '-';
    return date.toLocaleString('ko-KR', {
      year: 'numeric',
      month: '2-digit',
      day: '2-digit',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  // 삭제 처리
  const handleDeleteDraft = async (event: MouseEvent<HTMLButtonElement>, postId: string) => {
    event.preventDefault();
    event.stopPropagation();

    const confirmed = window.confirm('임시저장을 삭제할까요?');
    if (!confirmed) return;

    await deleteDraft(postId);
    await queryClient.invalidateQueries({ queryKey: postsKeys.drafts(), exact: false });
    showToast({ message: '임시저장을 삭제했습니다.', type: 'success' });
  };

  if (isLoading) {
    return (
      <ul className={postListStyles.listView} aria-label="임시저장 로딩">
        {Array.from({ length: 5 }).map((_, index) => (
          <Fragment key={`draft-skeleton-${index}`}>
            <li>
              <article className={postListStyles.listItem} aria-hidden="true">
                <div className={postListStyles.listBody}>
                  <Skeleton height={26} width="70%" />
                  <div className={postListStyles.skeletonSummary}>
                    <Skeleton count={2} height={16} />
                  </div>
                  <ul className={postListStyles.listTagList} aria-hidden="true">
                    {listTagSkeletonWidths.map(width => (
                      <li key={`draft-tag-skeleton-${index}-${width}`}>
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
            </li>
            {index < 4 ? (
              <li className={postListStyles.listDividerItem} aria-hidden="true">
                <div className={postListStyles.listDivider} />
              </li>
            ) : null}
          </Fragment>
        ))}
      </ul>
    );
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
              <Link className={postListStyles.postLink} href={`/posts/draftId?${draft.id}`}>
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
                            {formatDraftDate(draft.updatedAt, draft.createdAt)}
                          </span>
                        </span>
                      </div>
                      <span className={postListStyles.metaGroup}>
                        <button
                          type="button"
                          className={styles.deleteLinkButton}
                          disabled={isDeletingDraft}
                          onClick={event => void handleDeleteDraft(event, draft.id)}
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
