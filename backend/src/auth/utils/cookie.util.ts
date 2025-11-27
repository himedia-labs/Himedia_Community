import type { Response } from 'express';
import { ConfigValidationException } from '../../common/exception/config.exception';

/**
 * 쿠키 기본 옵션
 * @description 보안을 위한 쿠키 설정
 */
const COOKIE_OPTIONS = {
  httpOnly: true,
  secure: process.env.NODE_ENV === 'production',
  sameSite: 'lax' as const,
  path: '/',
};

/**
 * 인증 쿠키 설정
 * @description Access Token과 Refresh Token을 쿠키에 저장
 */
export const setCookies = (
  res: Response,
  accessToken: string,
  refreshToken: string,
) => {
  // Access Token 만료 시간
  const accessTokenExpires = process.env.ACCESS_TOKEN_EXPIRES_IN;
  if (!accessTokenExpires) {
    throw new ConfigValidationException('ACCESS_TOKEN_EXPIRES_IN');
  }

  // Refresh Token 만료 일수
  const refreshTokenDays = process.env.REFRESH_TOKEN_EXPIRES_IN_DAYS;
  if (!refreshTokenDays) {
    throw new ConfigValidationException('REFRESH_TOKEN_EXPIRES_IN_DAYS');
  }

  // Access Token 쿠키 설정
  res.cookie('accessToken', accessToken, {
    ...COOKIE_OPTIONS,
    maxAge: parseTimeToMs(accessTokenExpires),
  });

  // Refresh Token 쿠키 설정
  res.cookie('refreshToken', refreshToken, {
    ...COOKIE_OPTIONS,
    maxAge: parseInt(refreshTokenDays, 10) * 24 * 60 * 60 * 1000,
  });
};

/**
 * 시간 문자열을 밀리초로 변환
 */
function parseTimeToMs(timeStr: string): number {
  const match = timeStr.match(/^(\d+)([smhd])$/);
  if (!match) return 0;

  const [, value, unit] = match;
  const num = parseInt(value, 10);

  switch (unit) {
    case 's':
      return num * 1000;
    case 'm':
      return num * 60 * 1000;
    case 'h':
      return num * 60 * 60 * 1000;
    case 'd':
      return num * 24 * 60 * 60 * 1000;
    default:
      return 0;
  }
}

/**
 * 인증 쿠키 삭제
 * @description 로그아웃 시 Access Token과 Refresh Token 쿠키 제거
 */
export const clearCookies = (res: Response) => {
  res.clearCookie('accessToken', COOKIE_OPTIONS);
  res.clearCookie('refreshToken', COOKIE_OPTIONS);
};
