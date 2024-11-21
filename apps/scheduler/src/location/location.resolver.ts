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
import { Location } from './entities/location.entity';
import { CreateLocationInput } from './dto/create-location.input';
import { UpdateLocationInput } from './dto/update-location.input';
import { CurrentUser } from '../auth/decorators/current-user';
import { User } from '../user/entities/user.entity';
import { UserService } from '../user/user.service';
import { EventService } from '../event/event.service';
import { Event } from '../event/entities/event.entity';
import { CurrentUserType } from '../auth/types/current-user';

@Resolver(() => Location)
export class LocationResolver {
  constructor(
    private readonly locationService: LocationService,
    private readonly userService: UserService,
    private readonly eventService: EventService,
  ) {}

  @Mutation(() => Location)
  createLocation(
    @Args('createLocationInput') createLocationInput: CreateLocationInput,
    @CurrentUser() user: CurrentUserType,
  ) {
    return this.locationService.create(user, createLocationInput);
  }

  @Query(() => [Location], { name: 'location' })
  findAll(@CurrentUser() user: CurrentUserType): Promise<Location[]> {
    return this.locationService.findAll(user);
  }

  @Query(() => Location, { name: 'location' })
  findOne(
    @Args('id', { type: () => Int }) id: number,
    @CurrentUser() user: CurrentUserType,
  ): Promise<Location> {
    return this.locationService.findOne(user, id);
  }

  @Mutation(() => Location)
  updateLocation(
    @Args('updateLocationInput') updateLocationInput: UpdateLocationInput,
    @CurrentUser() user: CurrentUserType,
  ): Promise<Location> {
    return this.locationService.update(user, updateLocationInput);
  }

  @Mutation(() => Location)
  removeLocation(
    @Args('id', { type: () => Int }) id: number,
    @CurrentUser() user: CurrentUserType,
  ): Promise<Location> {
    return this.locationService.remove(user, id);
  }

  @ResolveField(() => [Event])
  events(
    @Parent() location: Location,
    @CurrentUser() user: User,
  ): Promise<Event[]> {
    return this.eventService.findAll(user, { locationId: location.id });
  }

  @ResolveField(() => User)
  user(@Parent() location: Location, @CurrentUser() user: User): Promise<User> {
    return this.userService.findOne(location.userId);
  }
}
