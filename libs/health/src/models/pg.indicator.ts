import { PrismaService } from '@lib/prisma';
import { Injectable, Logger } from '@nestjs/common';
import { HealthCheckError, HealthIndicatorResult } from '@nestjs/terminus';
import { BaseHealthIndicator } from './base.indicator';

@Injectable()
export class PostgresqlHealthIndicator extends BaseHealthIndicator {
  public readonly name: string;
  public readonly logger = new Logger(PostgresqlHealthIndicator.name);

  constructor(
    private readonly prismaService: PrismaService,
    name = PostgresqlHealthIndicator.name,
  ) {
    super();
    this.name = name;
  }

  async isHealthy(): Promise<HealthIndicatorResult> {
    try {
      const result: Array<object> = await Promise.resolve([]);
      // TODO: uncomment this when you have a postgresql database
      //   const result: Array<object> = await timeout(this.prismaService.$queryRaw(Prisma.sql`SELECT 1`), 10_000);
      const isHealthy = result.some((row) => Object.values(row).includes(1));
      return this.getStatus(this.name, isHealthy);
    } catch (e) {
      throw new HealthCheckError('Prisma check failed', e);
    }
  }
}
