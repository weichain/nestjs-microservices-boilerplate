import { ArgumentsHost, Catch, ExceptionFilter, HttpStatus, Logger } from '@nestjs/common';
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

  constructor() {
    // TODO: add Sentry
  }

  async catch(exception: any, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const request = ctx.getRequest<Request>();
    const response = ctx.getResponse<Response>();

    const headers = request.headers;
    if (headers) {
      delete headers.authorization;
      delete headers.cookie;
      // TODO: delete sensitive headers before sending to 3rd party
    }

    // TODO: capture exception and send to Sentry

    // http status code, return custom exception code or 500
    const httpStatusCode = exception?.statusCode || HttpStatus.INTERNAL_SERVER_ERROR;
    const statusCode = exception?.statusCode || HttpStatus.INTERNAL_SERVER_ERROR;
    const errMsg: string = exception?.message || 'Internal server error';

    // standard error response
    const errorResponse: IHttpErrorResponse = {
      success: false,
      code: statusCode,
      message: errMsg,
    };

    this.logger.error(
      {
        message: `request error: ${exception?.message || ''}`,
        response: exception?.response || '',
      },
      exception?.stack || errMsg,
    );

    response.status(httpStatusCode).json(errorResponse);
  }
}
