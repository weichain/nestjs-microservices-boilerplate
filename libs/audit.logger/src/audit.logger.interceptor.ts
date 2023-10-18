import { IRequest } from '@lib/common';
import { AUDIT_LOGGER_LEVEL, AuditLogLevelOption } from '@lib/decorators';
import { CallHandler, ExecutionContext, Injectable, NestInterceptor } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { Request as ExpressRequest } from 'express';
import { Observable, tap } from 'rxjs';
import { AuditLoggerService } from './audit.logger.service';

/**
 * Audit Logger Interceptor helps to log every activity to a database
 */
@Injectable()
export class AuditLoggerInterceptor implements NestInterceptor {
  constructor(
    private readonly reflector: Reflector,
    private readonly service: AuditLoggerService,
  ) {}

  intercept(context: ExecutionContext, next: CallHandler): Observable<CallHandler> {
    const level = this.reflector.get<AuditLogLevelOption>(AUDIT_LOGGER_LEVEL, context.getHandler());

    if (!level || level === 'disabled') {
      return next.handle();
    }

    if (context.getType() === 'http') {
      return this.logHttp(context, next, level);
    }

    return next.handle();
  }

  private logHttp(context: ExecutionContext, next: CallHandler, level: AuditLogLevelOption | null): Observable<CallHandler> {
    const user = context.switchToHttp().getRequest<IRequest>().user?.id;

    if (!user) {
      return next.handle();
    }

    const req: ExpressRequest = context.switchToHttp().getRequest();

    return next.handle().pipe(
      tap(() => {
        this.service
          .createHttpAudit(level, req, user)
          .then(() => {})
          .catch(() => {});
      }),
    );
  }
}
