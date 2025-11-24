import { IsEmail, IsString, Length, MinLength } from 'class-validator';

// 인증번호 확인 후 새 비밀번호로 재설정 요청에 사용
export class ResetPasswordWithCodeDto {
  @IsEmail({}, { message: '올바른 이메일 형식이 아닙니다.' })
  email!: string;

  @IsString()
  @Length(8, 8, { message: '인증번호는 8자리여야 합니다.' })
  code!: string;

  @IsString()
  @MinLength(8, { message: '비밀번호는 최소 8자 이상이어야 합니다.' })
  newPassword!: string;
}
