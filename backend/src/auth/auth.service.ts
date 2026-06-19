import { Injectable, UnauthorizedException, ForbiddenException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';
import { Response } from 'express';
import * as bcrypt from 'bcryptjs';
import { Role } from '@prisma/client';
import { PrismaService } from '../prisma/prisma.service';
import { RegisterDto } from './dto/register.dto';
import { LoginDto } from './dto/login.dto';
import {
  setAuthCookies,
  clearAuthCookies,
  setPortalAuthCookies,
  clearPortalAuthCookies,
  REFRESH_COOKIE,
  PORTAL_REFRESH_COOKIE,
  getPortalAccessSecret,
  getPortalRefreshSecret,
} from './auth-cookie.util';

@Injectable()
export class AuthService {
  constructor(
    private prisma: PrismaService,
    private jwtService: JwtService,
    private config: ConfigService,
  ) {}

  async register(dto: RegisterDto, res: Response) {
    const existing = await this.prisma.user.findUnique({
      where: { email: dto.email },
    });
    if (existing) {
      throw new UnauthorizedException('Email already registered');
    }

    const hashedPassword = await bcrypt.hash(dto.password, 10);
    const user = await this.prisma.user.create({
      data: {
        email: dto.email,
        password: hashedPassword,
        name: dto.name,
        phone: dto.phone,
        cart: { create: {} },
      },
      select: { id: true, email: true, name: true, role: true, phone: true },
    });

    this.issueTokens(res, user.id, user.email, user.role);
    return { user };
  }

  async login(dto: LoginDto, res: Response) {
    const user = await this.prisma.user.findUnique({
      where: { email: dto.email },
    });
    if (!user) {
      throw new UnauthorizedException('Invalid credentials');
    }

    const valid = await bcrypt.compare(dto.password, user.password);
    if (!valid) {
      throw new UnauthorizedException('Invalid credentials');
    }

    if (user.role === Role.ADMIN) {
      throw new ForbiddenException('Admin accounts must sign in at /portal/login');
    }

    this.issueTokens(res, user.id, user.email, user.role);
    return {
      user: {
        id: user.id,
        email: user.email,
        name: user.name,
        role: user.role,
        phone: user.phone,
      },
    };
  }

  async portalLogin(dto: LoginDto, res: Response) {
    const user = await this.prisma.user.findUnique({
      where: { email: dto.email },
    });
    if (!user) {
      throw new UnauthorizedException('Invalid credentials');
    }

    const valid = await bcrypt.compare(dto.password, user.password);
    if (!valid) {
      throw new UnauthorizedException('Invalid credentials');
    }

    if (user.role !== Role.ADMIN) {
      throw new ForbiddenException('Portal access is restricted to administrators');
    }

    this.issuePortalTokens(res, user.id, user.email, user.role);
    return {
      user: {
        id: user.id,
        email: user.email,
        name: user.name,
        role: user.role,
        phone: user.phone,
      },
    };
  }

  async portalRefresh(refreshToken: string | undefined, res: Response) {
    if (!refreshToken) {
      throw new UnauthorizedException('Refresh token missing');
    }

    try {
      const payload = this.jwtService.verify<{ sub: string; type?: string }>(
        refreshToken,
        { secret: this.getPortalRefreshSecret() },
      );

      if (payload.type !== 'portal-refresh') {
        throw new UnauthorizedException('Invalid refresh token');
      }

      const user = await this.prisma.user.findUnique({
        where: { id: payload.sub },
        select: { id: true, email: true, name: true, role: true, phone: true },
      });

      if (!user || user.role !== Role.ADMIN) {
        throw new UnauthorizedException('User not found');
      }

      this.issuePortalTokens(res, user.id, user.email, user.role);
      return { user };
    } catch {
      throw new UnauthorizedException('Invalid refresh token');
    }
  }

  portalLogout(res: Response) {
    clearPortalAuthCookies(res, this.config);
    return { success: true };
  }

  async refresh(refreshToken: string | undefined, res: Response) {
    if (!refreshToken) {
      throw new UnauthorizedException('Refresh token missing');
    }

    try {
      const payload = this.jwtService.verify<{ sub: string; type?: string }>(
        refreshToken,
        { secret: this.getRefreshSecret() },
      );

      if (payload.type !== 'refresh') {
        throw new UnauthorizedException('Invalid refresh token');
      }

      const user = await this.prisma.user.findUnique({
        where: { id: payload.sub },
        select: { id: true, email: true, name: true, role: true, phone: true },
      });

      if (!user) {
        throw new UnauthorizedException('User not found');
      }

      this.issueTokens(res, user.id, user.email, user.role);
      return { user };
    } catch {
      throw new UnauthorizedException('Invalid refresh token');
    }
  }

  logout(res: Response) {
    clearAuthCookies(res, this.config);
    return { success: true };
  }

  async getPortalProfile(userId: string) {
    const user = await this.prisma.user.findUnique({
      where: { id: userId },
      select: {
        id: true,
        email: true,
        name: true,
        role: true,
        phone: true,
        createdAt: true,
      },
    });

    if (!user || user.role !== Role.ADMIN) {
      throw new UnauthorizedException('Portal access denied');
    }

    return user;
  }

  async getProfile(userId: string) {
    return this.prisma.user.findUnique({
      where: { id: userId },
      select: {
        id: true,
        email: true,
        name: true,
        role: true,
        phone: true,
        createdAt: true,
        addresses: true,
      },
    });
  }

  private issueTokens(res: Response, id: string, email: string, role: string) {
    const accessToken = this.jwtService.sign(
      { sub: id, email, role },
      {
        secret: this.getAccessSecret(),
        expiresIn: this.config.get('JWT_EXPIRES_IN') || '15m',
      },
    );

    const refreshToken = this.jwtService.sign(
      { sub: id, type: 'refresh' },
      {
        secret: this.getRefreshSecret(),
        expiresIn: this.config.get('JWT_REFRESH_EXPIRES_IN') || '7d',
      },
    );

    setAuthCookies(res, this.config, accessToken, refreshToken);
  }

  private issuePortalTokens(
    res: Response,
    id: string,
    email: string,
    role: string,
  ) {
    const accessToken = this.jwtService.sign(
      { sub: id, email, role, scope: 'portal' },
      {
        secret: this.getPortalAccessSecret(),
        expiresIn: this.config.get('JWT_EXPIRES_IN') || '15m',
      },
    );

    const refreshToken = this.jwtService.sign(
      { sub: id, type: 'portal-refresh' },
      {
        secret: this.getPortalRefreshSecret(),
        expiresIn: this.config.get('JWT_REFRESH_EXPIRES_IN') || '7d',
      },
    );

    setPortalAuthCookies(res, this.config, accessToken, refreshToken);
  }

  private getPortalAccessSecret() {
    return getPortalAccessSecret(this.config);
  }

  private getPortalRefreshSecret() {
    return getPortalRefreshSecret(this.config);
  }

  private getAccessSecret() {
    return this.config.get<string>('JWT_SECRET') || 'elsaco-access-secret';
  }

  private getRefreshSecret() {
    return this.config.get<string>('JWT_REFRESH_SECRET') || 'elsaco-refresh-secret';
  }
}
