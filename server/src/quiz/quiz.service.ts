import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { RedisService } from 'src/lib/db/redis/redis.service';
import { CreateQuizPayload, JoinRoomDto, RoomSession, SubmitQuizDto } from './entities/quiz.entity';
import { EventService } from 'src/event/event.service';
import { EventGateway } from 'src/event/event.gateway';
import { AiService } from 'src/ai/ai.service';

@Injectable()
export class QuizService {
  constructor(private readonly redisService: RedisService,
    private readonly aiService: AiService,
    private readonly eventGateway: EventGateway,
  ) { }

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
        members: [createQuizDto.player.id],
        hostId: createQuizDto.hostId,
        players: [createQuizDto.player],
        createdAt: new Date().toISOString(),
        status: 'waiting',
        code: roomCode,
        readyPlayers: [],
        questions: [],
        prompt: createQuizDto.prompt,
        participantLimit: createQuizDto.participantLimit,
        difficulty: createQuizDto.difficulty,
        duration: createQuizDto.duration,
        numberOfQuestions: createQuizDto.numberOfQuestions,
        matchResults: [
          {
            id: createQuizDto.player.id,
            username: createQuizDto.player.username,
            isSubmitted: false,
            userAnswers: {},
            score: 0,
            timeTaken: 0,
            correctAnswers: 0,
            wrongAnswers: 0,
            totalQuestions: 0,
          }
        ],
        matchStarted: false,
        matchEnded: false,
        matchDuration: createQuizDto.duration,
        matchRanking: [
          {
            id: createQuizDto.hostId,
            score: 0,
            username: createQuizDto.player.username,
            rank: 0,
            answered: 0,
          }
        ],
      };
      // Store the room in Redis
      await this.redisService.client.set(`room:${roomCode}`, JSON.stringify(room));
      // Trigger prompt data generation
      await this.aiService.generateMainData(roomCode, {
        topic: createQuizDto.prompt,
        numberOfQuestions: createQuizDto.numberOfQuestions,
        difficulty: createQuizDto.difficulty,
        matchDuration: createQuizDto.duration,
      });
      return room;
    } catch (error) {
      throw new HttpException("Internal Server Error", HttpStatus.INTERNAL_SERVER_ERROR)
    }
  }

  async kickPlayer(joinRoomDto: JoinRoomDto) {
    try {
      const roomData = await this.redisService.client.get(`room:${joinRoomDto.roomCode}`);
      if (!roomData) {
        throw new HttpException("Room not found", HttpStatus.NOT_FOUND);
      }
      const room: RoomSession = JSON.parse(roomData);
      // Remove player from room
      room.players = room.players.filter(player => player.id !== joinRoomDto.player.id);
      room.members = room.members.filter(id => id !== joinRoomDto.player.id);
      room.matchRanking = room.matchRanking.filter(ranking => ranking.id !== joinRoomDto.player.id);
      // Update room in Redis
      await this.redisService.client.set(`room:${joinRoomDto.roomCode}`, JSON.stringify(room));
      const members = room.members;
      // publish room update event
      await this.eventGateway.kickUser(joinRoomDto.player.id, members);
      return room;
    } catch (error) {
      console.error(error);
      throw new HttpException("Internal Server Error", HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }

  async joinRoom(joinRoomDto: JoinRoomDto) {
    try {
      const roomData = await this.redisService.client.get(`room:${joinRoomDto.roomCode}`);
      if (!roomData) {
        throw new HttpException("Room not found", HttpStatus.NOT_FOUND);
      }
      const room: RoomSession = JSON.parse(roomData);
      // Check if room is full
      if (room.players.length >= room.participantLimit) {
        throw new HttpException("Room is full", HttpStatus.FORBIDDEN);
      }
      // Add player to room
      room.players.push({
        id: joinRoomDto.player.id,
        username: joinRoomDto.player.username,
        avatar: joinRoomDto.player.avatar,
        isHost: joinRoomDto.player.id === room.hostId,
        isReady: false,
      });

      room.matchRanking.push({
        id: joinRoomDto.player.id,
        score: 0,
        username: joinRoomDto.player.username,
        rank: 0,
        answered: 0,
      });

      room.matchResults.push({
        id: joinRoomDto.player.id,
        username: joinRoomDto.player.username,
        userAnswers: {},
        score: 0,
        timeTaken: 0,
        correctAnswers: 0,
        wrongAnswers: 0,
        totalQuestions: 0,
        isSubmitted: false,
      });

      room.members.push(joinRoomDto.player.id);

      // Update room in Redis
      await this.redisService.client.set(`room:${joinRoomDto.roomCode}`, JSON.stringify(room));
      const members = room.members.filter(id => id !== joinRoomDto.player.id);
      // publish room update event
      await this.eventGateway.joinUser(joinRoomDto.player, members);
      return room;
    } catch (error) {
      console.error(error);
      throw new HttpException("Internal Server Error", HttpStatus.INTERNAL_SERVER_ERROR)
    }
  }

  async leaveRoom(joinRoomDto: JoinRoomDto) {
    try {
      const roomData = await this.redisService.client.get(`room:${joinRoomDto.roomCode}`);
      if (!roomData) {
        throw new HttpException("Room not found", HttpStatus.NOT_FOUND);
      }
      const room: RoomSession = JSON.parse(roomData);
      // Remove player from room
      room.players = room.players.filter(player => player.id !== joinRoomDto.player.id);
      room.members = room.members.filter(id => id !== joinRoomDto.player.id);
      room.matchRanking = room.matchRanking.filter(ranking => ranking.id !== joinRoomDto.player.id);
      // Update room in Redis
      await this.redisService.client.set(`room:${joinRoomDto.roomCode}`, JSON.stringify(room));
      const members = room.members;
      // publish room update event
      await this.eventGateway.leaveUser(joinRoomDto.player.id, members);
      return room;
    } catch (error) {
      console.error(error);
      throw new HttpException("Internal Server Error", HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }

  async getRoomResult(joinRoomDto: JoinRoomDto) {
    return `This action gets results for room with code: ${joinRoomDto.roomCode}`;
  }

  async submitQuiz(id: string, submitDto: SubmitQuizDto) {
    try {
      const roomData = await this.redisService.client.get(`room:${id}`);
      if (!roomData) {
        throw new HttpException("Room not found", HttpStatus.NOT_FOUND);
      }
      const room: RoomSession = JSON.parse(roomData) as RoomSession;
      room.matchResults = room.matchResults.map(result => {
        if (result.id === submitDto.id) {
          return {
            ...result,
            score: submitDto.score,
            timeTaken: submitDto.timeTaken,
            correctAnswers: submitDto.correctAnswers,
            wrongAnswers: submitDto.wrongAnswers,
            totalQuestions: submitDto.totalQuestions,
            userAnswers: submitDto.userAnswers,
            isSubmitted: true,
          };
        }
        return result;
      });
      // Update room in Redis
      await this.redisService.client.set(`room:${id}`, JSON.stringify(room));
      const members = room.players.map(player => player.id).filter(pid => pid !== submitDto.id);
      // publish room update event
      await this.eventGateway.submitQuiz(members, room.matchResults);
      return { message: "Quiz submitted successfully" };
    } catch (error) {
      console.error(error);
      throw new HttpException("Internal Server Error", HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }
}
