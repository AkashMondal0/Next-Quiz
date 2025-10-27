import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { CreateQuizPayload, JoinRoomDto } from './dto/create-quiz.dto';
import { RedisService } from 'src/lib/db/redis/redis.service';
import { RoomSession } from './entities/quiz.entity';

@Injectable()
export class QuizService {
  constructor(private readonly redisService: RedisService) { }

  private generateRoomCode(): string {
    return Math.random().toString(36).substring(2, 8).toUpperCase();
  }

  async getRoomAndQuiz(id: string) {
    try {
      const roomData = await this.redisService.client.get(`room:${id}`);
      if (!roomData) {
        throw new HttpException("Room not found", HttpStatus.NOT_FOUND);
      }
      return JSON.parse(roomData);
    } catch (error) {
      throw new HttpException("Internal Server Error", HttpStatus.INTERNAL_SERVER_ERROR)
    }
  }

  async createQuiz(createQuizDto: CreateQuizPayload) {
    try {
      // throw new Error("Method not implemented.");
      const roomCode = this.generateRoomCode();
      let room: RoomSession = {
        id: roomCode,
        members: [createQuizDto.hostId],
        hostId: createQuizDto.hostId,
        players: [createQuizDto.player],
        createdAt: new Date().toISOString(),
        status: 'waiting',
        code: roomCode,
        readyPlayers: [],
        questions: [],
        matchResults: [],
        prompt: createQuizDto.prompt,
        matchStarted: false,
        matchDuration: createQuizDto.duration,
        matchRanking: [
          {
            id: createQuizDto.hostId,
            score: 0,
            isSubmitted: false
          }
        ]
      };
      // Store the room in Redis
      await this.redisService.client.set(`room:${roomCode}`, JSON.stringify(room));
      // Trigger prompt data generation
      // await this.aiService.generateMainData(roomCode, prompt);
      return room;
    } catch (error) {
      throw new HttpException("Internal Server Error", HttpStatus.INTERNAL_SERVER_ERROR)
    }
  }

  async kickPlayer(joinRoomDto: JoinRoomDto) {
    return `This action kicks a player from room with code: ${joinRoomDto.roomCode}`;
  }
  async joinRoom(joinRoomDto: JoinRoomDto) {
    return `This action joins a room with code: ${joinRoomDto.roomCode}`;
  }

  async leaveRoom(joinRoomDto: JoinRoomDto) {
    return `This action leaves a room with code: ${joinRoomDto.roomCode}`;
  }

  async getRoomResult(joinRoomDto: JoinRoomDto) {
    return `This action gets results for room with code: ${joinRoomDto.roomCode}`;
  }
}
