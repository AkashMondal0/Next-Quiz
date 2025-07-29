import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { AuthModule } from './auth/auth.module';
import { EventModule } from './event/event.module';
import { UserModule } from './user/user.module';
import { ConfigModule } from '@nestjs/config';
import configuration from './lib/configs/configuration';

@Module({
  imports: [AuthModule, EventModule, UserModule,
    ConfigModule.forRoot({
      load: [configuration],
      isGlobal: true,
      envFilePath: ['.env', '.env.development'],
    }),
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule { }
