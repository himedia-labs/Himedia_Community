import { IsIn, IsString } from 'class-validator';

const ALLOWED_EMOJIS = ['👍', '❤️', '🎉', '🔥', '👀'] as const;

export class ToggleNoticeReactionDto {
  @IsString()
  @IsIn(ALLOWED_EMOJIS, { message: '허용되지 않은 이모지입니다.' })
  emoji!: string;
}
