import { Module } from '@nestjs/common';
import { EventService } from './event.service';
import { EventResolver } from './event.resolver';
import { TypeOrmModule } from '@nestjs/typeorm';
import { EventEntity } from './entities/event.entity';
import { EventRepository } from './repositories/event.repository';
import { BullModule } from '@nestjs/bullmq';
import { QueueNamings } from '../common/enums/queue-namings';
import { EventConsumer } from './event.consumer';

@Module({
  imports: [
    TypeOrmModule.forFeature([EventEntity]),
    BullModule.registerQueue({
      name: QueueNamings.notification.name,
      connection: {
        host: 'redis-cache',
        port: 6379,
      },
    }),
  ],
  providers: [EventResolver, EventService, EventRepository, EventConsumer],
  exports: [TypeOrmModule, EventService],
})
export class EventModule {}
