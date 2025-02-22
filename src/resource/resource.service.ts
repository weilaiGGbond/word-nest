import { BadRequestException, HttpException, Injectable } from '@nestjs/common';
import { Resource } from './resource.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
@Injectable()
export class AssetsService {
  constructor(
    @InjectRepository(Resource)
    private readonly resourceRepository: Repository<Resource>,
  ) {}
  // 增删改查
  async create(resource: Partial<Resource>) {
    try {
      await this.resourceRepository.insert(resource);
      return {
        message: '添加资源成功',
      };
    } catch (error) {
      throw new HttpException('添加资源失败', 500);
    }
  }

  async deleteResouce(resourceIds: number[]) {
    const res = await this.resourceRepository.delete(resourceIds);
    return {
      message: res.affected == resourceIds.length ? '删除成功' : '删除失败',
      deleteIds: resourceIds,
    };
  }
  // 用户模糊查询
  async findAssets(query) {
    const { limit, page, keywords, type } = query;
    const take = Number(limit) || 10;
    const skip = ((Number(page) || 1) - 1) * take;

    const queryBuilder = this.resourceRepository.createQueryBuilder('resource');
    let newQuery = queryBuilder;

    if (keywords) {
      newQuery = newQuery.andWhere(
        '(resource.name LIKE :keyword OR resource.description LIKE :keyword)',
        { keyword: `%${keywords}%` },
      );
    }

    if (type) {
      newQuery = newQuery.andWhere('resource.docType = :type', { type });
    }

    const [records, total] = await newQuery
      .skip(skip)
      .take(take)
      .getManyAndCount();
    console.log(records, total, 11111);

    return {
      records: records,
      total,
      limit: take,
      totalPages: Math.ceil(total / take),
      currentPage: Number(page) || 1,
    };
  }

  // 编辑用户信息
  async updateAssets(updateResourceDto: Partial<Resource>) {
    // 获取编辑的当前用户
    if (!updateResourceDto.id) {
      throw new BadRequestException('资源 ID 不能为空');
    }
    const resource = await this.resourceRepository.findOneBy({
      id: updateResourceDto.id,
    });
    if (!resource) {
      throw new HttpException('当前资源不存在', 404);
    }

    const updatedUser = this.resourceRepository.merge(
      resource,
      updateResourceDto,
    ); // 合并原始数据和更新数据
    try {
      await this.resourceRepository.save(updatedUser);
      return {
        message: '更新资源信息成功',
      };
    } catch (error) {
      throw new HttpException('更新资源信息失败', 500);
    }
  }
}
