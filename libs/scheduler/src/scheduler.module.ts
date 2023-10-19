import { LoggerModule } from '@lib/logger';
import { PrismaModule } from '@lib/prisma';
import { Module } from '@nestjs/common';
import { ScheduleModule } from '@nestjs/schedule';
import { SchedulerService } from './scheduler.service';

@Module({
  imports: [LoggerModule, PrismaModule, ScheduleModule.forRoot()],
  providers: [SchedulerService],
  exports: [SchedulerService],
})
export class SchedulerModule {}
