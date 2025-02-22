import { Module } from '@nestjs/common';
import { PassportModule } from '@nestjs/passport';
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import { UserModule } from 'src/user/user.module';
import { JwtModule } from '@nestjs/jwt';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { ConfigEnum } from 'src/enum/config.enum';
import { EmailModule } from 'src/email/email.module';
import { MailerService } from 'src/email/email.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from 'src/user/user.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([User]), // 注册 UserRepository
    UserModule,
    PassportModule,
    EmailModule,
    JwtModule.registerAsync({
      imports: [ConfigModule],
      useFactory: async (configService: ConfigService) => {
        return {
          secret: configService.get<string>(ConfigEnum.SECRET),
          signOptions: {
            expiresIn: configService.get<string>(ConfigEnum.EXPIRESIN),
          },
        };
      },
      inject: [ConfigService],
    }),
  ],
  providers: [AuthService, MailerService],
  controllers: [AuthController],
})
export class AuthModule {}
