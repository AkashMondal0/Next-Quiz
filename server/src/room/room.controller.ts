import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { RoomService } from './room.service';
import { QuizPrompt, TemporaryUser } from 'src/lib/types';

@Controller('room')
export class RoomController {
  constructor(private readonly roomService: RoomService) { }

  @Post('/matchmaking')
  async handleMatchRequest(@Body() body: { user: TemporaryUser; level: number, roomSize: number, prompt: QuizPrompt }) {
    await this.roomService.addUser(body.user);
    return this.roomService.findOrCreateMatch(body.user, body.level, body.roomSize, body.prompt);
  }

  @Post('/cancel-matchmaking')
  async cancelMatchmaking(@Body() body: { user: TemporaryUser; level: number, roomSize: number }) {
    await this.roomService.cancelMatchmaking(body.user, body.level, body.roomSize);
    return { status: 'cancelled' };
  }

  @Get('/:id')
  async getRoomById(@Param('id') id: string) {
    return await this.roomService.getRoomByCode(id);
  }

  @Post('/custom')
  async createCustomRoom(@Body() body: { user: TemporaryUser; prompt: QuizPrompt }) {
    return await this.roomService.createCustomRoom(body.user, body.prompt);
  }

  @Post('/custom-join/:code')
  async getRoomByCode(@Param('code') code: string,@Body() body: { user: TemporaryUser,}) {
    return await this.roomService.joinRoomByCode(code, body.user);
  }

  @Post('/custom-leave/:code')
  async leaveRoom(@Param('code') code: string, @Body() body: { user: TemporaryUser }) {
    return await this.roomService.leaveRoom(code, body.user);
  }

  @Post('/add-user')
  async addUserToRoom(@Body() body: { user: TemporaryUser }) {
    const result = await this.roomService.addUser(body.user);
    return result;
  }
}
