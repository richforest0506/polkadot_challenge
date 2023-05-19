import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { AuthModule } from './api/v1/api.module';
import { ConfigModule } from '@nestjs/config';

// main module of the application where all other modules and services must be registered.
@Module({
  imports: [
    ConfigModule.forRoot(),
    AuthModule,    
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
