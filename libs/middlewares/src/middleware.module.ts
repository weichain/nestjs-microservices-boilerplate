import { Module } from '@nestjs/common';
import { CustomFaviconMiddleware } from './favico.middleware';

@Module({
  providers: [CustomFaviconMiddleware],
  exports: [CustomFaviconMiddleware],
})
export class MiddlewareModule {}
