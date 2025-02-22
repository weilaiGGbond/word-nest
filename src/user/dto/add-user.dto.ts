import { Expose } from 'class-transformer';
import {
  IsString,
  IsNotEmpty,
  Length,
  IsOptional,
  ValidateIf,
  IsEnum,
} from 'class-validator';

import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, Matches } from 'class-validator';
export enum UserType {
  USER = 'user',
  ADMIN = 'admin',
}
export class AddUserDto {
  @ApiProperty({
    description: '用户密码，长度在 6 到 64 之间',
  })
  @IsString({ message: '密码必须是字符串' })
  @IsNotEmpty({ message: '密码不能为空' })
  @Length(6, 64, { message: '密码长度必须在 6 到 64 个字符之间' })
  password: string;

  @ApiProperty({
    description: '用户邮箱，必须符合邮箱格式',
  })
  @IsString({ message: '邮箱必须是字符串' })
  @IsNotEmpty({ message: '邮箱不能为空' })
  @IsEmail({}, { message: '邮箱格式不正确' })
  email: string;

  @ApiProperty({
    description: '用户名，不能为空',
  })
  @IsString({ message: '用户名必须是字符串' })
  @IsNotEmpty({ message: '用户名不能为空' })
  username: string;

  @ApiProperty({
    description: '用户手机号，非必填',
    required: false,
  })
  @IsString({ message: '手机号必须是字符串' })
  @IsOptional()
  @ValidateIf((o) => o.phone !== undefined)
  @Matches(/^1[3-9]\d{9}$/, { message: '手机号格式不正确' }) // 中国大陆手机号校验
  phone?: string = ''; // 设置默认值为空字符串

  // 用户类型
  @ApiProperty({
    enum: UserType,
    description: '用户类型，非必填，默认为 user',
    required: false,
  })
  @IsEnum(UserType, {
    message: '用户类型必须是 user 或 admin ',
  })
  userType: UserType;
}

export class AddUserRes {
  @IsString()
  @IsNotEmpty()
  @Expose()
  message: string;

  @IsOptional()
  @Expose()
  error?: any;
}
