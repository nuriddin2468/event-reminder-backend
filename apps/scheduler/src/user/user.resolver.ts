import {
  Args,
  Int,
  Parent,
  Query,
  ResolveField,
  Resolver,
} from '@nestjs/graphql';
import { UserService } from './user.service';
import { EventSchema } from '../event/schemas/event.schema';
import { LocationSchema } from '../location/schemas/location.schema';
import { UserSchema } from './schemas/user.schema';
import { UserEntity } from './entities/user.entity';
import { DataLoaders } from '../common/decorators/data-loader';
import { DataLoadersType } from '../data-loaders';

@Resolver(() => UserSchema)
export class UserResolver {
  constructor(private readonly userService: UserService) {}

  @Query(() => UserSchema, { name: 'user' })
  findOne(@Args('id', { type: () => Int }) id: number): Promise<UserSchema> {
    return this.userService.findOne(id);
  }

  @ResolveField(() => [EventSchema])
  events(@Parent() parent: UserEntity, @DataLoaders() loader: DataLoadersType) {
    return loader.eventsLoaderByUserId.load(parent.id);
  }

  @ResolveField(() => [LocationSchema])
  locations(
    @Parent() parent: UserEntity,
    @DataLoaders() loader: DataLoadersType,
  ) {
    // no sens to add dataloader, we can fetch only one user
    return loader.locationsLoaderUserId.load(parent.id);
  }
}
