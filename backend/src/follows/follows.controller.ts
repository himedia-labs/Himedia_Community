import { Controller, Delete, Get, Param, Post, Request, UseGuards } from '@nestjs/common';

import { JwtGuard } from '../auth/guards/jwt.guard';
import { FollowsService } from './follows.service';

import type { Request as ExpressRequest } from 'express';
import type { JwtPayload } from '../auth/interfaces/jwt.interface';

// 타입/정의
type AuthRequest = ExpressRequest & { user: JwtPayload };

@Controller('follows')
export class FollowsController {
  /**
   * 팔로우 컨트롤러
   * @description 팔로우 관련 요청을 처리
   */
  constructor(private readonly followsService: FollowsService) {}

  /**
   * 팔로우
   * @description 대상 사용자를 팔로우 처리
   */
  @UseGuards(JwtGuard)
  @Post(':userId')
  followUser(@Param('userId') userId: string, @Request() req: AuthRequest) {
    return this.followsService.followUser(userId, req.user.sub);
  }

  /**
   * 언팔로우
   * @description 대상 사용자 팔로우를 해제
   */
  @UseGuards(JwtGuard)
  @Delete(':userId')
  unfollowUser(@Param('userId') userId: string, @Request() req: AuthRequest) {
    return this.followsService.unfollowUser(userId, req.user.sub);
  }

  /**
   * 팔로워 목록
   * @description 내 팔로워 목록과 맞팔 여부를 반환
   */
  @UseGuards(JwtGuard)
  @Get('me/followers')
  getFollowers(@Request() req: AuthRequest) {
    return this.followsService.getFollowers(req.user.sub);
  }

  /**
   * 팔로잉 목록
   * @description 내 팔로잉 목록과 맞팔 여부를 반환
   */
  @UseGuards(JwtGuard)
  @Get('me/followings')
  getFollowings(@Request() req: AuthRequest) {
    return this.followsService.getFollowings(req.user.sub);
  }
}
