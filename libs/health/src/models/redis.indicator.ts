import { RedisHealthIndicator } from '@liaoliaots/nestjs-redis-health';
import { RedisService } from '@lib/redis';
import { Logger } from '@nestjs/common';
import { HealthCheckError, HealthIndicatorResult } from '@nestjs/terminus';
import Redis from 'ioredis';
import { BaseHealthIndicator } from './base.indicator';

export class RedisIndicator extends BaseHealthIndicator {
  public readonly name: string;
  public readonly logger = new Logger(RedisIndicator.name);
  private readonly redis: Redis;

  constructor(
    name = RedisIndicator.name,
    private readonly redisIndicator: RedisHealthIndicator,
  ) {
    super();
    this.redis = RedisService.getNewClient();
    this.name = name;
  }

  public async isHealthy(): Promise<HealthIndicatorResult> {
    try {
      const check = await this.redisIndicator.checkHealth(this.name, { type: 'redis', client: this.redis, timeout: 5_000 });
      return check;
    } catch (e) {
      throw new HealthCheckError('RedisIndicator failed', this.getStatus(this.name, false, { message: e.message }));
    }
  }
}
