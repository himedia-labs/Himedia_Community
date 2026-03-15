'use client';

import { useEffect, useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';

import { noticesApi } from '@/app/api/notices/notices.api';
import { useCreateNoticeMutation } from '@/app/api/notices/notices.mutations';
import { ADMIN_QUERY_KEYS, ADMIN_TAB_QUERY_VALUE } from '@/app/shared/constants/config/admin.config';
import { useToast } from '@/app/shared/components/toast/toast';

import type { CreateNoticeRequest } from '@/app/shared/types/notices';

// 타입 파라미터 확인
const getNoticeTypeFromSearchParam = (type?: string | null): CreateNoticeRequest['type'] =>
  type?.toUpperCase() === 'UPDATE' ? 'UPDATE' : 'ANNOUNCEMENT';

/**
 * 관리자 공지 작성 폼 훅
 * @description 공지 작성 입력값과 저장 동작을 관리합니다.
 */
export const useAdminNoticeCreateForm = () => {
  // 공용 훅
  const router = useRouter();
  const searchParams = useSearchParams();
  const { showToast } = useToast();
  const createNoticeMutation = useCreateNoticeMutation();

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

  // 타입 동기화
  useEffect(() => {
    setNoticeType(getNoticeTypeFromSearchParam(searchParams.get('type')));
  }, [searchParams]);

  // 업데이트 타입일 때 릴리즈 타입에 따라 다음 버전 자동 조회
  useEffect(() => {
    if (noticeType !== 'UPDATE') return;

    noticesApi
      .getNextVersion(releaseType || undefined)
      .then(data => {
        setVersion(data.version);
      })
      .catch(() => {
        setVersion('0.1.0');
      });
  }, [noticeType, releaseType]);

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
      router.push(
        `/admin?${ADMIN_QUERY_KEYS.TAB}=${
          noticeType === 'UPDATE' ? ADMIN_TAB_QUERY_VALUE.NOTICE_UPDATES : ADMIN_TAB_QUERY_VALUE.NOTICE_ANNOUNCEMENTS
        }`,
      );
    } catch {
      showToast({ message: '공지 등록에 실패했습니다.', type: 'error' });
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
      isSubmitting: createNoticeMutation.isPending,
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
