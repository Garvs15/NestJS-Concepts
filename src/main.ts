import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';

// Main file of the nest file -> entry point of the nest js application
async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  // Validating incoming request globally
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,    // stripe properties don't have decorators
      forbidNonWhitelisted: true,
      transform: true,  // automatically transforms payloads to object typed according to their dto classes
      disableErrorMessages: false,
    }),
  );

  // Global Settings
  // env file

  // Starts a HTTP Server
  await app.listen(process.env.PORT ?? 3000);
}
bootstrap();
