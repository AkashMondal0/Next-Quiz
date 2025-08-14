import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { RedisProvider } from 'src/lib/db/redis/redis.provider';
import { UserService } from 'src/user/user.service';
import { QuizAnswerRequest, QuizPrompt, RoomSessionActivityData, TemporaryUser } from 'src/lib/types';
import { event_name } from 'src/lib/configs/connection.name';
import { RoomCreatedResponse, RoomSession } from './entities/room.entity';
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

  // new apis
  async getRoomByCode(code: string): Promise<RoomSession | null> {
    try {
      const roomData = await this.redis.client.get(`room:${code}`);
      if (!roomData) {
        throw new HttpException('Room not found', HttpStatus.NOT_FOUND);
      }
      const room = JSON.parse(roomData);
      return room;
    } catch (error) {
      console.error('Error fetching room by code:', error);
      throw new HttpException('Internal Server Error', HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }

  async createCustomRoom(user: TemporaryUser, prompt: QuizPrompt): Promise<RoomSession> {
    const roomCode = this.generateRoomCode();
    let room: RoomSession = {
      id: roomCode,
      members: [user.id],
      hostId: user.id,
      players: [{
        id: user.id || 0,
        username: user.username || "NO_USERNAME",
        avatar: user.avatar || "NO_AVATAR"
      }],
      createdAt: new Date().toISOString(),
      status: 'waiting',
      code: roomCode,
      readyPlayers: [],
      main_data: [],
      matchResults: [],
      prompt: prompt,
      matchStarted: false,
      matchDuration: prompt.matchDuration || 600,
      matchRanking: [
        {
          id: user.id as any,
          score: 0,
          isSubmitted: false 
        }
      ]
    };
    // Store the room in Redis
    await this.redis.client.set(`room:${roomCode}`, JSON.stringify(room));

    // Trigger prompt data generation
    await this.aiService.generateMainData(roomCode, prompt);

    return room;
  }

  async joinRoomByCode(code: string, user: TemporaryUser): Promise<RoomSession | null> {
    try {
      const roomData = await this.redis.client.get(`room:${code}`);

      if (!roomData) {
        throw new HttpException('Room not found', HttpStatus.NOT_FOUND);
      }

      const room = JSON.parse(roomData) as RoomSession;

      if (!room.players.some((player: TemporaryUser) => player.id === user.id)) { // check if user is already in the room
        if (room.prompt?.participantLimit && room.players.length >= room.prompt.participantLimit) {
          throw new HttpException('Room is full', HttpStatus.FORBIDDEN);
        }
        room.players.push({
          id: user.id,
          username: user.username,
          avatar: user.avatar
        });

        room.matchRanking.push({
          id: user.id as any,
          score: 0,
          isSubmitted: false 
        });
      }

      const members = room.players.map((player: TemporaryUser) => player.id).filter((id: number) => id !== user.id);

      await this.redis.client.set(`room:${code}`, JSON.stringify(room));
      await this.redis.client.publish(event_name.event.roomData, JSON.stringify({ ...room, members }));
      return room;
    } catch (error) {
      console.error('Error joining room by code:', error);
      throw new HttpException('Internal Server Error', HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }

  async leaveRoom(code: string, user: TemporaryUser): Promise<RoomSession | null> {
    try {
      const roomData = await this.redis.client.get(`room:${code}`);

      if (!roomData) {
        throw new HttpException('Room not found', HttpStatus.NOT_FOUND);
      }

      const room = JSON.parse(roomData) as RoomSession;

      room.players = room.players.filter((player: TemporaryUser) => player.id !== user.id);
      room.matchRanking = room.matchRanking.filter((ranking: any) => ranking.id !== user.id);

      room.hostId && (room.hostId = room.players[0]?.id || undefined);

      room.members = room.players.map((player: TemporaryUser) => player.id);

      await this.redis.client.set(`room:${code}`, JSON.stringify(room));
      await this.redis.client.publish(event_name.event.roomData, JSON.stringify(room));
      return room;
    } catch (error) {
      console.error('Error leaving room:', error);
      throw new HttpException('Internal Server Error', HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }

  async startRoom(code: string): Promise<RoomSession | null> {
    try {
      const roomData = await this.redis.client.get(`room:${code}`);

      if (!roomData) {
        throw new HttpException('Room not found', HttpStatus.NOT_FOUND);
      }

      const room = JSON.parse(roomData) as RoomSession;

      if (room.status !== 'waiting') {
        throw new HttpException('Room is not in waiting status', HttpStatus.FORBIDDEN);
      }

      room.matchStarted = true;
      await this.redis.client.set(`room:${code}`, JSON.stringify(room));
      await this.redis.client.publish(event_name.event.roomData, JSON.stringify(room));
      return room;
    } catch (error) {
      console.error('Error starting room:', error);
      throw new HttpException('Internal Server Error', HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }

  async submitRoom(answers: QuizAnswerRequest): Promise<RoomSession | null> {
    // console.log('Room ended event received:', results);
    const roomData = await this.redis.client.get(`room:${answers.code}`);
    if (!roomData) throw new Error('Room not found');

    let room = JSON.parse(roomData) as RoomSession;
    const correctAns = room.main_data.map((question, index) => question.correctIndex)
    const userMarks = answers.answers.reduce((acc, answer, index) => {
      return acc + (answer === correctAns[index] ? 1 : 0);
    }, 0);

    room.matchEnded = true;
    room.matchResults = room.matchResults || [];
    room.matchResults.push({
      totalMarks: room.main_data.length,
      userMarks,
      id: answers.userId,
      userAnswers: answers.answers,
      timeTaken: answers.timeTaken,
    });
    room.matchRanking = room.matchRanking.map((ranking) => {
      if (ranking.id === answers.userId) {
        ranking.score = userMarks;
        ranking.isSubmitted = true;
      }
      return ranking;
    });

    const _sData: RoomSessionActivityData = {
      code: room.code,
      type: "quiz_result_update",
      members: room.players.map(player => player.id),
      id: room.id,
      totalAnswered: 0,
      score: 0
    }

    await this.redis.client.set(`room:${answers.code}`, JSON.stringify(room));
    await this.redis.client.publish(event_name.event.roomActivity, JSON.stringify(_sData));
    // console.log('Room session updated with match results:', room);
    return room;
  }
}
