import { Injectable, NestMiddleware } from '@nestjs/common';

@Injectable()
export class CustomFaviconMiddleware implements NestMiddleware {
  async use(req: any, res: any, next: () => void) {
    if (req.originalUrl === '/favicon.ico') {
      res.status(204).end();
    } else {
      next();
    }
  }
}
