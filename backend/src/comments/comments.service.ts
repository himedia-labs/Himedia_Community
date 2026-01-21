import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { IsNull, Repository } from 'typeorm';

import { ERROR_CODES } from '../constants/error/error-codes';
import type { ErrorCode } from '../constants/error/error-codes';
import { COMMENT_ERROR_MESSAGES, COMMENT_VALIDATION_MESSAGES } from '../constants/message/comment.messages';
import { POST_ERROR_MESSAGES } from '../constants/message/post.messages';
import { SnowflakeService } from '../common/services/snowflake.service';
import { Post, PostStatus } from '../posts/entities/post.entity';
import { CreateCommentDto } from './dto/createComment.dto';
import { Comment } from './entities/comment.entity';

@Injectable()
export class CommentsService {
  constructor(
    @InjectRepository(Comment)
    private readonly commentsRepository: Repository<Comment>,
    @InjectRepository(Post)
    private readonly postsRepository: Repository<Post>,
    private readonly snowflakeService: SnowflakeService,
  ) {}

  async getCommentsByPostId(postId: string) {
    const post = await this.postsRepository.findOne({
      where: { id: postId, status: PostStatus.PUBLISHED },
      select: { id: true },
    });

    if (!post) {
      const code = ERROR_CODES.POST_NOT_FOUND as ErrorCode;
      throw new NotFoundException({
        message: POST_ERROR_MESSAGES.POST_NOT_FOUND,
        code,
      });
    }

    const comments = await this.commentsRepository.find({
      where: { postId, deletedAt: IsNull() },
      order: { createdAt: 'ASC' },
      relations: { author: true },
    });

    return comments.map(comment => ({
      id: comment.id,
      content: comment.content,
      parentId: comment.parentId,
      depth: comment.depth,
      likeCount: comment.likeCount,
      dislikeCount: comment.dislikeCount,
      createdAt: comment.createdAt,
      updatedAt: comment.updatedAt,
      author: comment.author
        ? { id: comment.author.id, name: comment.author.name, role: comment.author.role }
        : null,
    }));
  }

  async createComment(postId: string, body: CreateCommentDto, authorId: string) {
    const content = body.content?.trim();
    if (!content) {
      const code = ERROR_CODES.VALIDATION_FAILED as ErrorCode;
      throw new BadRequestException({ message: COMMENT_VALIDATION_MESSAGES.CONTENT_REQUIRED, code });
    }

    const post = await this.postsRepository.findOne({
      where: { id: postId, status: PostStatus.PUBLISHED },
      select: { id: true },
    });

    if (!post) {
      const code = ERROR_CODES.POST_NOT_FOUND as ErrorCode;
      throw new NotFoundException({
        message: POST_ERROR_MESSAGES.POST_NOT_FOUND,
        code,
      });
    }

    let parentId: string | null = null;
    let depth = 0;

    if (body.parentId) {
      const parent = await this.commentsRepository.findOne({
        where: { id: body.parentId, postId, deletedAt: IsNull() },
      });

      if (!parent) {
        const code = ERROR_CODES.COMMENT_NOT_FOUND as ErrorCode;
        throw new NotFoundException({
          message: COMMENT_ERROR_MESSAGES.COMMENT_NOT_FOUND,
          code,
        });
      }

      parentId = parent.id;
      depth = parent.depth + 1;
    }

    const comment = this.commentsRepository.create({
      id: this.snowflakeService.generate(),
      postId,
      authorId,
      content,
      parentId,
      depth,
    });

    await this.commentsRepository.save(comment);

    return { id: comment.id };
  }
}
