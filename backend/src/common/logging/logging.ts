import { Injectable, NestInterceptor, ExecutionContext, CallHandler, Logger, INestApplication } from '@nestjs/common';

import { Observable } from 'rxjs';
import { tap } from 'rxjs/operators';

import type { Request, Response } from 'express';

@Injectable()
export class LoggingInterceptor implements NestInterceptor {
  private readonly logger = new Logger(LoggingInterceptor.name);

  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
    const now = Date.now();
    const request = context.switchToHttp().getRequest<Request>();
    const response = context.switchToHttp().getResponse<Response>();
    const { method, url } = request;

    // Request 로깅
    this.logger.log(`Request ${method} ${url}`);

    return next.handle().pipe(
      tap(() => {
        const duration = Date.now() - now;
        const className = context.getClass().name;
        const statusCode = response?.statusCode ?? 'unknown';
        this.logger.log(`Response ${method} ${url} ${statusCode} ${className} ${duration}ms`);
      }),
    );
  }
}

export const setupInterceptors = (app: INestApplication) => {
  app.useGlobalInterceptors(new LoggingInterceptor());
};
