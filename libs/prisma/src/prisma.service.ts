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

  private async createIndexes() {}
}
