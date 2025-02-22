import { Expose, Type } from 'class-transformer';
import { CollaboratorRole } from 'src/enum/collaborator.enum';
import { Resource } from '../resource.entity';
import { IsNotEmpty, IsNumber } from 'class-validator';

export interface getUserAssetsDto {
  page: number;
  limit?: number;
  type?: CollaboratorRole; //资源类型
  name?: string;
}

export interface addCollaboratorDto {
  resourceId: number;
  role: CollaboratorRole;
}

export interface DeleteCollaboratorDto {
  resourceId: number;
  userId: number;
}

export interface ChangeCollaboratorDto extends DeleteCollaboratorDto {
  role: CollaboratorRole;
}
export class AssetsDtoList {
  @IsNumber()
  @Expose()
  total: number;

  @IsNotEmpty()
  @Expose()
  @Type(() => Resource)
  records: Resource[];

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
