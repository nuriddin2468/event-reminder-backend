import { forwardRef, Module } from '@nestjs/common';
import { LocationService } from './location.service';
import { LocationResolver } from './location.resolver';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Location } from './entities/location.entity';
import { UserModule } from '../user/user.module';
import { EventModule } from '../event/event.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([Location]),
    UserModule,
    forwardRef(() => EventModule),
  ],
  providers: [LocationResolver, LocationService],
  exports: [TypeOrmModule, LocationService],
})
export class LocationModule {}
