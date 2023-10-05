import { RedisHealthModule } from '@liaoliaots/nestjs-redis-health';
import { PrismaModule } from '@lib/prisma';
import { ServiceRegistryModule } from '@lib/service.registry';
import { Module } from '@nestjs/common';
import { TerminusModule } from '@nestjs/terminus';
import { HealthController } from './health.controller';
import { HealthService } from './health.service';

@Module({
  imports: [ServiceRegistryModule, PrismaModule, TerminusModule, RedisHealthModule],
  providers: [HealthService],
  exports: [HealthService],
  controllers: [HealthController],
})
export class HealthModule {}
