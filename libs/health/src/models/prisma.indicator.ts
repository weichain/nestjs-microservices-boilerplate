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
      const result = await timeout(this.prismaService.$runCommandRaw({ ping: 1 }), 10_000);
      return this.getStatus(this.name, result.ok === 1);
    } catch (e) {
      throw new HealthCheckError('Prisma check failed', e);
    }
  }
}
