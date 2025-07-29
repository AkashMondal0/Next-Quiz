import { Module } from '@nestjs/common';
import { AuthService } from './auth.service';
import { PassportModule } from '@nestjs/passport';
import { JwtModule } from '@nestjs/jwt';
import { AuthController } from './auth.controller';
import { RedisModule } from 'src/lib/db/redis/redis.module';
import configuration from 'src/lib/configs/configuration';
import { LocalStrategy } from 'src/lib/strategy/local.strategy';
import { JwtStrategy } from 'src/lib/strategy/jwt.strategy';
import { DrizzleProvider } from 'src/lib/db/drizzle/drizzle.provider';

@Module({
  imports: [
    PassportModule,
    RedisModule,
    JwtModule.register({
      global: true,
      secret: configuration().JWT_SECRET,
      signOptions: { expiresIn: "30d" },
    }),
  ],
  controllers: [AuthController],
  providers: [AuthService, LocalStrategy, JwtStrategy, DrizzleProvider],
  exports: [AuthService],
})
export class AuthModule { }