import { BaseMicroserviceModule } from '@lib/common';
import { LoggerModule } from '@lib/logger';
import { PrismaModule } from '@lib/prisma';
import { ServiceRegistryModule } from '@lib/service.registry';
import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';

@Module({
  imports: [LoggerModule, BaseMicroserviceModule, PrismaModule, JwtModule, ServiceRegistryModule],
  controllers: [AuthController],
  providers: [AuthService],
})
export class AuthModule {}
