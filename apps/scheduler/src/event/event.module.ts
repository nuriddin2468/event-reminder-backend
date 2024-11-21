import { forwardRef, Module } from '@nestjs/common';
import { EventService } from './event.service';
import { EventResolver } from './event.resolver';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Event } from './entities/event.entity';
import { UserModule } from '../user/user.module';
import { LocationModule } from '../location/location.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([Event]),
    forwardRef(() => UserModule),
    forwardRef(() => LocationModule),
  ],
  providers: [EventResolver, EventService],
  exports: [TypeOrmModule, EventService],
})
export class EventModule {}
