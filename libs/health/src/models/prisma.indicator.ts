import { timeout } from '@lib/common';
import { PrismaService } from '@lib/prisma';
import { Injectable, Logger } from '@nestjs/common';
import { HealthCheckError, HealthIndicatorResult } from '@nestjs/terminus';
import { BaseHealthIndicator } from './base.indicator';

@Injectable()
export class PrismaHealthIndicator extends BaseHealthIndicator {
  public readonly name: string;
  public readonly logger = new Logger(PrismaHealthIndicator.name);

  constructor(
    name: string,
    private readonly prismaService: PrismaService,
  ) {
    super();
    this.name = name;
  }

  async isHealthy(): Promise<HealthIndicatorResult> {
    try {
      const result: Array<object> = await timeout(this.prismaService.$queryRaw`SELECT 1`, 10_000);
      const isHealthy = result.some((row) => Object.values(row).includes(1));
      return this.getStatus(`postgresql ${this.name}`, isHealthy);
    } catch (e) {
      throw new HealthCheckError('Prisma check failed', e);
    }
  }
}
