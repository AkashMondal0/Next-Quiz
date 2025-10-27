import { Module } from '@nestjs/common';
import { QuizService } from './quiz.service';
import { QuizController } from './quiz.controller';
import { RedisService } from 'src/lib/db/redis/redis.service';

@Module({
  controllers: [QuizController],
  providers: [QuizService, RedisService],
})
export class QuizModule {}
