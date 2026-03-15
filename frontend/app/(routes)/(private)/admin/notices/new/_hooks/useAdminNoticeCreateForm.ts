'use client';

import { useEffect, useState } from 'react';
import { useParams, useRouter, useSearchParams } from 'next/navigation';

import { noticesApi } from '@/app/api/notices/notices.api';
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

  // 폼 상태
  const [title, setTitle] = useState('');
  const [version, setVersion] = useState('');
  const [releaseType, setReleaseType] = useState('');
  const [releaseScope, setReleaseScope] = useState('');
  const [publishedAt, setPublishedAt] = useState('');
  const [markdownContent, setMarkdownContent] = useState('');
  const [noticeType, setNoticeType] = useState<CreateNoticeRequest['type']>(
    getNoticeTypeFromSearchParam(searchParams.get('type')),
  );
  const [isInitialized, setIsInitialized] = useState(false);

  // 타입 동기화
  useEffect(() => {
    if (!isEditMode) {
      setNoticeType(getNoticeTypeFromSearchParam(searchParams.get('type')));
    }
  }, [searchParams, isEditMode]);

  // 수정 모드: 기존 데이터로 폼 채우기
  useEffect(() => {
    if (!isEditMode || !existingNotice || isInitialized) return;

    setTitle(existingNotice.title);
    setMarkdownContent(existingNotice.markdownContent);
    setNoticeType(existingNotice.type);

    if (existingNotice.type === 'UPDATE') {
      setVersion(existingNotice.version ?? '');
      setReleaseType(existingNotice.releaseType ?? '');
      setReleaseScope(existingNotice.releaseScope ?? '');

      // publishedAt: YYYY.MM.DD → YYYY-MM-DD
      if (existingNotice.publishedAt) {
        setPublishedAt(existingNotice.publishedAt.replace(/\./g, '-'));
      }
    }

    setIsInitialized(true);
  }, [isEditMode, existingNotice, isInitialized]);

  // 업데이트 타입일 때 릴리즈 타입에 따라 다음 버전 자동 조회 (생성 모드에서만)
  useEffect(() => {
    if (noticeType !== 'UPDATE' || isEditMode) return;

    noticesApi
      .getNextVersion(releaseType || undefined)
      .then(data => {
        setVersion(data.version);
      })
      .catch(() => {
        setVersion('0.1.0');
      });
  }, [noticeType, releaseType, isEditMode]);

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
