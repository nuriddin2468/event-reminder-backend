import { Module } from '@nestjs/common';
import { NotificationGateway } from './notification.gateway';
import { AuthModule } from '../auth/auth.module';
import { NotificationService } from './notification.service';

@Module({
  imports: [AuthModule],
  providers: [NotificationGateway, NotificationService],
  exports: [NotificationService],
})
export class NotificationModule {}
