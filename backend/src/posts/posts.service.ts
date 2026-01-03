import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

import { Post, PostStatus } from './entities/post.entity';
import { ERROR_CODES } from '../constants/error/error-codes';
import type { ErrorCode } from '../constants/error/error-codes';
import { POST_ERROR_MESSAGES } from '../constants/message/post.messages';
import { ListPostsQueryDto, PostSortOption, SortOrder } from './dto/listPostsQuery.dto';

@Injectable()
export class PostsService {
  constructor(
    @InjectRepository(Post)
    private readonly postsRepository: Repository<Post>,
  ) {}

  async getPosts(query: ListPostsQueryDto) {
    const page = query.page ?? 1;
    const limit = query.limit ?? 10;
    const sort = query.sort ?? PostSortOption.CREATED_AT;
    const order = query.order ?? SortOrder.DESC;

    const status = query.status ?? PostStatus.PUBLISHED;
    const queryBuilder = this.postsRepository
      .createQueryBuilder('post')
      .leftJoinAndSelect('post.category', 'category')
      .leftJoinAndSelect('post.author', 'author')
      .loadRelationCountAndMap('post.commentCount', 'post.comments', 'comment', qb =>
        qb.andWhere('comment.deletedAt IS NULL'),
      )
      .where('post.status = :status', { status });

    if (query.categoryId) {
      queryBuilder.andWhere('post.categoryId = :categoryId', { categoryId: query.categoryId });
    }

    const [posts, total] = await queryBuilder
      .orderBy(`post.${sort}`, order)
      .skip((page - 1) * limit)
      .take(limit)
      .getManyAndCount();

    return {
      items: posts.map(post => ({
        id: post.id,
        title: post.title,
        content: post.content,
        thumbnailUrl: post.thumbnailUrl,
        status: post.status,
        viewCount: post.viewCount,
        likeCount: post.likeCount,
        commentCount: post.commentCount ?? 0,
        createdAt: post.createdAt,
        publishedAt: post.publishedAt,
        category: post.category ? { id: post.category.id, name: post.category.name } : null,
        author: post.author ? { id: post.author.id, name: post.author.name } : null,
      })),
      page,
      limit,
      total,
      totalPages: Math.ceil(total / limit),
    };
  }

  async getPostDetail(postId: string) {
    const post = await this.postsRepository.findOne({
      where: { id: postId },
      relations: {
        category: true,
        author: true,
        postTags: {
          tag: true,
        },
      },
    });

    if (!post) {
      const code = ERROR_CODES.POST_NOT_FOUND as ErrorCode;
      throw new NotFoundException({
        message: POST_ERROR_MESSAGES.POST_NOT_FOUND,
        code,
      });
    }

    return {
      id: post.id,
      title: post.title,
      content: post.content,
      thumbnailUrl: post.thumbnailUrl,
      status: post.status,
      viewCount: post.viewCount,
      likeCount: post.likeCount,
      createdAt: post.createdAt,
      updatedAt: post.updatedAt,
      publishedAt: post.publishedAt,
      category: post.category ? { id: post.category.id, name: post.category.name } : null,
      author: post.author ? { id: post.author.id, name: post.author.name } : null,
      tags: post.postTags?.map(postTag => ({ id: postTag.tag.id, name: postTag.tag.name })) ?? [],
    };
  }
}
