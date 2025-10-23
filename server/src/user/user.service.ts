import { Injectable, Logger } from '@nestjs/common';
import { like, or } from 'drizzle-orm';
import { dataParser } from 'src/lib/dataParser';
import { DrizzleProvider } from 'src/lib/db/drizzle/drizzle.provider';
import { UserSchema } from 'src/lib/db/drizzle/drizzle.schema';
import { RedisService } from 'src/lib/db/redis/redis.service';

@Injectable()
export class UserService {
  constructor(
    private readonly redisService: RedisService,
    private readonly drizzleProvider: DrizzleProvider,
  ) { }
  getHello(): string {
    return 'Hello World!';
  }

  async getUserByKeyword(userKeyword: string) {
    try {
      const keywordForUsername = userKeyword.toLowerCase().trim();
      const keywordForName = userKeyword.trim();
      const searchKey = `search:users:${keywordForUsername + keywordForName}`;

      let results = await this.redisService.client.get(searchKey);
      if (results) {
        return dataParser(results);
      }

      const data = await this.drizzleProvider.db.select({
        id: UserSchema.id,
        username: UserSchema.username,
        email: UserSchema.email,
        name: UserSchema.name,
        profilePicture: UserSchema.profilePicture,
        bio: UserSchema.bio,
        website: UserSchema.website,
        publicKey: UserSchema.publicKey,
      }).from(UserSchema).where(
        or(
          like(UserSchema.username, `%${keywordForUsername}%`),
          like(UserSchema.name, `%${keywordForName}%`)
        )
      ).limit(20)

      if (data.length <= 0 || !data[0].id) {
        return [];
      }
      await this.redisService.client.set(searchKey, JSON.stringify(data), 'EX', 60); // short TTL
      return data;
    } catch (error) {
      Logger.error(error)
      return [];
    }
  }
}
