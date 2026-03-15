'use client';

import { useState } from 'react';

import Link from 'next/link';
import { useParams, useRouter } from 'next/navigation';

import { FiEdit2, FiMoreHorizontal, FiTrash2 } from 'react-icons/fi';

import { useCurrentUserQuery } from '@/app/api/auth/auth.queries';
import { useDeleteNoticeMutation } from '@/app/api/notices/notices.mutations';
import { useNoticeDetailQuery } from '@/app/api/notices/notices.queries';
import { renderMarkdownPreview } from '@/app/shared/utils/markdown';
import EmptyState from '@/app/shared/components/empty/EmptyState';
import { useToast } from '@/app/shared/components/toast/toast';

import markdownStyles from '@/app/shared/components/markdown-editor/markdown.module.css';
import styles from '@/app/(routes)/(public)/notices/NoticeDetailPage.module.css';

/**
 * 공지사항 상세 페이지
 * @description 공지 상세 데이터를 조회하여 렌더링합니다.
 */
export default function NoticeDetailPage() {
  const params = useParams();
  const router = useRouter();
  const noticeId = typeof params?.noticeId === 'string' ? params.noticeId : '';

  const { data: notice, isLoading, isError } = useNoticeDetailQuery(noticeId);
  const { data: currentUser } = useCurrentUserQuery();
  const { mutate: deleteNotice, isPending: isDeleting } = useDeleteNoticeMutation();
  const { showToast } = useToast();

  const isAdmin = currentUser?.role === 'ADMIN';
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const handleDelete = () => {
    if (isDeleting) return;

    const confirmed = window.confirm('이 공지사항을 삭제하시겠습니까?');
    if (!confirmed) return;

    setIsMenuOpen(false);
    deleteNotice(noticeId, {
      onSuccess: () => {
        showToast({ message: '공지사항이 삭제되었습니다.', type: 'success' });
        router.push('/notices');
      },
      onError: () => showToast({ message: '삭제에 실패했습니다.', type: 'error' }),
    });
  };

  if (isLoading) {
    return null;
  }

  if (isError || !notice) {
    return (
      <main className={styles.page}>
        <EmptyState title="공지사항을 찾을 수 없습니다." description="존재하지 않거나 삭제된 공지사항입니다." />
      </main>
    );
  }

  return (
    <main className={styles.page}>
      <article className={styles.article}>
        <div className={styles.headerGroup}>
          <div className={styles.actions}>
            <Link href="/notices" className={styles.backButton}>
              목록으로 돌아가기
            </Link>
          </div>
          <header className={styles.header}>
            <div className={styles.titleRow}>
              <h1 className={styles.title}>{notice.title}</h1>
              {isAdmin ? (
                <div className={styles.moreWrapper}>
                  <button
                    type="button"
                    className={styles.moreButton}
                    aria-label="공지 옵션"
                    onClick={() => setIsMenuOpen(prev => !prev)}
                  >
                    <FiMoreHorizontal aria-hidden="true" />
                  </button>
                  {isMenuOpen ? (
                    <div className={styles.moreMenu} role="menu">
                      <button
                        type="button"
                        className={styles.moreItem}
                        role="menuitem"
                        onClick={() => {
                          setIsMenuOpen(false);
                          router.push(`/admin/notices/edit/${noticeId}`);
                        }}
                      >
                        <FiEdit2 aria-hidden="true" />
                        수정
                      </button>
                      <button
                        type="button"
                        className={`${styles.moreItem} ${styles.moreItemDanger}`}
                        role="menuitem"
                        disabled={isDeleting}
                        onClick={handleDelete}
                      >
                        <FiTrash2 aria-hidden="true" />
                        삭제
                      </button>
                    </div>
                  ) : null}
                </div>
              ) : null}
            </div>
            <p className={styles.date}>{notice.publishedAt}</p>
          </header>
        </div>
        <section className={`${markdownStyles.markdown} ${styles.body}`}>
          {renderMarkdownPreview(notice.markdownContent ?? '')}
        </section>
      </article>
    </main>
  );
}
