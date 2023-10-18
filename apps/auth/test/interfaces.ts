import { PrismaService } from '@lib/prisma';
import { INestApplication } from '@nestjs/common';
import { ClientProxy } from '@nestjs/microservices';

export interface ITestContext {
  app: INestApplication;
  clientProxy: ClientProxy;
  prismaService: PrismaService;
}
