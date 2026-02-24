import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { HelloModule } from './hello/hello.module';
import { UserModule } from './user/user.module';
import { ConfigModule } from '@nestjs/config';
import { PostsModule } from './posts/posts.module';
import Joi, * as joi from 'joi';
import appConfig from './config/app.config';
import { TypeOrmModule } from "@nestjs/typeorm"; 
import { Post } from './posts/entities/post.entity';
import { AuthModule } from './auth/auth.module';
import { User } from './auth/entities/user.entity';

// root module -> use all the sub modules
@Module({
  imports: [
    TypeOrmModule.forRoot({
      type: 'postgres',
      host: 'localhost',
      port: 5432,
      username: 'postgres',
      password: '200415',
      database: 'nestjs-project',
      entities: [Post, User],
      autoLoadEntities: true,
      synchronize: true,
    }),
    ConfigModule.forRoot({
      isGlobal: true,   // this makes the config module globally available
      // validationSchema: joi.object({
      //   APP_NAME: Joi.string().default('defaultApp'),
      // }),
      load: [appConfig],
    }),
    HelloModule, UserModule, PostsModule, AuthModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
