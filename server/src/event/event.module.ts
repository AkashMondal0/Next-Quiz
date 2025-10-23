import { Module } from '@nestjs/common';
import { EventService } from './event.service';
import { EventGateway } from './event.gateway';
import { RedisService } from 'src/lib/db/redis/redis.service';

@Module({
  providers: [EventGateway, EventService, RedisService],
})
export class EventModule { }
