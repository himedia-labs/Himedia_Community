import { useEffect, useRef } from 'react';

import { FiCircle } from 'react-icons/fi';
import { IoMdClose } from 'react-icons/io';
import { useQueryClient } from '@tanstack/react-query';
import { useRouter, useSearchParams } from 'next/navigation';

import { postsKeys } from '@/app/api/posts/posts.keys';
import { buildPostPayload } from '@/app/api/posts/posts.payload';
import { useAuthStore } from '@/app/shared/store/authStore';
import { useToast } from '@/app/shared/components/toast/toast';
import { useDraftDetailQuery, useDraftsQuery } from '@/app/api/posts/posts.queries';
import { useCreatePostMutation, useUpdatePostMutation } from '@/app/api/posts/posts.mutations';

import { useAutoSave } from './useAutoSave';
import {
  DRAFT_TOAST_DURATION_MS,
  TOAST_CATEGORY_REQUIRED_MESSAGE,
  TOAST_CONTENT_REQUIRED_MESSAGE,
  TOAST_DRAFT_SAVED_MESSAGE,
  TOAST_SAVE_FAILURE_MESSAGE,
  TOAST_SAVE_SUCCESS_MESSAGE,
  TOAST_TITLE_REQUIRED_MESSAGE,
} from '../postCreate.constants';

import type { AxiosError } from 'axios';
import type { DraftData } from '@/app/shared/types/post';
import type { ApiErrorResponse } from '@/app/shared/types/error';

