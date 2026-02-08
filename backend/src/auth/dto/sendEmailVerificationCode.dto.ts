import { IsEmail, MaxLength } from 'class-validator';

import { AUTH_VALIDATION_MESSAGES } from '@/constants/message/auth.messages';

// 이메일 인증 코드 발송
export class SendEmailVerificationCodeDto {
  @IsEmail({}, { message: AUTH_VALIDATION_MESSAGES.EMAIL_FORMAT })
  @MaxLength(255, { message: AUTH_VALIDATION_MESSAGES.EMAIL_MAX_LENGTH })
  email!: string;
}
