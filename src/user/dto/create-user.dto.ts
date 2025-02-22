import {
  IsString,
  IsNotEmpty,
  Length,
  IsOptional,
  IsNumber,
} from 'class-validator';

export class CreateUserDto {
  @IsString()
  @IsNotEmpty()
  @Length(6, 64)
  password: string;

  @IsString()
  @IsNotEmpty()
  email: string;

  @IsNumber()
  @IsNotEmpty()
  code: number;

  @IsString()
  @IsOptional()
  phone: string = ''; // 设置默认值为空字符串
}
