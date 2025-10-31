import { Module } from '@nestjs/common';
import { QuizService } from './quiz.service';
import { QuizController } from './quiz.controller';
import { RedisService } from 'src/lib/db/redis/redis.service';
import { EventModule } from 'src/event/event.module';
import { EventGateway } from 'src/event/event.gateway';
import { AiService } from 'src/ai/ai.service';

@Module({
  imports: [EventModule],
  controllers: [QuizController],
  providers: [QuizService, RedisService, AiService, EventGateway],
})
export class QuizModule {}
