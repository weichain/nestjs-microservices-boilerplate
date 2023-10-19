import { Config } from '@lib/config';
import { Module } from '@nestjs/common';
import { ThrottlerModule, seconds } from '@nestjs/throttler';
import { Redis } from 'ioredis';
import { ThrottlerStorageRedisService } from 'nestjs-throttler-storage-redis';

@Module({
  imports: [
    ThrottlerModule.forRoot({
      throttlers: [{ limit: Config.API_RATE_LIMITTER_LIMIT, ttl: seconds(Config.API_RATE_LIMITTER_TTL) }],
      storage: new ThrottlerStorageRedisService(
        new Redis({ host: Config.REDIS_HOST, port: Config.REDIS_PORT, password: Config.REDIS_PASSWORD }),
      ),
    }),
  ],
  providers: [],
  exports: [],
})
export class RateLimiterModule {}
