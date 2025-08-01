import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { AuthModule } from './auth/auth.module';
import { EventModule } from './event/event.module';
import { UserModule } from './user/user.module';
import { ConfigModule } from '@nestjs/config';
import { RoomModule } from './room/room.module';
import configuration from './lib/configs/configuration';
import { DrizzleProvider } from './lib/db/drizzle/drizzle.provider';
import { AiModule } from './ai/ai.module';

@Module({
  imports: [AuthModule, EventModule, UserModule,
    ConfigModule.forRoot({
      load: [configuration],
      isGlobal: true,
      envFilePath: ['.env', '.env.development'],
    }),
    RoomModule,
    AiModule,
  ],
  controllers: [AppController],
  providers: [AppService, DrizzleProvider],
})
export class AppModule { }
