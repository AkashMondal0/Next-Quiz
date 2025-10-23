import { Module } from '@nestjs/common';
import { UserService } from './user.service';
import { UserController } from './user.controller';
import { DrizzleProvider } from 'src/lib/db/drizzle/drizzle.provider';
import { RedisService } from 'src/lib/db/redis/redis.service';

@Module({
  controllers: [UserController],
  providers: [UserService, DrizzleProvider, RedisService],
})
export class UserModule { }
