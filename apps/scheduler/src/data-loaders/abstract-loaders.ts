import * as DataLoader from 'dataloader';
import {
  DataSource,
  EntityTarget,
  FindOptionsWhere,
  ObjectLiteral,
} from 'typeorm';
import ArrayLike = jasmine.ArrayLike;

export function abstractLoaderFactory<O extends ObjectLiteral>(
  model: EntityTarget<O>,
  dataSource: DataSource,
  whereStrategy: (ids: number[]) => FindOptionsWhere<O> | FindOptionsWhere<O>[],
  keyStrategy: (v: O) => number,
) {
  return new DataLoader<number, O>(async (ids: number[]) => {
    const data = await dataSource
      .getRepository(model)
      .find({ where: whereStrategy(ids) });

    const mappedData = mapFromArray<(typeof data)[number]>(data, keyStrategy);

    return ids.map((id) => mappedData[id]) as ArrayLike<O>;
  });
}

export function abstractBatchLoader<O extends ObjectLiteral>(
  model: EntityTarget<O>,
  dataSource: DataSource,
  whereStrategy: (ids: number[]) => FindOptionsWhere<O> | FindOptionsWhere<O>[],
  matchStrategy: (v: O, paramId: number) => boolean,
) {
  return new DataLoader<number, O[]>(async (ids: number[]) => {
    const data = await dataSource
      .getRepository(model)
      .find({ where: whereStrategy(ids) });

    return ids.map((id) =>
      data.filter((d) => matchStrategy(d, id)),
    ) as ArrayLike<O[]>;
  });
}

export function mapFromArray<T>(array: T[], keyStrategy: (v: T) => number) {
  const map: Record<number, T> = {};

  for (const item of array) {
    map[keyStrategy(item)] = item;
  }

  return map;
}
