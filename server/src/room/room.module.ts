import { Module } from '@nestjs/common';
import { RoomService } from './room.service';
import { RoomController } from './room.controller';
import { DrizzleProvider } from 'src/lib/db/drizzle/drizzle.provider';
import { RedisProvider } from 'src/lib/db/redis/redis.provider';
import { UserService } from 'src/user/user.service';
import { AiService } from 'src/ai/ai.service';

@Module({
  controllers: [RoomController],
  providers: [RoomService, DrizzleProvider, RedisProvider, UserService, AiService],
})
export class RoomModule {}
