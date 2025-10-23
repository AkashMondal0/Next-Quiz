import { Body, Controller, Get, Post } from '@nestjs/common';
import { AppService } from './app.service';

@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}

  @Get('todos')
  getTodos(): any {
    // if(true) throw new Error('Test Sentry Integration');
    return this.appService.getHello();
  }

  @Post('todos')
  createTodo(
    @Body() data: any,
  ) {
    console.log(data);
    return this.appService.createTodo('New Todo', 'This is a newly created todo item.');
  }
}
