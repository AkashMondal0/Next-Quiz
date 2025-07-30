import { Injectable } from '@nestjs/common';
import { RedisProvider } from 'src/lib/db/redis/redis.provider';
import { UserService } from 'src/user/user.service';
import { DrizzleProvider } from 'src/lib/db/drizzle/drizzle.provider';
import { RoomSchema } from 'src/lib/db/drizzle/drizzle.schema';
import { TemporaryUser } from 'src/lib/types';
import { event_name } from 'src/lib/configs/connection.name';

@Injectable()
export class RoomService {
  private readonly MAX_PLAYERS = 2;

  constructor(
    private readonly redis: RedisProvider,
    private readonly usersService: UserService,
    private readonly drizzleProvider: DrizzleProvider
  ) { }

  private generateRoomCode(): string {
    return Math.random().toString(36).substring(2, 8).toUpperCase();
  }

  async findOrCreateMatch(user: TemporaryUser, level: number, roomSize: number) {
    const queueKey = `matchmaking:level:${level}:roomSize:${roomSize}`;
    const userIdStr = user.id.toString();

    // Fetch current queue
    let queuedPlayers = await this.redis.client.lrange(queueKey, 0, -1);

    // Add user if not already in queue
    if (!queuedPlayers.includes(userIdStr)) {
      await this.redis.client.rpush(queueKey, userIdStr);
      queuedPlayers.push(userIdStr);
    }

    // Check if enough players are in the queue
    if (queuedPlayers.length >= roomSize) {
      const playersToMatch = queuedPlayers.slice(0, roomSize);

      // Remove matched players from queue
      await this.redis.client.ltrim(queueKey, roomSize, -1);

      // Create and cache the room
      const room = await this.createRoomWithPlayers(playersToMatch, level, roomSize);

      // Get user info
      const users = await this.usersService.getUsersByIds(playersToMatch.map(id => Number(id)));

      return {
        roomCode: room[0].code,
        players: users,
        status: 'ready',
      };
    }

    // Still waiting
    const uniqueIds = [...new Set(queuedPlayers)].map(id => Number(id));
    const users = await this.usersService.getUsersByIds(uniqueIds);

    return {
      roomCode: null,
      players: users,
      status: 'waiting',
    };
  }

  async createRoomWithPlayers(userIds: string[], level: number, roomSize: number) {
    const hostId = Number(userIds[0]);
    const code = this.generateRoomCode();

    const room = await this.drizzleProvider.db
      .insert(RoomSchema)
      .values({
        code,
        hostId: hostId.toString(),
        status: 'waiting',
      })
      .returning({
        id: RoomSchema.id,
        code: RoomSchema.code,
        hostId: RoomSchema.hostId,
        createdAt: RoomSchema.createdAt,
        status: RoomSchema.status,
      });

    const _userIds = userIds.map(id => Number(id));
    await this.redis.client.set(
      `room:${code}`,
      JSON.stringify({
        id: room[0].id,
        code: room[0].code,
        players: _userIds,
        hostId: room[0].hostId,
        createdAt: room[0].createdAt,
        status: room[0].status,
        level: level,
        roomSize: roomSize,
      }),
    );

    return room;
  }


  async getRoomById(id: string) {
    const roomData = await this.redis.client.get(`room:${id}`);
    if (!roomData) return null;

    const room = JSON.parse(roomData);
    const userIds = room.players.map((id: string) => Number(id));
    const users = await this.usersService.getUsersByIds(userIds);

    return {
      ...room,
      players: users,
    };
  }

  async notifyUser(event: string, data: {
    members: number[];
    roomCode?: string | null;
  }) {
    await this.redis.client.publish(event, JSON.stringify(data));
  }

  async addUser(user: TemporaryUser) {
    await this.usersService.cacheUsers([user]); // Missing await was fixed
  }
}
