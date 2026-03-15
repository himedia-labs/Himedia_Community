import type { Request as ExpressRequest } from 'express';

import type { JwtPayload } from '../auth/interfaces/jwt.interface';
import type { NoticeType } from './entities/notice.entity';

export type AuthRequest = ExpressRequest & { user: JwtPayload };

export type OptionalAuthRequest = ExpressRequest & { user?: JwtPayload };

export interface NoticeReactionItemView {
  emoji: string;
  count: number;
}

export interface NoticeAnnouncementView {
  id: string;
  title: string;
  publishedAt: string;
}

export interface NoticeUpdateView {
  id: string;
  version: string;
  title: string;
  publishedAt: string;
  publishedLabel: string;
  adminName: string;
  adminInitial: string;
  releaseType: string;
  releaseScope: string;
  reactorCount: number;
  selectedEmojis: string[];
  reactions: NoticeReactionItemView[];
  markdownContent: string;
}

export interface NoticesListView {
  announcements: NoticeAnnouncementView[];
  updates: NoticeUpdateView[];
}

export interface ToggleNoticeReactionView {
  noticeId: string;
  reactorCount: number;
  selectedEmojis: string[];
  reactions: NoticeReactionItemView[];
}

export interface NoticeDetailView {
  id: string;
  title: string;
  publishedAt: string;
  markdownContent: string;
}

export interface CreateNoticeView {
  id: string;
  type: NoticeType;
}
