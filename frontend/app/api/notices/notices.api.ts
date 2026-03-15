import { axiosInstance } from '@/app/shared/lib/axios/axios.instance';

import type {
  CreateNoticeRequest,
  CreateNoticeResponse,
  NoticeDetailResponse,
  NoticesListResponse,
  ToggleNoticeReactionResponse,
  UpdateNoticeRequest,
} from '@/app/shared/types/notices';

// 공지 목록 조회
const getNotices = async (): Promise<NoticesListResponse> => {
  const res = await axiosInstance.get<NoticesListResponse>('/notices');
  return res.data;
};

// 공지 상세 조회
const getNoticeDetail = async (noticeId: string): Promise<NoticeDetailResponse> => {
  const res = await axiosInstance.get<NoticeDetailResponse>(`/notices/${noticeId}`);
  return res.data;
};

// 공지 리액션 토글
const toggleNoticeReaction = async (noticeId: string, emoji: string): Promise<ToggleNoticeReactionResponse> => {
  const res = await axiosInstance.post<ToggleNoticeReactionResponse>(`/notices/${noticeId}/reactions`, { emoji });
  return res.data;
};

// 다음 업데이트 버전 조회
const getNextVersion = async (releaseType?: string): Promise<{ version: string }> => {
  const res = await axiosInstance.get<{ version: string }>('/notices/next-version', {
    params: releaseType ? { releaseType } : undefined,
  });
  return res.data;
};

// 공지 생성
const createNotice = async (payload: CreateNoticeRequest): Promise<CreateNoticeResponse> => {
  const res = await axiosInstance.post<CreateNoticeResponse>('/notices', payload);
  return res.data;
};

// 공지 수정
const updateNotice = async (noticeId: string, payload: UpdateNoticeRequest): Promise<{ id: string }> => {
  const res = await axiosInstance.patch<{ id: string }>(`/notices/${noticeId}`, payload);
  return res.data;
};

// 공지 삭제
const deleteNotice = async (noticeId: string): Promise<{ id: string }> => {
  const res = await axiosInstance.delete<{ id: string }>(`/notices/${noticeId}`);
  return res.data;
};

export const noticesApi = {
  createNotice,
  deleteNotice,
  getNextVersion,
  getNoticeDetail,
  getNotices,
  toggleNoticeReaction,
  updateNotice,
};
