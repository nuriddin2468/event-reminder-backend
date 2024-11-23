import { Injectable, NotFoundException } from '@nestjs/common';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { LocationEntity } from '../entities/location.entity';
import { CreateLocationInput } from '../dto/create-location.input';
import { UpdateLocationInput } from '../dto/update-location.input';

@Injectable()
export class LocationRepository {
  constructor(
    @InjectRepository(LocationEntity)
    private repository: Repository<LocationEntity>,
  ) {}

  findUserLocationById(userId: number, locationId: number) {
    return this.repository.findOneOrFail({
      where: {
        id: locationId,
        userId,
      },
    });
  }

  findAllUserLocations(userId: number) {
    // here i could add pagination offsetBased / cursor based (no time sorry)
    return this.repository.find({ where: { userId } });
  }

  createUserLocation(userId: number, { title }: CreateLocationInput) {
    return this.repository.save({
      title,
      userId,
    });
  }

  async updateUserLocation(
    userId: number,
    { title, id }: UpdateLocationInput,
  ): Promise<LocationEntity> {
    const result = await this.repository
      .createQueryBuilder()
      .update({ title })
      .where('id = :id', { id })
      .andWhere('userId = :userId', { userId })
      .returning('*')
      .execute();

    if (result.affected === 0) {
      throw new NotFoundException('Location not found');
    }

    return result.raw[0];
  }

  async deleteUserLocation(
    userId: number,
    locationId: number,
  ): Promise<LocationEntity> {
    const result = await this.repository.delete({
      id: locationId,
      userId,
    });

    if (result.affected === 0) {
      throw new NotFoundException('Location not found');
    }

    return result.raw[0];
  }
}
