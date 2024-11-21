import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateLocationInput } from './dto/create-location.input';
import { UpdateLocationInput } from './dto/update-location.input';
import { CurrentUserType } from '../auth/types/current-user';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Location } from './entities/location.entity';

@Injectable()
export class LocationService {
  constructor(
    @InjectRepository(Location)
    private locationRepository: Repository<Location>,
  ) {}

  create(
    user: CurrentUserType,
    { title }: CreateLocationInput,
  ): Promise<Location> {
    return this.locationRepository.save({
      title,
      user: {
        id: user.id,
      },
    });
  }

  findAll(user: CurrentUserType): Promise<Location[]> {
    // here i could add pagination offsetBased / cursor based (no time sorry)
    return this.locationRepository.find({ where: { user: { id: user.id } } });
  }

  findOne(user: CurrentUserType, id: number): Promise<Location> {
    return this.locationRepository.findOneOrFail({
      where: {
        id,
        user: { id: user.id },
      },
    });
  }

  async update(
    user: CurrentUserType,
    { title, id }: UpdateLocationInput,
  ): Promise<Location> {
    const result = await this.locationRepository.update(
      {
        id,
        user: { id: user.id },
      },
      { title },
    );

    if (result.affected === 0) {
      throw new NotFoundException('Location not found');
    }

    return result.raw[0];
  }

  async remove(user: CurrentUserType, id: number): Promise<Location> {
    const result = await this.locationRepository.delete({
      id,
      user: { id: user.id },
    });

    if (result.affected === 0) {
      throw new NotFoundException('Location not found');
    }

    return result.raw[0];
  }
}
