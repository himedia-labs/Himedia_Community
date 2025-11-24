import {
  IsEmail,
  IsEnum,
  IsBoolean,
  IsOptional,
  IsString,
  MaxLength,
  MinLength,
  Equals,
} from 'class-validator';

import { UserRole } from '../entities/user.entity';

export class RegisterDto {
  @IsString()
  @MaxLength(100)
  name!: string;

  @IsEmail()
  email!: string;

  @IsString()
  @MinLength(8)
  @MaxLength(255)
  password!: string;

  @IsString()
  @MaxLength(20)
  phone!: string;

  @IsEnum(UserRole)
  role!: UserRole;

  @IsOptional()
  @IsString()
  @MaxLength(255)
  course?: string | null;

  @IsBoolean()
  @Equals(true, { message: '개인정보 수집 및 이용에 동의가 필요합니다.' })
  privacyConsent!: boolean;
}
