import { Module } from '@nestjs/common';
import { AiService } from './ai.service';
import { AiController } from './ai.controller';
import { RedisProvider } from 'src/lib/db/redis/redis.provider';

@Module({
  controllers: [AiController],
  providers: [AiService, RedisProvider],
})
export class AiModule {}
