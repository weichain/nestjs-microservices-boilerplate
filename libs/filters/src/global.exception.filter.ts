import { ICustomException } from '@lib/common';
import { ArgumentsHost, Catch, ExceptionFilter, HttpException, InternalServerErrorException, Logger } from '@nestjs/common';
import { Request, Response } from 'express';

export interface IHttpErrorResponse {
  success: boolean;
  code: number;
  message: string;
}

/**
 * Global exception filter
 * would filter custom exception
 * catch exceptions, not only http exceptions
 * @description format all errors and exceptions data
 */
@Catch()
export class GlobalExceptionFilter implements ExceptionFilter {
  private readonly logger = new Logger(GlobalExceptionFilter.name);

  constructor() {}

  catch(exception: ICustomException, host: ArgumentsHost) {
    this.logger.log(exception);

    if (exception instanceof HttpException) {
      this.handleHttpException(exception, host);
    } else if (typeof exception.error === 'object') {
      this.handleHttpException(
        new InternalServerErrorException({ message: exception.error.message, error: 'RpcError', statusCode: exception.error.code }),
        host,
      );
    } else {
      this.logger.error('Unhandled Exception');
      this.logger.error(`${exception.name}: ${exception.message}`, exception.stack);
      this.handleHttpException(new InternalServerErrorException({ message: 'UnhandledException' }), host);
    }
  }

  private handleHttpException(exception: HttpException, host: ArgumentsHost) {
    const contextType = host.getType();
    if (contextType === 'http') {
      const ctx = host.switchToHttp();
      const status = exception.getStatus();
      const httpRes: Response = ctx.getResponse();
      const httpReq: Request = ctx.getRequest();

      const res = exception.getResponse();

      this.logger.error(`${exception.getStatus()} ${httpReq.method} ${httpReq.url} ${typeof res === 'object' ? JSON.stringify(res) : res}`);

      httpRes.status(status).json(res);
      return;
    }

    this.logger.error(`HttpExceptionFilter was executed on a ${contextType} context`);
    throw Error('Invalid context.');
  }
}
