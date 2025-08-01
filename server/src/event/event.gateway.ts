import { WebSocketGateway, SubscribeMessage, WebSocketServer, MessageBody } from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';
import { Logger, OnModuleInit } from '@nestjs/common';
import Redis from 'ioredis';
import { event_name } from 'src/lib/configs/connection.name';
import configuration from 'src/lib/configs/configuration';

const url = configuration().REDIS_URL;
if (!url) throw new Error("REDIS_URL is not defined in .env file");


@WebSocketGateway({
  cors: {
    origin: "*",
    credentials: true,
  },
  namespace: 'event',
  transports: ['websocket'],
})
export class EventGateway implements OnModuleInit {
  @WebSocketServer()
  server: Server;

  sub: Redis;
  client: Redis;
  KeyName: string = "NQ:CLIENTS";

  async onModuleInit() {
    try {
      this.client = new Redis(url as string);
      this.sub = new Redis(url as string);
      const redisSubscriber = this.sub;
      await redisSubscriber.subscribe(
        "test",
        event_name.event.roomCreated,
        event_name.event.roomActivity,
      );

      redisSubscriber.on("message", async (channel, message) => {
        const data = JSON.parse(message);
        if (channel === "test") {
          this.server.emit(channel, data);
          return;
        }
        const ids = await this.findSocketIdsByUsersIds(data.members);
        if (!ids || ids.length === 0) {
          return;
        }
        this.server.to(ids).emit(channel, data);
      });

      Logger.log('Redis subscriber initialized successfully');
    } catch (error) {
      Logger.error('Redis subscriber initialization failed', error);
    }
  }

  generateRoomCode(): string {
    return Math.random().toString(36).substring(2, 8).toUpperCase(); // 6-char alphanumeric
  }

  extractUserIdAndName(client: Socket): { id: string, username: string, profilePicture?: string } | null {
    const id = client.handshake.query.id as string;
    const username = client.handshake.query.username as string;
    const profilePicture = client.handshake.query.profilePicture as string;
    if (!id || !username) {
      Logger.warn('User ID or username not found in handshake query');
      return null;
    }

    return { id, username, profilePicture };
  }

  async getUserIdBySocketId(userId?: string): Promise<string | null> {
    if (typeof userId !== 'string') return null;
    const socketId = await this.client.hget(this.KeyName, userId);
    if (!socketId && typeof socketId !== 'string') return null;
    return socketId;
  }

  async findSocketIdsByUsersIds(userIds?: string[]): Promise<string[] | null> {
    if (!userIds?.length) return null;
    const ids = await Promise.all(userIds.map(userId => this.client.hget(this.KeyName, userId)));
    return ids.filter(Boolean) as string[] | null;
  }

  async publishMessage(channel: string, data: any) {
    const ids = await this.findSocketIdsByUsersIds(data.members);
    if (ids && ids.length > 0) {
      this.client.publish(channel, JSON.stringify({ ...data, members: ids }));
    }
  }

  @SubscribeMessage('connect')
  async handleConnection(client: Socket) {
    const userId = this.extractUserIdAndName(client)?.id;
    if (userId) await this.client.hset(this.KeyName, userId, client.id);
  }

  @SubscribeMessage('disconnect')
  async handleDisconnect(client: Socket) {
    const userId = this.extractUserIdAndName(client)?.id;
    if (!userId) return;
    const queueKey = `matchmaking:level:${1}`;
    const userIdStr = userId.toString();
    await this.client.lrem(queueKey, 0, userIdStr);
    await this.client.hdel(this.KeyName, userId);
  }

  @SubscribeMessage(event_name.event.roomActivity)
  async handleRoomActivity(@MessageBody() data: any) {
    // Handle room activity event
    await this.client.publish(event_name.event.roomActivity, JSON.stringify(data));
  }
}
