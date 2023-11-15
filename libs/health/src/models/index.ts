import { RedisHealthIndicator } from '@liaoliaots/nestjs-redis-health';
import { HEALTH_INDICATORS } from '@lib/common';
import { PrismaService } from '@lib/prisma';
import { MongodbHealthIndicator } from './mongodb.indicator';
import { RedisIndicator } from './redis.indicator';

const getHealthProviders = () => {
  return [
    {
      provide: HEALTH_INDICATORS,
      useFactory: (prisma: PrismaService, redisIndicator: RedisHealthIndicator) => {
        return [new MongodbHealthIndicator(prisma), new RedisIndicator(redisIndicator)];
      },
      inject: [PrismaService, RedisHealthIndicator],
    },
  ];
};

export const HealthProviders = getHealthProviders();
