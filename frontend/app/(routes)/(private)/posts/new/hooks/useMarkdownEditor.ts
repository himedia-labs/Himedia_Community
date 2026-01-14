import {
  type ChangeEvent,
  type Dispatch,
  type PointerEvent as ReactPointerEvent,
  type SetStateAction,
  useEffect,
  useRef,
  useState,
} from 'react';
import type { AxiosError } from 'axios';

import { useToast } from '@/app/shared/components/toast/toast';
import { useAuthStore } from '@/app/shared/store/authStore';
import { useUploadImageMutation } from '@/app/api/uploads/uploads.mutations';
import type { ApiErrorResponse } from '@/app/shared/types/error';

import {
  DEFAULT_SPLIT_LEFT,
  SPLIT_MAX,
  SPLIT_MIN,
  THUMBNAIL_MAX_SIZE,
  TOAST_IMAGE_UPLOAD_FAILURE_MESSAGE,
  TOAST_IMAGE_UPLOAD_SIZE_MESSAGE,
  TOAST_IMAGE_UPLOAD_SUCCESS_MESSAGE,
  TOAST_IMAGE_UPLOAD_TYPE_MESSAGE,
} from '../postCreate.constants';

// 마크다운 에디터 및 분할 뷰 관리 hook
export const useMarkdownEditor = (params: { content: string; setContentValue: Dispatch<SetStateAction<string>> }) => {
  const { content, setContentValue } = params;
  const { showToast } = useToast();
  const { accessToken } = useAuthStore();
  const uploadImageMutation = useUploadImageMutation();
  const splitRef = useRef<HTMLDivElement | null>(null);
  const isDraggingRef = useRef(false);
  const contentRef = useRef<HTMLTextAreaElement | null>(null);
  const imageInputRef = useRef<HTMLInputElement | null>(null);
  const selectionRef = useRef<{ start: number; end: number } | null>(null);

  const [splitLeft, setSplitLeft] = useState(DEFAULT_SPLIT_LEFT);

  // 분할 비율 CSS 변수 동기화
  useEffect(() => {
    const container = splitRef.current;
    if (!container) return;
    container.style.setProperty('--split-left', `${splitLeft}%`);
  }, [splitLeft]);

  // 분할 위치 업데이트
  const updateSplit = (clientX: number) => {
    const container = splitRef.current;
    if (!container) return;
    const rect = container.getBoundingClientRect();
    const nextValue = ((clientX - rect.left) / rect.width) * 100;
    const clamped = Math.min(SPLIT_MAX, Math.max(SPLIT_MIN, nextValue));
    container.style.setProperty('--split-left', `${clamped}%`);
    setSplitLeft(clamped);
  };

  // 분할 드래그 시작
  const handleSplitPointerDown = (event: ReactPointerEvent<HTMLDivElement>) => {
    event.preventDefault();
    isDraggingRef.current = true;
    event.currentTarget.setPointerCapture(event.pointerId);
    updateSplit(event.clientX);
  };

  // 분할 드래그 이동
  const handleSplitPointerMove = (event: ReactPointerEvent<HTMLDivElement>) => {
    if (!isDraggingRef.current) return;
    event.preventDefault();
    updateSplit(event.clientX);
  };

  // 분할 드래그 종료
  const handleSplitPointerUp = (event: ReactPointerEvent<HTMLDivElement>) => {
    if (!isDraggingRef.current) return;
    isDraggingRef.current = false;
    event.currentTarget.releasePointerCapture(event.pointerId);
  };

  // 분할 드래그 핸들러 묶음
  const splitHandlers = {
    handlePointerDown: handleSplitPointerDown,
    handlePointerMove: handleSplitPointerMove,
    handlePointerUp: handleSplitPointerUp,
  };

  // 커서 선택 범위 저장
  const captureSelection = () => {
    const textarea = contentRef.current;
    if (!textarea) return;
    selectionRef.current = {
      start: textarea.selectionStart ?? 0,
      end: textarea.selectionEnd ?? 0,
    };
  };

  // 커서 선택 범위 조회
  const getSelectionRange = () => {
    if (selectionRef.current) {
      const range = selectionRef.current;
      selectionRef.current = null;
      return range;
    }
    const textarea = contentRef.current;
    return {
      start: textarea?.selectionStart ?? 0,
      end: textarea?.selectionEnd ?? 0,
    };
  };

  // 본문과 커서 위치를 함께 갱신
  const setContentAndSelection = (nextValue: string, selectionStart: number, selectionEnd = selectionStart) => {
    setContentValue(nextValue);
    window.requestAnimationFrame(() => {
      const textarea = contentRef.current;
      if (!textarea) return;
      textarea.focus();
      textarea.setSelectionRange(selectionStart, selectionEnd);
    });
  };

  // 인라인 마크다운 감싸기 적용
  const applyInlineWrap = (before: string, after = before) => {
    const textarea = contentRef.current;
    if (!textarea) return;
    const start = textarea.selectionStart ?? 0;
    const end = textarea.selectionEnd ?? 0;
    const selected = content.slice(start, end);
    const nextValue = content.slice(0, start) + before + selected + after + content.slice(end);
    const nextStart = start + before.length;
    const nextEnd = selected ? nextStart + selected.length : nextStart;
    setContentAndSelection(nextValue, nextStart, nextEnd);
  };

  // 라인 단위 프리픽스 적용
  const applyLinePrefix = (prefix: string, options?: { numbered?: boolean }) => {
    const textarea = contentRef.current;
    if (!textarea) return;
    const start = textarea.selectionStart ?? 0;
    const end = textarea.selectionEnd ?? 0;
    const lineStart = content.lastIndexOf('\n', Math.max(0, start - 1)) + 1;
    const lineEndIndex = content.indexOf('\n', end);
    const blockEnd = lineEndIndex === -1 ? content.length : lineEndIndex;
    const block = content.slice(lineStart, blockEnd);
    const lines = block.split('\n');
    const prefixes = lines.map((_, index) => (options?.numbered ? `${index + 1}. ` : prefix));
    const nextBlock = lines.map((line, index) => `${prefixes[index]}${line}`).join('\n');
    const nextValue = content.slice(0, lineStart) + nextBlock + content.slice(blockEnd);
    const prefixLengths = prefixes.map(item => item.length);
    const getLineIndex = (pos: number) => content.slice(lineStart, pos).split('\n').length - 1;
    const sumPrefixLength = (lineIndex: number) =>
      prefixLengths.slice(0, lineIndex + 1).reduce((sum, length) => sum + length, 0);
    const nextStart = start >= lineStart && start <= blockEnd ? start + sumPrefixLength(getLineIndex(start)) : start;
    const nextEnd = end >= lineStart && end <= blockEnd ? end + sumPrefixLength(getLineIndex(end)) : end;
    setContentAndSelection(nextValue, nextStart, nextEnd);
  };

  // 코드 인라인/블록 적용
  const applyCode = () => {
    const textarea = contentRef.current;
    if (!textarea) return;
    const start = textarea.selectionStart ?? 0;
    const end = textarea.selectionEnd ?? 0;
    const selected = content.slice(start, end);

    if (selected.includes('\n')) {
      const before = '```\n';
      const after = '\n```';
      const nextValue = content.slice(0, start) + before + selected + after + content.slice(end);
      const nextStart = start + before.length;
      const nextEnd = nextStart + selected.length;
      setContentAndSelection(nextValue, nextStart, nextEnd);
      return;
    }

    applyInlineWrap('`');
  };

  // 링크 마크다운 적용
  const applyLink = () => {
    const textarea = contentRef.current;
    if (!textarea) return;
    const start = textarea.selectionStart ?? 0;
    const end = textarea.selectionEnd ?? 0;
    const selected = content.slice(start, end);

    if (selected) {
      const prefix = '[';
      const suffix = ']()';
      const nextValue = content.slice(0, start) + prefix + selected + suffix + content.slice(end);
      const cursor = start + prefix.length + selected.length + suffix.length - 1;
      setContentAndSelection(nextValue, cursor, cursor);
      return;
    }

    const snippet = '[텍스트](링크)';
    const nextValue = content.slice(0, start) + snippet + content.slice(end);
    const textStart = start + 1;
    const textEnd = textStart + '텍스트'.length;
    setContentAndSelection(nextValue, textStart, textEnd);
  };

  // 이미지 선택 트리거
  const handleImageClick = () => {
    captureSelection();
    imageInputRef.current?.click();
  };

  // 이미지 선택 후 마크다운 삽입
  const handleImageSelect = async (event: ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    event.target.value = '';
    if (!file) return;

    if (!accessToken) {
      showToast({ message: '로그인 후 이용해주세요.', type: 'warning' });
      return;
    }

    if (!file.type.startsWith('image/')) {
      showToast({ message: TOAST_IMAGE_UPLOAD_TYPE_MESSAGE, type: 'warning' });
      return;
    }

    if (file.size > THUMBNAIL_MAX_SIZE) {
      showToast({ message: TOAST_IMAGE_UPLOAD_SIZE_MESSAGE, type: 'warning' });
      return;
    }

    if (uploadImageMutation.isPending) return;

    const { start, end } = getSelectionRange();
    const selected = content.slice(start, end).trim();
    const fileLabel = file.name.replace(/\.[^/.]+$/, '');
    const altText = selected || fileLabel || '이미지';
    const placeholderId = `uploading:${Date.now()}-${Math.random().toString(36).slice(2, 8)}`;
    const markdown = `![${altText}](${placeholderId})`;
    const nextValue = content.slice(0, start) + markdown + content.slice(end);
    const cursor = start + markdown.length;
    setContentAndSelection(nextValue, cursor, cursor);

    try {
      const response = await uploadImageMutation.mutateAsync(file);
      setContentValue(prev => prev.replace(placeholderId, response.url));
      showToast({ message: TOAST_IMAGE_UPLOAD_SUCCESS_MESSAGE, type: 'success' });
    } catch (error) {
      const axiosError = error as AxiosError<ApiErrorResponse>;
      const message = axiosError.response?.data?.message ?? TOAST_IMAGE_UPLOAD_FAILURE_MESSAGE;
      setContentValue(prev => prev.replace(markdown, '').replace(placeholderId, ''));
      showToast({ message, type: 'error' });
    }
  };

  // 제목 마크다운 적용
  const handleHeadingClick = (level: 1 | 2 | 3) => () => applyLinePrefix(`${'#'.repeat(level)} `);
  // 인용 마크다운 적용
  const handleQuoteClick = () => applyLinePrefix('> ');
  // 불릿 리스트 마크다운 적용
  const handleBulletClick = () => applyLinePrefix('- ');
  // 번호 리스트 마크다운 적용
  const handleNumberedClick = () => applyLinePrefix('', { numbered: true });

  // 본문 서식 핸들러 묶음
  const editorHandlers = {
    applyInlineWrap,
    applyCode,
    applyLink,
    handleHeadingClick,
    handleQuoteClick,
    handleBulletClick,
    handleNumberedClick,
    handleImageClick,
    handleImageSelect,
  };

  return {
    refs: {
      splitRef,
      contentRef,
      imageInputRef,
    },
    split: {
      value: splitLeft,
      min: SPLIT_MIN,
      max: SPLIT_MAX,
      handlers: splitHandlers,
    },
    editor: editorHandlers,
  };
};
