import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.enableCors(); //enabling cors for all resource origins..

  await app.listen(3030);
}
bootstrap();
