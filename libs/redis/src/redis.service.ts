import { InjectRedis } from '@liaoliaots/nestjs-redis';
import { Config } from '@lib/config';
import { Injectable } from '@nestjs/common';
import { Redis } from 'ioredis';

@Injectable()
export class RedisService {
  constructor(@InjectRedis() private readonly redis: Redis) {}

  public getClient(): Redis {
    return this.redis;
  }

  public static getNewClient(): Redis {
    return new Redis({
      host: Config.REDIS_HOST,
      port: Config.REDIS_PORT,
      username: Config.REDIS_USERNAME,
      password: Config.REDIS_PASSWORD,
      tls: Config.REDIS_TLS,
    });
  }
}
