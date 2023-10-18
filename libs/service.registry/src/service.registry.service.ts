import { RedisService } from '@liaoliaots/nestjs-redis';
import { Injectable, Logger } from '@nestjs/common';

@Injectable()
export class ServiceRegistry {
  private readonly logger = new Logger(ServiceRegistry.name);
  constructor(private readonly redisService: RedisService) {}

  private get redisClient() {
    return this.redisService.getClient();
  }

  public async registerService(serviceName: string, host: string, port: number) {
    const key = `service:${serviceName}`;
    const serviceInfo = JSON.stringify({ host, port });

    await this.redisClient.hset('services', key, serviceInfo);
    await this.redisClient.set(key, serviceInfo);
    this.logger.log(`Service ${serviceName} registered at ${host}:${port}`);
  }

  public async deregisterService(serviceName: string) {
    const key = `service:${serviceName}`;

    await this.redisClient.hdel('services', key);
    await this.redisClient.del(key);
  }

  public async getService(serviceName: string) {
    const key = `service:${serviceName}`;
    const serviceInfo = await this.redisClient.hget('services', key);
    return serviceInfo ? JSON.parse(serviceInfo) : null;
  }

  public async getAllServices() {
    const services = await this.redisClient.hgetall('services');
    const parsedServices: Record<string, IServiceInfo> = {};

    for (const key of Object.keys(services)) {
      parsedServices[key.split(':')[1]] = JSON.parse(services[key]);
    }

    return parsedServices;
  }
}

interface IServiceInfo {
  host: string;
  port: number;
}
