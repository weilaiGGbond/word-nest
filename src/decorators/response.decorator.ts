import { UseInterceptors } from '@nestjs/common';
import { ResponseInterceptor } from 'src/interceptors/response.interceptor';
interface ClassConstructor {
  new (...args: any[]): {};
}

export function Response(dto: ClassConstructor) {
  return UseInterceptors(new ResponseInterceptor(dto));
}
