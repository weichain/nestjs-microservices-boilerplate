import { INestApplication } from '@nestjs/common';
import { Logger, LoggerErrorInterceptor } from 'nestjs-pino';

export * from './logger.module';

export const useLogger = (app: INestApplication) => {
  app.useLogger(app.get(Logger));
  app.useGlobalInterceptors(new LoggerErrorInterceptor());
};
