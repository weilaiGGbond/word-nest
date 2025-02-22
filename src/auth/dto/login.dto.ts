import { IsString, IsNotEmpty, IsEmail } from 'class-validator';
import { Exclude, Expose } from 'class-transformer';
import { ApiProperty } from '@nestjs/swagger';
export class LoginDto {
  @IsString()
  @Expose()
  id: string;

  @IsString()
  @Expose()
  username: string;

  @IsString()
  @Exclude()
  password: string;

  @IsString()
  @Expose()
  userType: string;

  @IsNotEmpty()
  @Expose()
  token: string;
}

export class LoginParamsDto {
  @ApiProperty({ description: '邮箱地址' })
  @IsNotEmpty({ message: '邮箱不能为空' })
  @IsEmail({}, { message: '邮箱格式错误' })
  email: string;

  @ApiProperty({ description: '用户密码' })
  @IsNotEmpty({ message: '密码不能为空' })
  password: string;
}
export class VerifyCodeParamsDto {
  @ApiProperty({ description: '邮箱地址' })
  @IsNotEmpty({ message: '邮箱不能为空' })
  @IsEmail({}, { message: '邮箱格式错误' })
  email: string;

  @ApiProperty({
    enum: [0, 1],
    description: '类型：0为注册验证码，1为重置密码验证码',
  })
  @IsNotEmpty({ message: '类型不能为空' })
  type: 0 | 1;
}

export class ResetPasswordDto {
  @ApiProperty({ description: '邮箱地址' })
  @IsNotEmpty({ message: '邮箱不能为空' })
  @IsEmail({}, { message: '邮箱格式错误' })
  email: string;

  @ApiProperty({ description: '重置密码验证码' })
  @IsNotEmpty({ message: '验证码不能为空' })
  resetCode: number;

  @ApiProperty({ description: '新密码' })
  @IsNotEmpty({ message: '新密码不能为空' })
  newPassword: string;
}

export class VerifyDto {
  @IsString()
  @Expose()
  message: string;
}
