import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsOptional, IsString } from 'class-validator';
import { Column } from 'typeorm';
import { IsEnum } from 'class-validator';

export enum ResourceType {
  BLOG = 'blog',
  NOTE = 'note',
  PROJECT = 'project',
  CONTRACT = 'contract',
}

export class CreateAssetsDto {
  @ApiProperty({ description: '资源名称' })
  @IsString()
  @IsNotEmpty({ message: '文档名称不能为空' })
  name: string;

  @ApiProperty({ description: '资源描述' })
  @IsOptional()
  @IsString()
  @Column({ default: '用户在创建该资源时什么也没留下~' })
  description?: string;

  // 类型
  @ApiProperty({
    enum: ResourceType, // 让 Swagger 显示枚举值
    description: '资源类型，必须是 blog、note、project 或 contract 之一',
  })
  @IsEnum(ResourceType, {
    message: '资源类型必须是 blog、note、project 或 contract 之一',
  })
  @IsNotEmpty({ message: '资源类型不能为空' })
  type: ResourceType;
}
