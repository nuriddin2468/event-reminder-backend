import {
  Args,
  Int,
  Mutation,
  Parent,
  Query,
  ResolveField,
  Resolver,
} from '@nestjs/graphql';
import { LocationService } from './location.service';
import { CreateLocationInput } from './dto/create-location.input';
import { UpdateLocationInput } from './dto/update-location.input';
import { CurrentUser } from '../auth/decorators/current-user';
import { CurrentUserType } from '../auth/types/current-user';
import { EventSchema } from '../event/schemas/event.schema';
import { LocationSchema } from './schemas/location.schema';
import { UserSchema } from '../user/schemas/user.schema';
import { DataLoaders } from '../common/decorators/data-loader';
import { DataLoadersType } from '../data-loaders';
import { LocationEntity } from './entities/location.entity';

@Resolver(() => LocationSchema)
export class LocationResolver {
  constructor(private readonly locationService: LocationService) {}

  @Mutation(() => LocationSchema)
  createLocation(
    @Args('createLocationInput') createLocationInput: CreateLocationInput,
    @CurrentUser() user: CurrentUserType,
  ): Promise<LocationSchema> {
    return this.locationService.create(user, createLocationInput);
  }

  @Query(() => [LocationSchema], { name: 'locations' })
  findAll(@CurrentUser() user: CurrentUserType): Promise<LocationSchema[]> {
    return this.locationService.findAll(user);
  }

  @Query(() => LocationSchema, { name: 'location' })
  findOne(
    @Args('id', { type: () => Int }) id: number,
    @CurrentUser() user: CurrentUserType,
  ): Promise<LocationSchema> {
    return this.locationService.findOne(user, id);
  }

  @Mutation(() => LocationSchema)
  updateLocation(
    @Args('updateLocationInput') updateLocationInput: UpdateLocationInput,
    @CurrentUser() user: CurrentUserType,
  ): Promise<LocationSchema> {
    return this.locationService.update(user, updateLocationInput);
  }

  @Mutation(() => LocationSchema)
  removeLocation(
    @Args('id', { type: () => Int }) id: number,
    @CurrentUser() user: CurrentUserType,
  ): Promise<LocationSchema> {
    return this.locationService.remove(user, id);
  }

  @ResolveField(() => [EventSchema])
  events(
    @Parent() location: LocationSchema,
    @DataLoaders() loader: DataLoadersType,
  ) {
    return loader.eventsLoaderByLocationId.load(location.id);
  }

  @ResolveField(() => UserSchema)
  user(
    @Parent() location: LocationEntity,
    @DataLoaders() loader: DataLoadersType,
  ) {
    return loader.userLoaderById.load(location.userId);
  }
}
