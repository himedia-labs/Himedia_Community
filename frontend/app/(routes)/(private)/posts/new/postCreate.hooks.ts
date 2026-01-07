import { type ChangeEvent, type PointerEvent as ReactPointerEvent, useEffect, useRef, useState } from 'react';
import type { AxiosError } from 'axios';

import { useCategoriesQuery } from '@/app/api/categories/categories.queries';
import { useTagSuggestionsQuery } from '@/app/api/tags/tags.queries';
import { useToast } from '@/app/shared/components/toast/toast';
import { useCurrentUserQuery } from '@/app/api/auth/auth.queries';
import { useCreatePostMutation } from '@/app/api/posts/posts.mutations';
import type { ApiErrorResponse } from '@/app/shared/types/error';
import { useRouter } from 'next/navigation';

import {
  createAddTagsFromInput,
  createCommitTagInput,
  createHandleCategoryChange,
  createHandleContentChange,
  createHandlePreviewModeChange,
  createHandleRemoveTag,
  createHandleTagBlur,
  createHandleTagChange,
  createHandleTagCompositionEnd,
  createHandleTagCompositionStart,
  createHandleTagKeyDown,
  createHandleTagSuggestionMouseDown,
  createHandleThumbnailChange,
  createHandleTitleChange,
} from './postCreate.handlers';
import {
  AUTO_SAVE_DELAY_MS,
  DEFAULT_PREVIEW_MODE,
  DEFAULT_SPLIT_LEFT,
  DRAFT_STORAGE_KEY,
  DRAFT_TOAST_DURATION_MS,
  PREVIEW_MODE_DETAIL,
  PREVIEW_MODE_LIST,
  SPLIT_MAX,
  SPLIT_MIN,
  TAG_MAX_COUNT,
  TAG_MAX_LENGTH,
  TITLE_MAX_LENGTH,
  TOOLBAR_PADDING,
} from './postCreate.constants';
import { buildSummary, formatDateLabel, getTagQueryFromInput } from './postCreate.utils';

const DEFAULT_TIME_AGO_LABEL = '방금 전';
const DEFAULT_CATEGORY_LABEL = '카테고리';
const DEFAULT_AUTHOR_NAME = '홍길동';
const DEFAULT_PREVIEW_STATS = {
  views: 128,
  likeCount: 12,
  commentCount: 3,
};
const PREVIEW_TIME_FORMAT_LOCALE = 'ko-KR';
const PREVIEW_TIME_FORMAT_OPTIONS = { hour: '2-digit', minute: '2-digit' } as const;
const DRAFT_BUTTON_LABEL = '임시저장';
const DRAFT_BUTTON_LABEL_PREFIX = '임시저장됨';
const TOAST_DRAFT_SAVED_MESSAGE = '임시저장 완료';
const TOAST_TITLE_REQUIRED_MESSAGE = '제목을 입력해주세요.';
const TOAST_CATEGORY_REQUIRED_MESSAGE = '카테고리를 선택해주세요.';
const TOAST_CONTENT_REQUIRED_MESSAGE = '본문을 입력해주세요.';
const TOAST_SAVE_SUCCESS_MESSAGE = '게시물이 저장되었습니다.';
const TOAST_SAVE_FAILURE_MESSAGE = '게시물 저장에 실패했습니다.';

