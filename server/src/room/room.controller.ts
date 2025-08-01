import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { RoomService } from './room.service';
import { QuizPrompt, TemporaryUser } from 'src/lib/types';

@Controller('room')
export class RoomController {
  constructor(private readonly roomService: RoomService) { }

  @Post('/matchmaking')
  async handleMatchRequest(@Body() body: { user: TemporaryUser; level: number, roomSize: number, prompt: QuizPrompt }) {
    await this.roomService.addUser(body.user); // ✅ cache first
    return this.roomService.findOrCreateMatch(body.user, body.level, body.roomSize, body.prompt);
  }

  @Post('/cancel-matchmaking')
  async cancelMatchmaking(@Body() body: { user: TemporaryUser; level: number, roomSize: number }) {
    await this.roomService.cancelMatchmaking(body.user, body.level, body.roomSize);
    return { status: 'cancelled' };
  }

  @Get('/:id')
  async getRoomById(@Param('id') id: string) {
    const room = await this.roomService.getRoomById(id);
    if (!room) {
      return { status: 'not_found' };
    }
    return room;
  }

  @Post('/add-user')
  async addUserToRoom(@Body() body: { user: TemporaryUser }) {
    const result = await this.roomService.addUser(body.user);
    return result;
  }
}
