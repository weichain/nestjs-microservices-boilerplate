import { IRequest, IResponse } from '@lib/common';
import { Injectable, NestMiddleware } from '@nestjs/common';
import { NextFunction } from 'express';

@Injectable()
export class CustomFaviconMiddleware implements NestMiddleware {
  use(req: IRequest, res: IResponse, next: NextFunction) {
    if (req.originalUrl === '/favicon.ico') {
      res.status(204).end();
    } else {
      next();
    }
  }
}
