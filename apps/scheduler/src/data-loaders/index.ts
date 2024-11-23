import { DataSource } from 'typeorm';
import { createUserLoaderById } from './user.loader';
import {
  createLocationLoaderById,
  createLocationsLoaderUserId,
} from './location.loader';
import {
  createEventsLoaderUserId,
  createLocationEventsLoader,
} from './event.loader';

export const createDataLoaders = (dataSource: DataSource) => {
  return {
    userLoaderById: createUserLoaderById(dataSource),
    locationLoaderById: createLocationLoaderById(dataSource),
    eventsLoaderByLocationId: createLocationEventsLoader(dataSource),
    eventsLoaderByUserId: createEventsLoaderUserId(dataSource),
    locationsLoaderUserId: createLocationsLoaderUserId(dataSource),
  };
};

export type DataLoadersType = ReturnType<typeof createDataLoaders>;
