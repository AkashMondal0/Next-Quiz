import { Injectable, Logger } from '@nestjs/common';
import { Server, Socket } from 'socket.io';
import { RedisService } from 'src/lib/db/redis/redis.service';
import { Player } from 'src/quiz/entities/quiz.entity';

@Injectable()
export class EventService {
  server: Server;
  private KeyName: string = "SOCKET:CLIENTS";
  constructor(
    private readonly redisService: RedisService,
  ) { }

  setSocket(server: Server) {
    this.server = server;
  }

  extractUserIdAndName(client: Socket): { id: string, username: string, profilePicture?: string } | null {
    const id = client.handshake.query.id as string;
    const username = client.handshake.query.username as string;
    const profilePicture = client.handshake.query.profilePicture as string;
    if (!id || !username) {
      Logger.warn('User ID or username not found in handshake query');
      client.disconnect();
      return null;
    }
    return { id, username, profilePicture };
  }

  async getUserIdBySocketId(userId?: string): Promise<string | null> {
    if (typeof userId !== 'string') return null;
    const socketId = await this.redisService.client.hget(this.KeyName, userId);
    if (!socketId && typeof socketId !== 'string') return null;
    return socketId;
  }

  async findSocketIdsByUsersIds(userIds?: string[]): Promise<string[] | null> {
    if (!userIds?.length) return null;
    const ids = await Promise.all(userIds.map(userId => this.redisService.client.hget(this.KeyName, userId)));
    return ids.filter(Boolean) as string[] | null;
  }

  async handleConnection(client: Socket) {
    const userId = this.extractUserIdAndName(client)?.id;
    if (userId) await this.redisService.client.hset(this.KeyName, userId, client.id);
  }

  async handleDisconnect(client: Socket) {
    const userId = this.extractUserIdAndName(client)?.id;
    if (!userId) return;
    await this.redisService.client.hdel(this.KeyName, userId);
  }

  async handleMessage(data: {
    userId: string,
    message: string,
  }) {
    if (!data.userId) return;
    const socketId = await this.getUserIdBySocketId(data.userId);
    if (!socketId) return;
    this.server.to(socketId).emit("message", data.message);
  }

  async joinUser(player: Player, members: string[]) {
    if (!members.length) return;
    const socketIds = await this.findSocketIdsByUsersIds(members);
    if (!socketIds?.length) return;
    this.server.to(socketIds).emit("user-joined", player);
  }

  async leaveUser(playerId: string, members: string[]) {
    if (!members.length) return;
    const socketIds = await this.findSocketIdsByUsersIds(members);
    if (!socketIds?.length) return;
    this.server.to(socketIds).emit("user-left", { playerId });
  }

  async kickUser(playerId: string) {
    if (!playerId) return;
    const socketIds = await this.findSocketIdsByUsersIds([playerId]);
    if (!socketIds?.length) return;
    this.server.to(socketIds).emit("user-kicked", { playerId });
  }
}
