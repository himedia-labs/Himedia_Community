import { IsIn, IsOptional, IsString, MaxLength } from 'class-validator';

import { POST_VALIDATION_MESSAGES } from '../../constants/message/post.messages';
import { PostStatus } from '../entities/post.entity';

// 게시글 생성
export class CreatePostDto {
  @IsString({ message: POST_VALIDATION_MESSAGES.TITLE_STRING })
  @MaxLength(200, { message: POST_VALIDATION_MESSAGES.TITLE_MAX_LENGTH })
  title!: string;

  @IsString({ message: POST_VALIDATION_MESSAGES.CONTENT_STRING })
  content!: string;

  @IsString({ message: POST_VALIDATION_MESSAGES.CATEGORY_ID_STRING })
  categoryId!: string;

  @IsOptional()
  @IsIn([PostStatus.DRAFT, PostStatus.PUBLISHED], { message: POST_VALIDATION_MESSAGES.POST_STATUS_ENUM })
  status?: PostStatus;
}
