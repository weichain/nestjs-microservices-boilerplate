import { Config } from '@lib/config';
import { RedisService } from '@lib/redis';
import { Module } from '@nestjs/common';
import { ThrottlerModule, seconds } from '@nestjs/throttler';
import { ThrottlerStorageRedisService } from 'nestjs-throttler-storage-redis';

@Module({
  imports: [
    ThrottlerModule.forRoot({
      throttlers: [{ limit: Config.API_RATE_LIMITTER_LIMIT, ttl: seconds(Config.API_RATE_LIMITTER_TTL) }],
      storage: new ThrottlerStorageRedisService(RedisService.getNewClient()),
    }),
  ],
  providers: [],
  exports: [],
})
export class RateLimiterModule {}
