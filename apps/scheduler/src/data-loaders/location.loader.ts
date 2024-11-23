import { DataSource, In } from 'typeorm';
import { abstractBatchLoader, abstractLoaderFactory } from './abstract-loaders';
import { LocationEntity } from '../location/entities/location.entity';

export const createLocationLoaderById = (dataSource: DataSource) => {
  const whereStrategy = (ids: number[]) => ({
    id: In(ids),
  });
  const keyStrategy = (e: LocationEntity) => e.id;
  return abstractLoaderFactory(
    LocationEntity,
    dataSource,
    whereStrategy,
    keyStrategy,
  );
};

export const createLocationsLoaderUserId = (dataSource: DataSource) => {
  return abstractBatchLoader(
    LocationEntity,
    dataSource,
    (ids) => ({ userId: In(ids) }),
    (location, userId) => location.userId === userId,
  );
};
