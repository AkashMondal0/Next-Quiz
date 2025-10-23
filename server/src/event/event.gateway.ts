import { WebSocketGateway, SubscribeMessage, MessageBody, WebSocketServer } from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';
import configuration from 'src/lib/configs/configuration';
import { EventService } from './event.service';
import { OnModuleInit } from '@nestjs/common';

const url = configuration().REDIS_URL;
if (!url) throw new Error("REDIS_URL is not defined in .env file");

@WebSocketGateway({
  cors: {
    origin: true,
    credentials: true,
  },
  namespace: 'event',
  transports: ['websocket'],
})
export class EventGateway implements OnModuleInit {
  @WebSocketServer()
  server: Server;
  constructor(
    private readonly eventService: EventService,
  ) { }

  onModuleInit() {
    this.eventService.setSocket(this.server);
  }

  @SubscribeMessage('connect')
  async handleConnection(client: Socket) {
    this.eventService.handleConnection(client);
  }

  @SubscribeMessage('disconnect')
  async handleDisconnect(client: Socket) {
    this.eventService.handleDisconnect(client);
  }

  @SubscribeMessage('message-typing')
  async handleMessageTyping(@MessageBody() data: any) {
  }

  @SubscribeMessage('message-seen')
  async handleMessageSeen(@MessageBody() data: any) {
  }

  @SubscribeMessage('message')
  async handleMessage(@MessageBody() data: any) {
  }

}