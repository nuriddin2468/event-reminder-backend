import { Processor, WorkerHost } from '@nestjs/bullmq';
import { QueueNamings } from '../common/enums/queue-namings';
import { Job } from 'bullmq';
import { EventEntity } from './entities/event.entity';

@Processor(QueueNamings.notification.name)
export class EventConsumer extends WorkerHost {
  async process(
    job: Job<
      EventEntity,
      void,
      keyof typeof QueueNamings.notification.jobsKeys
    >,
  ) {
    switch (job.name) {
      case 'reminder':
        console.log('hey this is reminder', job.data);
        // remind
        break;
    }
  }
}
