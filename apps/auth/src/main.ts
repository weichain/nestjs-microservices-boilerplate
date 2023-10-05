import { microserviceSetup } from '@lib/common';
import { Config } from '@lib/config';
import { Logger } from '@nestjs/common';
import { AuthModule } from './auth.module';

const logger = new Logger(AuthModule.name);

async function bootstrap() {
  const port = Config.AUTH_SERVICE_PORT;
  await microserviceSetup(AuthModule, { port });
  logger.log(`Service is listening on port ${port}`);
}

bootstrap().catch((err) => {
  logger.error(err);
  process.exit(1);
});
