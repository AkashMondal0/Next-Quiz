import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { EventModule } from './event/event.module';
import { ConfigModule } from '@nestjs/config';
import configuration from './lib/configs/configuration';
import { AiModule } from './ai/ai.module';
import { ThrottlerModule } from '@nestjs/throttler';
import { QuizModule } from './quiz/quiz.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      load: [configuration],
      isGlobal: true,
      envFilePath: ['.env', '.env.development'],
    }),
    ThrottlerModule.forRoot([{ ttl: 60000, limit: 10 }]),
    EventModule,
    AiModule,
    QuizModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule { }
