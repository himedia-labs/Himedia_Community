/**
 * 전역 ValidationPipe 설정
 * @description DTO 검증 실패 시 필드별 에러 메시지를 포함한 표준 응답 반환
 *
 * @example
 * - message: 모든 에러 메시지 배열
 * - code: "VALIDATION_FAILED"
 * - errors: 필드별 에러 객체
 */

import { BadRequestException, INestApplication, ValidationPipe } from '@nestjs/common';

import { ERROR_CODES } from '../../constants/error/error-codes';
import { VALIDATION_MESSAGES } from '../../constants/message/dto.messages';

import type { ValidationError } from 'class-validator';

export const setupValidation = (app: INestApplication): void => {
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      forbidNonWhitelisted: true,
      transform: true,
      exceptionFactory: (errors: ValidationError[]) => {
        const fieldErrors = errors.reduce<Record<string, string[]>>((acc, err) => {
          const constraints = Object.values(err.constraints ?? {}).filter(Boolean);
          if (constraints.length) {
            acc[err.property] = constraints;
          }
          return acc;
        }, {});

        const messages = Object.values(fieldErrors).flat();

        return new BadRequestException({
          message: messages.length ? messages.join(', ') : VALIDATION_MESSAGES.UNKNOWN,
          code: ERROR_CODES.VALIDATION_FAILED,
          errors: fieldErrors,
        });
      },
    }),
  );
};
