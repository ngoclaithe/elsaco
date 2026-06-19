import {
  Controller,
  Post,
  Get,
  Body,
  UseGuards,
  Request,
  Res,
  Req,
} from '@nestjs/common';
import { Response, Request as ExpressRequest } from 'express';
import { AuthService } from './auth.service';
import { RegisterDto } from './dto/register.dto';
import { LoginDto } from './dto/login.dto';
import { JwtAuthGuard } from './jwt-auth.guard';
import { PortalJwtAuthGuard } from './portal-jwt-auth.guard';
import { REFRESH_COOKIE, PORTAL_REFRESH_COOKIE } from './auth-cookie.util';

@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) {}

  @Post('register')
  register(
    @Body() dto: RegisterDto,
    @Res({ passthrough: true }) res: Response,
  ) {
    return this.authService.register(dto, res);
  }

  @Post('login')
  login(
    @Body() dto: LoginDto,
    @Res({ passthrough: true }) res: Response,
  ) {
    return this.authService.login(dto, res);
  }

  @Post('refresh')
  refresh(
    @Req() req: ExpressRequest,
    @Res({ passthrough: true }) res: Response,
  ) {
    return this.authService.refresh(req.cookies?.[REFRESH_COOKIE], res);
  }

  @Post('logout')
  logout(@Res({ passthrough: true }) res: Response) {
    return this.authService.logout(res);
  }

  @UseGuards(JwtAuthGuard)
  @Get('me')
  getProfile(@Request() req: { user: { id: string } }) {
    return this.authService.getProfile(req.user.id);
  }

  @Post('portal/login')
  portalLogin(
    @Body() dto: LoginDto,
    @Res({ passthrough: true }) res: Response,
  ) {
    return this.authService.portalLogin(dto, res);
  }

  @Post('portal/refresh')
  portalRefresh(
    @Req() req: ExpressRequest,
    @Res({ passthrough: true }) res: Response,
  ) {
    return this.authService.portalRefresh(req.cookies?.[PORTAL_REFRESH_COOKIE], res);
  }

  @Post('portal/logout')
  portalLogout(@Res({ passthrough: true }) res: Response) {
    return this.authService.portalLogout(res);
  }

  @UseGuards(PortalJwtAuthGuard)
  @Get('portal/me')
  getPortalProfile(@Request() req: { user: { id: string } }) {
    return this.authService.getPortalProfile(req.user.id);
  }
}
