import { Module } from '@nestjs/common';
import { ApiController } from './api.controller';
import { ApiService } from './api.service';
import { PassportModule } from '@nestjs/passport';
import { JwtModule } from '@nestjs/jwt';


@Module({
  imports: [
    PassportModule,
    JwtModule.register({
      secret: 'SECURED_JWT_KEY',
      signOptions: {
        expiresIn: 3600
      }
    })
  ],
  controllers: [ApiController],
  providers: [ApiService ],
})
export class AuthModule {}
