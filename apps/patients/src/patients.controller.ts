import { PatientsMessagePatterns } from '@lib/common';
import { Controller } from '@nestjs/common';
import { MessagePattern } from '@nestjs/microservices';
import { PatientsService } from './patients.service';

@Controller()
export class PatientsController {
  constructor(private readonly patientsService: PatientsService) {}

  @MessagePattern({ cmd: PatientsMessagePatterns.get })
  getPatientByUserId(input: { id: number }) {
    return this.patientsService.getPatientByUserId(input.id);
  }
}
