import { PrismaModule } from '@lib/prisma';
import { Module } from '@nestjs/common';
import { AuditLoggerInterceptor } from './audit.logger.interceptor';
import { AuditLoggerService } from './audit.logger.service';

@Module({
  imports: [PrismaModule],
  providers: [AuditLoggerService, AuditLoggerInterceptor],
  exports: [AuditLoggerService],
})
export class AuditLoggerModule {}
