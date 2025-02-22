import { ForbiddenException, HttpException, Injectable } from '@nestjs/common';
import { UserService } from 'src/user/user.service';
import { JwtService } from '@nestjs/jwt';
import * as argon2 from 'argon2';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from 'src/user/user.entity';
import { Repository } from 'typeorm';
import { MailerService } from 'src/email/email.service';

@Injectable()
export class AuthService {
  constructor(
    @InjectRepository(User)
    private userRepository: Repository<User>,
    private mailService: MailerService,
    private userService: UserService,
    private jwt: JwtService,
  ) {}

  async login(email: string, password: string) {
    const user = await this.userService.find(email);
    console.log(user);

    if (!user) {
      // 用户不存在
      throw new ForbiddenException('用户不存在, 请先注册');
    }
    // 用户存在进行密码校验
    const isPasswordValid = await argon2.verify(user.password, password);
    if (!isPasswordValid) {
      throw new ForbiddenException('用户名或者密码错误');
    }
    const token = await this.jwt.signAsync({
      username: user.username,
      id: user.id,
    });

    return {
      ...user,
      token,
    };
  }
  // 统一发送验证码，注册和重置密码使用同一个方法
  async sendVerificationCode(email: string, type: 0 | 1) {
    const user = await this.userRepository.findOneBy({ email });
    if (type === 0 && user) {
      throw new HttpException('该邮箱已注册', 400);
    }
    if (type === 1 && !user) {
      throw new HttpException('该邮箱未注册', 403);
    }
    if (type === 0) {
      await this.mailService.sendVerificationCode(email, 0);
    } else {
      await this.mailService.sendVerificationCode(email, 1);
    }

    return {
      message: `${type === 0 ? '注册' : '重置密码'}验证码已发送，请检查您的邮箱`,
    };
  }
  async register(email: string, password: string, code: number) {
    const verify = this.mailService.verifyCode(email, code);
    console.log('verify', verify);

    if (!verify) {
      throw new HttpException({ message: '验证码错误' }, 400);
    }
    const user = await this.userRepository.findOneBy({ email });
    if (user) {
      throw new HttpException('该邮箱已注册', 400);
    }
    const newUser = await this.userService.create({
      email,
      username: email,
      password,
    });
    const token = await this.jwt.signAsync({
      username: newUser.username,
      id: newUser.id,
    });
    return {
      ...newUser,
      token,
    };
  }
  // 重置密码
  async resetPassword(email: string, resetCode: number, newPassword: string) {
    const user = await this.userRepository.findOneBy({ email });
    const verify = this.mailService.verifyCode(email, resetCode);
    if (!user) {
      throw new HttpException('邮箱未注册', 400);
    }
    if (!verify) {
      throw new HttpException('验证码错误', 400);
    }
    user.password = await argon2.hash(newPassword);
    await this.userRepository.save(user);
    return { message: '密码重置成功' };
  }
}
