import { Injectable } from '@nestjs/common';
import { MailerService as NestMailerService } from '@nestjs-modules/mailer';

@Injectable()
export class MailerService {
  private verificationCodes = new Map<string, number>(); // 临时存储验证码

  constructor(private readonly mailerService: NestMailerService) {}

  // 生成随机验证码
  private generateCode(): number {
    return Math.floor(100000 + Math.random() * 900000);
  }

  // 发送验证码
  async sendVerificationCode(email: string, type: 0 | 1): Promise<void> {
    const code = this.generateCode();
    this.verificationCodes.set(email, code); // 存储验证码

    const subject = type === 0 ? '注册验证码' : '密码重置验证码';
    await this.mailerService.sendMail({
      to: email,
      subject,
      text: `您的验证码是：${code}，有效期为10分钟。`,
      html: `<p>您的验证码是：<b>${code}</b>，有效期为10分钟。</p>`,
    });
  }

  // 验证验证码
  verifyCode(email: string, code: number): boolean {
    const storedCode = this.verificationCodes.get(email);
    console.log(storedCode, code, storedCode === code);

    if (storedCode === code) {
      this.verificationCodes.delete(email); // 验证成功后删除验证码
      return true;
    }

    return false;
  }
}
