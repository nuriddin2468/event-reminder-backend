import {
  Args,
  Int,
  Parent,
  Query,
  ResolveField,
  Resolver,
} from '@nestjs/graphql';
import { UserService } from './user.service';
import { User } from './entities/user.entity';
import { Location } from '../location/entities/location.entity';
import { Event } from '../event/entities/event.entity';
import { LocationService } from '../location/location.service';
import { EventService } from '../event/event.service';

@Resolver(() => User)
export class UserResolver {
  constructor(
    private readonly userService: UserService,
    private readonly locationService: LocationService,
    private readonly eventService: EventService,
  ) {}

  @Query(() => User, { name: 'user' })
  findOne(@Args('id', { type: () => Int }) id: number): Promise<User> {
    return this.userService.findOne(id);
  }

  @ResolveField(() => [Event])
  events(@Parent() user: User): Promise<Event[]> {
    return this.eventService.findAll(user, {});
  }

  @ResolveField(() => [Location])
  locations(@Parent() user: User): Promise<Location[]> {
    return this.locationService.findAll(user);
  }
}
