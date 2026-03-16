'use client';

import { type SetStateAction, useCallback, useMemo, useState } from 'react';
import { useParams, useRouter, useSearchParams } from 'next/navigation';

import { useCreateNoticeMutation, useUpdateNoticeMutation } from '@/app/api/notices/notices.mutations';
import { useNoticeDetailQuery } from '@/app/api/notices/notices.queries';
import { ADMIN_QUERY_KEYS, ADMIN_TAB_QUERY_VALUE } from '@/app/shared/constants/config/admin.config';
import { useToast } from '@/app/shared/components/toast/toast';

import type { CreateNoticeRequest } from '@/app/shared/types/notices';

// 타입 파라미터 확인
const getNoticeTypeFromSearchParam = (type?: string | null): CreateNoticeRequest['type'] =>
  type?.toUpperCase() === 'UPDATE' ? 'UPDATE' : 'ANNOUNCEMENT';

/**
 * 관리자 공지 작성 폼 훅
 * @description 공지 작성/수정 입력값과 저장 동작을 관리합니다.
 */
export const useAdminNoticeCreateForm = () => {
  // 공용 훅
  const router = useRouter();
  const params = useParams();
  const searchParams = useSearchParams();
  const { showToast } = useToast();
  const createNoticeMutation = useCreateNoticeMutation();
  const updateNoticeMutation = useUpdateNoticeMutation();

  // 수정 모드 감지 (라우트 파라미터 /admin/notices/edit/[noticeId])
  const editNoticeId = typeof params?.noticeId === 'string' ? params.noticeId : null;
  const isEditMode = Boolean(editNoticeId);

  // 기존 공지 데이터 조회 (수정 모드일 때만)
  const { data: existingNotice } = useNoticeDetailQuery(editNoticeId ?? '', {
    enabled: isEditMode,
  });

  // 초기값 계산: 수정 모드면 서버 데이터, 생성 모드면 빈 값
  const initialValues = useMemo(() => {
    if (isEditMode && existingNotice) {
      return {
        title: existingNotice.title,
        markdownContent: existingNotice.markdownContent,
        version: existingNotice.version ?? '',
        releaseType: existingNotice.releaseType ?? '',
        releaseScope: existingNotice.releaseScope ?? '',
        publishedAt: existingNotice.publishedAt?.replace(/\./g, '-') ?? '',
      };
    }

    return {
      title: '',
      markdownContent: '',
      version: '',
      releaseType: '',
      releaseScope: '',
      publishedAt: '',
    };
  }, [isEditMode, existingNotice]);

  // 폼 상태 (사용자가 직접 수정한 값)
  const [formEdits, setFormEdits] = useState<Record<string, string>>({});

  // 실제 폼 값: 사용자 수정이 있으면 그것, 없으면 초기값
  const title = formEdits.title ?? initialValues.title;
  const version = formEdits.version ?? initialValues.version;
  const releaseType = formEdits.releaseType ?? initialValues.releaseType;
  const releaseScope = formEdits.releaseScope ?? initialValues.releaseScope;
  const publishedAt = formEdits.publishedAt ?? initialValues.publishedAt;
  const markdownContent = formEdits.markdownContent ?? initialValues.markdownContent;

  // 공지 타입: 수정 모드면 서버 데이터, 생성 모드면 searchParams
  const noticeType: CreateNoticeRequest['type'] = isEditMode && existingNotice
    ? existingNotice.type
    : getNoticeTypeFromSearchParam(searchParams.get('type'));

  // 개별 setter (Dispatch<SetStateAction<string>> 호환)
  const resolveAction = (action: SetStateAction<string>, current: string) =>
    typeof action === 'function' ? action(current) : action;

  const setTitle = useCallback((action: SetStateAction<string>) => {
    setFormEdits(prev => ({ ...prev, title: resolveAction(action, prev.title ?? initialValues.title) }));
  }, [initialValues.title]);

  const setVersion = useCallback((action: SetStateAction<string>) => {
    setFormEdits(prev => ({ ...prev, version: resolveAction(action, prev.version ?? initialValues.version) }));
  }, [initialValues.version]);

  const setReleaseType = useCallback((action: SetStateAction<string>) => {
    setFormEdits(prev => ({ ...prev, releaseType: resolveAction(action, prev.releaseType ?? initialValues.releaseType) }));
  }, [initialValues.releaseType]);

  const setReleaseScope = useCallback((action: SetStateAction<string>) => {
    setFormEdits(prev => ({ ...prev, releaseScope: resolveAction(action, prev.releaseScope ?? initialValues.releaseScope) }));
  }, [initialValues.releaseScope]);

  const setPublishedAt = useCallback((action: SetStateAction<string>) => {
    setFormEdits(prev => ({ ...prev, publishedAt: resolveAction(action, prev.publishedAt ?? initialValues.publishedAt) }));
  }, [initialValues.publishedAt]);

  const setMarkdownContent = useCallback((action: SetStateAction<string>) => {
    setFormEdits(prev => ({ ...prev, markdownContent: resolveAction(action, prev.markdownContent ?? initialValues.markdownContent) }));
  }, [initialValues.markdownContent]);

  // 제출 처리
  const handleSubmit = async () => {
    if (!title.trim()) {
      showToast({ message: '제목을 입력해주세요.', type: 'warning' });
      return;
    }

    if (!markdownContent.trim()) {
      showToast({ message: '본문을 입력해주세요.', type: 'warning' });
      return;
    }

    if (noticeType === 'UPDATE' && !releaseType) {
      showToast({ message: '릴리즈 타입을 선택해주세요.', type: 'warning' });
      return;
    }

    if (noticeType === 'UPDATE' && !releaseScope) {
      showToast({ message: '릴리즈 범위를 선택해주세요.', type: 'warning' });
      return;
    }

    try {
      if (isEditMode && editNoticeId) {
        // 수정 모드
        await updateNoticeMutation.mutateAsync({
          noticeId: editNoticeId,
          payload: {
            title,
            version: noticeType === 'UPDATE' ? version : undefined,
            releaseType: noticeType === 'UPDATE' ? releaseType : undefined,
            releaseScope: noticeType === 'UPDATE' ? releaseScope : undefined,
            markdownContent,
            publishedAt: noticeType === 'UPDATE' && publishedAt ? publishedAt : undefined,
          },
        });

        showToast({ message: '공지가 수정되었습니다.', type: 'success' });
      } else {
        // 생성 모드
        await createNoticeMutation.mutateAsync({
          type: noticeType,
          title,
          version: noticeType === 'UPDATE' ? version : '',
          releaseType: noticeType === 'UPDATE' ? releaseType : '',
          releaseScope: noticeType === 'UPDATE' ? releaseScope : '',
          markdownContent,
          publishedAt: noticeType === 'UPDATE' && publishedAt ? publishedAt : undefined,
        });

        showToast({ message: '공지가 등록되었습니다.', type: 'success' });
      }

      router.push(
        `/admin?${ADMIN_QUERY_KEYS.TAB}=${
          noticeType === 'UPDATE' ? ADMIN_TAB_QUERY_VALUE.NOTICE_UPDATES : ADMIN_TAB_QUERY_VALUE.NOTICE_ANNOUNCEMENTS
        }`,
      );
    } catch {
      showToast({ message: isEditMode ? '공지 수정에 실패했습니다.' : '공지 등록에 실패했습니다.', type: 'error' });
    }
  };

  return {
    state: {
      title,
      version,
      releaseType,
      releaseScope,
      publishedAt,
      markdownContent,
      noticeType,
      isEditMode,
      isSubmitting: createNoticeMutation.isPending || updateNoticeMutation.isPending,
    },
    setters: {
      setTitle,
      setVersion,
      setReleaseType,
      setReleaseScope,
      setPublishedAt,
      setMarkdownContent,
    },
    handlers: {
      handleSubmit,
    },
  };
};
