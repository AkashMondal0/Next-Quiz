import Redis from 'ioredis';
import configuration from 'src/lib/configs/configuration';

const url = configuration().REDIS_URL;

if (!url) {
  throw new Error('REDIS_URL must be defined in environment variables');
}
export const RedisProvider = new Redis(url as string)
    .on('connect', () => {
        console.log('🚀 Redis client connected');
    })
    .on('error', (err) => {
        console.error('Redis client error', err);
        process.exit(1);
    });