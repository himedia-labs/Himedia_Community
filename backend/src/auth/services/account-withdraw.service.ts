import { InjectRepository } from '@nestjs/typeorm';
import { ConflictException, Injectable, UnauthorizedException } from '@nestjs/common';
import { Repository } from 'typeorm';

import { UserService } from './user.service';
import { TokenService } from './token.service';

import { User } from '../entities/user.entity';

import { AUTH_CONFIG } from '../../constants/config/auth.config';
import { ERROR_CODES } from '../../constants/error/error-codes';
import { AUTH_ERROR_MESSAGES, AUTH_SUCCESS_MESSAGES } from '../../constants/message/auth.messages';

import { comparePassword } from '../utils/bcrypt.util';

/**
 * 회원탈퇴 서비스
 * @description 현재 비밀번호 검증 후 계정을 탈퇴 처리하고 모든 토큰을 무효화
 */
@Injectable()
export class AccountWithdrawService {
  constructor(
    @InjectRepository(User)
    private readonly usersRepository: Repository<User>,
    private readonly tokenService: TokenService,
    private readonly userService: UserService,
  ) {}

  /**
   * 회원탈퇴
   * @description 사용자 탈퇴 플래그를 활성화하고 전체 세션을 종료
   */
  async withdrawAccount(userId: string, currentPassword: string): Promise<{ success: true; message: string }> {
    // 사용자 조회
    const user = await this.userService.getUserByIdOrThrow(userId);

    // 이미 탈퇴한 계정
    if (user.withdrawn) {
      throw new ConflictException({
        message: AUTH_ERROR_MESSAGES.ACCOUNT_WITHDRAWN,
        code: ERROR_CODES.AUTH_ACCOUNT_WITHDRAWN,
      });
    }

    // 현재 비밀번호 검증
    const isValid = await comparePassword(currentPassword, user.password);
    if (!isValid) {
      throw new UnauthorizedException({
        message: AUTH_ERROR_MESSAGES.INVALID_CURRENT_PASSWORD,
        code: ERROR_CODES.AUTH_INVALID_CURRENT_PASSWORD,
      });
    }

    // 탈퇴 처리
    const now = new Date();
    user.withdrawn = true;
    user.withdrawnAt = now;
    user.withdrawNote = AUTH_CONFIG.WITHDRAW_NOTE_ACTIVE;
    user.withdrawRestoreDeadline = this.buildRestoreDeadline(now);
    user.approved = false;

    await this.usersRepository.save(user);

    // 모든 토큰 무효화
    await this.tokenService.revokeAllUserTokens(user.id);

    return {
      success: true,
      message: AUTH_SUCCESS_MESSAGES.WITHDRAWN,
    };
  }

  /**
   * 복구 기한 계산
   * @description 탈퇴 시점 기준 복구 가능한 만료 시각을 계산
   */
  private buildRestoreDeadline(withdrawnAt: Date): Date {
    const deadline = new Date(withdrawnAt);
    deadline.setDate(deadline.getDate() + AUTH_CONFIG.WITHDRAW_RESTORE_GRACE_DAYS);
    return deadline;
  }
}
