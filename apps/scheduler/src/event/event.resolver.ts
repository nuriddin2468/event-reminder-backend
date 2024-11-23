import {
  Args,
  Int,
  Mutation,
  Parent,
  Query,
  ResolveField,
  Resolver,
} from '@nestjs/graphql';

import { FindAllEventsInput } from './dto/find-all-events.input';
import { CurrentUser } from '../auth/decorators/current-user';
import { CurrentUserType } from '../auth/types/current-user';
import { EventEntity } from './entities/event.entity';
import { EventService } from './event.service';
import { CreateEventInput } from './dto/create-event.input';
import { UpdateEventInput } from './dto/update-event.input';
import { EventSchema } from './schemas/event.schema';
import { LocationSchema } from '../location/schemas/location.schema';
import { UserSchema } from '../user/schemas/user.schema';
import { DataLoaders } from '../common/decorators/data-loader';
import { DataLoadersType } from '../data-loaders';

@Resolver(() => EventSchema)
export class EventResolver {
  constructor(private readonly eventService: EventService) {}

  @Mutation(() => EventSchema)
  createEvent(
    @Args('createEventInput') createEventInput: CreateEventInput,
    @CurrentUser() user: CurrentUserType,
  ): Promise<EventSchema> {
    return this.eventService.create(user, createEventInput);
  }

  @Query(() => [EventSchema], { name: 'events' })
  findAll(
    @Args('findAllEventsInput') findAllEventsInput: FindAllEventsInput,
    @CurrentUser() user: CurrentUserType,
  ): Promise<EventSchema[]> {
    return this.eventService.findAll(user, findAllEventsInput);
  }

  @Query(() => EventSchema, { name: 'event' })
  findOne(
    @Args('id', { type: () => Int }) id: number,
    @CurrentUser() user: CurrentUserType,
  ): Promise<EventSchema> {
    return this.eventService.findOne(user, id);
  }

  @Mutation(() => EventSchema)
  updateEvent(
    @Args('updateEventInput') updateEventInput: UpdateEventInput,
    @CurrentUser() user: CurrentUserType,
  ): Promise<EventSchema> {
    return this.eventService.update(user, updateEventInput);
  }

  @Mutation(() => EventSchema)
  removeEvent(
    @Args('id', { type: () => Int }) id: number,
    @CurrentUser() user: CurrentUserType,
  ): Promise<EventSchema> {
    return this.eventService.remove(user, id);
  }

  @ResolveField(() => UserSchema)
  async user(
    @Parent() parent: EventEntity,
    @DataLoaders() dataLoaders: DataLoadersType,
  ) {
    return await dataLoaders.userLoaderById.load(parent.userId);
  }

  @ResolveField(() => LocationSchema)
  location(
    @Parent() parent: EventEntity,
    @DataLoaders() dataLoaders: DataLoadersType,
  ) {
    return parent.locationId
      ? dataLoaders.locationLoaderById.load(parent.locationId)
      : null;
  }
}
