import { RedisHealthIndicator } from '@liaoliaots/nestjs-redis-health';
import { PrismaService } from '@lib/prisma';
import { ServiceRegistry } from '@lib/service.registry';
import { Injectable, Logger } from '@nestjs/common';
import { Transport } from '@nestjs/microservices';
import { HealthCheck, HealthCheckResult, HealthCheckService, MicroserviceHealthIndicator } from '@nestjs/terminus';
import { IHealthIndicator } from './interfaces/health-indicator.interface';
import { MongodbHealthIndicator, RedisIndicator } from './models';

@Injectable()
export class HealthService {
  private readonly listOfThingsToMonitor: IHealthIndicator[];
  private readonly logger = new Logger(HealthService.name);

  constructor(
    prisma: PrismaService,
    redisIndicator: RedisHealthIndicator,

    private readonly health: HealthCheckService,
    private readonly microservice: MicroserviceHealthIndicator,
    private readonly serviceRegistry: ServiceRegistry,
  ) {
    this.listOfThingsToMonitor = [new MongodbHealthIndicator(prisma), new RedisIndicator(redisIndicator)];
  }

  @HealthCheck()
  public async check(): Promise<HealthCheckResult[]> {
    const results: HealthCheckResult[] = [];

    for (const apiIndicator of this.listOfThingsToMonitor) {
      const isHealthy = await this.health.check([
        async () => {
          try {
            return await apiIndicator.isHealthy();
          } catch (error) {
            this.logger.warn(error);
            if (error.isHealthCheckError) {
              return apiIndicator.reportUnhealthy(JSON.stringify(error.causes));
            }
            return apiIndicator.reportUnhealthy(error.message);
          }
        },
      ]);

      results.push(isHealthy);
    }

    const microservicesHealthCheck = await this.checkMicroservices();
    return [...results, ...microservicesHealthCheck];
  }

  private async checkMicroservices(): Promise<HealthCheckResult[]> {
    const microservicesHealthCheck: HealthCheckResult[] = [];

    const allServices = await this.serviceRegistry.getAllServices();

    for (const service in allServices) {
      const { host, port } = allServices[service];

      const check = await this.health.check([
        () =>
          this.microservice.pingCheck(service, {
            transport: Transport.TCP,
            options: { host, port },
          }),
      ]);

      microservicesHealthCheck.push(check);
    }

    return microservicesHealthCheck;
  }
}
