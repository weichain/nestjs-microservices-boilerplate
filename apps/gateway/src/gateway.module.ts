import { AuditLoggerModule } from '@lib/audit.logger';
import { HealthModule } from '@lib/health';
import { LoggerModule } from '@lib/logger';
import { CustomFaviconMiddleware, NodeRateLimiterMiddleware } from '@lib/middlewares';
import { ServiceRegistryModule } from '@lib/service.registry';
import { MiddlewareConsumer, Module, NestModule } from '@nestjs/common';
import { Clients } from './gateway.providers';
import { AuthController } from './services/auth/auth.controller';

@Module({
  imports: [LoggerModule, AuditLoggerModule, ServiceRegistryModule, HealthModule],
  controllers: [AuthController],
  providers: [...Clients],
})
export class GatewayModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    consumer.apply(CustomFaviconMiddleware, NodeRateLimiterMiddleware).forRoutes('*');
  }
}
