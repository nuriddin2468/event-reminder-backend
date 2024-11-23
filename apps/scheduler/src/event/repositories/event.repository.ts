import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Injectable, NotFoundException } from '@nestjs/common';
import { FindAllEventsInput } from '../dto/find-all-events.input';
import { UpdateEventInput } from '../dto/update-event.input';
import { CreateEventInput } from '../dto/create-event.input';
import { EventEntity } from '../entities/event.entity';

@Injectable()
export class EventRepository {
  constructor(
    @InjectRepository(EventEntity)
    private repository: Repository<EventEntity>,
  ) {}

  findAllUserEventsByFilters(
    userId: number,
    { locationId, endDate, startDate }: FindAllEventsInput,
  ) {
    // in future we can add pagination via cursor / offset-limit
    const qb = this.repository.createQueryBuilder('e1');
    qb.where('e1.userId = :userId', { userId });
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

  async updateUserEvent(
    userId: number,
    {
      id,
      title,
      description,
      startDate,
      endDate,
      locationId,
    }: UpdateEventInput,
  ) {
    const result = await this.repository
      .createQueryBuilder()
      .update({
        title,
        description,
        startDate,
        endDate,
        locationId,
      })
      .where('id = :id', { id })
      .andWhere('userId = :userId', { userId })
      .returning('*')
      .execute();

    if (result.affected === 0) {
      throw new NotFoundException('Event Not Found');
    }

    return result.raw[0];
  }

  async deleteUserEventById(userId: number, eventId: number) {
    const result = await this.repository.delete({
      id: eventId,
      userId,
    });
    if (result.affected === 0) {
      throw new NotFoundException('Event Not Found');
    }
    return result.raw[0];
  }

  findUserEventById(userId: number, eventId: number) {
    return this.repository.findOneOrFail({
      where: {
        userId,
        id: eventId,
      },
    });
  }

  createUserEvent(
    userId: number,
    { startDate, endDate, description, title, locationId }: CreateEventInput,
  ) {
    return this.repository.save({
      startDate,
      endDate,
      description,
      title,
      locationId,
      userId,
    });
  }
}
