import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { RoomService } from './room.service';
import { QuizAnswerRequest, QuizPrompt, TemporaryUser } from 'src/lib/types';

@Controller('room')
export class RoomController {
  constructor(private readonly roomService: RoomService) { }

  @Get('/:id')
  async getRoomById(@Param('id') id: string) {
    return await this.roomService.getRoomByCode(id);
  }

  @Post('/custom')
  async createCustomRoom(@Body() body: { user: TemporaryUser; prompt: QuizPrompt }) {
    return await this.roomService.createCustomRoom(body.user, body.prompt);
  }

  @Post('/custom-join/:code')
  async getRoomByCode(@Param('code') code: string, @Body() body: { user: TemporaryUser, }) {
    return await this.roomService.joinRoomByCode(code, body.user);
  }

  @Post('/custom-leave/:code')
  async leaveRoom(@Param('code') code: string, @Body() body: { user: TemporaryUser }) {
    return await this.roomService.leaveRoom(code, body.user);
  }

  @Post('/submit-answers')
  async submitRoom(@Body() body: QuizAnswerRequest) {
    return await this.roomService.submitRoom(body);
  }
}
