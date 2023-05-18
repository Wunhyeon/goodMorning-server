import { Injectable, Logger, NestMiddleware } from '@nestjs/common';
import { Request, Response, NextFunction } from 'express';

@Injectable()
export class LoggerMiddleware implements NestMiddleware {
  private logger = new Logger('HTTP');
  use(req: Request, res: Response, next: NextFunction) {
    const { ip, method, originalUrl, hostname } = req;
    const userAgent = req.get('user-agent') || '';

    const now = Date.now();

    res.on('finish', () => {
      const { statusCode } = res;
      const contentLength = res.get('content-length');
      this.logger.log(
        `${method} ${originalUrl} ${statusCode} ${contentLength} - userAgent : ${userAgent} ip : ${ip}, host : ${hostname} - ${
          Date.now() - now
        }ms`,
      );
    });
    next();
  }
}
