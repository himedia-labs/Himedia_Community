import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { TypeOrmModule } from '@nestjs/typeorm';
import { PassportModule } from '@nestjs/passport';
import { ConfigModule, ConfigService, ConfigType } from '@nestjs/config';

import { AuthController } from './auth.controller';

import { AuthService } from './services/auth.service';
import { UserService } from './services/user.service';
import { TokenService } from './services/token.service';
import { RateLimitService } from './services/rateLimit.service';
import { SnowflakeService } from '../common/services/snowflake.service';
import { PasswordResetService } from './services/password-reset.service';
import { PasswordChangeService } from './services/password-change.service';
import { AccountRestoreService } from './services/account-restore.service';
import { AccountWithdrawService } from './services/account-withdraw.service';
import { EmailVerificationService } from './services/email-verification.service';

import { User } from './entities/user.entity';
import { RefreshToken } from './entities/refreshToken.entity';
import { PasswordReset } from './entities/passwordReset.entity';
import { EmailVerification } from './entities/emailVerification.entity';

import { JwtStrategy } from './strategies/jwt.strategy';
import { LocalStrategy } from './strategies/local.strategy';

import { LoginRateLimitGuard } from './guards/loginRateLimit.guard';
import { LoginValidationGuard } from './guards/loginValidation.guard';
import { PasswordRateLimitGuard } from './guards/passwordRateLimit.guard';

import appConfig from '../common/config/app.config';
import { EmailModule } from '../email/email.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([User, RefreshToken, PasswordReset, EmailVerification]),
    PassportModule,
    JwtModule.registerAsync({
      imports: [ConfigModule.forFeature(appConfig)],
      inject: [ConfigService],
      useFactory: (configService: ConfigService) => {
        const config: ConfigType<typeof appConfig> = configService.get('app')!;
        return {
          secret: config.jwt.secret,
          signOptions: {
            expiresIn: config.jwt.accessExpiresIn,
          },
        };
      },
    }),
    EmailModule,
  ],
  controllers: [AuthController],
  providers: [
    AuthService,
    UserService,
    JwtStrategy,
    TokenService,
    LocalStrategy,
    RateLimitService,
    SnowflakeService,
    LoginRateLimitGuard,
    LoginValidationGuard,
    PasswordResetService,
    AccountRestoreService,
    PasswordChangeService,
    PasswordRateLimitGuard,
    AccountWithdrawService,
    EmailVerificationService,
  ],
})
export class AuthModule {}
