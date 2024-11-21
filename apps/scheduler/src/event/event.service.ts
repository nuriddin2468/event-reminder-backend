import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateEventInput } from './dto/create-event.input';
import { UpdateEventInput } from './dto/update-event.input';
import { FindAllEventsInput } from './dto/find-all-events.input';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CurrentUserType } from '../auth/types/current-user';
import { Event } from './entities/event.entity';

@Injectable()
export class EventService {
  constructor(
    @InjectRepository(Event)
    private readonly eventRepository: Repository<Event>,
  ) {}
  create(
    user: CurrentUserType,
    { startDate, endDate, description, title, locationId }: CreateEventInput,
  ): Promise<Event> {
    return this.eventRepository.save({
      startDate,
      endDate,
      description,
      title,
      location: locationId
        ? {
            id: locationId,
          }
        : undefined,
      user: {
        id: user.id,
      },
    });
  }

  findAll(
    user: CurrentUserType,
    { locationId, endDate, startDate }: FindAllEventsInput,
  ): Promise<Event[]> {
    // in future we can add pagination via cursor / offset-limit
    const qb = this.eventRepository.createQueryBuilder('e1');
    qb.where('e1.userId = :userId', { userId: user.id });
    if (locationId) {
      qb.where('e1.locationId = :locationId', { locationId: locationId });
    }
    if (startDate) {
      qb.andWhere('e1.endDate >= :startDate', {
        startDate: new Date(startDate),
      });
    }
    if (endDate) {
      qb.andWhere('e1.startDate <= :endDate', { endDate: new Date(endDate) });
    }
    return qb.getMany();
  }

  findOne(user: CurrentUserType, eventId: number): Promise<Event> {
    return this.eventRepository.findOneOrFail({
      where: {
        userId: user.id,
        id: eventId,
      },
    });
  }

  async update(
    user: CurrentUserType,
    {
      id,
      title,
      description,
      startDate,
      endDate,
      locationId,
    }: UpdateEventInput,
  ): Promise<Event> {
    const result = await this.eventRepository.update(
      { id, user: { id: user.id } },
      {
        title,
        description,
        startDate,
        endDate,
        location: locationId ? { id: locationId } : undefined,
      },
    );

    if (result.affected === 0) {
      throw new NotFoundException('Event Not Found');
    }

    return result.raw[0];
  }

  async remove(user: CurrentUserType, eventId: number): Promise<Event> {
    const result = await this.eventRepository.delete({
      id: eventId,
      user: { id: user.id },
    });
    if (result.affected === 0) {
      throw new NotFoundException('Event Not Found');
    }
    return result.raw[0];
  }
}
