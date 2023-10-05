import { RedisModule } from '@liaoliaots/nestjs-redis';
import { Config } from '@lib/config';
import { LoggerModule } from '@lib/logger';
import { Module } from '@nestjs/common';
import { ServiceRegistry } from './service.registry.service';

@Module({
  imports: [
    LoggerModule,
    RedisModule.forRoot({
      config: {
        host: Config.REDIS_HOST,
        port: Config.REDIS_PORT,
        password: Config.REDIS_PASSWORD,
      },
    }),
  ],
  providers: [ServiceRegistry],
  exports: [ServiceRegistry],
})
export class ServiceRegistryModule {}
