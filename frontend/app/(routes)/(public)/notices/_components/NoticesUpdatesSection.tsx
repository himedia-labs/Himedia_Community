'use client';

import Image from 'next/image';

import NumberFlow from '@number-flow/react';
import { FiBox, FiGrid, FiSmile, FiTag } from 'react-icons/fi';

import {
  createSelectNoticeReactionHandler,
  createToggleNoticeReactionMenuHandler,
} from '@/app/(routes)/(public)/notices/_handlers';
import { useNoticeReactions } from '@/app/(routes)/(public)/notices/_hooks/useNoticeReactions';
import { formatNoticePublishedDate, getNoticeReactionImageSrc } from '@/app/(routes)/(public)/notices/_utils';
import { useNoticesQuery } from '@/app/api/notices/notices.queries';
import { renderMarkdownPreview } from '@/app/shared/utils/markdown';
import EmptyState from '@/app/shared/components/empty/EmptyState';
import { useToast } from '@/app/shared/components/toast/toast';
import { useAuthStore } from '@/app/shared/store/authStore';

import markdownStyles from '@/app/shared/components/markdown-editor/markdown.module.css';
import styles from '@/app/(routes)/(public)/notices/NoticesPage.module.css';

import type { NoticesUpdatesSectionProps } from '@/app/shared/types/notices';

/**
 * 공지 업데이트 섹션
 * @description 업데이트 내역 리스트와 프론트 전용 반응 추가 UI를 렌더링합니다.
 */
