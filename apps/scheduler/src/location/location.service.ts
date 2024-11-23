import { Injectable } from '@nestjs/common';
import { CreateLocationInput } from './dto/create-location.input';
import { UpdateLocationInput } from './dto/update-location.input';
import { CurrentUserType } from '../auth/types/current-user';
import { LocationRepository } from './repositories/location.repository';
import { LocationEntity } from './entities/location.entity';

@Injectable()
export class LocationService {
  constructor(private readonly locationRepository: LocationRepository) {}

  create(
    user: CurrentUserType,
    createLocationInput: CreateLocationInput,
  ): Promise<LocationEntity> {
    return this.locationRepository.createUserLocation(
      user.id,
      createLocationInput,
    );
  }

  findAll(user: CurrentUserType): Promise<LocationEntity[]> {
    return this.locationRepository.findAllUserLocations(user.id);
  }

  findOne(user: CurrentUserType, id: number): Promise<LocationEntity> {
    return this.locationRepository.findUserLocationById(user.id, id);
  }

  async update(
    user: CurrentUserType,
    updateLocationInput: UpdateLocationInput,
  ): Promise<LocationEntity> {
    return this.locationRepository.updateUserLocation(
      user.id,
      updateLocationInput,
    );
  }

  async remove(user: CurrentUserType, id: number): Promise<LocationEntity> {
    return this.locationRepository.deleteUserLocation(user.id, id);
  }
}
