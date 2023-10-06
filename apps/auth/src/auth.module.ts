import { Config } from '@lib/config';
import { GlobalRpcExceptionFilter } from '@lib/filters';
import { LoggerModule } from '@lib/logger';
import { PrismaModule } from '@lib/prisma';
import { ServiceRegistryModule } from '@lib/service.registry';
import { Module } from '@nestjs/common';
import { APP_FILTER } from '@nestjs/core';
import { JwtModule } from '@nestjs/jwt';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';

@Module({
  imports: [
    LoggerModule,
    PrismaModule,
    JwtModule.register({
      secret: Config.JWT_SECRET,
      signOptions: {
        expiresIn: '24h',
      },
    }),
    ServiceRegistryModule,
  ],
  controllers: [AuthController],
  providers: [
    AuthService,

    {
      provide: APP_FILTER,
      useClass: GlobalRpcExceptionFilter,
    },
  ],
})
export class AuthModule {}
