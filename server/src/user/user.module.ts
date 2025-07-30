import { Module } from '@nestjs/common';
import { UserService } from './user.service';
import { UserController } from './user.controller';
import { DrizzleProvider } from 'src/lib/db/drizzle/drizzle.provider';
import { RedisProvider } from 'src/lib/db/redis/redis.provider';

@Module({
  controllers: [UserController],
  providers: [UserService, DrizzleProvider, RedisProvider],
})
export class UserModule { }
