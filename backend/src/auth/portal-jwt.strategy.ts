import { Injectable } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { ConfigService } from '@nestjs/config';
import { Request } from 'express';
import { PORTAL_ACCESS_COOKIE } from './auth-cookie.util';

@Injectable()
export class PortalJwtStrategy extends PassportStrategy(Strategy, 'portal-jwt') {
  constructor(config: ConfigService) {
    super({
      jwtFromRequest: ExtractJwt.fromExtractors([
        (req: Request) => req?.cookies?.[PORTAL_ACCESS_COOKIE] ?? null,
      ]),
      ignoreExpiration: false,
      secretOrKey:
        config.get<string>('PORTAL_JWT_SECRET') ||
        config.get<string>('JWT_SECRET') ||
        'elsaco-portal-access-secret',
    });
  }

  validate(payload: { sub: string; email: string; role: string }) {
    return { id: payload.sub, email: payload.email, role: payload.role };
  }
}
