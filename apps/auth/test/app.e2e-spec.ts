import { Config } from '@lib/config';
import { PrismaService } from '@lib/prisma';
import { JwtModule } from '@nestjs/jwt';
import { ClientProxyFactory, Transport } from '@nestjs/microservices';
import { Test, TestingModule } from '@nestjs/testing';
import { AuthModule } from './../src/auth.module';
import { shouldLogin } from './behavior/login';
import { shouldUpdatePassword } from './behavior/password.update';
import { shouldRegister } from './behavior/register.test';
import { ITestContext } from './interfaces';

describe('AuthController (e2e)', () => {
  const context: ITestContext = {
    app: null,
    clientProxy: null,
    prismaService: null,
  };

  beforeAll(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({ imports: [AuthModule, JwtModule] }).compile();

    context.app = moduleFixture.createNestApplication();
    context.app.connectMicroservice({ transport: Transport.TCP, options: { port: Config.AUTH_SERVICE_PORT } });
    context.clientProxy = ClientProxyFactory.create({
      transport: Transport.TCP,
      options: { host: 'localhost', port: Config.AUTH_SERVICE_PORT },
    });
    context.prismaService = new PrismaService();

    await context.app.startAllMicroservices();
  });

  beforeEach(async () => {});

  afterAll(async () => {
    await context.clientProxy.close();
    await context.app.close();
    await context.prismaService.user.deleteMany({});
  });

  shouldRegister(context);
  shouldLogin(context);
  shouldUpdatePassword(context);
});
