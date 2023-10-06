import { Catch, RpcExceptionFilter } from '@nestjs/common';
import { RpcException } from '@nestjs/microservices';
import { Observable, throwError } from 'rxjs';

@Catch(RpcException)
export class GlobalRpcExceptionFilter implements RpcExceptionFilter<RpcException> {
  catch(exception: RpcException /** host: ArgumentsHost **/): Observable<any> {
    return throwError(() => {
      return { error: exception.getError(), type: 'RPC' };
    });
  }
}
