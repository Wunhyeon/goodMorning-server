import {
  CallHandler,
  ExecutionContext,
  Injectable,
  Logger,
  NestInterceptor,
} from '@nestjs/common';
import { Request, Response } from 'express';
import { Observable, tap } from 'rxjs';

@Injectable()
export class LoggingInterceptor implements NestInterceptor {
  intercept(
    context: ExecutionContext,
    next: CallHandler<any>,
  ): Observable<any> | Promise<Observable<any>> {
    const req = context.switchToHttp().getRequest<Request>();
    const res = context.switchToHttp().getResponse<Response>();

    const userAgent = req.get('user-agent') || '';

    const { ip, method, originalUrl, hostname } = req;

    Logger.log(
      `REQUEST : ${method} ${originalUrl} - ${userAgent} ${ip}, host : ${hostname}`,
    );

    const now = Date.now();

    res.on('finish', () => {
      const { statusCode } = res;
      const contentLength = res.get('content-length');
      Logger.log(
        `RESPONSE : statusCode :  ${method} ${originalUrl} -  ${statusCode}, contentLength :  ${contentLength} - ${
          Date.now() - now
        }ms`,
      );
    });

    return next.handle();
  }
}
