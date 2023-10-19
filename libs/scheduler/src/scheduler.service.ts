import { sleep } from '@lib/common';
import { Config } from '@lib/config';
import { PrismaService } from '@lib/prisma';
import { Injectable, Logger, OnModuleDestroy } from '@nestjs/common';
import { SchedulerRegistry } from '@nestjs/schedule';
import { CronJob } from 'cron';
import { DateTime } from 'luxon';

@Injectable()
export class SchedulerService implements OnModuleDestroy {
  private logger: Logger = new Logger(SchedulerService.name);
  private readonly instanceId = Config.INSTANCE_ID;

  constructor(
    private readonly schedulerRegistry: SchedulerRegistry,
    private readonly prisma: PrismaService,
  ) {}

  async onModuleDestroy() {
    await this.releaseAllLocks();
  }

  public async removeTask(name: string) {
    try {
      this.schedulerRegistry.deleteCronJob(name);
      this.logger.log(`Cron Job ${name} deleted.`, SchedulerService.name);
      await this.releaseLock(name);
    } catch (error) {
      this.logger.error(error);
    }
  }

  public addTask(name: string, cronTime: string | Date | DateTime, func: () => Promise<void>) {
    try {
      const job = new CronJob({
        cronTime,
        timeZone: 'UTC',
        onTick: () => {
          void (async () => {
            const acquired = await this.tryAcquireLock(name);
            if (acquired) {
              try {
                this.logger.log(
                  `⏰ Cron Job ${name} tick on instance ${this.instanceId}. Next tick at ${job.nextDate().toFormat('LLL dd HH:mm:ss')}`,
                  SchedulerService.name,
                );
                await func();
              } catch (error) {
                this.logger.error(error, null, SchedulerService.name);
              } finally {
                await sleep(1000);
                await this.releaseLock(name);
              }
            }
          })();
        },
      });

      this.logger.log(`⏰ Cron Job ${name} started on instance ${this.instanceId}`, SchedulerService.name);
      this.schedulerRegistry.addCronJob(name, job);
      job.start();
    } catch (err) {}
  }

  /**
   * @dev Set lock with expiration time of 300 seconds or 5 minutes and only set it if the lock is not already set
   * @param name
   * @returns
   */
  private async tryAcquireLock(name: string): Promise<boolean> {
    try {
      const lockKey = this.lockKey(name);
      const acquired = await this.prisma.distributedLocks.create({ data: { key: lockKey, value: this.instanceId } });
      return acquired.key === lockKey;
    } catch (err) {
      return false;
    }
  }

  /**
   * @dev Release lock by deleting it
   * @param name
   * @returns
   */
  private async releaseLock(name: string): Promise<boolean> {
    try {
      const lockKey = this.lockKey(name);
      const deleted = await this.prisma.distributedLocks.delete({ where: { key: lockKey } });
      return deleted.key === lockKey;
    } catch (error) {
      this.logger.error(error);
      return false;
    }
  }

  /**
   * @dev Release all locks
   */
  private async releaseAllLocks(): Promise<void> {
    const numberOfReleasedLocks = await this.prisma.distributedLocks.deleteMany({ where: { value: this.instanceId } });
    this.logger.log(`Released all locks: ${numberOfReleasedLocks.count}`, SchedulerService.name);
  }

  /**
   * @dev Create a lock key
   * @param name
   * @returns
   */
  private lockKey(name: string): string {
    return `scheduler_service_lock:${name}`;
  }
}
