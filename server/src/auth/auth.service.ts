import { HttpException, HttpStatus, Injectable, Logger } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { RegisterUserPayload } from 'src/lib/validation/AuthZodSchema';
import { eq, or } from 'drizzle-orm';
import { DrizzleProvider } from 'src/lib/db/drizzle/drizzle.provider';
import { Request, Response } from 'express';
import { comparePassword, createHash } from 'src/lib/bcrypt/bcrypt.function';
import { AccountSchema, UserPasswordSchema, UserSchema, UserSettingsSchema } from 'src/lib/db/drizzle/drizzle.schema';
import { generateRSAKeyPair } from 'src/lib/crypto/encrypt.decrypt';
import { Author } from './entities/author.entity';
import { User } from './entities/user.entity';
import { generateRandomString } from 'src/lib/id-generator';
import configuration from 'src/lib/configs/configuration';
import { RedisService } from 'src/lib/db/redis/redis.service';

if (!configuration().COOKIE_NAME) {
  throw new Error('COOKIE_NAME must be defined in environment variables');
}

export interface SignUpAndSignInResponse {
  id: string,
  username: string,
  email: string,
  accessToken: string,
  publicKey: string,
  privateKey: string
}

@Injectable()
export class AuthService {
  constructor(
    private readonly jwtService: JwtService,
    private readonly drizzleProvider: DrizzleProvider,
    private readonly redisService: RedisService,
  ) { }

  async validateOAuthLogin(user: any): Promise<string> {
    const payload = { email: user.email, sub: user.email };
    return this.jwtService.sign(payload);
  }
  // 
  async signIn(response: Response, email: string, pass: string): Promise<SignUpAndSignInResponse | HttpException> {
    const user = await this.findUserAndPassword(email);

    if (!user || !user.password) {
      // throw error user not found
      throw new HttpException('User Not Found', HttpStatus.NOT_FOUND);
    }

    const isPasswordMatching = await comparePassword(pass, user.password);

    if (!isPasswordMatching) {
      // throw error wrong credentials
      throw new HttpException('Wrong Credentials', HttpStatus.UNAUTHORIZED);
    }

    const userinfo = {
      username: user.username,
      id: user.id,
      email: user.email,
      name: user.name,
      profilePicture: user.profilePicture,
    }

    const accessToken = await this.jwtService.signAsync(userinfo, { expiresIn: '30d' });
    await this.redisService.client.set(`chat:user:${userinfo.id}:privateKey`, user.privateKey);
    // save session to redis

    response.cookie(configuration().COOKIE_NAME, accessToken, {
      path: "/",
      maxAge: 1000 * 60 * 60 * 24 * 30,
      httpOnly: true,
      priority: "medium",
      sameSite: "lax",
      secure: true
    });
    return {
      ...userinfo,
      accessToken: accessToken,
      privateKey: user.privateKey,
      publicKey: user.publicKey,
    };
  }

  async signUp(response: Response, body: RegisterUserPayload): Promise<SignUpAndSignInResponse | HttpException> {

    const user = await this.findUserForRegister(body.email, body.username);

    if (user) {
      // throw error user not found
      throw new HttpException('User Already Registered', HttpStatus.BAD_REQUEST);
    }

    const newUser = await this.createUser(body);

    if (!newUser) {
      // throw error user not found
      throw new HttpException('Failed to create user', HttpStatus.INTERNAL_SERVER_ERROR);
    }

    const userinfo = {
      username: newUser.username,
      email: newUser.email,
      name: newUser.name,
      id: newUser.id,
      profilePicture: newUser.profilePicture,
    }
    const accessToken = await this.jwtService.signAsync(userinfo, { expiresIn: '30d' });
    await this.redisService.client.set(`chat:user:${userinfo.id}:privateKey`, newUser.privateKey);
    // save session to redis

    response.cookie(configuration().COOKIE_NAME, accessToken, {
      path: '/',
      maxAge: 1000 * 60 * 60 * 24 * 30,
      httpOnly: true,
      priority: "medium",
      sameSite: "lax",
      secure: true
    })

    return {
      ...userinfo,
      accessToken: accessToken,
      privateKey: newUser.privateKey,
      publicKey: newUser.publicKey,
    }
  }

  async signOut(request: Request, response: Response, session: Author): Promise<any | HttpException> {

    // this.redisProvider.client.del(`notification:${session.id}`);
    for (const [key] of Object.entries(request.cookies)) {
      response.clearCookie(key)
    }
    return response.send("Logged Out Successfully")
  }

