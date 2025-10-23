import { Controller, Get, Post, Body, Patch, Param, Delete, Sse, UseInterceptors, UploadedFile } from '@nestjs/common';
import { UserService } from './user.service';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { interval, map, Observable } from 'rxjs';
import { FileInterceptor } from '@nestjs/platform-express';

@Controller('user')
export class UserController {
  constructor(private readonly userService: UserService) { }

  @Sse('events')
  stream(): Observable<{ data: any }> {
    return interval(2000).pipe(
      map((i) => ({
        data: { message: `Hello ${i} at ${new Date().toISOString()}` },
      })),
    );
  }

  @Post()
  @UseInterceptors(FileInterceptor('file'))
  uploadFile(@UploadedFile() file: any) {
    console.log('File uploaded:', file.originalname, file.size, 'bytes');
    return { message: 'File uploaded successfully', size: file.size };
  }

  @Get('search/:keyword')
  async getUserByKeyword(@Param('keyword') keyword: string) {
    return this.userService.getUserByKeyword(keyword);
  }
}
