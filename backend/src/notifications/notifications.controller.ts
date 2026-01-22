import { Controller, Get, Param, Patch, Query, Request, UseGuards } from '@nestjs/common';

import { JwtGuard } from '../auth/guards/jwt.guard';
import { NotificationsService } from './notifications.service';

import type { JwtPayload } from '../auth/interfaces/jwt.interface';
import type { Request as ExpressRequest } from 'express';

@Controller('notifications')
@UseGuards(JwtGuard)
export class NotificationsController {
  constructor(private readonly notificationsService: NotificationsService) {}

  @Get()
  getNotifications(
    @Request() req: ExpressRequest & { user: JwtPayload },
    @Query('limit') limit?: string,
  ) {
    const parsed = limit ? Number(limit) : undefined;
    const safeLimit = Number.isFinite(parsed) ? Number(parsed) : undefined;
    return this.notificationsService.getNotifications(req.user.sub, safeLimit);
  }

  @Patch('read-all')
  markAllRead(@Request() req: ExpressRequest & { user: JwtPayload }) {
    return this.notificationsService.markAllRead(req.user.sub);
  }

  @Patch(':notificationId/read')
  markRead(
    @Param('notificationId') notificationId: string,
    @Request() req: ExpressRequest & { user: JwtPayload },
  ) {
    return this.notificationsService.markRead(req.user.sub, notificationId);
  }
}
