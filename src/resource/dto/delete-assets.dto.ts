import { Expose } from 'class-transformer';
import { IsNotEmpty, IsNumber, IsString } from 'class-validator';

export class DeleteResourceDto {
  @IsString()
  @IsNotEmpty()
  @Expose()
  message: string;

  @IsNumber()
  @IsNotEmpty()
  @Expose()
  deleteIds: number[];
}