// 게시물 작성 폼 상태/핸들러 제공
export const usePostCreateForm = () => {
  const { showToast } = useToast();
  const { data: categories, isLoading } = useCategoriesQuery();
  const router = useRouter();
  const createPostMutation = useCreatePostMutation();
  const [title, setTitle] = useState('');
  const [categoryId, setCategoryId] = useState('');
  const [thumbnailUrl, setThumbnailUrl] = useState('');
  const [content, setContent] = useState('');
  const [tagInput, setTagInput] = useState('');
  const [tags, setTags] = useState<string[]>([]);
  const [tagLengthError, setTagLengthError] = useState(false);
  const [titleLengthError, setTitleLengthError] = useState(false);
  const [tagQuery, setTagQuery] = useState('');
  const [previewMode, setPreviewMode] = useState<'detail' | 'list'>(DEFAULT_PREVIEW_MODE);
  const [lastSavedAt, setLastSavedAt] = useState<string | null>(null);
  const didLoadDraft = useRef(false);
  const shouldCommitAfterComposition = useRef(false);
  const isComposingRef = useRef(false);
  const pendingBlurCommitRef = useRef(false);
  const titleLimitNotifiedRef = useRef(false);
  const tagLimitNotifiedRef = useRef(false);

  const categoryName = categories?.find(category => String(category.id) === categoryId)?.name ?? DEFAULT_CATEGORY_LABEL;
  const summary = buildSummary(content);
  const dateLabel = formatDateLabel(new Date());
  const timeAgoLabel = DEFAULT_TIME_AGO_LABEL;
  const previewStats = DEFAULT_PREVIEW_STATS;
  // 로그인 사용자 정보 조회
  const { data: currentUser } = useCurrentUserQuery();
  // 미리보기 작성자 이름
  const authorName = currentUser?.name ?? DEFAULT_AUTHOR_NAME;
  const savedAtLabel = lastSavedAt
    ? new Date(lastSavedAt).toLocaleTimeString(PREVIEW_TIME_FORMAT_LOCALE, PREVIEW_TIME_FORMAT_OPTIONS)
    : null;
  const draftButtonTitle = savedAtLabel ? `${DRAFT_BUTTON_LABEL_PREFIX} ${savedAtLabel}` : DRAFT_BUTTON_LABEL;
  const { data: tagSuggestions = [] } = useTagSuggestionsQuery(tagQuery);
  const hasTagSuggestions = tagQuery.length > 0 && tagSuggestions.length > 0;

  const addTagsFromInput = createAddTagsFromInput({
    tags,
    setTags,
    showToast,
    maxCount: TAG_MAX_COUNT,
    maxLength: TAG_MAX_LENGTH,
  });
  const commitTagInput = createCommitTagInput({ addTagsFromInput, setTagInput });

  const handleTitleChange = createHandleTitleChange({
    setTitle,
    maxLength: TITLE_MAX_LENGTH,
    showToast,
    limitNotifiedRef: titleLimitNotifiedRef,
    setTitleLengthError,
  });
  const handleCategoryChange = createHandleCategoryChange({ setCategoryId });
  const handleThumbnailChange = createHandleThumbnailChange({ setThumbnailUrl });
  const handleContentChange = createHandleContentChange({ setContent });
  const setContentValue = setContent;
  const handlePreviewDetail = createHandlePreviewModeChange({ setPreviewMode, mode: PREVIEW_MODE_DETAIL });
  const handlePreviewList = createHandlePreviewModeChange({ setPreviewMode, mode: PREVIEW_MODE_LIST });
  const handleRemoveTag = createHandleRemoveTag({ setTags });
  const handleTagKeyDown = createHandleTagKeyDown({
    tagInput,
    tags,
    setTags,
    commitTagInput,
    shouldCommitAfterComposition,
  });
  const handleTagChange = createHandleTagChange({
    commitTagInput,
    setTagInput,
    showToast,
    maxLength: TAG_MAX_LENGTH,
    limitNotifiedRef: tagLimitNotifiedRef,
    setTagLengthError,
  });
  const handleTagBlur = createHandleTagBlur({
    commitTagInput,
    isComposingRef,
    pendingBlurCommitRef,
    shouldCommitAfterComposition,
  });
  const handleTagCompositionStart = createHandleTagCompositionStart({ isComposingRef });
  const handleTagCompositionEnd = createHandleTagCompositionEnd({
    commitTagInput,
    shouldCommitAfterComposition,
    isComposingRef,
    pendingBlurCommitRef,
  });
  const handleTagSuggestionMouseDown = createHandleTagSuggestionMouseDown({ commitTagInput });

  // 임시저장 처리
  const saveDraft = () => {
    const now = new Date().toISOString();
    const draftPayload = {
      title,
      categoryId,
      thumbnailUrl,
      content,
      tags,
      savedAt: now,
    };
    localStorage.setItem(DRAFT_STORAGE_KEY, JSON.stringify(draftPayload));
    setLastSavedAt(now);
    showToast({ message: TOAST_DRAFT_SAVED_MESSAGE, type: 'success', duration: DRAFT_TOAST_DURATION_MS });
  };

  // 게시물 저장 처리
  const handleSave = async () => {
    const trimmedTitle = title.trim();
    const trimmedContent = content.trim();
    const trimmedThumbnail = thumbnailUrl.trim();

    if (!trimmedTitle) {
      showToast({ message: TOAST_TITLE_REQUIRED_MESSAGE, type: 'warning' });
      return;
    }

    if (!categoryId) {
      showToast({ message: TOAST_CATEGORY_REQUIRED_MESSAGE, type: 'warning' });
      return;
    }

    if (!trimmedContent) {
      showToast({ message: TOAST_CONTENT_REQUIRED_MESSAGE, type: 'warning' });
      return;
    }

    if (createPostMutation.isPending) return;

    try {
      await createPostMutation.mutateAsync({
        title: trimmedTitle,
        content,
        categoryId,
        status: 'PUBLISHED',
        thumbnailUrl: trimmedThumbnail || undefined,
        tags: tags.length ? tags : undefined,
      });
      localStorage.removeItem(DRAFT_STORAGE_KEY);
      setLastSavedAt(null);
      showToast({ message: TOAST_SAVE_SUCCESS_MESSAGE, type: 'success' });
      router.replace('/');
    } catch (error) {
      const axiosError = error as AxiosError<ApiErrorResponse>;
      const message = axiosError.response?.data?.message ?? TOAST_SAVE_FAILURE_MESSAGE;
      showToast({ message, type: 'error' });
    }
  };

  useEffect(() => {
    setTagQuery(getTagQueryFromInput(tagInput));
  }, [tagInput]);

  useEffect(() => {
    if (!tagInput) {
      setTagLengthError(false);
    }
  }, [tagInput]);

  useEffect(() => {
    const savedDraft = localStorage.getItem(DRAFT_STORAGE_KEY);
    if (!savedDraft) {
      didLoadDraft.current = true;
      return;
    }

    try {
      const draft = JSON.parse(savedDraft) as {
        title?: string;
        categoryId?: string;
        thumbnailUrl?: string;
        content?: string;
        tags?: string[];
        savedAt?: string;
      };
      if (draft.title) setTitle(draft.title.slice(0, TITLE_MAX_LENGTH));
      if (draft.categoryId) setCategoryId(draft.categoryId);
      if (draft.thumbnailUrl) setThumbnailUrl(draft.thumbnailUrl);
      if (draft.content) setContent(draft.content);
      if (Array.isArray(draft.tags)) setTags(draft.tags);
      if (draft.savedAt) setLastSavedAt(draft.savedAt);
    } catch {
      localStorage.removeItem(DRAFT_STORAGE_KEY);
    } finally {
      didLoadDraft.current = true;
    }
  }, []);

  useEffect(() => {
    if (!didLoadDraft.current) return;

    const hasDraft = title.trim() || content.trim() || categoryId || thumbnailUrl || tags.length > 0;
    if (!hasDraft) return;

    const timer = window.setTimeout(() => {
      saveDraft();
    }, AUTO_SAVE_DELAY_MS);

    return () => window.clearTimeout(timer);
  }, [title, categoryId, thumbnailUrl, content, tags]);

  return {
    state: {
      title,
      categoryId,
      thumbnailUrl,
      content,
      tagInput,
      tags,
      tagLengthError,
      titleLengthError,
      previewMode,
    },
    derived: {
      categoryName,
      summary,
      dateLabel,
      timeAgoLabel,
      previewStats,
      authorName,
      draftButtonTitle,
      hasTagSuggestions,
    },
    data: {
      categories,
      isLoading,
      tagSuggestions,
    },
    handlers: {
      handleTitleChange,
      handleCategoryChange,
      handleThumbnailChange,
      handleContentChange,
      setContentValue,
      handlePreviewDetail,
      handlePreviewList,
      handleRemoveTag,
      handleTagKeyDown,
      handleTagChange,
      handleTagBlur,
      handleTagCompositionStart,
      handleTagCompositionEnd,
      handleTagSuggestionMouseDown,
      saveDraft,
      handleSave,
    },
  };
};

