import { IRequest, IResponse, NoArgNoReturnFunction } from '@lib/common';
import { Injectable, NestMiddleware } from '@nestjs/common';

@Injectable()
export class NodeRateLimiterMiddleware implements NestMiddleware {
  constructor() {
    // TODO: implement
  }

  use(req: IRequest, res: IResponse, next: NoArgNoReturnFunction) {
    next();
  }
}
