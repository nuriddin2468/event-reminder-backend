import { DataSource, In } from 'typeorm';
import { abstractLoaderFactory } from './abstract-loaders';
import { UserEntity } from '../user/entities/user.entity';

export const createUserLoaderById = (dataSource: DataSource) => {
  const whereStrategy = (ids: number[]) => ({
    id: In(ids),
  });
  const keyStrategy = (e: UserEntity) => e.id;
  return abstractLoaderFactory(
    UserEntity,
    dataSource,
    whereStrategy,
    keyStrategy,
  );
};
