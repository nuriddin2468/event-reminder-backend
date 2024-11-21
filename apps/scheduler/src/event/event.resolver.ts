import {
  Args,
  Int,
  Mutation,
  Parent,
  Query,
  ResolveField,
  Resolver,
} from '@nestjs/graphql';
import { EventService } from './event.service';
import { Event } from './entities/event.entity';
import { CreateEventInput } from './dto/create-event.input';
import { UpdateEventInput } from './dto/update-event.input';
import { FindAllEventsInput } from './dto/find-all-events.input';
import { CurrentUser } from '../auth/decorators/current-user';
import { CurrentUserType } from '../auth/types/current-user';
import { User } from '../user/entities/user.entity';
import { UserService } from '../user/user.service';
import { Location } from '../location/entities/location.entity';
import { LocationService } from '../location/location.service';

@Resolver(() => Event)
export class EventResolver {
  constructor(
    private readonly eventService: EventService,
    private readonly userService: UserService,
    private readonly locationService: LocationService,
  ) {}

  @Mutation(() => Event)
  createEvent(
    @Args('createEventInput') createEventInput: CreateEventInput,
    @CurrentUser() user: CurrentUserType,
  ): Promise<Event> {
    return this.eventService.create(user, createEventInput);
  }

  @Query(() => [Event], { name: 'events' })
  findAll(
    @Args('findAllEventsInput') findAllEventsInput: FindAllEventsInput,
    @CurrentUser() user: CurrentUserType,
  ): Promise<Event[]> {
    return this.eventService.findAll(user, findAllEventsInput);
  }

  @Query(() => Event, { name: 'event' })
  findOne(
    @Args('id', { type: () => Int }) id: number,
    @CurrentUser() user: CurrentUserType,
  ): Promise<Event> {
    return this.eventService.findOne(user, id);
  }

  @Mutation(() => Event)
  updateEvent(
    @Args('updateEventInput') updateEventInput: UpdateEventInput,
    @CurrentUser() user: CurrentUserType,
  ): Promise<Event> {
    return this.eventService.update(user, updateEventInput);
  }

  @Mutation(() => Event)
  removeEvent(
    @Args('id', { type: () => Int }) id: number,
    @CurrentUser() user: CurrentUserType,
  ): Promise<Event> {
    return this.eventService.remove(user, id);
  }

  @ResolveField(() => User)
  user(@Parent() event: Event): Promise<User> {
    return this.userService.findOne(event.userId);
  }

  @ResolveField(() => Location)
  location(
    @Parent() event: Event,
    @CurrentUser() user: CurrentUserType,
  ): Promise<Location> | null {
    return event.locationId
      ? this.locationService.findOne(user, event.locationId)
      : null;
  }
}
