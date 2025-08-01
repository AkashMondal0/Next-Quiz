import { Injectable } from '@nestjs/common';
import { RedisProvider } from 'src/lib/db/redis/redis.provider';

@Injectable()
export class AiService {
  constructor(
    private readonly redis: RedisProvider,
  ) { }
  async generateMainData(roomId: string): Promise<void> {
    const mainData = {message: 'Generated main data for room', roomId};
    // save the generated data to Redis or database
    const key = `room:${roomId}`;
    const existingData = await this.redis.client.get(key);
    const updatedData = existingData ? JSON.parse(existingData) : {};
    updatedData.main_data = mainData;
    await this.redis.client.set(key, JSON.stringify(updatedData));
  }
}
