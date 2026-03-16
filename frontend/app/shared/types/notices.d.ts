import type { MouseEvent } from 'react';

export interface NoticeReactionItem {
  emoji: string;
  count: number;
}

export interface NoticeReactionOption {
  emoji: string;
  label: string;
}

export interface NoticeAnnouncementItem {
  id: string;
  title: string;
  publishedAt: string;
  markdownContent?: string;
}

export interface NoticeUpdateRelease {
  id: string;
  version: string;
  title: string;
  publishedAt: string;
  publishedLabel: string;
  adminName: string;
  adminInitial: string;
  adminProfileImageUrl: string | null;
  releaseType: string;
  releaseScope: string;
  reactorCount: number;
  selectedEmojis: string[];
  reactions: NoticeReactionItem[];
  markdownContent: string;
}

export interface NoticesListResponse {
  announcements: NoticeAnnouncementItem[];
  updates: NoticeUpdateRelease[];
}

export interface ToggleNoticeReactionResponse {
  noticeId: string;
  reactorCount: number;
  selectedEmojis: string[];
  reactions: NoticeReactionItem[];
}

export interface NoticeDetailResponse {
  id: string;
  type: 'ANNOUNCEMENT' | 'UPDATE';
  title: string;
  publishedAt: string;
  markdownContent: string;
  version: string | null;
  releaseType: string | null;
  releaseScope: string | null;
}

export interface CreateNoticeRequest {
  type: 'ANNOUNCEMENT' | 'UPDATE';
  title: string;
  version?: string;
  releaseType?: string;
  releaseScope?: string;
  markdownContent: string;
  publishedAt?: string;
}

export interface CreateNoticeResponse {
  id: string;
  type: 'ANNOUNCEMENT' | 'UPDATE';
}

export interface UpdateNoticeRequest {
  title?: string;
  version?: string;
  releaseType?: string;
  releaseScope?: string;
  markdownContent?: string;
  publishedAt?: string;
}

export interface NoticesUpdatesSectionProps {
  releases: NoticeUpdateRelease[];
}

export interface NoticesAnnouncementsSectionProps {
  notices: NoticeAnnouncementItem[];
}

export interface NoticesPageSearchParams {
  view?: string | string[];
}

export interface NoticesPageProps {
  searchParams?: Promise<NoticesPageSearchParams>;
}

export interface NoticeDetailPageProps {
  params: Promise<{
    noticeId: string;
  }>;
}

export type NoticeReactionMap = Record<string, NoticeReactionItem[]>;
export type NoticeSelectedReactionMap = Record<string, string[]>;

export type NoticeToggleReactionMenu = (releaseId: string) => void;

export type NoticeSelectReaction = (releaseId: string, emoji: string) => Promise<void> | void;

export type NoticeReactionButtonHandler = (event: MouseEvent<HTMLButtonElement>) => void;
