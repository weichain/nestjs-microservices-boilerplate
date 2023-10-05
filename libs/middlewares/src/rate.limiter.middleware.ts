import { Injectable, NestMiddleware } from '@nestjs/common';

@Injectable()
export class NodeRateLimiterMiddleware implements NestMiddleware {
  constructor() {
    // TODO: implement
  }

  async use(req: any, res: any, next: () => void) {
    next();
  }
}
