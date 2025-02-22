import {
  IsString,
  IsOptional,
  IsInt,
  IsNumber,
  IsNotEmpty,
} from 'class-validator';
import { Expose, Transform, Type } from 'class-transformer';
import { User } from '../user.entity';

export class FindUserDto {
  @IsOptional()
  @Transform(({ value }) => parseInt(value, 10)) // 自动转换字符串为数字
  @IsInt({ message: 'limit 必须是整数' }) // 确保是整数
  limit?: number;

  @IsOptional()
  @Transform(({ value }) => parseInt(value, 10))
  @IsInt({ message: 'page 必须是整数' })
  page?: number;

  @IsOptional()
  @IsString({ message: 'keywords 必须是字符串' })
  keywords?: string;

  @IsOptional()
  @IsString({ message: 'type 必须是字符串' })
  type?: string;
}

export class FindUserListDto {
  @IsNumber()
  @Expose()
  total: number;

  @IsNotEmpty()
  @Expose()
  @Type(() => User)
  records: User[];

  @IsNumber()
  @Expose()
  limit: number;

  @IsNumber()
  @Expose()
  totalPages: number;

  @IsNumber()
  @Expose()
  currentPage: number;
}
