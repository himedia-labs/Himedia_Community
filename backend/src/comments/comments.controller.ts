import { Body, Controller, Delete, Get, Param, Patch, Post, Request, UseGuards } from '@nestjs/common';

import { JwtGuard } from '@/auth/guards/jwt.guard';
import { OptionalJwtGuard } from '@/auth/guards/optional-jwt.guard';

import { CommentsService } from '@/comments/comments.service';
import { CreateCommentDto } from '@/comments/dto/createComment.dto';
import { UpdateCommentDto } from '@/comments/dto/updateComment.dto';

import type { Request as ExpressRequest } from 'express';
import type { JwtPayload } from '@/auth/interfaces/jwt.interface';

@Controller('posts/:postId/comments')
export class CommentsController {
  constructor(private readonly commentsService: CommentsService) {}

  /**
   * 댓글 목록 조회
   * @description 게시글 댓글과 반응 정보를 반환
   */
  @Get()
  @UseGuards(OptionalJwtGuard)
  getComments(@Param('postId') postId: string, @Request() req: ExpressRequest & { user?: JwtPayload }) {
    const userId = req.user?.sub ?? null;
    return this.commentsService.getCommentsByPostId(postId, userId);
  }

  /**
   * 댓글 생성
   * @description 게시글에 댓글을 등록
   */
  @UseGuards(JwtGuard)
  @Post()
  createComment(
    @Param('postId') postId: string,
    @Body() body: CreateCommentDto,
    @Request() req: ExpressRequest & { user: JwtPayload },
  ) {
    return this.commentsService.createComment(postId, body, req.user.sub);
  }

  /**
   * 댓글 좋아요 토글
   * @description 댓글 좋아요를 등록/해제
   */
  @UseGuards(JwtGuard)
  @Post(':commentId/like')
  toggleLike(
    @Param('postId') postId: string,
    @Param('commentId') commentId: string,
    @Request() req: ExpressRequest & { user: JwtPayload },
  ) {
    return this.commentsService.toggleCommentLike(postId, commentId, req.user.sub);
  }

  /**
   * 댓글 수정
   * @description 댓글 내용을 수정
   */
  @UseGuards(JwtGuard)
  @Patch(':commentId')
  updateComment(
    @Param('postId') postId: string,
    @Param('commentId') commentId: string,
    @Body() body: UpdateCommentDto,
    @Request() req: ExpressRequest & { user: JwtPayload },
  ) {
    return this.commentsService.updateComment(postId, commentId, body, req.user.sub);
  }

  /**
   * 댓글 삭제
   * @description 댓글을 소프트 삭제
   */
  @UseGuards(JwtGuard)
  @Delete(':commentId')
  deleteComment(
    @Param('postId') postId: string,
    @Param('commentId') commentId: string,
    @Request() req: ExpressRequest & { user: JwtPayload },
  ) {
    return this.commentsService.deleteComment(postId, commentId, req.user.sub);
  }
}

@Controller('comments')
export class MyCommentsController {
  constructor(private readonly commentsService: CommentsService) {}

  /**
   * 내 댓글 조회
   * @description 사용자가 작성한 댓글 목록을 반환
   */
  @UseGuards(JwtGuard)
  @Get('me')
  getMyComments(@Request() req: ExpressRequest & { user: JwtPayload }) {
    return this.commentsService.getCommentsByAuthorId(req.user.sub);
  }
}
