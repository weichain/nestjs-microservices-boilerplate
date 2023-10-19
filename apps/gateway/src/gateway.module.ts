import { AuditLoggerModule } from '@lib/audit.logger';
import { UserJwtStrategy } from '@lib/guards';
import { HealthModule } from '@lib/health';
import { LoggerModule } from '@lib/logger';
import { MetricsModule } from '@lib/metrics';
import { CustomFaviconMiddleware } from '@lib/middlewares';
import { PrismaModule } from '@lib/prisma';
import { RateLimiterModule } from '@lib/rate.limiter';
import { ServiceRegistryModule } from '@lib/service.registry';
import { MiddlewareConsumer, Module, NestModule } from '@nestjs/common';
import { APP_GUARD } from '@nestjs/core';
import { ThrottlerGuard } from '@nestjs/throttler';
import { Clients } from './gateway.providers';
import { AuthController } from './services/auth/auth.controller';

@Module({
  imports: [LoggerModule, AuditLoggerModule, ServiceRegistryModule, HealthModule, MetricsModule, PrismaModule, RateLimiterModule],
  controllers: [AuthController],
  providers: [
    ...Clients,
    UserJwtStrategy,
    {
      provide: APP_GUARD,
      useClass: ThrottlerGuard,
    },
  ],
})
export class GatewayModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    consumer.apply(CustomFaviconMiddleware).forRoutes('*');
  }
}
