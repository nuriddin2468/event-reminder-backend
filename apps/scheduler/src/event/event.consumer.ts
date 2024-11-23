import { Processor, WorkerHost } from '@nestjs/bullmq';
import { QueueNamings } from '../common/enums/queue-namings';
import { Job } from 'bullmq';
import { EventEntity } from './entities/event.entity';
import { NotificationService } from '../notification/notification.service';

@Processor(QueueNamings.notification.name)
export class EventConsumer extends WorkerHost {
  constructor(private readonly notificationService: NotificationService) {
    super();
  }

  async process(
    job: Job<
      EventEntity,
      void,
      keyof typeof QueueNamings.notification.jobsKeys
    >,
  ) {
    switch (job.name) {
      case 'reminder':
        this.notificationService.sendMessage(
          job.data.userId,
          'reminder',
          job.data,
        );
        break;
    }
  }
}
