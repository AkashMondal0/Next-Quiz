import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { QuizService } from './quiz.service';
import { CreateQuizPayload, JoinRoomDto, SubmitQuizDto } from './entities/quiz.entity';

@Controller('quiz')
export class QuizController {
  constructor(private readonly quizService: QuizService) { }

  @Post('room/create')
  createRoomAndQuiz(@Body() createQuizDto: CreateQuizPayload) {
    return this.quizService.createQuiz(createQuizDto);
  }

  @Get('room/:id')
  getRoomAndQuiz(@Param('id') id: string) {
    return this.quizService.getRoomAndQuiz(id);
  }

  @Post('room/join')
  joinRoom(@Body() joinRoomDto: JoinRoomDto) {
    return this.quizService.joinRoom(joinRoomDto);
  }

  @Post('room/leave')
  leaveRoom(@Body() joinRoomDto: JoinRoomDto) {
    return this.quizService.leaveRoom(joinRoomDto);
  }

  @Post('room/kick')
  kickPlayer(@Body() joinRoomDto: JoinRoomDto) {
    return this.quizService.kickPlayer(joinRoomDto);
  }

  @Post('room/result')
  getRoomResult(@Body() joinRoomDto: JoinRoomDto) {
    return this.quizService.getRoomResult(joinRoomDto);
  }

  @Post('submit/:id')
  submitQuiz(@Param('id') id: string, @Body() submitDto: SubmitQuizDto) {
    return this.quizService.submitQuiz(id, submitDto);
  }
}
