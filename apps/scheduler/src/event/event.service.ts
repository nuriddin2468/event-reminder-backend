import { Injectable } from '@nestjs/common';
import { CreateEventInput } from './dto/create-event.input';
import { UpdateEventInput } from './dto/update-event.input';
import { FindAllEventsInput } from './dto/find-all-events.input';
import { CurrentUserType } from '../auth/types/current-user';
import { EventRepository } from './repositories/event.repository';
import { EventEntity } from './entities/event.entity';

@Injectable()
export class EventService {
  constructor(private readonly repository: EventRepository) {}
  create(
    user: CurrentUserType,
    createEventInput: CreateEventInput,
  ): Promise<EventEntity> {
    return this.repository.createUserEvent(user.id, createEventInput);
  }

  findAll(
    user: CurrentUserType,
    findAllEventsInput: FindAllEventsInput,
  ): Promise<EventEntity[]> {
    return this.repository.findAllUserEventsByFilters(
      user.id,
      findAllEventsInput,
    );
  }

  findOne(user: CurrentUserType, eventId: number): Promise<EventEntity> {
    return this.repository.findUserEventById(user.id, eventId);
  }

  async update(
    user: CurrentUserType,
    updateEventInput: UpdateEventInput,
  ): Promise<EventEntity> {
    return this.repository.updateUserEvent(user.id, updateEventInput);
  }

  async remove(user: CurrentUserType, eventId: number): Promise<EventEntity> {
    return this.repository.deleteUserEventById(user.id, eventId);
  }
}
