'use client';

import { useRef, useState } from 'react';
import { useQueryClient } from '@tanstack/react-query';

import { adminApi } from '@/app/api/admin/admin.api';
import { notificationsKeys } from '@/app/api/notifications/notifications.keys';
import { uploadsApi } from '@/app/api/uploads/uploads.api';

import { useToast } from '@/app/shared/components/toast/toast';
import { useAuthStore } from '@/app/shared/store/authStore';

import type { KeyboardEvent } from 'react';

const NOTICE_TITLE_MAX_LENGTH = 30;
const NOTICE_CONTENT_MAX_LENGTH = 3000;
const NOTICE_ATTACHMENT_MAX_COUNT = 3;
const NOTICE_ALLOWED_IMAGE_TYPES = new Set(['image/jpeg', 'image/png', 'image/webp', 'image/gif']);

type NoticeAttachment = {
  name: string;
  url: string;
};

/**
 * 버그 제보 폼 훅
 * @description 버그 제보 모달 상태와 입력/업로드 핸들러를 관리한다
 */
export const useBugReportForm = () => {
  const queryClient = useQueryClient();
  const { showToast } = useToast();

  // 인증 상태
  const accessToken = useAuthStore(state => state.accessToken);

  // 폼 상태
  const [noticeTitle, setNoticeTitle] = useState('');
  const [noticeContent, setNoticeContent] = useState('');
  const [isNoticeModalOpen, setIsNoticeModalOpen] = useState(false);
  const [isNoticeSubmitting, setIsNoticeSubmitting] = useState(false);
  const [isNoticeImageUploading, setIsNoticeImageUploading] = useState(false);
  const [noticeAttachments, setNoticeAttachments] = useState<NoticeAttachment[]>([]);

  // 입력 참조
  const noticeTitleLimitToastAtRef = useRef(0);
  const noticeContentLimitToastAtRef = useRef(0);
  const noticeImageInputRef = useRef<HTMLInputElement | null>(null);

  /**
   * 모달 열기
   * @description 버그 제보 입력 모달을 연다
   */
  const handleOpenNoticeModal = () => {
    setIsNoticeModalOpen(true);
  };

  /**
   * 모달 닫기
   * @description 버그 제보 입력 상태를 초기화하고 모달을 닫는다
   */
  const handleCloseNoticeModal = () => {
    setNoticeTitle('');
    setNoticeContent('');
    setNoticeAttachments([]);
    setIsNoticeImageUploading(false);
    setIsNoticeModalOpen(false);
  };

  /**
   * 제목 키 입력 제한
   * @description 제목 최대 글자수 초과 입력을 차단하고 안내 토스트를 표시한다
   */
  const handleNoticeTitleKeyDown = (event: KeyboardEvent<HTMLInputElement>) => {
    const target = event.currentTarget;
    const key = event.key;
    const isControlKey =
      key === 'Backspace' ||
      key === 'Delete' ||
      key === 'ArrowLeft' ||
      key === 'ArrowRight' ||
      key === 'ArrowUp' ||
      key === 'ArrowDown' ||
      key === 'Home' ||
      key === 'End' ||
      key === 'Tab' ||
      key === 'Enter';

    if (event.nativeEvent.isComposing || event.metaKey || event.ctrlKey || event.altKey || isControlKey) return;
    if (target.selectionStart !== target.selectionEnd) return;
    if (noticeTitle.length < NOTICE_TITLE_MAX_LENGTH) return;

    event.preventDefault();

    const now = Date.now();
    if (now - noticeTitleLimitToastAtRef.current < 1000) return;
    noticeTitleLimitToastAtRef.current = now;
    showToast({ message: `제목은 최대 ${NOTICE_TITLE_MAX_LENGTH}자까지 입력할 수 있습니다.`, type: 'warning' });
  };

  /**
   * 제목 변경
   * @description 붙여넣기/조합 입력까지 포함해 제목 길이를 최대값으로 고정한다
   */
  const handleNoticeTitleChange = (nextValue: string) => {
    if (nextValue.length <= NOTICE_TITLE_MAX_LENGTH) {
      setNoticeTitle(nextValue);
      return;
    }

    setNoticeTitle(nextValue.slice(0, NOTICE_TITLE_MAX_LENGTH));

    const now = Date.now();
    if (now - noticeTitleLimitToastAtRef.current < 1000) return;
    noticeTitleLimitToastAtRef.current = now;
    showToast({ message: `제목은 최대 ${NOTICE_TITLE_MAX_LENGTH}자까지 입력할 수 있습니다.`, type: 'warning' });
  };

  /**
   * 내용 키 입력 제한
   * @description 내용 최대 글자수 초과 입력을 차단하고 안내 토스트를 표시한다
   */
  const handleNoticeContentKeyDown = (event: KeyboardEvent<HTMLTextAreaElement>) => {
    const target = event.currentTarget;
    const key = event.key;
    const isControlKey =
      key === 'Backspace' ||
      key === 'Delete' ||
      key === 'ArrowLeft' ||
      key === 'ArrowRight' ||
      key === 'ArrowUp' ||
      key === 'ArrowDown' ||
      key === 'Home' ||
      key === 'End' ||
      key === 'Tab';

    if (event.nativeEvent.isComposing || event.metaKey || event.ctrlKey || event.altKey || isControlKey) return;
    if (target.selectionStart !== target.selectionEnd) return;
    if (noticeContent.length < NOTICE_CONTENT_MAX_LENGTH) return;

    event.preventDefault();

    const now = Date.now();
    if (now - noticeContentLimitToastAtRef.current < 1000) return;
    noticeContentLimitToastAtRef.current = now;
    showToast({ message: `내용은 최대 ${NOTICE_CONTENT_MAX_LENGTH}자까지 입력할 수 있습니다.`, type: 'warning' });
  };

  /**
   * 내용 변경
   * @description 붙여넣기/조합 입력까지 포함해 내용 길이를 최대값으로 고정한다
   */
  const handleNoticeContentChange = (nextValue: string) => {
    if (nextValue.length <= NOTICE_CONTENT_MAX_LENGTH) {
      setNoticeContent(nextValue);
      return;
    }

    setNoticeContent(nextValue.slice(0, NOTICE_CONTENT_MAX_LENGTH));

    const now = Date.now();
    if (now - noticeContentLimitToastAtRef.current < 1000) return;
    noticeContentLimitToastAtRef.current = now;
    showToast({ message: `내용은 최대 ${NOTICE_CONTENT_MAX_LENGTH}자까지 입력할 수 있습니다.`, type: 'warning' });
  };

  /**
   * 이미지 선택창 열기
   * @description 로그인 여부를 확인한 뒤 파일 선택창을 연다
   */
  const handleClickNoticeImageUpload = () => {
    if (!accessToken) {
      showToast({ message: '로그인 후 이미지 첨부가 가능합니다.', type: 'warning' });
      return;
    }

    noticeImageInputRef.current?.click();
  };

  /**
   * 이미지 업로드
   * @description 선택한 이미지를 검증 후 업로드하고 첨부 목록에 추가한다
   */
  const handleChangeNoticeImage = async (files: FileList | null) => {
    if (!files?.length) return;
    if (!accessToken) {
      showToast({ message: '로그인 후 이미지 첨부가 가능합니다.', type: 'warning' });
      return;
    }

    try {
      const remainingCount = NOTICE_ATTACHMENT_MAX_COUNT - noticeAttachments.length;
      if (remainingCount <= 0) {
        showToast({ message: `이미지는 최대 ${NOTICE_ATTACHMENT_MAX_COUNT}개까지 첨부할 수 있습니다.`, type: 'warning' });
        return;
      }

      if (files.length > remainingCount) {
        showToast({ message: `이미지는 최대 ${NOTICE_ATTACHMENT_MAX_COUNT}개까지 첨부할 수 있습니다.`, type: 'warning' });
      }

      setIsNoticeImageUploading(true);
      const selectedFiles = Array.from(files).slice(0, remainingCount);
      const validFiles = selectedFiles.filter(file => NOTICE_ALLOWED_IMAGE_TYPES.has(file.type));
      const invalidFiles = selectedFiles.filter(file => !NOTICE_ALLOWED_IMAGE_TYPES.has(file.type));

      if (invalidFiles.length) {
        showToast({
          message: 'HEIC/HEIF는 지원하지 않습니다. JPG, PNG, WEBP, GIF 파일만 업로드할 수 있습니다.',
          type: 'warning',
        });
      }

      if (!validFiles.length) return;

      const uploadedAttachments: NoticeAttachment[] = [];
      for (const file of validFiles) {
        const result = await uploadsApi.uploadImage(file);
        uploadedAttachments.push({ name: file.name, url: result.url });
      }

      setNoticeAttachments(prev => [...prev, ...uploadedAttachments]);
      showToast({ message: '이미지가 첨부되었습니다.', type: 'success' });
    } catch (error) {
      const defaultMessage = '이미지 첨부에 실패했습니다.';
      if (typeof error !== 'object' || !error || !('response' in error)) {
        showToast({ message: defaultMessage, type: 'error' });
      } else if (
        typeof error.response === 'object' &&
        error.response &&
        'data' in error.response &&
        typeof error.response.data === 'object' &&
        error.response.data &&
        'message' in error.response.data &&
        typeof error.response.data.message === 'string'
      ) {
        showToast({ message: error.response.data.message, type: 'error' });
      } else {
        showToast({ message: defaultMessage, type: 'error' });
      }
    } finally {
      setIsNoticeImageUploading(false);
      if (noticeImageInputRef.current) noticeImageInputRef.current.value = '';
    }
  };

  /**
   * 첨부 이미지 삭제
   * @description 선택한 첨부 이미지를 목록에서 제거한다
   */
  const handleRemoveNoticeAttachment = (targetUrl: string) => {
    setNoticeAttachments(prev => prev.filter(item => item.url !== targetUrl));
    showToast({ message: '첨부 이미지가 제거되었습니다.', type: 'success' });
  };

  /**
   * 버그 제보 제출
   * @description 제목/내용을 검증하고 제보 데이터를 서버로 전송한다
   */
  const handleSubmitNotice = async () => {
    if (!noticeTitle.trim() || !noticeContent.trim()) {
      showToast({ message: '제목과 내용을 입력해주세요.', type: 'warning' });
      return;
    }
    if (noticeTitle.trim().length > NOTICE_TITLE_MAX_LENGTH) {
      showToast({ message: `제목은 최대 ${NOTICE_TITLE_MAX_LENGTH}자까지 입력할 수 있습니다.`, type: 'warning' });
      return;
    }
    if (noticeContent.trim().length > NOTICE_CONTENT_MAX_LENGTH) {
      showToast({ message: `내용은 최대 ${NOTICE_CONTENT_MAX_LENGTH}자까지 입력할 수 있습니다.`, type: 'warning' });
      return;
    }

    try {
      setIsNoticeSubmitting(true);
      const attachmentText = noticeAttachments.length
        ? `\n\n첨부 이미지:\n${noticeAttachments.map(item => `- ${item.url}`).join('\n')}`
        : '';
      const contentWithImage = `${noticeContent.trim()}${attachmentText}`;

      await adminApi.createReport({ title: noticeTitle.trim(), content: contentWithImage });
      await queryClient.invalidateQueries({ queryKey: notificationsKeys.list() });
      showToast({ message: '버그 제보가 접수되었습니다.', type: 'success' });
      handleCloseNoticeModal();
    } catch {
      showToast({ message: '버그 제보 등록에 실패했습니다.', type: 'error' });
    } finally {
      setIsNoticeSubmitting(false);
    }
  };

  return {
    noticeTitle,
    noticeContent,
    isNoticeModalOpen,
    isNoticeSubmitting,
    isNoticeImageUploading,
    noticeImageInputRef,
    noticeAttachments,
    noticeTitleMaxLength: NOTICE_TITLE_MAX_LENGTH,
    noticeContentMaxLength: NOTICE_CONTENT_MAX_LENGTH,
    noticeAttachmentMaxCount: NOTICE_ATTACHMENT_MAX_COUNT,
    handleOpenNoticeModal,
    handleCloseNoticeModal,
    handleSubmitNotice,
    handleNoticeTitleKeyDown,
    handleNoticeTitleChange,
    handleNoticeContentKeyDown,
    handleNoticeContentChange,
    handleClickNoticeImageUpload,
    handleChangeNoticeImage,
    handleRemoveNoticeAttachment,
  };
};
