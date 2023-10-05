import { AuthMessagePatterns, Microservices } from '@lib/common';
import { Body, Controller, Inject, Post } from '@nestjs/common';
import { ClientProxy } from '@nestjs/microservices';
import { ApiTags } from '@nestjs/swagger';
import { firstValueFrom } from 'rxjs';

// TODO: add DTOs and guards

@ApiTags('api/auth')
@Controller('api/auth')
export class AuthController {
  constructor(@Inject(Microservices.AUTH) private readonly authServiceProxy: ClientProxy) {}

  @Post('register')
  public async createUser(@Body() data) {
    return firstValueFrom(this.authServiceProxy.send({ cmd: AuthMessagePatterns.register }, { data }));
  }

  @Post('login')
  public async login(@Body() data) {
    return firstValueFrom(this.authServiceProxy.send({ cmd: AuthMessagePatterns.login }, { data }));
  }

  @Post('password')
  public async updatePassword(@Body() data) {
    return firstValueFrom(this.authServiceProxy.send({ cmd: AuthMessagePatterns.updatePassword }, { data }));
  }
}
