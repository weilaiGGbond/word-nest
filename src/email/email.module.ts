import { MailerModule } from '@nestjs-modules/mailer';
import { Module } from '@nestjs/common';

@Module({
  imports: [
    MailerModule.forRoot({
      transport: {
        host: 'smtp.qq.com',
        port: 465,
        secure: true,
        auth: {
          user: '3318759791@qq.com', // QQ邮箱账号
          pass: 'qgmjfnwqmpobdbge', // QQ邮箱的SMTP授权码
        },
      },
      defaults: {
        from: '"No Reply" <3318759791@qq.com>', // 发件人邮箱
      },
    }),
  ],
})
export class EmailModule {}
