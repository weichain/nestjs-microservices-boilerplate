import { RedisModule as NestRedisModule } from '@liaoliaots/nestjs-redis';

import { Config } from '@lib/config';
import { Module } from '@nestjs/common';
import { RedisService } from './redis.service';

@Module({
  imports: [
    NestRedisModule.forRoot({
      config: {
        host: Config.REDIS_HOST,
        port: Config.REDIS_PORT,
        username: Config.REDIS_USERNAME,
        password: Config.REDIS_PASSWORD,
        tls: Config.REDIS_TLS,
      },
    }),
  ],
  providers: [RedisService],
  exports: [RedisService],
})
export class RedisModule {}
