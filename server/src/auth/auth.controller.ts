import { Body, Controller, Post, UseGuards, Get, Version, UsePipes, Req, Res, HttpException, HttpStatus, Redirect, Delete, } from '@nestjs/common';
import { AuthService } from './auth.service';
import { Response, Request } from 'express';
import { LoginUserPayload, LoginUserSchema, RegisterUserPayload, RegisterUserSchema } from 'src/lib/validation/AuthZodSchema';
import { ZodValidationPipe } from 'src/lib/validation/Validation';
import { RestApiSessionUser } from 'src/lib/decorator/session.decorator';
import { Author } from './entities/author.entity';
import { AuthGuard } from '@nestjs/passport';
import configuration from 'src/lib/configs/configuration';
import { RestAuthGuard } from 'src/lib/guard/RestAuth.guard';

@Controller({
  path: 'auth',
  version: ['1']
})

export class AuthController {
  constructor(private authService: AuthService) { }

  @Version('1')
  @Post('login')
  @UsePipes(new ZodValidationPipe(LoginUserSchema))
  async signIn(@Body() body: LoginUserPayload, @Res({ passthrough: true }) response: Response) {
    return this.authService.signIn(response, body.email, body.password);
  }

  @Version('1')
  @Post('register')
  @UsePipes(new ZodValidationPipe(RegisterUserSchema))
  async signUp(@Body() body: RegisterUserPayload, @Res({ passthrough: true }) response: Response) {
    return this.authService.signUp(response, body);
  }

  @Version('1')
  @Delete('logout')
  @UseGuards(RestAuthGuard)
  async signOut(@RestApiSessionUser() session: Author, @Req() request: Request, @Res({ passthrough: true }) response: Response) {
    return this.authService.signOut(request, response, session);
  }

  @Version('1')
  @Get('session')
  @UseGuards(RestAuthGuard)
  getProfile(@RestApiSessionUser() user: Author) {
    return {
      id: user.id,
      username: user.username,
      email: user.email,
      name: user.name,
      profilePicture: user.profilePicture,
    };
  }

  @Version('1')
  @Get('google')
  @UseGuards(AuthGuard('google'))
  async googleAuth(@Req() req: Request) {
    // Initiates Google Auth request
  }

  @Version('1')
  @Get('google/callback')
  @UseGuards(AuthGuard('google'))
  async googleAuthRedirect(@Req() req: Request, @Res() res: Response) {
    if (!req.user) {
      throw new HttpException('User Not Found', HttpStatus.NOT_FOUND);
    }
    const user = await this.authService.googleOAuthLogin(req.user as any);

    if (!user?.accessToken) {
      return res.redirect(301, 'http://localhost:3000/login?error=oauth');
    }

    res.cookie(configuration().COOKIE_NAME, user?.accessToken, {
      path: "/",
      maxAge: 1000 * 60 * 60 * 24 * 30,
      httpOnly: true,
      priority: "medium",
      sameSite: "lax",
      secure: true
    });

    return res.redirect(301, 'http://localhost:3000');
  }
}