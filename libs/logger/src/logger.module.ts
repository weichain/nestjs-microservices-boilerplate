import { Module } from '@nestjs/common';
import { LoggerModule as PinoLoggerModule } from 'nestjs-pino';

const transport =
  process.env.NODE_ENV === 'development'
    ? {
        target: 'pino-pretty',
        options: {
          colorize: true,
          singleLine: true,
          sync: true,
        },
      }
    : undefined;

const loggerModule = PinoLoggerModule.forRoot({
  pinoHttp: {
    transport,
    timestamp: () => `,"time":"${new Date(Date.now()).toISOString()}"`,
    formatters: {
      level: (label) => {
        return { level: label };
      },
    },
    genReqId: (req) => req.id,
    level: 'debug',
  },
});

@Module({
  imports: [loggerModule],
  exports: [loggerModule],
})
export class LoggerModule {}
