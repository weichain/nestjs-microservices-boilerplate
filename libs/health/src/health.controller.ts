import { Controller, Get } from '@nestjs/common';
import { ApiExcludeController } from '@nestjs/swagger';
import { HealthCheckResult } from '@nestjs/terminus';
import { HealthService } from './health.service';

@Controller('health')
@ApiExcludeController()
export class HealthController {
  constructor(private healthService: HealthService) {}

  @Get()
  public async check(): Promise<HealthCheckResult[]> {
    const healthCheckResult: HealthCheckResult[] = await this.healthService.check();
    return healthCheckResult;
  }
}
