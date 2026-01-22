import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { IsNull, Repository } from 'typeorm';

import { ERROR_CODES } from '../constants/error/error-codes';
import type { ErrorCode } from '../constants/error/error-codes';
import { NOTIFICATION_ERROR_MESSAGES } from '../constants/message/notification.messages';
import { SnowflakeService } from '../common/services/snowflake.service';
import { Notification, NotificationType } from './entities/notification.entity';

type CreateNotificationInput = {
  actorUserId: string;
  targetUserId: string;
  type: NotificationType;
  postId?: string | null;
  commentId?: string | null;
};

const buildExcerpt = (value: string | null | undefined, maxLength = 60) => {
  if (!value) return '';
  const trimmed = value.trim();
  if (trimmed.length <= maxLength) return trimmed;
  return `${trimmed.slice(0, maxLength)}...`;
};

@Injectable()
export class NotificationsService {
  constructor(
    @InjectRepository(Notification)
    private readonly notificationsRepository: Repository<Notification>,
    private readonly snowflakeService: SnowflakeService,
  ) {}

  async createNotification({
    actorUserId,
    targetUserId,
    type,
    postId = null,
    commentId = null,
  }: CreateNotificationInput) {
    const safeActorId = actorUserId.trim();
    const safeTargetId = targetUserId.trim();
    if (safeActorId === safeTargetId) return;

    const notification = this.notificationsRepository.create({
      id: this.snowflakeService.generate(),
      actorUserId: safeActorId,
      targetUserId: safeTargetId,
      postId,
      commentId,
      type,
      readAt: null,
    });

    await this.notificationsRepository.save(notification);
  }

  async getNotifications(userId: string, limit = 50) {
    const safeUserId = userId.trim();
    const take = Math.min(Math.max(limit, 1), 100);

    const notifications = await this.notificationsRepository.find({
      where: { targetUserId: safeUserId },
      order: { createdAt: 'DESC' },
      take,
      relations: { actorUser: true, post: true, comment: true },
    });

    const unreadCount = await this.notificationsRepository.count({
      where: { targetUserId: safeUserId, readAt: IsNull() },
    });

    return {
      unreadCount,
      items: notifications.map(notification => {
        const actorName = notification.actorUser?.name ?? '누군가';
        const postTitle = notification.post?.title ?? '게시글';
        const commentContent = notification.comment?.content ?? '';
        const commentExcerpt = buildExcerpt(commentContent);

        let title = '';
        let description = '';
        let href = notification.postId ? `/posts/${notification.postId}` : '/';

        switch (notification.type) {
          case NotificationType.POST_LIKE:
            title = `${actorName}님이 내 게시글을 좋아합니다`;
            description = `“${postTitle}”`;
            break;
          case NotificationType.POST_COMMENT:
            title = `${actorName}님이 내 게시글에 댓글을 남겼어요`;
            description = commentExcerpt ? `“${commentExcerpt}”` : '“댓글이 도착했어요.”';
            if (notification.commentId) {
              href = `/posts/${notification.postId}#comment-${notification.commentId}`;
            }
            break;
          case NotificationType.COMMENT_LIKE:
            title = `${actorName}님이 내 댓글을 좋아합니다`;
            description = commentExcerpt ? `“${commentExcerpt}”` : '“댓글에 좋아요가 달렸어요.”';
            if (notification.commentId) {
              href = `/posts/${notification.postId}#comment-${notification.commentId}`;
            }
            break;
          case NotificationType.COMMENT_REPLY:
            title = `${actorName}님이 내 댓글에 답글을 남겼어요`;
            description = commentExcerpt ? `“${commentExcerpt}”` : '“답글이 도착했어요.”';
            if (notification.commentId) {
              href = `/posts/${notification.postId}#comment-${notification.commentId}`;
            }
            break;
          default:
            break;
        }

        return {
          id: notification.id,
          type: notification.type,
          title,
          description,
          href,
          createdAt: notification.createdAt.toISOString(),
          createdAtMs: notification.createdAt.getTime(),
          isRead: Boolean(notification.readAt),
        };
      }),
    };
  }

  async markAllRead(userId: string) {
    const safeUserId = userId.trim();
    const result = await this.notificationsRepository.update(
      { targetUserId: safeUserId, readAt: IsNull() },
      { readAt: new Date() },
    );

    return { updated: result.affected ?? 0 };
  }

  async markRead(userId: string, notificationId: string) {
    const notification = await this.notificationsRepository.findOne({
      where: { id: notificationId, targetUserId: userId },
    });

    if (!notification) {
      const code = ERROR_CODES.NOTIFICATION_NOT_FOUND as ErrorCode;
      throw new NotFoundException({ message: NOTIFICATION_ERROR_MESSAGES.NOTIFICATION_NOT_FOUND, code });
    }

    if (!notification.readAt) {
      notification.readAt = new Date();
      await this.notificationsRepository.save(notification);
    }

    return { id: notification.id };
  }
}
