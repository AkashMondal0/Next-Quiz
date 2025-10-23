import {
  CanActivate,
  ExecutionContext,
  Injectable,
  Logger,
  UnauthorizedException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { Reflector } from '@nestjs/core';
import { Request } from 'express';
import configuration from '../configs/configuration';
import { IS_PUBLIC_KEY, ROLES_KEY } from './SetMetadata';

if (!configuration().JWT_SECRET || !configuration().COOKIE_NAME) {
  throw new Error('JWT_SECRET and COOKIE_NAME must be defined in environment variables');
}

@Injectable()
export class RestAuthGuard implements CanActivate {
  constructor(private jwtService: JwtService,
    private reflector: Reflector
  ) { }

  private extractTokenFromHeader(request: Request): string | undefined {
    if (!request.cookies || !request.cookies[configuration().COOKIE_NAME]) {
      const [type, token] = request.headers.authorization?.split(' ') ?? [];
      return type === 'Bearer' ? token : undefined;
    }
    return request.cookies[configuration().COOKIE_NAME];
  }

  async canActivate(context: ExecutionContext): Promise<boolean> {

    // if request is public, return true
    const isPublic = this.reflector.getAllAndOverride<boolean>(ROLES_KEY, [
      context.getHandler(),
      context.getClass(),
    ]);
    // if request is not public, check for token
    const request = context.switchToHttp().getRequest();
    const token = this.extractTokenFromHeader(request);

    // console.log('Extracted Token:', token, request ); // Debug log

    if (token) {
      try {
        const payload = await this.jwtService.verifyAsync(token, { secret: configuration().JWT_SECRET });
        // 💡 We're assigning the payload to the request object here
        // so that we can access it in our route handlers
        request['user'] = payload;
      } catch (error) {
        Logger.error(error);
        throw new UnauthorizedException();
      }
    }
    if (!token && !isPublic) {
      throw new UnauthorizedException();
    }
    return true;
  }
}