import { IsString, MinLength } from 'class-validator';

// 로그인 상태에서 현재 비밀번호 확인 후 새 비밀번호로 변경할 때 사용
export class ChangePasswordDto {
  @IsString()
  @MinLength(8)
  currentPassword!: string;

  @IsString()
  @MinLength(8)
  newPassword!: string;
}
