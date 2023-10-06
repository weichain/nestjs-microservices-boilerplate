import { AuditLoggerModule } from '@lib/audit.logger';
import { UserJwtStrategy } from '@lib/guards';
import { HealthModule } from '@lib/health';
import { LoggerModule } from '@lib/logger';
import { MetricsModule } from '@lib/metrics';
import { CustomFaviconMiddleware, NodeRateLimiterMiddleware } from '@lib/middlewares';
import { PrismaModule } from '@lib/prisma';
import { ServiceRegistryModule } from '@lib/service.registry';
import { MiddlewareConsumer, Module, NestModule } from '@nestjs/common';
import { Clients } from './gateway.providers';
import { AuthController } from './services/auth/auth.controller';

@Module({
  imports: [LoggerModule, AuditLoggerModule, ServiceRegistryModule, HealthModule, MetricsModule, PrismaModule],
  controllers: [AuthController],
  providers: [...Clients, UserJwtStrategy],
})
export class GatewayModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    consumer.apply(CustomFaviconMiddleware, NodeRateLimiterMiddleware).forRoutes('*');
  }
}
