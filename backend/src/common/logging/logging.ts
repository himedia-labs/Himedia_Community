import {
  Injectable,
  NestInterceptor,
  ExecutionContext,
  CallHandler,
  Logger,
  INestApplication,
} from '@nestjs/common';
import type { Request } from 'express';
import { Observable } from 'rxjs';
import { tap } from 'rxjs/operators';

@Injectable()
export class LoggingInterceptor implements NestInterceptor {
  private readonly logger = new Logger(LoggingInterceptor.name);

  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
    const now = Date.now();
    const request = context.switchToHttp().getRequest<Request>();
    const { method, url } = request;

    // Request 로깅
    const requestInfo = this.formatRequestInfo(request);
    this.logger.log(`Request to ${method} ${url}${requestInfo}`);

    return next.handle().pipe(
      tap((data) => {
        const duration = Date.now() - now;
        const className = context.getClass().name;

        // Response 로깅
        if (data !== undefined && data !== null) {
          try {
            const responseData = JSON.stringify(data, null, 2);
            this.logger.log(
              `Response from ${method} ${url} ${className} ${duration}ms \n response: ${responseData}`,
            );
          } catch {
            // circular structure 에러 처리
            this.logger.log(
              `Response from ${method} ${url} ${className} ${duration}ms (response contains circular structure)`,
            );
          }
        } else {
          this.logger.log(
            `Response from ${method} ${url} ${className} ${duration}ms (no response data)`,
          );
        }
      }),
    );
  }

  /**
   * Request 정보 포맷팅
   */
  private formatRequestInfo(request: Request): string {
    const params = request.params as Record<string, unknown> | undefined;
    const query = request.query as Record<string, unknown> | undefined;
    const body = request.body as Record<string, unknown> | undefined;

    const parts: string[] = [];

    if (params && Object.keys(params).length > 0) {
      parts.push(`params: ${JSON.stringify(params, null, 2)}`);
    }
    if (query && Object.keys(query).length > 0) {
      parts.push(`query: ${JSON.stringify(query, null, 2)}`);
    }
    if (body && Object.keys(body).length > 0) {
      parts.push(`body: ${JSON.stringify(body, null, 2)}`);
    }

    return parts.length > 0 ? ` \n ${parts.join(' \n ')}` : '';
  }
}

export const setupInterceptors = (app: INestApplication) => {
  app.useGlobalInterceptors(new LoggingInterceptor());
};
