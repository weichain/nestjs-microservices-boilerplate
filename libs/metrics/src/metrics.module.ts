import { Module } from '@nestjs/common';
import { PrometheusModule } from '@willsoto/nestjs-prometheus';
import { PrometheusControllerOmitSwagger } from './metrics.controller';
import { MetricsService } from './metrics.service';

@Module({
  imports: [PrometheusModule.register({ global: true, controller: PrometheusControllerOmitSwagger })],
  providers: [MetricsService],
  exports: [MetricsService],
})
export class MetricsModule {}
