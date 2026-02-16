import appConfig from '../../common/config/app.config';
import { TOKEN_CONFIG } from '../../constants/config/token.config';

import type { Response } from 'express';
import type { ConfigType } from '@nestjs/config';

/**
 * 쿠키 기본 옵션 생성
 * @description 환경에 따른 보안 쿠키 설정
 */
const getCookieOptions = (env?: string) => {
  // 배포(production): 프론트/백엔드가 다른 도메인이므로 SameSite=None + Secure 필수
  // 로컬(development): http 환경이므로 SameSite=Lax 유지
  const isProduction = env === 'production';
  const sameSite = isProduction ? ('none' as const) : ('lax' as const);

  return {
    httpOnly: true,
    secure: isProduction,
    sameSite,
    path: '/',
  };
};

/**
 * 인증 쿠키 설정
 * @description Refresh Token을 httpOnly 쿠키에 저장
 */
export const setCookies = (res: Response, refreshToken: string, config: ConfigType<typeof appConfig>) => {
  const cookieOptions = getCookieOptions(config.env);
  const refreshMaxAgeSeconds = Number(config.jwt.refreshExpiresInSeconds);

  // Refresh Token 쿠키 설정 (초 > 밀리초)
  res.cookie(TOKEN_CONFIG.REFRESH_COOKIE_NAME, refreshToken, {
    ...cookieOptions,
    maxAge: refreshMaxAgeSeconds * 1000,
  });
};

/**
 * 인증 쿠키 삭제
 * @description 로그아웃 시 Refresh Token 쿠키 제거
 */
export const clearCookies = (res: Response, config: ConfigType<typeof appConfig>) => {
  const cookieOptions = getCookieOptions(config.env);
  res.clearCookie(TOKEN_CONFIG.REFRESH_COOKIE_NAME, cookieOptions);
};
