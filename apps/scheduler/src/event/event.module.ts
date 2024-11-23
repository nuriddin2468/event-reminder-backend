import { Module } from '@nestjs/common';
import { EventService } from './event.service';
import { EventResolver } from './event.resolver';
import { TypeOrmModule } from '@nestjs/typeorm';
import { EventEntity } from './entities/event.entity';
import { EventRepository } from './repositories/event.repository';

@Module({
  imports: [TypeOrmModule.forFeature([EventEntity])],
  providers: [EventResolver, EventService, EventRepository],
  exports: [TypeOrmModule, EventService],
})
export class EventModule {}
