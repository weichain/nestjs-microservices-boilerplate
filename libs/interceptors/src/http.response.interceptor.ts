import { DefaultStatusMessage } from '@lib/common';
import { CallHandler, ExecutionContext, HttpStatus, Injectable, NestInterceptor } from '@nestjs/common';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';

/**
 * HTTP Response Intercept
 * success response only, error response @code{GlobalExceptionFilter}
 * response standard format data
 */
@Injectable()
export class HttpResponseInterceptor implements NestInterceptor {
  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
    const response = context.switchToHttp().getResponse();

    return next.handle().pipe(
      map((data: any) => {
        response.header('Cache-Control', 'no-cache,no-store,must-revalidate');

        if (data?.response instanceof Buffer) {
          response.header('Content-Type', 'application/json');
          return data.response;
        }

        return {
          statusCode: HttpStatus.OK,
          message: DefaultStatusMessage.OK_MSG,
          data,
        };
      }),
    );
  }
}
