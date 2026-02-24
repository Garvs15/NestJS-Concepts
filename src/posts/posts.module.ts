import { Module } from '@nestjs/common';
import { PostsController } from './posts.controller';
import { PostsService } from './posts.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Post } from './entities/post.entity';
import { AuthModule } from 'src/auth/auth.module';

@Module({
  imports: [
    // This will make the post repository avalilable for injection
    TypeOrmModule.forFeature([Post]),
    AuthModule
  ],
  controllers: [PostsController],
  providers: [PostsService]
})
export class PostsModule {}
