import type { AppRouterInstance } from 'next/dist/shared/lib/app-router-context.shared-runtime';
import type { Dispatch, SetStateAction } from 'react';

import { extractTags } from '@/app/(routes)/(private)/posts/new/utils';

import type { TagCommit } from '@/app/shared/types/post';
import type { ToastOptions } from '@/app/shared/types/toast';

/**
 * 태그 추가 헬퍼 생성
 * @description 입력값에서 태그를 추출해 목록에 추가
 */
export const createAddTagsFromInput = (params: {
  tags: string[];
  setTags: Dispatch<SetStateAction<string[]>>;
  showToast: (options: ToastOptions) => void;
  maxCount: number;
  maxLength: number;
}) => {
  return (value: string) => {
    const candidates = extractTags(value);
    if (!candidates.length) return false;

    const existingTags = new Set(params.tags);
    const newTags: string[] = [];
    let hasDuplicate = false;
    let limitReached = false;

    candidates.forEach(tag => {
      if (tag.length > params.maxLength) {
        return;
      }
      if (existingTags.has(tag)) {
        hasDuplicate = true;
        return;
      }
      if (existingTags.size >= params.maxCount) {
        limitReached = true;
        return;
      }
      existingTags.add(tag);
      newTags.push(tag);
    });

    if (hasDuplicate) {
      params.showToast({ message: '이미 추가된 태그입니다.', type: 'warning' });
    }

    if (limitReached) {
      params.showToast({ message: `태그는 최대 ${params.maxCount}개까지 추가할 수 있어요.`, type: 'warning' });
    }

    if (newTags.length) {
      params.setTags(prev => {
        const next = [...prev];
        newTags.forEach(tag => {
          if (!next.includes(tag)) next.push(tag);
        });
        return next;
      });
    }

    return true;
  };
};

/**
 * 태그 입력 확정 헬퍼 생성
 * @description 입력값을 태그로 확정하고 입력창을 비움
 */
export const createCommitTagInput = (params: { addTagsFromInput: TagCommit; setTagInput: (value: string) => void }) => {
  return (value: string) => {
    if (!params.addTagsFromInput(value)) return false;
    params.setTagInput('');
    return true;
  };
};

/**
 * 작성 화면 종료 핸들러 생성
 * @description 작성 페이지를 종료하고 홈으로 이동
 */
export const createHandleExit = (router: AppRouterInstance) => {
  return () => {
    router.push('/');
  };
};

/**
 * 임시저장 클릭 핸들러 생성
 * @description 현재 작성 상태를 임시저장으로 저장
 */
export const createHandleSaveDraftClick = (saveDraft: () => void) => {
  return () => {
    saveDraft();
  };
};

/**
 * 굵게 서식 핸들러 생성
 * @description 선택 영역을 굵게 포맷으로 감싼다
 */
export const createHandleBoldClick = (applyInlineWrap: (prefix: string, suffix?: string) => void) => {
  return () => {
    applyInlineWrap('**');
  };
};

/**
 * 기울임 서식 핸들러 생성
 * @description 선택 영역을 기울임 포맷으로 감싼다
 */
export const createHandleItalicClick = (applyInlineWrap: (prefix: string, suffix?: string) => void) => {
  return () => {
    applyInlineWrap('_');
  };
};

/**
 * 밑줄 서식 핸들러 생성
 * @description 선택 영역을 밑줄 태그로 감싼다
 */
export const createHandleUnderlineClick = (applyInlineWrap: (prefix: string, suffix?: string) => void) => {
  return () => {
    applyInlineWrap('<u>', '</u>');
  };
};

/**
 * 취소선 서식 핸들러 생성
 * @description 선택 영역을 취소선 포맷으로 감싼다
 */
export const createHandleStrikeClick = (applyInlineWrap: (prefix: string, suffix?: string) => void) => {
  return () => {
    applyInlineWrap('~~');
  };
};
