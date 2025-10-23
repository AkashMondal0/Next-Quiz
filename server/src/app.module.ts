import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { AuthModule } from './auth/auth.module';
import { EventModule } from './event/event.module';
import { UserModule } from './user/user.module';
import { ConfigModule } from '@nestjs/config';
import configuration from './lib/configs/configuration';
import { DrizzleProvider } from './lib/db/drizzle/drizzle.provider';
import { AiModule } from './ai/ai.module';
import { ThrottlerModule } from '@nestjs/throttler';

@Module({
  imports: [
    ConfigModule.forRoot({
      load: [configuration],
      isGlobal: true,
      envFilePath: ['.env', '.env.development'],
    }),
    ThrottlerModule.forRoot([{ ttl: 60000, limit: 10 }]),
    AuthModule,
    EventModule,
    UserModule,
    AiModule,
  ],
  controllers: [AppController],
  providers: [AppService, DrizzleProvider],
})
export class AppModule { }
