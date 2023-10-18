import { IRpcErrorResponse } from '@lib/common';
import { Catch, RpcExceptionFilter } from '@nestjs/common';
import { RpcException } from '@nestjs/microservices';
import { Observable, throwError } from 'rxjs';

@Catch(RpcException)
export class GlobalRpcExceptionFilter implements RpcExceptionFilter<RpcException> {
  catch(exception: RpcException): Observable<IRpcErrorResponse> {
    return throwError(() => {
      return exception;
    });
  }
}
