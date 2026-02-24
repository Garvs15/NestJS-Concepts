import { Module } from '@nestjs/common';
import { HelloController } from './hello.controller';
import { HelloService } from './hello.service';

@Module({
  controllers: [HelloController],
  providers: [HelloService],
  imports: [],   // imports the other module if needed
  exports: [HelloService],  // exports other services if needed
})
export class HelloModule {}
