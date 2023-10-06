import { RedisHealthIndicator } from '@liaoliaots/nestjs-redis-health';
import { Config } from '@lib/config';
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
    this.redis = new Redis({ host: Config.REDIS_HOST, port: Config.REDIS_PORT, password: Config.REDIS_PASSWORD });
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
