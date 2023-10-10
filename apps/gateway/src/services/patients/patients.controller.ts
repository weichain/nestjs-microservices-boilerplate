import { IRequest, Microservices, PatientsMessagePatterns } from '@lib/common';
import { UserRegisterResponseDto } from '@lib/dtos';
import JwtAuthGuard from '@lib/guards/jwt.guard';
import { Controller, Get, HttpCode, HttpStatus, Inject, Request, UseGuards } from '@nestjs/common';
import { ClientProxy } from '@nestjs/microservices';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { firstValueFrom } from 'rxjs';

@ApiTags('api/patients')
@Controller('api/patients')
export class PatientsController {
  constructor(@Inject(Microservices.PATIENTS) private readonly patientsServiceProxy: ClientProxy) {}

  @Get()
  @ApiBearerAuth()
  @HttpCode(HttpStatus.OK)
  @UseGuards(JwtAuthGuard)
  public async fetchPatient(@Request() req: IRequest): Promise<UserRegisterResponseDto> {
    return firstValueFrom<UserRegisterResponseDto>(
      this.patientsServiceProxy.send({ cmd: PatientsMessagePatterns.get }, { id: req.user.id }),
    );
  }
}
