import { InjectRepository } from '@nestjs/typeorm';
import { ConflictException, ForbiddenException, Injectable, UnauthorizedException } from '@nestjs/common';
import { Repository } from 'typeorm';

import { RegisterDto } from '../dto/register.dto';

import { TokenService } from './token.service';

import { User, UserRole } from '../entities/user.entity';

import { AUTH_CONFIG } from '../../constants/config/auth.config';
import { ERROR_CODES } from '../../constants/error/error-codes';
import { SnowflakeService } from '../../common/services/snowflake.service';
import { AUTH_ERROR_MESSAGES } from '../../constants/message/auth.messages';

import { formatPhoneNumber, normalizePhoneNumber } from '../utils/phone.util';
import { comparePassword, hashWithAuthRounds } from '../utils/bcrypt.util';

import type { AuthResponse } from '../interfaces/auth.interface';

/**
 * 인증 서비스
 * @description 로그인, 회원가입, 사용자 인증 처리
 */
@Injectable()
export class AuthService {
  constructor(
    @InjectRepository(User)
    private readonly usersRepository: Repository<User>,
    private readonly tokenService: TokenService,
    private readonly snowflakeService: SnowflakeService,
  ) {}

  /**
   * 로그인
   * @description 검증된 사용자에 대해 토큰 생성 및 프로필 반환
   */
  async login(user: User, userAgent?: string, ipAddress?: string): Promise<AuthResponse> {
    // 로그인 성공 시 토큰과 프로필 반환
    return this.tokenService.buildAuthResponseForUser(user, userAgent, ipAddress);
  }

  /**
   * 회원가입
   * @description 이메일/전화번호 중복 확인 후 비밀번호 해싱하여 사용자 생성
   */
  async register(registerDto: RegisterDto): Promise<void> {
    // 이메일 중복 확인
    const { role: requestedRole, phone, ...registerData } = registerDto;
    const normalizedPhone = normalizePhoneNumber(phone);
    const formattedPhone = formatPhoneNumber(normalizedPhone);

    const existingUser = await this.usersRepository.findOne({
      where: [{ email: registerData.email }, { phone: normalizedPhone }, { phone: formattedPhone }],
    });

    if (existingUser) {
      if (existingUser.email === registerDto.email) {
        throw new ConflictException({
          message: AUTH_ERROR_MESSAGES.EMAIL_ALREADY_EXISTS,
          code: ERROR_CODES.AUTH_EMAIL_ALREADY_EXISTS,
        });
      }
      if (
        existingUser.phone === registerDto.phone ||
        existingUser.phone === normalizedPhone ||
        existingUser.phone === formattedPhone
      ) {
        throw new ConflictException({
          message: AUTH_ERROR_MESSAGES.PHONE_ALREADY_EXISTS,
          code: ERROR_CODES.AUTH_PHONE_ALREADY_EXISTS,
        });
      }
    }

    // 비밀번호 해싱
    const password = await hashWithAuthRounds(registerDto.password);
    // Snowflake ID 생성
    const id = this.snowflakeService.generate();

    // 프로필 핸들 생성
    const baseHandle = registerData.email.split('@')[0]?.trim().toLowerCase() ?? '';
    const cleanedHandle = baseHandle.replace(/[^a-z0-9._-]/g, '');
    const seedHandle = cleanedHandle || `user${id.slice(-6)}`;
    const profileHandle = await this.createUniqueProfileHandle(seedHandle.slice(0, 30));

    // 사용자 엔티티 생성
    const userEntity = this.usersRepository.create({
      id,
      ...registerData,
      password,
      phone: formattedPhone,
      role: UserRole.TRAINEE,
      requestedRole,
      profileHandle,
    });

    // DB 저장
    try {
      await this.usersRepository.save(userEntity);
    } catch (error) {
      if (error instanceof Error && 'code' in error && (error as { code?: string }).code === '23505') {
        const detailRaw = (error as { detail?: unknown }).detail;
        const detail = typeof detailRaw === 'string' ? detailRaw : '';
        if (detail.includes('email')) {
          throw new ConflictException({
            message: AUTH_ERROR_MESSAGES.EMAIL_ALREADY_EXISTS,
            code: ERROR_CODES.AUTH_EMAIL_ALREADY_EXISTS,
          });
        }
        if (detail.includes('phone')) {
          throw new ConflictException({
            message: AUTH_ERROR_MESSAGES.PHONE_ALREADY_EXISTS,
            code: ERROR_CODES.AUTH_PHONE_ALREADY_EXISTS,
          });
        }
      }

      throw error;
    }
  }

