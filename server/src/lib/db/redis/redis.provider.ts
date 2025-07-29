import { Injectable, OnModuleInit } from '@nestjs/common';
import Redis from 'ioredis';
import configuration from 'src/lib/configs/configuration';

const url = configuration().REDIS_URL;
if (!url) throw new Error("REDIS_URL is not defined in .env file");
@Injectable()
export class RedisProvider implements OnModuleInit {
    client: Redis;
    async onModuleInit() {
        this.client = new Redis(url as string);
    }
}