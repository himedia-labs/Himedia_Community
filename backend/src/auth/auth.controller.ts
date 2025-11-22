import {
  Body,
  Controller,
  Get,
  Post,
  Request,
  UseGuards,
} from '@nestjs/common';
import { Request as ExpressRequest } from 'express';

import { AuthService } from './auth.service';
import { LoginDto } from './dto/login.dto';
import { RegisterDto } from './dto/register.dto';
import { LocalAuthGuard } from './guards/local-auth.guard';
import { JwtAuthGuard } from './guards/jwt-auth.guard';
import { User } from './entities/user.entity';
import { JwtPayload } from './interfaces/jwt-payload.interface';
import { RefreshTokenDto } from './dto/refresh-token.dto';
import { ChangePasswordDto } from './dto/change-password.dto';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @UseGuards(LocalAuthGuard)
  @Post('login')
  login(
    @Body() _loginDto: LoginDto,
    @Request() req: ExpressRequest & { user: User },
  ) {
    return this.authService.login(req.user);
  }

  @Post('register')
  register(@Body() registerDto: RegisterDto) {
    return this.authService.register(registerDto);
  }

  @Post('refresh')
  refresh(@Body() refreshTokenDto: RefreshTokenDto) {
    return this.authService.refreshTokens(refreshTokenDto);
  }

  @Post('logout')
  logout(@Body() refreshTokenDto: RefreshTokenDto) {
    return this.authService.logout(refreshTokenDto);
  }

  @UseGuards(JwtAuthGuard)
  @Get('me')
  me(@Request() req: ExpressRequest & { user: JwtPayload }) {
    return this.authService.getProfileById(req.user.sub);
  }

  @UseGuards(JwtAuthGuard)
  @Post('password/reset')
  resetPassword(
    @Request() req: ExpressRequest & { user: JwtPayload },
    @Body() changePasswordDto: ChangePasswordDto,
  ) {
    return this.authService.resetPassword(req.user.sub, changePasswordDto);
  }
}
