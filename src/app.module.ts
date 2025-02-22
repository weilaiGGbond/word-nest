import { Global, Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { ConfigModule } from '@nestjs/config';
import { UserModule } from './user/user.module';
import { LogsModule } from './logs/logs.module';
import { AssetsModule } from './resource/resource.module';
import * as dotenv from 'dotenv';
import * as Joi from 'joi';
import { TypeOrmModule } from '@nestjs/typeorm';
import { connectionParams } from 'ormconfig';
import { AuthModule } from './auth/auth.module';
import { JwtStrategy } from './auth/auth.strategy';
import { MailerService } from './email/email.service';
import { EmailModule } from './email/email.module';

const envFilePath = `.env.${process.env.NODE_ENV || `development`}`;

@Global()
@Module({
  imports: [
    UserModule,
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath,
      load: [() => dotenv.config({ path: '.env' })],
      validationSchema: Joi.object({
        NODE_ENV: Joi.string()
          .valid('development', 'production')
          .default('development'),
        DB_TYPE: Joi.string().valid('mysql', 'postgres').default('mysql'),
        DB_PORT: Joi.number().default(3306),
        DB_HOST: Joi.alternatives()
          .try(Joi.string().ip(), Joi.string().domain())
          .required(),
        DB_USERNAME: Joi.string().required(),
        DB_PASSWORD: Joi.string().required(),
      }),
    }),
    TypeOrmModule.forRoot(connectionParams),
    LogsModule,
    AssetsModule,
    AuthModule,
    EmailModule,
  ],
  controllers: [AppController],
  providers: [JwtStrategy, AppService, MailerService],
})
export class AppModule {}
