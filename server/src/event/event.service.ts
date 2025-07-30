import { Injectable, Logger } from '@nestjs/common';
import { WebSocketServer } from '@nestjs/websockets';
import Redis from 'ioredis';
import { Server, Socket } from 'socket.io';
import configuration from 'src/lib/configs/configuration';
import { event_name } from 'src/lib/configs/connection.name';
import { RedisProvider } from 'src/lib/db/redis/redis.provider';
import { RoomService } from 'src/room/room.service';
import { UserService } from 'src/user/user.service';

const url = configuration().REDIS_URL;
if (!url) throw new Error("REDIS_URL is not defined in .env file");

@Injectable()
export class EventService {

  @WebSocketServer()
  server: Server;
  sub: Redis;
  client: Redis;
  KeyName: string = "NQ:CLIENTS";

  constructor(
    private readonly usersService: UserService,
    private readonly roomsService: RoomService,
    private readonly redis: RedisProvider
  ) { }

  async onModuleInit() {
    try {
      this.client = new Redis(url as string);
      this.sub = new Redis(url as string);
      const redisSubscriber = this.sub;
      await redisSubscriber.subscribe(
        "test",
        event_name.event.roomCreated
      );

      redisSubscriber.on("message", (channel, message) => {
        const data = JSON.parse(message);
        if (channel === "test") {
          console.log("From Server : Redis SUB :v1", channel);
          this.server.emit(channel, data);
          return;
        }
        this.server.to(data.members).emit(channel, data);
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

    // console.log('User ID and username extracted from handshake query:', { id, username, profilePicture });

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

  async handleConnection(client: Socket) {
    const userId = this.extractUserIdAndName(client)?.id;
    if (userId) await this.client.hset(this.KeyName, userId, client.id);
  }

  async handleDisconnect(client: Socket) {
    const userId = this.extractUserIdAndName(client)?.id;
    if (!userId) return;
    const queueKey = `matchmaking:level:${1}`;
    const userIdStr = userId.toString();
    await this.redis.client.lrem(queueKey, 0, userIdStr);
    await this.client.hdel(this.KeyName, userId);
  }

  async handleCreateRoom(data: any, client: Socket) {
    // const { username } = data;
    // const user = await this.usersService.create({ username });
    // const roomCode = this.generateRoomCode();
    // await this.roomsService.createRoom(user.id, roomCode);

    // await this.setRoom(roomCode, {
    //   hostId: user.id,
    //   players: [{ id: user.id, username, socketId: client.id }],
    //   status: 'waiting'
    // });

    // client.join(roomCode);
    // client.emit('room_created', { code: roomCode });
  }

  async handleJoinRoom(data: any, client: Socket) {
    // const { code, username } = data;
    // const roomState = await this.getRoom(code);
    // if (!roomState) return client.emit('error', { message: 'Room not found' });

    // const user = await this.usersService.create({ username });
    // roomState.players.push({ id: user.id, username, socketId: client.id });

    // await this.setRoom(code, roomState);
    // client.join(code);
    // client.emit('joined_room', { code, players: roomState.players, hostId: roomState.hostId });
    // client.to(code).emit('player_joined', { id: user.id, username });
  }

}