// 작성 페이지 UI 상태/핸들러 제공
export const usePostCreatePage = (params: { content: string; setContentValue: (value: string) => void }) => {
  const { content, setContentValue } = params;
  const splitRef = useRef<HTMLDivElement | null>(null);
  const isDraggingRef = useRef(false);
  const toolbarRef = useRef<HTMLElement | null>(null);
  const isToolbarDraggingRef = useRef(false);
  const toolbarOffsetRef = useRef({ x: 0, y: 0 });
  const contentRef = useRef<HTMLTextAreaElement | null>(null);
  const imageInputRef = useRef<HTMLInputElement | null>(null);
  const imageUrlsRef = useRef<string[]>([]);
  const selectionRef = useRef<{ start: number; end: number } | null>(null);

  const [splitLeft, setSplitLeft] = useState(DEFAULT_SPLIT_LEFT);
  const [isToolbarDragging, setIsToolbarDragging] = useState(false);

  useEffect(() => {
    return () => {
      imageUrlsRef.current.forEach(url => URL.revokeObjectURL(url));
    };
  }, []);

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

  // 툴바 위치 업데이트
  const updateToolbarPosition = (clientX: number, clientY: number) => {
    const toolbar = toolbarRef.current;
    if (!toolbar) return;
    const { x: offsetX, y: offsetY } = toolbarOffsetRef.current;
    const nextLeft = clientX - offsetX;
    const nextTop = clientY - offsetY;
    const maxLeft = window.innerWidth - toolbar.offsetWidth - TOOLBAR_PADDING;
    const maxTop = window.innerHeight - toolbar.offsetHeight - TOOLBAR_PADDING;
    const clampedLeft = Math.min(maxLeft, Math.max(TOOLBAR_PADDING, nextLeft));
    const clampedTop = Math.min(maxTop, Math.max(TOOLBAR_PADDING, nextTop));
    toolbar.style.left = `${clampedLeft}px`;
    toolbar.style.top = `${clampedTop}px`;
    toolbar.style.bottom = 'auto';
    toolbar.style.transform = 'none';
  };

  // 툴바 드래그 시작
  const handleToolbarPointerDown = (event: ReactPointerEvent<HTMLElement>) => {
    const target = event.target as HTMLElement;
    if (target.closest('button')) return;
    const toolbar = toolbarRef.current;
    if (!toolbar) return;
    event.preventDefault();
    isToolbarDraggingRef.current = true;
    setIsToolbarDragging(true);
    event.currentTarget.setPointerCapture(event.pointerId);
    const rect = toolbar.getBoundingClientRect();
    toolbarOffsetRef.current = {
      x: event.clientX - rect.left,
      y: event.clientY - rect.top,
    };
    updateToolbarPosition(event.clientX, event.clientY);
  };

  // 툴바 드래그 이동
  const handleToolbarPointerMove = (event: ReactPointerEvent<HTMLElement>) => {
    if (!isToolbarDraggingRef.current) return;
    event.preventDefault();
    updateToolbarPosition(event.clientX, event.clientY);
  };

  // 툴바 드래그 종료
  const handleToolbarPointerUp = (event: ReactPointerEvent<HTMLElement>) => {
    if (!isToolbarDraggingRef.current) return;
    isToolbarDraggingRef.current = false;
    setIsToolbarDragging(false);
    event.currentTarget.releasePointerCapture(event.pointerId);
  };

  // 툴바 드래그 핸들러 묶음
  const toolbarHandlers = {
    handlePointerDown: handleToolbarPointerDown,
    handlePointerMove: handleToolbarPointerMove,
    handlePointerUp: handleToolbarPointerUp,
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
  const handleImageSelect = (event: ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    event.target.value = '';
    if (!file) return;

    const objectUrl = URL.createObjectURL(file);
    imageUrlsRef.current.push(objectUrl);
    const { start, end } = getSelectionRange();
    const selected = content.slice(start, end).trim();
    const fileLabel = file.name.replace(/\.[^/.]+$/, '');
    const altText = selected || fileLabel || '이미지';
    const markdown = `![${altText}](${objectUrl})`;
    const nextValue = content.slice(0, start) + markdown + content.slice(end);
    const cursor = start + markdown.length;
    setContentAndSelection(nextValue, cursor, cursor);
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
      toolbarRef,
      contentRef,
      imageInputRef,
    },
    split: {
      value: splitLeft,
      min: SPLIT_MIN,
      max: SPLIT_MAX,
      handlers: splitHandlers,
    },
    toolbar: {
      isDragging: isToolbarDragging,
      handlers: toolbarHandlers,
    },
    editor: editorHandlers,
  };
};

export default usePostCreateForm;
