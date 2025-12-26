import { IsOptional, IsString } from 'class-validator';

import { COMMENT_VALIDATION_MESSAGES } from '../../constants/message/comment.messages';

// 댓글 생성
export class CreateCommentDto {
  @IsString({ message: COMMENT_VALIDATION_MESSAGES.CONTENT_STRING })
  content!: string;

  @IsOptional()
  @IsString({ message: COMMENT_VALIDATION_MESSAGES.PARENT_ID_STRING })
  parentId?: string | null;
}
