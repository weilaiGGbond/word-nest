import {
  CallHandler,
  ExecutionContext,
  Injectable,
  NestInterceptor,
} from '@nestjs/common';
import { plainToInstance } from 'class-transformer';
import { Observable, map } from 'rxjs';
@Injectable()
export class ResponseInterceptor implements NestInterceptor {
  constructor(private dto: any) {}
  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
    return next.handle().pipe(
      map((data) => {
        return {
          code: 20000,
          message: '请求成功',
          success: true,
          data: plainToInstance(this.dto, data, {
            excludeExtraneousValues: true,
          }),
        };
      }),
    );
  }
}
