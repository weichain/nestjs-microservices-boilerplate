import { HealthIndicatorResult } from '@nestjs/terminus';

export interface IHealthIndicator {
  name: string;
  isHealthy(): Promise<HealthIndicatorResult>;
  reportUnhealthy(reason: string): Promise<HealthIndicatorResult>;
}
