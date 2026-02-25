import { MiddlewareConsumer, Module, NestModule } from '@nestjs/common';
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
import { ThrottlerModule } from '@nestjs/throttler';
import { CacheModule } from "@nestjs/cache-manager";
import { FileUploadModule } from './file-upload/file-upload.module';
import { File } from './file-upload/entities/file.entity';
import { EventsModule } from './events/events.module';
import { LoggerMiddleware } from './common/middleware/logger.middleware';

// root module -> use all the sub modules
@Module({
  imports: [
     ConfigModule.forRoot({
        isGlobal: true,
     }),
     ThrottlerModule.forRoot([
      {
        ttl: 60000,
        limit: 5,
      }
     ]),
     CacheModule.register({
      isGlobal: true,
      ttl: 30000,
      max: 100,
     }),
    TypeOrmModule.forRoot({
      type: 'postgres',
      host: 'localhost',
      port: 5432,
      username: 'postgres',
      password: '200415',
      database: 'nestjs-project',
      entities: [Post, User, File],
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
    HelloModule, UserModule, PostsModule, AuthModule, FileUploadModule, EventsModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    // apply the middleware for all the routes
    consumer.apply(LoggerMiddleware).forRoutes('*')
  }
}
