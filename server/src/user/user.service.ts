import { Injectable } from '@nestjs/common';
import { DrizzleProvider } from 'src/lib/db/drizzle/drizzle.provider';
import { UserSchema } from 'src/lib/db/drizzle/drizzle.schema';
import { inArray } from 'drizzle-orm';
import { TemporaryUser } from 'src/lib/types';
import { RedisProvider } from 'src/lib/db/redis/redis.provider';

@Injectable()
export class UserService {
  constructor(
    private readonly drizzleProvider: DrizzleProvider,
    private readonly redisProvider: RedisProvider,
  ) { }
  
  async getUsersByIds(ids: number[]): Promise<TemporaryUser[]> {
    if (!ids.length) return [];

    const pipeline = this.redisProvider.client.multi();
    const keys = ids.map(id => `user:${id}`);

    for (const key of keys) {
      pipeline.hgetall(key);
    }

    const rawResults = await pipeline.exec();

    if (!rawResults) return [];

    const users: TemporaryUser[] = [];

    rawResults.forEach((result, index) => {
      const [err, data] = result as [Error | null, Record<string, string>];

      if (!err && data && data.id && data.username) {
        users.push({
          id: Number(data.id),
          username: data.username,
          avatar: data.avatar,
        });
      }
    });

    return users;
  }
  async cacheUser(user: TemporaryUser): Promise<void> {
    const userKey = `user:${user.id}`;
    await this.redisProvider.client.hset(userKey, {
      id: user.id.toString(),
      username: user.username,
      avatar: user.avatar,
    });
  }
  async cacheUsers(users: TemporaryUser[]): Promise<void> {
    const pipeline = this.redisProvider.client.multi();

    for (const user of users) {
      const userKey = `user:${user.id}`;
      pipeline.hset(userKey, {
        id: user.id.toString(),
        username: user.username,
        avatar: user.avatar,
      });
    }

    await pipeline.exec();
  }

}
