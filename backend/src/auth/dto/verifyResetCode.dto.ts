import { IsEmail, IsString, Length } from 'class-validator';

// 이메일로 받은 인증번호 검증 요청에 사용
export class VerifyResetCodeDto {
  @IsEmail({}, { message: '올바른 이메일 형식이 아닙니다.' })
  email!: string;

  @IsString()
  @Length(8, 8, { message: '인증번호는 8자리여야 합니다.' })
  code!: string;
}
