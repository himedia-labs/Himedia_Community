import { IsEmail, IsString, Length, MaxLength } from 'class-validator';

import { AUTH_VALIDATION_MESSAGES } from '../../constants/message/auth.messages';
import { PASSWORD_VALIDATION_MESSAGES } from '../../constants/message/password.messages';

// 탈퇴 계정 복원
export class RestoreWithdrawnAccountDto {
  @IsEmail({}, { message: AUTH_VALIDATION_MESSAGES.EMAIL_FORMAT })
  @MaxLength(255, { message: AUTH_VALIDATION_MESSAGES.EMAIL_MAX_LENGTH })
  email!: string;

  @IsString({ message: PASSWORD_VALIDATION_MESSAGES.CODE_STRING })
  @Length(8, 8, { message: PASSWORD_VALIDATION_MESSAGES.CODE_LENGTH })
  code!: string;
}