  async googleOAuthLogin(user: {
    email: string
    firstName: string
    lastName: string
    picture: string
  }): Promise<User & {
    accessToken: string
  } | null> {

    const findUser = await this.findUserAndPassword(user.email);

    if (!findUser) {
      // register the user
      const newUser = await this.createUser({
        email: user.email,
        name: `${user.firstName} ${user.lastName}`,
        username: user.email.split('@')[0],
        password: generateRandomString(12, 'uppernumeric'),
      });

      if (!newUser) {
        throw new HttpException('Failed to create user', HttpStatus.INTERNAL_SERVER_ERROR);
      }

      const userinfo = {
        username: newUser.username,
        email: newUser.email,
        name: newUser.name,
        id: newUser.id,
        profilePicture: newUser?.profilePicture,
      }

      const accessToken = await this.jwtService.signAsync(userinfo, { expiresIn: '30d' });
      await this.redisService.client.set(`chat:user:${userinfo.id}:privateKey`, newUser.privateKey);

      return { ...newUser, accessToken };
    }
    const userinfo = {
      username: findUser.username,
      email: findUser.email,
      name: findUser.name,
      id: findUser.id,
      bio: findUser.bio ?? "",
      website: findUser.website ?? [],
      profilePicture: findUser?.profilePicture,
    }
    const accessToken = await this.jwtService.signAsync(userinfo, { expiresIn: '30d' });

    return { ...findUser, accessToken };
  }

  async findUserAndPassword(email: string): Promise<{
    id: string,
    username: string,
    email: string,
    name: string,
    password: string | null,
    hash: string | null,
    bio: string,
    website: string[],
    profilePicture: string
    privateKey: string,
    publicKey: string
  } | null> {
    try {
      const user = await this.drizzleProvider.db.select({
        id: UserSchema.id,
        username: UserSchema.username,
        name: UserSchema.name,
        email: UserSchema.email,
        password: UserPasswordSchema.password,
        hash: UserPasswordSchema.hash,
        profilePicture: UserSchema.profilePicture,
        bio: UserSchema.bio,
        website: UserSchema.website,
        publicKey: UserSchema.publicKey,
        privateKey: AccountSchema.privateKey,
      })
        .from(UserSchema)
        .leftJoin(UserPasswordSchema, eq(UserSchema.id, UserPasswordSchema.id))
        .leftJoin(AccountSchema, eq(UserSchema.id, AccountSchema.id))
        .where(or(eq(UserSchema.email, email), eq(UserSchema.username, email)))
        .limit(1)

      if (!user[0] || !user[0].password) {
        return null;
      }

      return user[0] as any
    } catch (error) {
      Logger.error(`findUserAndPassword Error:`, error)
      return null;
    }
  }

  async findUserForRegister(email: string, username: string): Promise<{
    id: string,
    username: string,
    email: string,
  } | null> {
    try {
      const user = await this.drizzleProvider.db.select({
        id: UserSchema.id,
        username: UserSchema.username,
        email: UserSchema.email,
      })
        .from(UserSchema)
        .where(or(
          eq(UserSchema.email, email),
          eq(UserSchema.username, username)
        ))
        .limit(1)

      if (!user[0]) {
        return null;
      }
      return user[0] as any;
    } catch (error) {
      Logger.error(`findUser Error:`, error)
      return null;
    }
  }

  async createUser(userCredential: RegisterUserPayload): Promise<User | null> {
    const hashPassword = await createHash(userCredential.password);
    const { publicKey, privateKey } = generateRSAKeyPair();
    try {
      const newUser = await this.drizzleProvider.db.insert(UserSchema).values({
        username: userCredential.username,
        name: userCredential.name,
        email: userCredential.email,
        publicKey: publicKey
      }).returning({
        id: UserSchema.id,
        username: UserSchema.username,
        name: UserSchema.name,
        email: UserSchema.email,
        profilePicture: UserSchema.profilePicture,
        bio: UserSchema.bio,
        lastStatusUpdate: UserSchema.lastStatusUpdate,
        website: UserSchema.website,
        publicKey: UserSchema.publicKey
      })

      await this.drizzleProvider.db.insert(AccountSchema).values({
        id: newUser[0].id,
        privateKey: privateKey,
      });

      await this.drizzleProvider.db.insert(UserPasswordSchema).values({
        id: newUser[0].id,
        password: hashPassword,
        hash: hashPassword
      });

      await this.drizzleProvider.db.insert(UserSettingsSchema).values({
        id: newUser[0].id,
      });

      // const aName = userCredential.name?.trim().length ? userCredential.name.trim() : userCredential.username;
      // await this.drizzleProvider.db.insert(ChannelSchema).values({
      //   // id: `@${aName.replace(/\s+/g, '').toLowerCase()}-${generateRandomString(6, 'lowernumeric')}`,
      //   avatarUrl: userCredential.profilePicture || "",
      //   name: aName,
      //   userId: newUser[0].id,
      // });

      if (!newUser[0].id) {
        return null;
      };

      return { ...newUser[0], privateKey } as any;
    } catch (error) {
      Logger.error(`createUser Error:`, error)
      return null
    }
  }

  async passwordReset() {
    // to be implemented
  }
}