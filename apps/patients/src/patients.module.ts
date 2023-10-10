import { LoggerModule } from '@lib/logger';
import { PrismaModule } from '@lib/prisma';
import { ServiceRegistryModule } from '@lib/service.registry';
import { Module } from '@nestjs/common';
import { PatientsController } from './patients.controller';
import { PatientsService } from './patients.service';

@Module({
  imports: [PrismaModule, LoggerModule, ServiceRegistryModule],
  controllers: [PatientsController],
  providers: [PatientsService],
})
export class PatientsModule {}
