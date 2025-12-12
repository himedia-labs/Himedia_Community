import { BadRequestException, INestApplication, ValidationPipe } from '@nestjs/common';
import type { ValidationError } from 'class-validator';

import { ERROR_CODES } from '../../constants/error/error-codes';
import { VALIDATION_MESSAGES } from '../../constants/message/dto.messages';
import type { ErrorCode } from '../../constants/error/error-codes';

export const setupValidation = (app: INestApplication): void => {
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      forbidNonWhitelisted: true,
      transform: true,
      exceptionFactory: (errors: ValidationError[]) => {
        const messages = errors
          .map(err => Object.values(err.constraints ?? {}))
          .flat()
          .filter(Boolean);

        return new BadRequestException({
          message: messages.length ? messages : (VALIDATION_MESSAGES.UNKNOWN as ErrorCode),
          code: ERROR_CODES.VALIDATION_FAILED as ErrorCode,
        });
      },
    }),
  );
};
