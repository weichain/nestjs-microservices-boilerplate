import { microserviceSetup } from '@lib/common';
import { Config } from '@lib/config';
import { Logger } from '@nestjs/common';
import { PatientsModule } from './patients.module';

const logger = new Logger(PatientsModule.name);

async function bootstrap() {
  const port = Config.PATIENTS_SERVICE_PORT;
  await microserviceSetup(PatientsModule, { port });
  logger.log(`Service is listening on port ${port}`);
}

bootstrap().catch((err) => {
  logger.error(err);
  process.exit(1);
});
