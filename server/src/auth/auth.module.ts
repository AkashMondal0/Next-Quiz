import { Module } from '@nestjs/common';
import { AuthService } from './auth.service';
import { PassportModule } from '@nestjs/passport';
import { JwtModule } from '@nestjs/jwt';
import { AuthController } from './auth.controller';
import configuration from 'src/lib/configs/configuration';
import { LocalStrategy } from 'src/lib/strategy/local.strategy';
import { JwtStrategy } from 'src/lib/strategy/jwt.strategy';
import { DrizzleProvider } from 'src/lib/db/drizzle/drizzle.provider';
import { GoogleStrategy } from 'src/lib/strategy/google.strategy';
import { RedisService } from 'src/lib/db/redis/redis.service';

@Module({
  imports: [
    PassportModule.register({ session: false }),
    JwtModule.register({
      global: true,
      secret: configuration().JWT_SECRET,
      signOptions: { expiresIn: "30d" },
    }),
  ],
  controllers: [AuthController],
  providers: [AuthService, LocalStrategy, JwtStrategy, DrizzleProvider, GoogleStrategy, RedisService],
  exports: [AuthService],
})
export class AuthModule { }