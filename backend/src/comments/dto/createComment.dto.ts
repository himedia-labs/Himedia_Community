import { IsOptional, IsString, MaxLength } from 'class-validator';

import { COMMENT_VALIDATION_MESSAGES } from '../../constants/message/comment.messages';

// 댓글 생성
export class CreateCommentDto {
  @IsString({ message: COMMENT_VALIDATION_MESSAGES.CONTENT_STRING })
  @MaxLength(1000, { message: COMMENT_VALIDATION_MESSAGES.CONTENT_MAX_LENGTH })
  content!: string;

  @IsOptional()
  @IsString({ message: COMMENT_VALIDATION_MESSAGES.PARENT_ID_STRING })
  parentId?: string | null;
}
