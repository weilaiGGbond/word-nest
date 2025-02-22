import { ApiProperty } from '@nestjs/swagger';
import {
  IsString,
  IsNotEmpty,
  Length,
  IsOptional,
  IsNumber,
  IsEmail,
  IsEnum,
  Matches,
  ValidateIf,
  IsInt,
} from 'class-validator';
import { UserType } from './add-user.dto';
import { Expose } from 'class-transformer';

export class UpdateUserDto {
  @ApiProperty({
    description: '用户 ID，必须是整数',
  })
  @IsInt({ message: 'ID 必须是整数' })
  @IsNotEmpty({
    message: 'ID 不能为空',
  })
  id: number;

  @ApiProperty({
    description: '用户邮箱，必须符合邮箱格式',
  })
  @IsString({ message: '邮箱必须是字符串' })
  @IsOptional()
  @IsEmail({}, { message: '邮箱格式不正确' })
  email: string;

  @ApiProperty({
    description: '用户名，不能为空',
  })
  @IsString({ message: '用户名必须是字符串' })
  @IsOptional()
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
  @IsOptional()
  @IsEnum(UserType, {
    message: '用户类型必须是 user 或 admin ',
  })
  userType: UserType;
}

export class UpdateUserRes {
  @IsString()
  @Expose()
  message: string;
}
