'use client';

import { useCallback, useEffect, useRef, useState } from 'react';

import { noticesApi } from '@/app/api/notices/notices.api';
import { NOTICE_REACTION_OPTIONS } from '@/app/(routes)/(public)/notices/_constants/noticesReaction.constants';
import { createNoticeReactionMap, formatNoticeReactionSummary, sortNoticeReactions } from '@/app/(routes)/(public)/notices/_utils';

import type {
  NoticeReactionMap,
  NoticeSelectReaction,
  NoticeSelectedReactionMap,
  NoticeToggleReactionMenu,
  NoticeUpdateRelease,
} from '@/app/shared/types/notices';

/**
 * 공지 반응 훅
 * @description 반응 메뉴 열림 상태와 서버 기반 리액션 응답 상태를 관리합니다.
 */
export const useNoticeReactions = (releases: NoticeUpdateRelease[], onError?: () => void) => {
  // 반응 상태
  const initialSelectedReactionMap = releases.reduce<NoticeSelectedReactionMap>((accumulator, release) => {
    accumulator[release.id] = release.selectedEmojis;
    return accumulator;
  }, {});
  const initialReactorCountMap = releases.reduce<Record<string, number>>((accumulator, release) => {
    accumulator[release.id] = release.reactorCount;
    return accumulator;
  }, {});
  const [openReactionMenuId, setOpenReactionMenuId] = useState<string | null>(null);
  const [reactionMap, setReactionMap] = useState<NoticeReactionMap>(() => createNoticeReactionMap(releases));
  const [reactorCountMap, setReactorCountMap] = useState<Record<string, number>>(initialReactorCountMap);
  const [selectedReactionMap, setSelectedReactionMap] = useState<NoticeSelectedReactionMap>(initialSelectedReactionMap);

  // releases 변경 시 상태 동기화 (로그인 후 클라이언트 데이터 반영)
  useEffect(() => {
    setReactionMap(createNoticeReactionMap(releases));
    setReactorCountMap(
      releases.reduce<Record<string, number>>((accumulator, release) => {
        accumulator[release.id] = release.reactorCount;
        return accumulator;
      }, {}),
    );
    setSelectedReactionMap(
      releases.reduce<NoticeSelectedReactionMap>((accumulator, release) => {
        accumulator[release.id] = release.selectedEmojis;
        return accumulator;
      }, {}),
    );
  }, [releases]);

  // 반응 요청 중복 방지
  const pendingReactionRef = useRef(false);

  // 메뉴 토글
  const toggleReactionMenu: NoticeToggleReactionMenu = releaseId => {
    setOpenReactionMenuId(prev => (prev === releaseId ? null : releaseId));
  };

  // 반응 추가
  const selectReaction: NoticeSelectReaction = useCallback(async (releaseId, emoji) => {
    if (pendingReactionRef.current) return;

    setOpenReactionMenuId(null);
    pendingReactionRef.current = true;

    try {
      const data = await noticesApi.toggleNoticeReaction(releaseId, emoji);

      setReactionMap(prev => ({
        ...prev,
        [releaseId]: data.reactions,
      }));
      setReactorCountMap(prev => ({
        ...prev,
        [releaseId]: data.reactorCount,
      }));
      setSelectedReactionMap(prev => ({
        ...prev,
        [releaseId]: data.selectedEmojis,
      }));
    } catch {
      onError?.();
    } finally {
      pendingReactionRef.current = false;
    }
  }, [onError]);

  // 반응 조회
  const getReleaseReactions = (releaseId: string) => sortNoticeReactions(reactionMap[releaseId] ?? [], NOTICE_REACTION_OPTIONS);
  const getReactionSummary = (releaseId: string) => {
    const selectedEmojis = selectedReactionMap[releaseId] ?? [];
    const reactorCount = reactorCountMap[releaseId] ?? 0;
    return formatNoticeReactionSummary(reactorCount, selectedEmojis.length > 0);
  };
  const isReactionMenuOpen = (releaseId: string) => openReactionMenuId === releaseId;
  const isReactionSelected = (releaseId: string, emoji: string) => (selectedReactionMap[releaseId] ?? []).includes(emoji);

  return {
    reactionOptions: NOTICE_REACTION_OPTIONS,
    getReactionSummary,
    getReleaseReactions,
    isReactionSelected,
    isReactionMenuOpen,
    selectReaction,
    toggleReactionMenu,
  };
};
