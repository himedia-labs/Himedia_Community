import { IsString, MaxLength, MinLength } from 'class-validator';
import { PASSWORD_VALIDATION_MESSAGES } from '@/constants/message/password.messages';

// 회원탈퇴 요청
export class WithdrawAccountDto {
  @IsString({ message: PASSWORD_VALIDATION_MESSAGES.CURRENT_PASSWORD_STRING })
  @MinLength(8, { message: PASSWORD_VALIDATION_MESSAGES.CURRENT_PASSWORD_MIN_LENGTH })
  @MaxLength(255, { message: PASSWORD_VALIDATION_MESSAGES.CURRENT_PASSWORD_MAX_LENGTH })
  currentPassword!: string;
}