export const useDraftManager = (formData: DraftData, setFormData: (data: Partial<DraftData>) => void) => {
  // 라우터 및 유틸리티
  const router = useRouter();
  const { showToast } = useToast();
  const queryClient = useQueryClient();
  const { accessToken } = useAuthStore();

  // 공통 validation
  const getValidatedFormData = () => ({
    tags: formData.tags,
    title: formData.title.trim(),
    content: formData.content.trim(),
    thumbnail: formData.thumbnailUrl.trim(),
    categoryId: formData.categoryId || null,
  });

  // 발행 필수 항목 검증
  const validatePublishRequirements = (validated: ReturnType<typeof getValidatedFormData>) => {
    if (!validated.title) {
      showToast({ message: TOAST_TITLE_REQUIRED_MESSAGE, type: 'warning' });
      return false;
    }
    if (!validated.categoryId) {
      showToast({ message: TOAST_CATEGORY_REQUIRED_MESSAGE, type: 'warning' });
      return false;
    }
    if (!validated.content) {
      showToast({ message: TOAST_CONTENT_REQUIRED_MESSAGE, type: 'warning' });
      return false;
    }
    return true;
  };

  // 에러 핸들링
  const handleApiError = (error: unknown) => {
    const axiosError = error as AxiosError<ApiErrorResponse>;
    const message = axiosError.response?.data?.message ?? TOAST_SAVE_FAILURE_MESSAGE;
    showToast({ message, type: 'error' });
  };

  // URL 파라미터
  const searchParams = useSearchParams();
  const searchDraftId = searchParams.get('draftId');

  // Mutations
  const createPostMutation = useCreatePostMutation();
  const updatePostMutation = useUpdatePostMutation();

  // State
  const draftNoticeShownRef = useRef(false);
  const prevSearchDraftIdRef = useRef<string | null>(searchDraftId);

  // Queries
  const isAuthenticated = !!accessToken;
  const { data: draftList } = useDraftsQuery({ limit: 20 }, { enabled: isAuthenticated });

  // 파생 상태
  const draftId = searchDraftId ?? null;
  const { data: draftDetail } = useDraftDetailQuery(draftId ?? undefined, { enabled: isAuthenticated });
  const hasDrafts = (draftList?.items?.length ?? 0) > 0;
  const lastSavedAt = draftDetail?.updatedAt ?? null;

  // draft 불러오기
  useEffect(() => {
    if (!draftDetail) return;
    setFormData({
      title: draftDetail.title ?? '',
      categoryId: draftDetail.category?.id ?? '',
      thumbnailUrl: draftDetail.thumbnailUrl ?? '',
      content: draftDetail.content ?? '',
      tags: draftDetail.tags?.map(tag => tag.name) ?? [],
    });
  }, [draftDetail, setFormData]);

  // draftId 변경 시 폼 초기화
  useEffect(() => {
    if (prevSearchDraftIdRef.current === searchDraftId) return;
    const previousDraftId = prevSearchDraftIdRef.current;
    prevSearchDraftIdRef.current = searchDraftId;

    if (!searchDraftId || previousDraftId) {
      setFormData({
        title: '',
        categoryId: '',
        thumbnailUrl: '',
        content: '',
        tags: [],
      });
    }
  }, [searchDraftId, setFormData]);

  // draft 알림 표시
  useEffect(() => {
    if (draftNoticeShownRef.current) return;
    if (draftId) return;
    if (!hasDrafts) return;
    draftNoticeShownRef.current = true;
    showToast({
      message: '이전에 저장된 초안이 있습니다.',
      type: 'info',
      duration: 4000,
      actions: [
        {
          id: 'draft-open',
          label: '임시저장 목록 보기',
          ariaLabel: '임시저장 목록 보기',
          icon: FiCircle,
          className: 'action',
          onClick: () => router.push('/posts/drafts'),
        },
        {
          id: 'draft-close',
          label: '알림 닫기',
          ariaLabel: '알림 닫기',
          icon: IoMdClose,
          className: 'close',
          onClick: () => {},
        },
      ],
    });
  }, [draftId, hasDrafts, router, showToast]);

  // 임시저장
  const saveDraft = async (options?: { silent?: boolean }) => {
    const silent = options?.silent ?? false;
    const validated = getValidatedFormData();
    const hasDraftInput = Boolean(
      validated.title || validated.content || validated.categoryId || validated.thumbnail || validated.tags.length > 0,
    );

    if (!hasDraftInput) {
      if (!silent) {
        showToast({ message: '입력한 내용이 없습니다.', type: 'warning' });
      }
      return;
    }

    if (!isAuthenticated) {
      if (!silent) {
        showToast({ message: '로그인 후 이용해주세요.', type: 'warning' });
      }
      return;
    }

    if (createPostMutation.isPending || updatePostMutation.isPending) return;

    try {
      const payload = buildPostPayload(
        {
          tags: validated.tags,
          title: validated.title,
          content: formData.content,
          categoryId: validated.categoryId,
          thumbnailUrl: validated.thumbnail,
        },
        'DRAFT',
        { includeEmptyThumbnail: Boolean(draftId) },
      );

      let savedDraftId = draftId;
      if (draftId) {
        await updatePostMutation.mutateAsync({ id: draftId, ...payload });
      } else {
        const response = await createPostMutation.mutateAsync(payload);
        savedDraftId = response.id;
        router.replace(`/posts/new?draftId=${response.id}`);
      }

      queryClient.invalidateQueries({ queryKey: postsKeys.drafts(), exact: false });
      if (savedDraftId) {
        queryClient.invalidateQueries({ queryKey: postsKeys.draft(savedDraftId) });
      }
      showToast({ message: TOAST_DRAFT_SAVED_MESSAGE, type: 'success', duration: DRAFT_TOAST_DURATION_MS });
    } catch (error) {
      handleApiError(error);
    }
  };

  // 게시물 발행
  const publishPost = async () => {
    if (!isAuthenticated) {
      showToast({ message: '로그인 후 이용해주세요.', type: 'warning' });
      return;
    }

    const validated = getValidatedFormData();
    if (!validatePublishRequirements(validated)) return;

    if (createPostMutation.isPending || updatePostMutation.isPending) return;

    try {
      const payload = buildPostPayload(
        {
          tags: validated.tags,
          title: validated.title,
          content: formData.content,
          categoryId: validated.categoryId,
          thumbnailUrl: validated.thumbnail,
        },
        'PUBLISHED',
        { includeEmptyThumbnail: Boolean(draftId) },
      );

      if (draftId) {
        await updatePostMutation.mutateAsync({ id: draftId, ...payload });
      } else {
        await createPostMutation.mutateAsync(payload);
      }

      showToast({ message: TOAST_SAVE_SUCCESS_MESSAGE, type: 'success' });
      router.replace('/');
    } catch (error) {
      handleApiError(error);
    }
  };

  // 임시저장 목록 열기
  const openDraftList = () => {
    router.push('/posts/drafts');
  };

  // 자동저장
  useAutoSave({ formData, isAuthenticated, saveDraft });

  return {
    state: {
      lastSavedAt,
    },
    data: {
      draftList,
    },
    handlers: {
      saveDraft,
      publishPost,
      openDraftList,
    },
  };
};
