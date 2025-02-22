import { SelectQueryBuilder } from 'typeorm';
import { ForbiddenException, NotFoundException } from '@nestjs/common';

export const conditionUtils = <T>(
  queryBuilder: SelectQueryBuilder<T>,
  obj: Record<string, unknown>,
) => {
  // 后面的.where会替换前面的.where
  // WHERE 1=1 AND ...
  Object.keys(obj).forEach((key) => {
    if (obj[key]) {
      queryBuilder.andWhere(`${key} = :${key}`, { [key]: obj[key] });
    }
  });
  return queryBuilder;
};

// 查找函数：用于查找单一用户或者资源是否存在
//  查找条件， 查找的字段
export const findUtils = async <T>(
  repository: any,
  conditions: object,
  errorMessage?: object,
) => {
  const result = await repository.findOne(conditions);
  console.log(!result && errorMessage);

  if (!result && errorMessage) {
    throw new NotFoundException(errorMessage);
  }
  return result || null;
};
