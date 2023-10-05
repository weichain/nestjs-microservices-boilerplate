import { Module } from '@nestjs/common';
import { CustomFaviconMiddleware } from './favico.middleware';
import { NodeRateLimiterMiddleware } from './rate.limiter.middleware';

@Module({
  providers: [NodeRateLimiterMiddleware, CustomFaviconMiddleware],
  exports: [NodeRateLimiterMiddleware, CustomFaviconMiddleware],
})
export class MiddlewareModule {}
