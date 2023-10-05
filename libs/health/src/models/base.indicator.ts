import { HealthIndicator, HealthIndicatorResult } from '@nestjs/terminus';
import { IHealthIndicator } from '../interfaces/health-indicator.interface';

export abstract class BaseHealthIndicator extends HealthIndicator implements IHealthIndicator {
  public name: string;

  abstract isHealthy(): Promise<HealthIndicatorResult>;

  reportUnhealthy(reason: string): Promise<HealthIndicatorResult> {
    return new Promise((resolve) => {
      resolve(this.getStatus(this.name, false, { reason }));
    });
  }
}
