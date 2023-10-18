import { AuthMessagePatterns, IRequest, Microservices } from '@lib/common';
import {
  UserLoginRequestDto,
  UserLoginResponseDto,
  UserRegisterRequestDto,
  UserRegisterResponseDto,
  UserUpdatePasswordRequestDto,
  UserUpdatePasswordResponseDto,
} from '@lib/dtos';
import JwtAuthGuard from '@lib/guards/jwt.guard';
import { Body, Controller, HttpCode, HttpStatus, Inject, Post, Request, UseGuards } from '@nestjs/common';
import { ClientProxy } from '@nestjs/microservices';
import { ApiBody, ApiOkResponse, ApiTags } from '@nestjs/swagger';
import { firstValueFrom } from 'rxjs';

@ApiTags('api/auth')
@Controller('api/auth')
export class AuthController {
  constructor(@Inject(Microservices.AUTH) private readonly authServiceProxy: ClientProxy) {}

  @Post('register')
  @HttpCode(HttpStatus.OK)
  @ApiBody({ type: UserRegisterRequestDto })
  @ApiOkResponse({ type: UserRegisterResponseDto })
  public createUser(@Body() data: UserRegisterRequestDto): Promise<UserRegisterResponseDto> {
    return firstValueFrom<UserRegisterResponseDto>(this.authServiceProxy.send({ cmd: AuthMessagePatterns.REGISTER }, { data }));
  }

  @Post('login')
  @HttpCode(HttpStatus.OK)
  @ApiBody({ type: UserLoginRequestDto })
  @ApiOkResponse({ type: UserLoginResponseDto })
  public login(@Body() data: UserLoginRequestDto): Promise<UserLoginResponseDto> {
    return firstValueFrom<UserLoginResponseDto>(this.authServiceProxy.send({ cmd: AuthMessagePatterns.LOGIN }, { data }));
  }

  @Post('password')
  @HttpCode(HttpStatus.OK)
  @ApiBody({ type: UserUpdatePasswordRequestDto })
  @ApiOkResponse({ type: UserUpdatePasswordResponseDto })
  @UseGuards(JwtAuthGuard)
  public updatePassword(@Body() data: UserUpdatePasswordRequestDto, @Request() req: IRequest): Promise<UserUpdatePasswordResponseDto> {
    return firstValueFrom<UserUpdatePasswordResponseDto>(
      this.authServiceProxy.send({ cmd: AuthMessagePatterns.UPDATE_PASSWORD }, { id: req.user.id, data }),
    );
  }
}
