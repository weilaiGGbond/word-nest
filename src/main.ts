import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import {
  BadRequestException,
  HttpException,
  ValidationPipe,
} from '@nestjs/common';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';
import { HttpExceptionFilter } from './filters/http-exception.filter';
async function bootstrap() {
  const app = await NestFactory.create(AppModule, {
    cors: true,
  });
  app.enableCors({
    origin: '*', // 或指定域名，允许 Swagger UI 跨域访问
  });
  // 配置 Swagger 文档
  const config = new DocumentBuilder()
    .setTitle('API 文档')
    .setDescription('这是一个 NestJS 项目的 Swagger API 文档')
    .setVersion('1.0')
    .addBearerAuth(
      {
        type: 'http',
        scheme: 'bearer',
        bearerFormat: 'JWT',
      },
      'access-token', // 这里建议换成 'access-token'，或者不填默认就是 'bearer'
    )
    .build();

  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api-docs', app, document);
  app.useGlobalFilters(new HttpExceptionFilter());
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true, // 过滤掉 DTO 以外的参数
      forbidNonWhitelisted: true, // 传递额外参数时报错
      transform: true, // 自动转换数据类型
      exceptionFactory: (errors) => {
        const message = errors
          .map((error) => Object.values(error.constraints))
          .join(', ');
        throw new HttpException(message, 400); // 返回自定义错误消息
      },
    }),
  );
  await app.listen(8989);
}
bootstrap();
