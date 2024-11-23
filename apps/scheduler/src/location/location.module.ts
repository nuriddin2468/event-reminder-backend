import { Module } from '@nestjs/common';
import { LocationService } from './location.service';
import { LocationResolver } from './location.resolver';
import { TypeOrmModule } from '@nestjs/typeorm';
import { LocationRepository } from './repositories/location.repository';
import { LocationEntity } from './entities/location.entity';

@Module({
  imports: [TypeOrmModule.forFeature([LocationEntity])],
  providers: [LocationResolver, LocationService, LocationRepository],
  exports: [TypeOrmModule, LocationService],
})
export class LocationModule {}
