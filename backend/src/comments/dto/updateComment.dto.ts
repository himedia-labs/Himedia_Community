import { IsOptional, IsString } from 'class-validator';

import { COMMENT_VALIDATION_MESSAGES } from '../../constants/message/comment.messages';

// 댓글 수정
export class UpdateCommentDto {
  @IsOptional()
  @IsString({ message: COMMENT_VALIDATION_MESSAGES.CONTENT_STRING })
  content?: string;
}
