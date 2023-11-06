import { LoggerModule } from '@lib/logger';
import { RedisModule } from '@lib/redis';
import { Module } from '@nestjs/common';
import { ServiceRegistry } from './service.registry.service';

@Module({
  imports: [LoggerModule, RedisModule],
  providers: [ServiceRegistry],
  exports: [ServiceRegistry],
})
export class ServiceRegistryModule {}