  /**
   * 사용자 인증
   * @description 이메일로 사용자 조회 후 비밀번호 검증 및 승인 상태 확인
   */
  async validateUser(email: string, password: string): Promise<User> {
    // 이메일로 사용자 조회
    const user = await this.usersRepository.findOne({
      where: { email },
    });

    // 사용자 없음
    if (!user) {
      throw new UnauthorizedException({
        message: AUTH_ERROR_MESSAGES.INVALID_CREDENTIALS,
        code: ERROR_CODES.AUTH_INVALID_CREDENTIALS,
      });
    }

    // 비밀번호 검증
    const isMatch = await comparePassword(password, user.password);

    // 비밀번호 불일치
    if (!isMatch) {
      throw new UnauthorizedException({
        message: AUTH_ERROR_MESSAGES.INVALID_CREDENTIALS,
        code: ERROR_CODES.AUTH_INVALID_CREDENTIALS,
      });
    }

    // 탈퇴 계정 차단
    if (user.withdrawn) {
      if (this.isWithdrawRestoreExpired(user)) {
        await this.markWithdrawExpiredMemo(user);
        throw new UnauthorizedException({
          message: AUTH_ERROR_MESSAGES.INVALID_CREDENTIALS,
          code: ERROR_CODES.AUTH_INVALID_CREDENTIALS,
        });
      }

      throw new ForbiddenException({
        message: AUTH_ERROR_MESSAGES.ACCOUNT_WITHDRAWN,
        code: ERROR_CODES.AUTH_ACCOUNT_WITHDRAWN,
      });
    }

    // 승인 상태 확인
    if (!user.approved) {
      throw new ForbiddenException({
        message: AUTH_ERROR_MESSAGES.PENDING_APPROVAL,
        code: ERROR_CODES.AUTH_PENDING_APPROVAL,
      });
    }

    return user;
  }

  /**
   * 탈퇴 복구 가능 여부
   * @description 복구 기한(또는 탈퇴 시각+유예기간)을 기준으로 만료 여부를 계산
   */
  private isWithdrawRestoreExpired(user: User): boolean {
    const deadline = user.withdrawRestoreDeadline ?? this.buildLegacyRestoreDeadline(user.withdrawnAt);
    if (!deadline) return true;
    return deadline.getTime() < Date.now();
  }

  /**
   * 탈퇴 만료 메모 반영
   * @description 만료 메모가 아직 없으면 상태 메모를 만료값으로 업데이트
   */
  private async markWithdrawExpiredMemo(user: User): Promise<void> {
    if (user.withdrawNote === AUTH_CONFIG.WITHDRAW_NOTE_EXPIRED) {
      return;
    }

    user.withdrawNote = AUTH_CONFIG.WITHDRAW_NOTE_EXPIRED;
    await this.usersRepository.save(user);
  }

  /**
   * 레거시 복구 기한 계산
   * @description 복구 기한 컬럼이 없는 기존 탈퇴 계정은 withdrawnAt 기준으로 기한을 계산
   */
  private buildLegacyRestoreDeadline(withdrawnAt: Date | null): Date | null {
    if (!withdrawnAt) return null;

    const deadline = new Date(withdrawnAt);
    deadline.setDate(deadline.getDate() + AUTH_CONFIG.WITHDRAW_RESTORE_GRACE_DAYS);
    return deadline;
  }

  // 프로필 핸들 생성
  private async createUniqueProfileHandle(seedHandle: string): Promise<string> {
    let candidate = seedHandle;
    let suffix = 1;

    while (await this.usersRepository.exist({ where: { profileHandle: candidate } })) {
      candidate = `${seedHandle}${suffix}`;
      suffix += 1;
    }

    return candidate;
  }
}
