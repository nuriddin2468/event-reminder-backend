import { Injectable } from '@nestjs/common';
import { Server, Socket } from 'socket.io';
import { AuthService } from '../auth/auth.service';

@Injectable()
export class NotificationService {
  private server: Server;

  private activeClientMapper: Map<string, number> = new Map();

  constructor(private readonly authService: AuthService) {}

  init(server: Server) {
    this.server = server;
  }

  async onNewConnection(client: Socket) {
    try {
      const user = await this.authService.verifyToken(
        client.handshake.headers.authorization,
      );
      this.activeClientMapper.set(client.id, user.id);
    } catch {
      client.disconnect();
    }
  }

  onDisconnect(client: Socket) {
    this.activeClientMapper.delete(client.id);
  }

  sendMessage<T>(userId: number, messageType: string, message: T) {
    const rooms: string[] = [];
    this.activeClientMapper.forEach((value, key) => {
      if (value === userId) {
        rooms.push(key);
      }
    });
    this.server.to(rooms).emit(messageType, message);
  }
}
