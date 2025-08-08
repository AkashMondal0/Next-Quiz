import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { RedisProvider } from 'src/lib/db/redis/redis.provider';
import { UserService } from 'src/user/user.service';
import { QuizPrompt, TemporaryUser } from 'src/lib/types';
import { event_name } from 'src/lib/configs/connection.name';
import { RoomCreatedResponse, RoomMatchMakingState, RoomSession } from './entities/room.entity';
import { AiService } from 'src/ai/ai.service';

@Injectable()
export class RoomService {

  constructor(
    private readonly redis: RedisProvider,
    private readonly usersService: UserService,
    private readonly aiService: AiService,
  ) { }

  private generateRoomCode(): string {
    return Math.random().toString(36).substring(2, 8).toUpperCase();
  }

  async findOrCreateMatch(
    user: TemporaryUser,
    level: number,
    roomSize: number,
    prompt: QuizPrompt
  ): Promise<RoomMatchMakingState> {
    try {
      const queueKey = `matchmaking:level:${level}:roomSize:${roomSize}`;
      const promptKey = `matchmaking:prompt:${level}:${roomSize}`;
      const userIdStr = user.id.toString();

      // Fetch current queue
      let queuedPlayers = await this.redis.client.lrange(queueKey, 0, -1);

      // Add user if not already in queue
      if (!queuedPlayers.includes(userIdStr)) {
        await this.redis.client.rpush(queueKey, userIdStr);
        // Set expiration for 2 minutes
        await this.redis.client.expire(queueKey, 60 * 2);
        queuedPlayers.push(userIdStr);

        // Store prompt.topic (or full prompt if you prefer) in hash
        await this.redis.client.hset(promptKey, userIdStr, prompt.topic);
        // Set expiration for prompt hash for 2 minutes
        await this.redis.client.expire(promptKey, 60 * 2);
      }

      // Check if enough players are in the queue
      if (queuedPlayers.length >= roomSize) {
        const playersToMatch = queuedPlayers.slice(0, roomSize);

        // Remove matched players from queue
        await this.redis.client.ltrim(queueKey, roomSize, -1);

        // Get stored prompt topics
        const promptTopics = await this.redis.client.hmget(promptKey, ...playersToMatch);

        // Find most common prompt topic
        const topicFrequency: Record<string, number> = {};
        promptTopics.forEach(topic => {
          if (topic) topicFrequency[topic] = (topicFrequency[topic] || 0) + 1;
        });
        const mostFrequentTopic = Object.entries(topicFrequency).sort((a, b) => b[1] - a[1])[0]?.[0] ?? prompt.topic;

        // Construct final prompt object
        const finalPrompt: QuizPrompt = {
          ...prompt,
          topic: mostFrequentTopic,
        };

        // Create and cache the room
        const room = await this.createRoomWithPlayers(playersToMatch, level, roomSize, finalPrompt);

        // Clean up used prompt topics
        await this.redis.client.hdel(promptKey, ...playersToMatch);

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
          roomSize: roomSize,
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
        roomSize: roomSize
      };

    } catch (error) {
      console.error('Error in findOrCreateMatch:', error);
      throw new HttpException('Internal Server Error', HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }

  async createRoomWithPlayers(
    userIds: string[],
    level: number,
    roomSize: number,
    prompt: QuizPrompt
  ): Promise<RoomCreatedResponse> {
    try {
      const hostId = Number(userIds[0]);
      const code = this.generateRoomCode();

      const room = {
        id: Math.random().toString(36).substring(2, 15),
        code: code,
        hostId: hostId,
        createdAt: new Date().toISOString(),
        status: 'waiting',
      };

      const _userIds = userIds.map(id => Number(id));
      await this.redis.client.set(
        `room:${code}`,
        JSON.stringify({
          id: room.id,
          code: room.code,
          players: _userIds,
          hostId: room.hostId,
          createdAt: room.createdAt,
          status: room.status,
          level: level,
          roomSize: roomSize,
          main_data: null, // Placeholder for main data
          matchRanking: _userIds.map(id => ({ id, score: 0 })),
          matchResults: [],
          matchEnded: false,
        }),
        'EX',
        86400 // 1 day expiration
      );

      // Trigger prompt data generation
      if (room.code) {
        this.aiService.generateMainData(room.code, prompt);
      }

      return {
        members: _userIds,
        code: room.code,
        players: await this.usersService.getUsersByIds(_userIds),
        status: 'waiting',
        hostId: room.hostId,
        createdAt: room.createdAt,
      };
    } catch (error) {
      console.error('Error creating room with players:', error);
      throw new HttpException('Failed to create room', HttpStatus.INTERNAL_SERVER_ERROR);
    }
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

  async createCustomRoom(user: TemporaryUser, prompt: QuizPrompt): Promise<RoomSession> {
    const roomCode = this.generateRoomCode();
    const room: RoomSession = {
      id: roomCode,
      hostId: user.id,
      players: [user],
      createdAt: new Date().toISOString(),
      status: 'waiting',
      code: roomCode,
      readyPlayers: [],
      main_data: [],
      matchResults: []
    };
    console.log('Room created:', JSON.stringify(room));
    // Store the room in Redis
    await this.redis.client.set(`room:${roomCode}`, JSON.stringify(room));

    // Trigger prompt data generation
    this.aiService.generateMainData(roomCode, prompt);
    return room;
  }

  // async getRoomByCode(code: string): Promise<RoomSession | null> {
  //   const roomData = await this.redis.client.get(`room:${code}`);
  //   if (!roomData) return null;

  //   const room = JSON.parse(roomData);
  //   const userIds = room.players.map((id: string) => Number(id));
  //   const users = await this.usersService.getUsersByIds(userIds);

  //   return {
  //     ...room,
  //     players: users,
  //     readyPlayers: users.filter(user => room.readyPlayers.includes(user.id)),
  //   };
  // }

  // async updateRoomStatus(roomCode: string, status: "waiting" | "joining" | "ready"): Promise<RoomSession> {
  //   const roomData = await this.redis.client.get(`room:${roomCode}`);
  //   if (!roomData) throw new Error('Room not found');

  //   const room = JSON.parse(roomData);
  //   room.status = status;

  //   await this.redis.client.set(`room:${roomCode}`, JSON.stringify(room));
  //   return room;
  // }

  // async addPlayerToRoom(roomCode: string, user: TemporaryUser): Promise<RoomSession> {
  //   const roomData = await this.redis.client.get(`room:${roomCode}`);
  //   if (!roomData) throw new Error('Room not found');

  //   const room = JSON.parse(roomData);
  //   if (!room.players.includes(user.id)) {
  //     room.players.push(user.id);
  //     await this.redis.client.set(`room:${roomCode}`, JSON.stringify(room));
  //   }

  //   return room;
  // }

  // async removePlayerFromRoom(roomCode: string, userId: number): Promise<RoomSession> {
  //   const roomData = await this.redis.client.get(`room:${roomCode}`);
  //   if (!roomData) throw new Error('Room not found');

  //   const room = JSON.parse(roomData);
  //   room.players = room.players.filter((id: string) => Number(id) !== userId);

  //   await this.redis.client.set(`room:${roomCode}`, JSON.stringify(room));
  //   return room;
  // }

  // async startMatch(roomCode: string): Promise<RoomSession> {
  //   const roomData = await this.redis.client.get(`room:${roomCode}`);
  //   if (!roomData) throw new Error('Room not found');

  //   const room = JSON.parse(roomData);
  //   room.status = 'ready';

  //   await this.redis.client.set(`room:${roomCode}`, JSON.stringify(room));
  //   return room;
  // }
}
