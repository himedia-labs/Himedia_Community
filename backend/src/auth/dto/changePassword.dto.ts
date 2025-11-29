import { IsString, MaxLength, MinLength } from 'class-validator';

// 로그인 후 비밀번호 변경
export class ChangePasswordDto {
  @IsString({ message: '현재 비밀번호는 문자열이어야 합니다.' })
  @MinLength(8, { message: '현재 비밀번호는 최소 8자 이상이어야 합니다.' })
  @MaxLength(255, { message: '현재 비밀번호는 255자 이하여야 합니다.' })
  currentPassword!: string;

  @IsString({ message: '새 비밀번호는 문자열이어야 합니다.' })
  @MinLength(8, { message: '새 비밀번호는 최소 8자 이상이어야 합니다.' })
  @MaxLength(255, { message: '새 비밀번호는 255자 이하여야 합니다.' })
  newPassword!: string;
}
