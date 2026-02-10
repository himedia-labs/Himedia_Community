import { IsDateString, IsEmail, IsOptional, IsString, MaxLength } from 'class-validator';

import { PHONE_CONFIG } from '@/constants/config/phone.config';
import { AUTH_VALIDATION_MESSAGES } from '@/constants/message/auth.messages';

// 계정 정보 수정
export class UpdateAccountInfoDto {
  @IsOptional()
  @IsEmail({}, { message: AUTH_VALIDATION_MESSAGES.EMAIL_FORMAT })
  @MaxLength(255, { message: AUTH_VALIDATION_MESSAGES.EMAIL_MAX_LENGTH })
  email?: string;

  @IsOptional()
  @IsString({ message: AUTH_VALIDATION_MESSAGES.PHONE_STRING })
  @MaxLength(PHONE_CONFIG.MAX_LENGTH, { message: AUTH_VALIDATION_MESSAGES.PHONE_MAX_LENGTH })
  phone?: string;

  @IsOptional()
  @IsDateString({}, { message: AUTH_VALIDATION_MESSAGES.BIRTH_DATE_FORMAT })
  birthDate?: string;
}
