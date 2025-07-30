import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { VersioningType } from '@nestjs/common';
import { Logger } from '@nestjs/common';
import configuration from './lib/configs/configuration';

const envs = configuration();

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  app.enableVersioning({
    type: VersioningType.URI,
    defaultVersion: ['1']
  });

  app.enableCors({
    origin: true,
    credentials: true,
    exposedHeaders: ["set-cookie"]
  });

  app.setGlobalPrefix('api');

  await app.listen(process.env.PORT ?? 5000, "0.0.0.0");
  for (const key in envs) {
    const element = envs[key];
    if (!element) {
      Logger.error(`[ENV] ${key}: ❌`)
    } else {
      Logger.log(`[ENV] ${key}: ${element} ✅`)
    }
  }
  Logger.log(`Server is running on: http://localhost:${process.env.PORT ?? 5000}/api/v1`);
}
bootstrap();
