import { Expose } from 'class-transformer';
import { IsNotEmpty, IsString } from 'class-validator';
import { Column } from 'typeorm';

export class CreateResourceDto {
  @Expose()
  id: number;

  @IsString()
  @Expose()
  @IsNotEmpty()
  name: string;

  @IsString()
  @IsNotEmpty()
  @Expose()
  description: string;

}
