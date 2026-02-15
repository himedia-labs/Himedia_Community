import { Type } from 'class-transformer';
import { IsIn, IsInt, IsOptional, IsString, Max, Min } from 'class-validator';

import { PostStatus } from '../entities/post.entity';
import { POST_FEED_OPTIONS } from '../posts.constants';
import { POST_VALIDATION_MESSAGES } from '../../constants/message/post.messages';
import { PostSortOption, SortOrder } from '../posts.types';

import type { PostFeedOption } from '../posts.types';

// 게시글 목록 조회 쿼리
export class ListPostsQueryDto {
  @IsOptional()
  @Type(() => Number)
  @IsInt({ message: POST_VALIDATION_MESSAGES.PAGE_NUMBER })
  @Min(1, { message: POST_VALIDATION_MESSAGES.PAGE_MIN })
  page?: number;

  @IsOptional()
  @Type(() => Number)
  @IsInt({ message: POST_VALIDATION_MESSAGES.LIMIT_NUMBER })
  @Min(1, { message: POST_VALIDATION_MESSAGES.LIMIT_MIN })
  @Max(50, { message: POST_VALIDATION_MESSAGES.LIMIT_MAX })
  limit?: number;

  @IsOptional()
  @IsString({ message: POST_VALIDATION_MESSAGES.CATEGORY_ID_STRING })
  categoryId?: string;

  @IsOptional()
  @IsString({ message: POST_VALIDATION_MESSAGES.AUTHOR_ID_STRING })
  authorId?: string;

  @IsOptional()
  @IsIn([PostStatus.DRAFT, PostStatus.PUBLISHED], { message: POST_VALIDATION_MESSAGES.POST_STATUS_ENUM })
  status?: PostStatus;

  @IsOptional()
  @IsIn(
    [PostSortOption.CREATED_AT, PostSortOption.PUBLISHED_AT, PostSortOption.VIEW_COUNT, PostSortOption.LIKE_COUNT],
    {
      message: POST_VALIDATION_MESSAGES.POST_SORT_ENUM,
    },
  )
  sort?: PostSortOption;

  @IsOptional()
  @IsIn([SortOrder.ASC, SortOrder.DESC], { message: POST_VALIDATION_MESSAGES.SORT_ORDER_ENUM })
  order?: SortOrder;

  @IsOptional()
  @IsIn(POST_FEED_OPTIONS, { message: POST_VALIDATION_MESSAGES.POST_FEED_ENUM })
  feed?: PostFeedOption;
}
