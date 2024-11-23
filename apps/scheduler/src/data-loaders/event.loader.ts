import { DataSource, In } from 'typeorm';
import { abstractBatchLoader } from './abstract-loaders';
import { EventEntity } from '../event/entities/event.entity';

export const createLocationEventsLoader = (dataSource: DataSource) => {
  const whereStrategy = (ids) => ({ locationId: In(ids) });
  return abstractBatchLoader(
    EventEntity,
    dataSource,
    whereStrategy,
    (event, locationId) => event.locationId === locationId,
  );
};

export const createEventsLoaderUserId = (dataSource: DataSource) => {
  return abstractBatchLoader(
    EventEntity,
    dataSource,
    (ids) => ({ userId: In(ids) }),
    (event, userId) => event.userId === userId,
  );
};
