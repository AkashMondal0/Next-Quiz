import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { RedisProvider } from 'src/lib/db/redis/redis.provider';
import { UserService } from 'src/user/user.service';
import { DrizzleProvider } from 'src/lib/db/drizzle/drizzle.provider';
import { RoomSchema } from 'src/lib/db/drizzle/drizzle.schema';
import { quizAnswerRequest, QuizPrompt, TemporaryUser } from 'src/lib/types';
import { event_name } from 'src/lib/configs/connection.name';
import { RoomCreatedResponse, RoomMatchMakingState, RoomSession } from './entities/room.entity';
import { AiService } from 'src/ai/ai.service';

@Injectable()
export class RoomService {

  constructor(
    private readonly redis: RedisProvider,
    private readonly usersService: UserService,
    private readonly aiService: AiService,
    private readonly drizzleProvider: DrizzleProvider
  ) { }

  private generateRoomCode(): string {
    return Math.random().toString(36).substring(2, 8).toUpperCase();
  }

  async findOrCreateMatch(user: TemporaryUser, level: number, roomSize: number, prompt: QuizPrompt): Promise<RoomMatchMakingState> {
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
      const room = await this.createRoomWithPlayers(playersToMatch, level, roomSize, prompt);

      // Get user info
      const users = await this.usersService.getUsersByIds(playersToMatch.map(id => Number(id)));

      // Notify users about the room creation
      this.notifyUser(event_name.event.roomCreated, {
        members: users.map(user => user.id),
        code: room.code || null,
        players: users,
        status: 'ready',
      });

      return {
        code: room.code || null,
        players: users,
        status: 'ready',
      };
    }

    // Still waiting
    const uniqueIds = [...new Set(queuedPlayers)].map(id => Number(id));
    const users = await this.usersService.getUsersByIds(uniqueIds);

    // Notify users that they are still waiting
    this.notifyUser(event_name.event.roomCreated, {
      members: users.map(user => user.id),
      code: null,
      players: users,
      status: 'joining',
    });

    return {
      code: null,
      players: users,
      status: 'waiting',
    };
  }

  async createRoomWithPlayers(userIds: string[], level: number, roomSize: number, prompt: QuizPrompt): Promise<RoomCreatedResponse> {
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
        main_data: null, // Placeholder for main data
        matchRanking: _userIds.map(id => ({ id, score: 0 })),
        matchResults: [],
        matchEnded: false,
      }),
      'EX',
      86400 // 1 day expiration in seconds
    );
    room[0].code && this.aiService.generateMainData(room[0].code, prompt);
    return {
      members: _userIds,
      code: room[0].code,
      players: await this.usersService.getUsersByIds(_userIds),
      status: 'waiting',
      hostId: room[0].hostId,
      createdAt: room[0].createdAt,
    };
  }

  async getRoomById(id: string): Promise<RoomCreatedResponse | null> {
    try {
      const roomData = await this.redis.client.get(`room:${id}`);
      if (!roomData) {
        throw new HttpException('Room not found', HttpStatus.NOT_FOUND);
      }

      const room = JSON.parse(roomData);
      const userIds = room.players.map((id: string) => Number(id));
      const users = await this.usersService.getUsersByIds(userIds);

      return {
        ...room,
        players: users,
      };
    } catch (error) {
      console.error('Error fetching room by ID:', error);
      throw new HttpException('Internal Server Error', HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }

  async getRoomByCode(code: string): Promise<RoomSession | null> {
    const roomData = await this.redis.client.get(`room:${code}`);
    if (!roomData) return null;

    const room = JSON.parse(roomData);
    const userIds = room.players.map((id: string) => Number(id));
    const users = await this.usersService.getUsersByIds(userIds);

    return {
      ...room,
      players: users,
      readyPlayers: users.filter(user => room.readyPlayers.includes(user.id)),
    };
  }

  async updateRoomStatus(roomCode: string, status: "waiting" | "joining" | "ready"): Promise<RoomSession> {
    const roomData = await this.redis.client.get(`room:${roomCode}`);
    if (!roomData) throw new Error('Room not found');

    const room = JSON.parse(roomData);
    room.status = status;

    await this.redis.client.set(`room:${roomCode}`, JSON.stringify(room));
    return room;
  }

  async addPlayerToRoom(roomCode: string, user: TemporaryUser): Promise<RoomSession> {
    const roomData = await this.redis.client.get(`room:${roomCode}`);
    if (!roomData) throw new Error('Room not found');

    const room = JSON.parse(roomData);
    if (!room.players.includes(user.id)) {
      room.players.push(user.id);
      await this.redis.client.set(`room:${roomCode}`, JSON.stringify(room));
    }

    return room;
  }

  async removePlayerFromRoom(roomCode: string, userId: number): Promise<RoomSession> {
    const roomData = await this.redis.client.get(`room:${roomCode}`);
    if (!roomData) throw new Error('Room not found');

    const room = JSON.parse(roomData);
    room.players = room.players.filter((id: string) => Number(id) !== userId);

    await this.redis.client.set(`room:${roomCode}`, JSON.stringify(room));
    return room;
  }

  async startMatch(roomCode: string): Promise<RoomSession> {
    const roomData = await this.redis.client.get(`room:${roomCode}`);
    if (!roomData) throw new Error('Room not found');

    const room = JSON.parse(roomData);
    room.status = 'ready';

    await this.redis.client.set(`room:${roomCode}`, JSON.stringify(room));
    return room;
  }

  async cancelMatchmaking(user: TemporaryUser, level: number, roomSize: number): Promise<void> {
    const queueKey = `matchmaking:level:${level}:roomSize:${roomSize}`;
    const userIdStr = user.id.toString();
    // Remove user from the matchmaking queue
    await this.redis.client.lrem(queueKey, 0, userIdStr);
  }

  async notifyUser(event: string, data: RoomCreatedResponse) {
    await this.redis.client.publish(event, JSON.stringify(data));
  }

  async addUser(user: TemporaryUser) {
    await this.usersService.cacheUsers([user]); // Missing await was fixed
  }
}
