import { HttpException, Injectable } from '@nestjs/common';
import { User } from './user.entity';
import { DeepPartial, In, Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import * as argon2 from 'argon2';
import { FindUserDto } from './dto/find-users.dto';
import { UpdateUserDto } from './dto/update-user.dto';
@Injectable()
export class UserService {
  constructor(
    @InjectRepository(User) private readonly userRepository: Repository<User>,
  ) {}
  // 增删改查
  async create(user: Partial<User>) {
    const userT = await this.userRepository.findOne({
      where: { email: user.email },
    });
    if (userT) {
      throw new HttpException({ message: '当前用户邮箱已被注册' }, 400);
    }
    if (!user.userType) {
      user.userType = 'admin';
    }
    const userTmp = this.userRepository.create(user);
    // 对用户密码使用argon2加密
    userTmp.password = await argon2.hash(userTmp.password);
    const res = await this.userRepository.save(userTmp);
    return res;
  }
  async createIt(id: number, user: Partial<User>) {
    const userT = await this.userRepository.findOne({
      where: { email: user.email },
    });
    const userSelf = await this.userRepository.findOneBy({
      id,
    });
    if (userSelf.userType !== 'admin') {
      throw new HttpException({ message: '用户权限不足，无法添加' }, 400);
    }
    if (userT) {
      throw new HttpException({ message: '当前用户邮箱已被注册' }, 400);
    }
    if (!user.userType) {
      user.userType = 'user';
    }
    const userTmp = this.userRepository.create(user);
    // 对用户密码使用argon2加密
    userTmp.password = await argon2.hash(userTmp.password);
    try {
      await this.userRepository.save(userTmp);
      return {
        message: '添加成功',
      };
    } catch (error) {
      console.error('添加用户失败:', error);
      throw new HttpException({ message: '添加用户失败' }, 500);
    }
  }
  async deleteUser(id: number, userIds: number[]) {
    // 判断当前用户是否有修改用户权限
    const user = await this.userRepository.findOneBy({
      id,
    });
    if (user.userType !== 'admin') {
      throw new HttpException({ message: '用户权限不足，无法删除' }, 400);
    }
    const res = await this.userRepository.delete(userIds);
    return {
      message: res.affected == userIds.length ? '删除成功' : '删除失败',
      deleteIds: userIds,
    };
  }
  // 用户模糊查询
  async findUsers(query: FindUserDto) {
    const { limit, page, keywords, type } = query;
    const take = limit || 10;
    const skip = ((page || 1) - 1) * take;
    const queryBuilder = this.userRepository.createQueryBuilder('user');
    let newQuery = queryBuilder;
    if (keywords) {
      newQuery = queryBuilder.where(
        '(user.email LIKE :keyword OR user.phone LIKE :keyword OR user.username LIKE :keyword)',
        { keyword: `%${keywords}%` },
      );
    }
    if (type) {
      newQuery.andWhere('user.userType = :type', { type });
    }
    const [records, total] = await newQuery
      .take(take)
      .skip(skip)
      .getManyAndCount();
    console.log(records, 11111, total);

    const totalPages = Math.ceil(total / take);
    const users = {
      records,
      total,
      limit,
      totalPages,
      currentPage: page || 1,
    };
    return users;
  }
  // 编辑用户信息
  async updateUser(userId: number, updateUserDto: UpdateUserDto) {
    if (!updateUserDto.id) {
      throw new HttpException({ message: '缺少用户 ID' }, 400);
    }

    // 查找当前操作的用户
    const user = await this.userRepository.findOneBy({ id: userId });

    // 查找要更新的目标用户
    const updateUser = await this.userRepository.findOneBy({
      id: updateUserDto.id,
    });
    if (!updateUser) {
      throw new HttpException({ message: '用户不存在' }, 404);
    }

    // 如果 email 发生变化，检查是否已被占用
    if (updateUserDto.email && updateUserDto.email !== updateUser.email) {
      const existingUser = await this.userRepository.findOneBy({
        email: updateUserDto.email,
      });
      if (existingUser) {
        throw new HttpException({ message: '该邮箱已被占用' }, 409);
      }
    }

    // 权限检查，普通用户只能更新自己的信息并且不能将自己升为管理员用户
    if (
      (user.userType !== 'admin' && user.id !== updateUserDto.id) ||
      (user.id === updateUserDto.id && updateUserDto.userType === 'admin')
    ) {
      throw new HttpException({ message: '用户权限不足，无法更新' }, 403);
    }

    // 合并更新信息
    const updatedUser = this.userRepository.merge(updateUser, updateUserDto);

    try {
      await this.userRepository.save(updatedUser);
      return {
        message: '更新用户信息成功',
        data: updatedUser,
      };
    } catch (error) {
      console.error('更新用户信息失败:', error);
      throw new HttpException({ message: '更新用户信息失败' }, 500);
    }
  }

  find(email: string) {
    return this.userRepository.findOne({
      where: { email },
    });
  }
}
