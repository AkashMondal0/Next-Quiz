import Redis from 'ioredis';
import { Injectable } from '@nestjs/common';
import { RedisProvider } from './redis.provider';

@Injectable()
export class RedisService {
    client: Redis = RedisProvider;
}
