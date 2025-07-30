import { WebSocketGateway, SubscribeMessage, MessageBody, ConnectedSocket } from '@nestjs/websockets';
import { EventService } from './event.service';
import { Socket } from 'socket.io';
@WebSocketGateway({
  cors: {
    origin: "*",
    credentials: true,
  },
  namespace: 'event',
  transports: ['websocket'],
})
export class EventGateway {
  constructor(private readonly eventService: EventService) { }

  @SubscribeMessage('connect')
  async handleConnection(client: Socket) {
    await this.eventService.handleConnection(client);
  }

  @SubscribeMessage('disconnect')
  async handleDisconnect(client: Socket) {
    await this.eventService.handleDisconnect(client);
  }

  @SubscribeMessage('create_room')
  async handleCreateRoom(@MessageBody() data: any, @ConnectedSocket() client: Socket) {
    await this.eventService.handleCreateRoom(data, client);
  }

  @SubscribeMessage('join_room')
  async handleJoinRoom(@MessageBody() data: any, @ConnectedSocket() client: Socket) {
    await this.eventService.handleJoinRoom(data, client);
  }
}
