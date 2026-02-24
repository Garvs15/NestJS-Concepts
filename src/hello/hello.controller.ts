import { Controller, Get, Param, Query } from '@nestjs/common';
import { HelloService } from './hello.service';

// Controller is responsible for handling all incoming request or returning responses to the client for example
// express
// service.js -> routes, controller, services 
 
// http://localhost:3000/hello
@Controller('hello')
export class HelloController {
    // dependency injection

   constructor(private readonly helloService: HelloService){}

// Call the route
@Get()
getHello():string {
    return this.helloService.getHello();
}

// Dynamic route
@Get('user/:name')
getHelloWithName(@Param('name') name: string): string {
   return this.helloService.getHelloWithName(name);
}

// Query Parameters
// /hello/query?name=garv

@Get('query')
getHelloWithQuery(@Query('name') name: string): string {
    return this.helloService.getHelloWithName(name || 'world');
}
}
