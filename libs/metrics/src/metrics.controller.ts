import { Controller } from '@nestjs/common';
import { ApiExcludeController } from '@nestjs/swagger';
import { PrometheusController } from '@willsoto/nestjs-prometheus';

@Controller()
@ApiExcludeController()
export class PrometheusControllerOmitSwagger extends PrometheusController {}
