import { InjectRepository } from '@nestjs/typeorm';
import { LessThan, MoreThanOrEqual, Repository } from 'typeorm';
import { Injectable, UnauthorizedException } from '@nestjs/common';

import { TokenService } from './token.service';
import { UserService } from './user.service';

import { User } from '../entities/user.entity';
import { EmailVerification } from '../entities/emailVerification.entity';

import { AUTH_CONFIG } from '../../constants/config/auth.config';
import { ERROR_CODES } from '../../constants/error/error-codes';
import { AUTH_ERROR_MESSAGES } from '../../constants/message/auth.messages';
import { EMAIL_VERIFICATION_ERROR_MESSAGES } from '../../constants/message/email-verification.messages';

import { comparePassword } from '../utils/bcrypt.util';

import type { AuthResponse } from '../interfaces/auth.interface';

/**
 * 계정 복원 서비스
 * @description 탈퇴 계정의 이메일 인증 확인 후 계정을 복원하고 로그인 토큰을 발급
 */
@Injectable()
export class AccountRestoreService {
  constructor(
    @InjectRepository(User)
    private readonly usersRepository: Repository<User>,
    @InjectRepository(EmailVerification)
    private readonly emailVerificationRepository: Repository<EmailVerification>,
    private readonly userService: UserService,
    private readonly tokenService: TokenService,
  ) {}

  /**
   * 탈퇴 계정 복원
   * @description 이메일 인증번호를 검증한 뒤 탈퇴 상태를 해제하고 로그인 응답을 반환
   */
  async restoreWithdrawnAccount(
    email: string,
    code: string,
    userAgent?: string,
    ipAddress?: string,
  ): Promise<AuthResponse> {
    // 사용자/상태 검증
    const normalizedEmail = email.trim().toLowerCase();
    const user = await this.userService.findUserByEmail(normalizedEmail);
    const canRestore =
      Boolean(user?.withdrawn) &&
      !this.isRestoreExpired(user?.withdrawRestoreDeadline ?? null, user?.withdrawnAt ?? null);

    if (!user || !canRestore) {
      throw new UnauthorizedException({
        message: AUTH_ERROR_MESSAGES.INVALID_CREDENTIALS,
        code: ERROR_CODES.AUTH_INVALID_CREDENTIALS,
      });
    }

    // 인증번호/검증
    await this.verifyRestoreCode(normalizedEmail, code);

    // 계정/복원
    user.withdrawn = false;
    user.withdrawnAt = null;
    user.withdrawNote = null;
    user.withdrawRestoreDeadline = null;
    user.approved = true;

    await this.usersRepository.save(user);

    // 기존 세션 정리 후 재로그인 토큰 발급
    await this.tokenService.revokeAllUserTokens(user.id);
    return this.tokenService.buildAuthResponseForUser(user, userAgent, ipAddress);
  }

  /**
   * 복원 인증번호 검증
   * @description 활성 인증코드 중 일치 코드를 찾아 사용 처리
   */
  private async verifyRestoreCode(email: string, code: string): Promise<void> {
    // 만료코드/정리
    const now = new Date();
    await this.emailVerificationRepository.update(
      {
        email,
        used: false,
        expiresAt: LessThan(now),
      },
      { used: true },
    );

    // 유효코드/조회
    const verificationRecords = await this.emailVerificationRepository.find({
      where: {
        email,
        used: false,
        expiresAt: MoreThanOrEqual(now),
      },
      order: {
        createdAt: 'DESC',
      },
    });

    if (!verificationRecords.length) {
      throw new UnauthorizedException({
        message: EMAIL_VERIFICATION_ERROR_MESSAGES.INVALID_CODE,
        code: ERROR_CODES.EMAIL_INVALID_VERIFICATION_CODE,
      });
    }

    // 코드/검증
    let matchedRecord: EmailVerification | null = null;
    for (const record of verificationRecords) {
      const isMatch = await comparePassword(code, record.code);
      if (isMatch) {
        matchedRecord = record;
        break;
      }
    }

    if (!matchedRecord) {
      throw new UnauthorizedException({
        message: EMAIL_VERIFICATION_ERROR_MESSAGES.INVALID_CODE,
        code: ERROR_CODES.EMAIL_INVALID_VERIFICATION_CODE,
      });
    }

    matchedRecord.used = true;
    await this.emailVerificationRepository.save(matchedRecord);
  }

  /**
   * 복구 기한 만료 여부
   * @description 복구 기한(또는 탈퇴 시각+유예기간) 기준 만료 여부를 반환
   */
  private isRestoreExpired(restoreDeadline: Date | null, withdrawnAt: Date | null): boolean {
    const deadline = restoreDeadline ?? this.buildLegacyRestoreDeadline(withdrawnAt);
    if (!deadline) return true;
    return deadline.getTime() < Date.now();
  }

  /**
   * 레거시 복구 기한 계산
   * @description 복구 기한 컬럼이 없는 기존 데이터는 탈퇴 시각 기준으로 계산
   */
  private buildLegacyRestoreDeadline(withdrawnAt: Date | null): Date | null {
    if (!withdrawnAt) return null;

    const deadline = new Date(withdrawnAt);
    deadline.setDate(deadline.getDate() + AUTH_CONFIG.WITHDRAW_RESTORE_GRACE_DAYS);
    return deadline;
  }
}
