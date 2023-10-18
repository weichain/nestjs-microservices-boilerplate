import { Config } from '@lib/config';
import { GlobalExceptionFilter } from '@lib/filters';
import { AuditLoggerInterceptor, HttpResponseInterceptor, TimeoutInterceptor } from '@lib/interceptors';
import { useLogger } from '@lib/logger';
import { Logger, VERSION_NEUTRAL, ValidationPipe, VersioningType } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import * as compression from 'compression';
import { GatewayModule } from './gateway.module';
import { getServerLoadEvent } from './logServerLoadEvent';
import { setupSwagger } from './swagger';

const logger = new Logger(GatewayModule.name);

async function bootstrap() {
  const port = Config.GATEWAY_SERVICE_PORT;

  const app = await NestFactory.create(GatewayModule, {
    bufferLogs: true,
  });

  useLogger(app);

  /**
   * Setup Swagger
   */
  setupSwagger(app);

  /**
   * Enable API versioning
   * https://docs.nestjs.com/techniques/versioning
   */
  app.enableVersioning({ type: VersioningType.URI, prefix: 'v', defaultVersion: VERSION_NEUTRAL });

  /**
   * set the global interceptors
   */
  app.useGlobalInterceptors(new HttpResponseInterceptor(), app.get(AuditLoggerInterceptor), new TimeoutInterceptor(60_000));

  /**
   * Use performance middlewares
   */
  app.use(compression());

  /**
   * Enable CORS
   */
  app.enableCors({ origin: '*' });

  /**
   * Enable graceful shutdown
   */
  app.enableShutdownHooks();

  app.useGlobalPipes(
    new ValidationPipe({
      transform: true,
      forbidUnknownValues: false,
    }),
  );

  app.useGlobalFilters(new GlobalExceptionFilter());

  app
    .listen(port)
    .then(() => {
      logger.log(`🚀 Gateway Service running on port ${port}`);
      logger.log(`${JSON.stringify(getServerLoadEvent())}`);
    })
    .catch((err) => {
      logger.error(err);
    });
}

bootstrap().catch((err) => {
  logger.error(err);
  process.exit(1);
});
