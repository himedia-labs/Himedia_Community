import { PassportStrategy } from '@nestjs/passport';
import { ForbiddenException, Inject, Injectable } from '@nestjs/common';
import { Strategy, ExtractJwt } from 'passport-jwt';

import { UserService } from '../services/user.service';

import appConfig from '../../common/config/app.config';
import { ERROR_CODES } from '../../constants/error/error-codes';
import { AUTH_ERROR_MESSAGES } from '../../constants/message/auth.messages';

import type { ConfigType } from '@nestjs/config';
import type { JwtPayload } from '../interfaces/jwt.interface';

/**
 * JWT 인증
 * @description Authorization 헤더에서 Bearer 토큰 추출
 */
@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor(
    @Inject(appConfig.KEY)
    private readonly config: ConfigType<typeof appConfig>,
    private readonly userService: UserService,
  ) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false,
      secretOrKey: config.jwt.secret,
    });
  }

  /**
   * JWT 페이로드 검증
   * @description 사용자 존재 여부 및 승인 상태 확인
   */
  async validate(payload: JwtPayload) {
    // 사용자 조회
    const user = await this.userService.getUserByIdOrThrow(payload.sub);

    // 탈퇴 계정 차단
    if (user.withdrawn) {
      throw new ForbiddenException({
        message: AUTH_ERROR_MESSAGES.ACCOUNT_WITHDRAWN,
        code: ERROR_CODES.AUTH_ACCOUNT_WITHDRAWN,
      });
    }

    // 승인되지 않은 사용자
    if (!user.approved) {
      throw new ForbiddenException({
        message: AUTH_ERROR_MESSAGES.PENDING_APPROVAL,
        code: ERROR_CODES.AUTH_PENDING_APPROVAL,
      });
    }

    // 최신 권한 정보 반환
    return {
      sub: user.id,
      role: user.role,
    };
  }
}
