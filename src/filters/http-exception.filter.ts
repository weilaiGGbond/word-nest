import {
  ArgumentsHost,
  Catch,
  ExceptionFilter,
  HttpException,
} from '@nestjs/common';

import { Response } from 'express';
@Catch(HttpException)
export class HttpExceptionFilter implements ExceptionFilter {
  async catch(exception: HttpException, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();
    const status =
      exception instanceof Error
        ? (exception as { getStatus: () => number }).getStatus() || 400
        : 500;
    response.status(status).json({
      code: status,
      success: false,
      timestamp: new Date().toISOString(),
      message: exception.message || '请求失败',
      data: null,
    });
  }
}
