import { createParamDecorator, ExecutionContext } from '@nestjs/common';
import { GqlExecutionContext } from '@nestjs/graphql';
import { DataLoadersType } from '../../data-loaders';

export const DataLoaders = createParamDecorator(
  (data: unknown, ctx: ExecutionContext) => {
    return GqlExecutionContext.create(ctx).getContext()
      .loaders as DataLoadersType;
  },
);
