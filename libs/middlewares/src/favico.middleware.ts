import { IRequest, IResponse, NoArgNoReturnFunction } from '@lib/common';
import { Injectable, NestMiddleware } from '@nestjs/common';

@Injectable()
export class CustomFaviconMiddleware implements NestMiddleware {
  use(req: IRequest, res: IResponse, next: NoArgNoReturnFunction) {
    if (req.originalUrl === '/favicon.ico') {
      res.status(204).end();
    } else {
      next();
    }
  }
}
