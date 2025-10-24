import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { VersioningType } from '@nestjs/common';
import { Logger } from '@nestjs/common';
import { RedisIoAdapter } from './lib/db/redis/RedisIoAdapter';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  app.enableVersioning({
    type: VersioningType.URI,
    defaultVersion: ['1']
  });

  app.enableCors({
    origin: true,
    credentials: true,
    exposedHeaders: ["set-cookie"],
    methods: "GET,HEAD,PUT,PATCH,POST,DELETE,OPTIONS"
  });

  app.setGlobalPrefix('api');
  const redisIoAdapter = new RedisIoAdapter(app);
  await redisIoAdapter.connectToRedis();

  app.useWebSocketAdapter(redisIoAdapter);

  await app.listen(process.env.PORT ?? 4000, "0.0.0.0");

  Logger.log(`Server is running on: http://localhost:${process.env.PORT ?? 4000}/api/v1`);
}
bootstrap();
