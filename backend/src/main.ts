import { NestFactory } from '@nestjs/core';
import { ConfigService, ConfigType } from '@nestjs/config';

import cookieParser from 'cookie-parser';

import { AppModule } from './app.module';
import appConfig from './common/config/app.config';
import { setupCors } from './common/cors/cors';
import { setupSwagger } from './common/swagger/swagger';
import { setupFilters } from './common/exception/httpException';
import { setupValidation } from './common/validation/validation';
import { setupInterceptors } from './common/logging/logging';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  const configService = app.get(ConfigService);
  const config: ConfigType<typeof appConfig> = configService.get('app')!;

  app.use(cookieParser());
  setupCors(app);
  setupFilters(app);
  setupValidation(app);
  setupInterceptors(app);

  setupSwagger(app);
  await app.listen(config.port);
}
void bootstrap();
