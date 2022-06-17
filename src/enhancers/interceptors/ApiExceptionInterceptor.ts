import {CallHandler, ExecutionContext, NestInterceptor} from '@nestjs/common';
import {catchError} from 'rxjs/operators';
import {processError} from '../utils/ErrorUtils';

export class ApiExceptionInterceptor implements NestInterceptor {
  // eslint-disable-next-line class-methods-use-this
  intercept(context: ExecutionContext, next: CallHandler) {
    return next.handle().pipe(catchError(processError));
  }
}