export default function NoticesUpdatesSection({ releases }: NoticesUpdatesSectionProps) {
  // 공용 훅
  const { accessToken } = useAuthStore();
  const { showToast } = useToast();

  // 로그인 상태일 때 클라이언트에서 다시 조회하여 selectedEmojis 반영
  const { data: clientData } = useNoticesQuery(!!accessToken);
  const resolvedReleases = clientData?.updates ?? releases;

  // 반응 상태
  const {
    reactionOptions,
    getReactionSummary,
    getReleaseReactions,
    isReactionMenuOpen,
    isReactionSelected,
    selectReaction,
    toggleReactionMenu,
  } = useNoticeReactions(resolvedReleases, () => {
    showToast({ message: '반응 처리에 실패했습니다.', type: 'error' });
  });

  // 로그인 체크 후 반응 메뉴 토글
  const guardedToggleReactionMenu: typeof toggleReactionMenu = releaseId => {
    if (!accessToken) {
      showToast({ message: '로그인 후 반응을 추가할 수 있습니다.', type: 'warning' });
      return;
    }
    toggleReactionMenu(releaseId);
  };

  // 로그인 체크 후 반응 선택
  const guardedSelectReaction: typeof selectReaction = (releaseId, emoji) => {
    if (!accessToken) {
      showToast({ message: '로그인 후 반응을 추가할 수 있습니다.', type: 'warning' });
      return;
    }
    selectReaction(releaseId, emoji);
  };

  // 이벤트 핸들러
  const handleToggleReactionMenu = createToggleNoticeReactionMenuHandler(guardedToggleReactionMenu);
  const handleSelectReaction = createSelectNoticeReactionHandler(guardedSelectReaction);

  if (resolvedReleases.length === 0) {
    return (
      <EmptyState
        title="등록된 업데이트 내역이 없습니다."
        description="새로운 업데이트가 등록되면 여기에 표시됩니다."
      />
    );
  }

  return (
    <section className={styles.timeline} aria-label="업데이트 내역">
      {resolvedReleases.map(release => {
        const reactionSummary = getReactionSummary(release.id);

        return (
          <article key={release.id} className={styles.releaseRow}>
            <aside className={styles.releaseMeta} aria-label={`${release.version} 메타 정보`}>
              <div className={styles.metaDate}>
                <p className={styles.metaDateValue}>{formatNoticePublishedDate(release.publishedAt)}</p>
                <p className={styles.metaDateHint}>{release.publishedLabel}</p>
              </div>
              <div className={styles.metaDivider} aria-hidden="true" />
              <dl className={styles.metaDetails}>
                <div className={styles.metaDetailRow}>
                  <span className={styles.metaAvatar} aria-hidden="true">
                    {release.adminInitial}
                  </span>
                  <dd className={styles.metaDetailText}>{release.adminName}</dd>
                </div>
                <div className={styles.metaDetailRow}>
                  <dt className={styles.metaDetailLabel}>
                    <FiTag className={styles.metaDetailIcon} aria-hidden="true" />
                  </dt>
                  <dd className={styles.metaDetailText}>{release.version}</dd>
                </div>
                <div className={styles.metaDetailRow}>
                  <dt className={styles.metaDetailLabel}>
                    <FiBox className={styles.metaDetailIcon} aria-hidden="true" />
                  </dt>
                  <dd className={styles.metaDetailText}>{release.releaseType}</dd>
                </div>
                <div className={styles.metaDetailRow}>
                  <dt className={styles.metaDetailLabel}>
                    <FiGrid className={styles.metaDetailIcon} aria-hidden="true" />
                  </dt>
                  <dd className={styles.metaDetailText}>{release.releaseScope}</dd>
                </div>
              </dl>
            </aside>

            <div className={styles.releaseCard}>
              <header className={styles.releaseHeader}>
                <h2 className={styles.releaseTitle}>{release.title}</h2>
              </header>

              <section className={`${markdownStyles.markdown}`}>
                {renderMarkdownPreview(release.markdownContent)}
              </section>

              <footer className={styles.releaseFooter}>
                <div className={styles.releaseDivider} aria-hidden="true" />
                <div className={styles.reactionBar} aria-label="업데이트 반응">
                  <div className={styles.reactionPicker}>
                    <button
                      type="button"
                      data-release-id={release.id}
                      aria-label="반응 추가"
                      aria-expanded={isReactionMenuOpen(release.id)}
                      className={styles.addReactionButton}
                      onClick={handleToggleReactionMenu}
                    >
                      <FiSmile className={styles.addReactionIcon} aria-hidden="true" />
                    </button>
                    {isReactionMenuOpen(release.id) ? (
                      <ul className={styles.reactionPickerMenu} aria-label="반응 선택">
                        {reactionOptions.map(option => (
                          <li key={`${release.id}-${option.emoji}`} className={styles.reactionPickerItem}>
                            <button
                              type="button"
                              data-release-id={release.id}
                              data-reaction-emoji={option.emoji}
                              aria-label={option.label}
                              aria-pressed={isReactionSelected(release.id, option.emoji)}
                              className={
                                isReactionSelected(release.id, option.emoji)
                                  ? `${styles.reactionPickerButton} ${styles.reactionPickerButtonSelected}`
                                  : styles.reactionPickerButton
                              }
                              onClick={handleSelectReaction}
                            >
                              <Image
                                src={getNoticeReactionImageSrc(option.emoji)}
                                alt=""
                                width={18}
                                height={18}
                                unoptimized
                                aria-hidden="true"
                                className={styles.reactionPickerEmoji}
                              />
                            </button>
                          </li>
                        ))}
                      </ul>
                    ) : null}
                  </div>
                  <ul className={styles.reactionList}>
                    {getReleaseReactions(release.id).map(reaction => (
                      <li key={`${release.id}-${reaction.emoji}`} className={styles.reactionItem}>
                        <button
                          type="button"
                          data-release-id={release.id}
                          data-reaction-emoji={reaction.emoji}
                          className={
                            isReactionSelected(release.id, reaction.emoji)
                              ? `${styles.reactionButton} ${styles.reactionButtonSelected}`
                              : styles.reactionButton
                          }
                          onClick={handleSelectReaction}
                        >
                          <span className={styles.reactionEmoji}>
                            <Image
                              src={getNoticeReactionImageSrc(reaction.emoji)}
                              alt={reaction.emoji}
                              width={16}
                              height={16}
                              unoptimized
                              className={styles.reactionEmojiImage}
                            />
                          </span>
                          <span className={styles.reactionCount}>
                            <NumberFlow value={reaction.count} />
                          </span>
                        </button>
                      </li>
                    ))}
                  </ul>
                  {reactionSummary ? <span className={styles.reactionSummary}>{reactionSummary}</span> : null}
                </div>
              </footer>
            </div>
          </article>
        );
      })}
    </section>
  );
}
