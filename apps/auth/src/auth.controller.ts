import { AuthMessagePatterns } from '@lib/common';
import { Controller } from '@nestjs/common';
import { MessagePattern } from '@nestjs/microservices';
import { AuthService } from './auth.service';
import {
  UserLoginRequestDto,
  UserLoginResponseDto,
  UserRegisterRequestDto,
  UserRegisterResponseDto,
  UserUpdatePasswordRequestDto,
  UserUpdatePasswordResponseDto,
} from './dto';

@Controller()
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @MessagePattern({ cmd: AuthMessagePatterns.register })
  public async register(input: { data: UserRegisterRequestDto }): Promise<UserRegisterResponseDto> {
    return this.authService.register(input.data);
  }

  @MessagePattern({ cmd: AuthMessagePatterns.login })
  public async login(input: { data: UserLoginRequestDto }): Promise<UserLoginResponseDto> {
    return this.authService.login(input.data);
  }

  @MessagePattern({ cmd: AuthMessagePatterns.updatePassword })
  public async updatePassword(input: { userUuid: string; data: UserUpdatePasswordRequestDto }): Promise<UserUpdatePasswordResponseDto> {
    return this.authService.updatePassword(input.userUuid, input.data);
  }
}
