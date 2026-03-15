import { Body, Controller, Delete, Get, Param, Patch, Post, Query, Request, UseGuards } from '@nestjs/common';

import { Roles } from '../auth/decorators/roles.decorator';
import { UserRole } from '../auth/entities/user.entity';
import { JwtGuard } from '../auth/guards/jwt.guard';
import { OptionalJwtGuard } from '../auth/guards/optional-jwt.guard';
import { RolesGuard } from '../auth/guards/roles.guard';

import { CreateNoticeDto } from './dto/createNotice.dto';
import { UpdateNoticeDto } from './dto/updateNotice.dto';
import { ToggleNoticeReactionDto } from './dto/toggleNoticeReaction.dto';
import { NoticesService } from './notices.service';

import type { AuthRequest, OptionalAuthRequest } from './notices.types';

@Controller('notices')
export class NoticesController {
  /**
   * 공지 컨트롤러
   * @description 공지 목록 조회와 업데이트 리액션 요청을 처리합니다.
   */
  constructor(private readonly noticesService: NoticesService) {}

  /**
   * 공지 목록
   * @description 공지사항과 업데이트 내역 목록을 반환합니다.
   */
  @Get()
  @UseGuards(OptionalJwtGuard)
  getNotices(@Request() req: OptionalAuthRequest) {
    return this.noticesService.getNotices(req.user?.sub);
  }

  /**
   * 다음 업데이트 버전 조회
   * @description 마지막 업데이트 버전에서 patch를 +1한 다음 버전을 반환합니다.
   */
  @Get('next-version')
  @UseGuards(JwtGuard, RolesGuard)
  @Roles(UserRole.ADMIN)
  getNextVersion(@Query('releaseType') releaseType?: string) {
    return this.noticesService.getNextVersion(releaseType);
  }

  /**
   * 공지 상세 조회
   * @description 공지사항 ID로 단건 조회합니다.
   */
  @Get(':noticeId')
  getNotice(@Param('noticeId') noticeId: string) {
    return this.noticesService.getNotice(noticeId);
  }

  /**
   * 공지 생성
   * @description 관리자가 새 공지사항 또는 업데이트 내역을 생성합니다.
   */
  @Post()
  @UseGuards(JwtGuard, RolesGuard)
  @Roles(UserRole.ADMIN)
  createNotice(@Body() body: CreateNoticeDto, @Request() req: AuthRequest) {
    return this.noticesService.createNotice(body, req.user.sub);
  }

  /**
   * 공지 수정
   * @description 관리자가 공지사항 또는 업데이트 내역을 수정합니다.
   */
  @Patch(':noticeId')
  @UseGuards(JwtGuard, RolesGuard)
  @Roles(UserRole.ADMIN)
  updateNotice(@Param('noticeId') noticeId: string, @Body() body: UpdateNoticeDto) {
    return this.noticesService.updateNotice(noticeId, body);
  }

  /**
   * 공지 삭제
   * @description 관리자가 공지사항 또는 업데이트 내역을 삭제합니다.
   */
  @Delete(':noticeId')
  @UseGuards(JwtGuard, RolesGuard)
  @Roles(UserRole.ADMIN)
  deleteNotice(@Param('noticeId') noticeId: string) {
    return this.noticesService.deleteNotice(noticeId);
  }

  /**
   * 공지 리액션 토글
   * @description 특정 업데이트 공지의 이모지 리액션을 토글합니다.
   */
  @Post(':noticeId/reactions')
  @UseGuards(JwtGuard)
  toggleReaction(
    @Param('noticeId') noticeId: string,
    @Body() body: ToggleNoticeReactionDto,
    @Request() req: AuthRequest,
  ) {
    return this.noticesService.toggleReaction(noticeId, req.user.sub, body.emoji);
  }
}
