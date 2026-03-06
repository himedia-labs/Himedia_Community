import { IsNotEmpty, IsString, MaxLength } from 'class-validator';

/**
 * 관리자 회원 승인 거절 DTO
 * @description 거절 사유를 검증
 */
export class RejectAdminUserDto {
  @IsString({ message: '거절 사유는 문자열이어야 합니다.' })
  @IsNotEmpty({ message: '거절 사유를 입력해주세요.' })
  @MaxLength(300, { message: '거절 사유는 300자 이하여야 합니다.' })
  reason!: string;
}
