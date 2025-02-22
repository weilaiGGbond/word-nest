import { ApiProperty } from '@nestjs/swagger';
import { Expose } from 'class-transformer';
import {
  IsEnum,
  IsInt,
  IsNotEmpty,
  IsOptional,
  IsString,
  MaxLength,
} from 'class-validator';
import { Column } from 'typeorm';
import { ResourceType } from './create-assets.dto';
// import { UpdateUserDto } from '../../user/dto/update-user.dto';

export class UpdateAssetsDto {
  @ApiProperty({
    description: '资源 ID',
  })
  @IsInt({ message: 'ID 必须是整数' })
  @IsNotEmpty({ message: '资源 ID 不能为空' })
  id: number;

  @ApiProperty({
    description: '资源名称',
    required: false,
  })
  @IsOptional()
  @IsString({ message: '名称必须是字符串' })
  @MaxLength(100, { message: '名称不能超过 100 个字符' })
  name?: string;

  @ApiProperty({
    description: '资源描述',
    required: false,
  })
  @IsOptional()
  @IsString({ message: '描述必须是字符串' })
  @MaxLength(500, { message: '描述不能超过 500 个字符' })
  description?: string;

  // 类型
  @ApiProperty({
    enum: ResourceType, // 让 Swagger 显示枚举值
    description: '资源类型，必须是 blog、note、project 或 contract 之一',
    required: false,
  })
  @IsOptional()
  @IsEnum(ResourceType, {
    message: '资源类型必须是 blog、note、project 或 contract 之一',
  })
  type: ResourceType;
}
export class UpdateResourceDto {
  @IsString()
  @Expose()
  message?: string;
}
