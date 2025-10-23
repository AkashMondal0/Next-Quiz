import Redis from 'ioredis';

const url = process.env.REDIS_URL;
if (!url) throw new Error("REDIS_URL is not defined in .env file");

export const RedisProvider = new Redis(url as string)
    .on('connect', () => {
        console.log('🚀 Redis client connected');
    })
    .on('error', (err) => {
        console.error('Redis client error', err);
        process.exit(1);
    });