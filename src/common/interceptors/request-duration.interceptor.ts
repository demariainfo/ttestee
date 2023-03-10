import { CallHandler, ExecutionContext, Injectable, Logger, NestInterceptor } from '@nestjs/common';
import { Observable } from 'rxjs';
import { tap } from 'rxjs/operators';

@Injectable()
export class RequestDurationInterceptor implements NestInterceptor {
  logger = new Logger(RequestDurationInterceptor.name);
  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
    const startTimestamp = Date.now();
    return next.handle().pipe(tap(() => this.logger.debug(`Request took: ${Date.now() - startTimestamp} ms`)));
  }
}
