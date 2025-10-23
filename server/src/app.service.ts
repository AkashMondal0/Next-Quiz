import { Injectable } from '@nestjs/common';

const todos = [
  { title: 'Hello World!', description: 'This is a sample description.' },
  { title: 'NestJS is Awesome', description: 'Build scalable server-side applications.' },
  { title: 'TypeScript', description: 'JavaScript with superpowers.' },
  { title: 'GraphQL', description: 'Query language for APIs.' },
  { title: 'RESTful APIs', description: 'Representational State Transfer.' },
  { title: 'Microservices', description: 'Architectural style for building distributed systems.' },
  { title: 'Docker', description: 'Containerization platform.' },
  { title: 'Kubernetes', description: 'Container orchestration platform.' },
  { title: 'CI/CD', description: 'Continuous Integration and Continuous Deployment.' },
  { title: 'DevOps', description: 'Collaboration between development and operations.' },
];
@Injectable()
export class AppService {
  // get todos
  getHello(): { title: string; description: string }[] {
    return todos;
  }

  createTodo(title: string, description: string): { message: string } {
    todos.push({ title, description });
    return { message: 'Todo created successfully' };
  }
}
