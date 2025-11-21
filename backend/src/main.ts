import { NestFactory } from '@nestjs/core';

import { AppModule } from './app.module';
import { setupCors } from './config/cors/cors';
import { setupSwagger } from './config/swagger/setupSwagger';
import { setupFilters } from './common/filter/HttpException';
import { setupValidation } from './common/validation/setupValidation';
import { setupInterceptors } from './common/interceptors/LoggingInterceptor';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  setupCors(app);
  setupFilters(app);
  setupValidation(app);
  setupInterceptors(app);

  setupSwagger(app);
  await app.listen(Number(process.env.PORT));
}
void bootstrap();
