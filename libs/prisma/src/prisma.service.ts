import { Config } from '@lib/config';
import { Injectable, Logger, OnModuleInit } from '@nestjs/common';
import { fieldEncryptionExtension } from 'prisma-field-encryption';
import { MainPrisma } from '.';

@Injectable()
export class PrismaService extends MainPrisma.PrismaClient implements OnModuleInit {
  private readonly logger = new Logger(PrismaService.name);

  constructor() {
    super({
      datasources: {
        db: {
          url: Config.MAIN_DATABASE_URI,
        },
      },
    });

    this.$extends(
      fieldEncryptionExtension({
        encryptionKey: Config.MAIN_DB_CLOAK_MASTER_KEY,
        dmmf: MainPrisma.Prisma.dmmf,
        decryptionKeys: [Config.MAIN_DB_CLOAK_MASTER_KEY],
      }),
    );
  }

  async onModuleInit() {
    try {
      await this.$connect();
      await this.createIndexes();
    } catch (error) {
      this.logger.error(`Prisma connection error ${JSON.stringify(error)}`);
    }
  }

  private async createIndexes() {
    /**
     * Mongodb should ignore the trial of recreation of index with same name
     * @description create index for `DistributedLocks` collection
     * @see https://docs.mongodb.com/manual/core/index-ttl/
     * @see https://docs.mongodb.com/manual/tutorial/expire-data/
     * @see https://docs.mongodb.com/manual/core/index-unique/
     * @see https://docs.mongodb.com/manual/core/index-partial/
     */
    await this.$runCommandRaw({
      createIndexes: 'DistributedLocks',
      indexes: [
        {
          key: {
            createdAt: 1,
          },
          name: 'DistributedLocks_createdAt_ttl_index',
          expireAfterSeconds: 300,
        },
      ],
    });
  }
}
