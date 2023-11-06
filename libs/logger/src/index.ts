import { INestApplication } from '@nestjs/common';
import { Logger, LoggerErrorInterceptor } from 'nestjs-pino';

export * from './logger.module';

export const useLogger = (app: INestApplication) => {
  app.useLogger(app.get(Logger));
  // part of Pino
  app.useGlobalInterceptors(new LoggerErrorInterceptor());
};
