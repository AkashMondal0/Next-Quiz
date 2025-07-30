import { Module } from '@nestjs/common';
import { EventService } from './event.service';
import { EventGateway } from './event.gateway';
import { UserService } from 'src/user/user.service';
import { RoomService } from 'src/room/room.service';
import { DrizzleProvider } from 'src/lib/db/drizzle/drizzle.provider';
import { RedisProvider } from 'src/lib/db/redis/redis.provider';

@Module({
  providers: [EventGateway, EventService, UserService, RoomService,DrizzleProvider, RedisProvider],
})
export class EventModule { }
