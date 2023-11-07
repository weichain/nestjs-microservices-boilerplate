import { timeout } from '@lib/common';
import { PrismaService } from '@lib/prisma';
import { Injectable, Logger } from '@nestjs/common';
import { HealthCheckError, HealthIndicatorResult } from '@nestjs/terminus';
import { BaseHealthIndicator } from './base.indicator';

@Injectable()
export class MongodbHealthIndicator extends BaseHealthIndicator {
  public readonly name: string;
  public readonly logger = new Logger(MongodbHealthIndicator.name);

  constructor(
    private readonly prismaService: PrismaService,
    name = MongodbHealthIndicator.name,
  ) {
    super();
    this.name = name;
  }

  async isHealthy(): Promise<HealthIndicatorResult> {
    try {
      const result = await timeout(this.prismaService.$runCommandRaw({ ping: 1 }), 10_000);
      return this.getStatus(this.name, result.ok === 1);
    } catch (e) {
      throw new HealthCheckError('Prisma check failed', e);
    }
  }
}
