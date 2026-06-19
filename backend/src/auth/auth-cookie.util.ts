import { Response } from 'express';
import { ConfigService } from '@nestjs/config';

export const ACCESS_COOKIE = 'elsaco_access';
export const REFRESH_COOKIE = 'elsaco_refresh';

export function getCookieOptions(config: ConfigService, maxAgeMs: number) {
  const isProd = config.get('NODE_ENV') === 'production';
  const domain = config.get<string>('COOKIE_DOMAIN') || undefined;

  return {
    httpOnly: true,
    secure: isProd,
    sameSite: (isProd ? 'none' : 'lax') as 'none' | 'lax',
    domain: domain || undefined,
    path: '/',
    maxAge: maxAgeMs,
  };
}

export function setAuthCookies(
  res: Response,
  config: ConfigService,
  accessToken: string,
  refreshToken: string,
) {
  const accessMax = parseExpiry(config.get('JWT_EXPIRES_IN') || '15m');
  const refreshMax = parseExpiry(config.get('JWT_REFRESH_EXPIRES_IN') || '7d');

  res.cookie(ACCESS_COOKIE, accessToken, getCookieOptions(config, accessMax));
  res.cookie(REFRESH_COOKIE, refreshToken, getCookieOptions(config, refreshMax));
}

export function clearAuthCookies(res: Response, config: ConfigService) {
  const opts = { ...getCookieOptions(config, 0), maxAge: 0 };
  res.clearCookie(ACCESS_COOKIE, opts);
  res.clearCookie(REFRESH_COOKIE, opts);
}

function parseExpiry(value: string): number {
  const match = value.match(/^(\d+)([smhd])$/);
  if (!match) return 7 * 24 * 60 * 60 * 1000;
  const n = parseInt(match[1], 10);
  const unit = match[2];
  const multipliers: Record<string, number> = {
    s: 1000,
    m: 60 * 1000,
    h: 60 * 60 * 1000,
    d: 24 * 60 * 60 * 1000,
  };
  return n * (multipliers[unit] || multipliers.d);
}
