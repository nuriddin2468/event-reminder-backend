import {
  OnGatewayConnection,
  OnGatewayDisconnect,
  OnGatewayInit,
  WebSocketGateway,
} from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';
import { NotificationService } from './notification.service';

@WebSocketGateway(80, { cors: '*' })
export class NotificationGateway
  implements OnGatewayConnection, OnGatewayDisconnect, OnGatewayInit
{
  constructor(private readonly notificationService: NotificationService) {}

  afterInit(server: Server) {
    this.notificationService.init(server);
  }

  async handleConnection(client: Socket) {
    await this.notificationService.onNewConnection(client);
  }

  handleDisconnect(client: Socket) {
    this.notificationService.onDisconnect(client);
  }
}
