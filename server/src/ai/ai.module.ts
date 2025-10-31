import { Module } from '@nestjs/common';
import { AiService } from './ai.service';
import { AiController } from './ai.controller';
import { RedisService } from 'src/lib/db/redis/redis.service';

@Module({
  controllers: [AiController],
  providers: [AiService, RedisService],
})
export class AiModule {}
