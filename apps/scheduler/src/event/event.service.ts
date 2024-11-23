import { Injectable } from '@nestjs/common';
import { CreateEventInput } from './dto/create-event.input';
import { UpdateEventInput } from './dto/update-event.input';
import { FindAllEventsInput } from './dto/find-all-events.input';
import { CurrentUserType } from '../auth/types/current-user';
import { EventRepository } from './repositories/event.repository';
import { EventEntity } from './entities/event.entity';
import { InjectQueue } from '@nestjs/bullmq';
import { QueueNamings } from '../common/enums/queue-namings';
import { Queue } from 'bullmq';

@Injectable()
export class EventService {
  constructor(
    private readonly repository: EventRepository,
    @InjectQueue(QueueNamings.notification.name)
    private notificationQueue: Queue,
  ) {}
  async create(
    user: CurrentUserType,
    createEventInput: CreateEventInput,
  ): Promise<EventEntity> {
    const event = await this.repository.createUserEvent(
      user.id,
      createEventInput,
    );
    await this.addReminder(event);
    return event;
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

  private async addReminder(event: EventEntity) {
    await this.notificationQueue.add(
      QueueNamings.notification.jobsKeys.reminder,
      event,
      { delay: new Date(event.startDate).getTime() - new Date().getTime() },
    );
  }
}
