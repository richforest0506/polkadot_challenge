import { Controller, Post, Get } from '@nestjs/common';
import { ApiService } from './api.service';
import { Body, Res, Req } from '@nestjs/common/decorators/http/route-params.decorator';
import { SigninDto } from 'src/api/v1/dto/signinDto';
import { Request, Response } from 'express';

@Controller('api/v1')
export class ApiController {
  constructor(private apiService: ApiService) { }

  @Post('signin')
  async signin(@Body() signinDto: SigninDto, @Res() res: Response) {
    const token = await this.apiService.signin(
      signinDto.address, signinDto.message, signinDto.signature
    )
    if (!token) {
      return res.status(401).send({
        msg: 'Authentication failed'
      })
    }
    return res.status(200).send(token);
  }

  @Post('signin')
  async signout(@Req() req: Request, @Res() res: Response) {
    await this.apiService.signout();
    return res.status(200).send(
      {
        status: true
      }
    );
  }

  @Get('secret')
  async getSecret(@Req() req: Request, @Res() res: Response) {
    const authHeader = req.headers.authorization;
    if (!authHeader) {
      return res.status(401).send({
        msg: 'Auth token is not provided'
      })
    }

    const token = authHeader.split(' ')[1];
    if (!token) {
      return res.status(401).send({
        msg: 'Auth token is not provided'
      })
    }

    const isAuthenticated = await this.apiService.verifyJwt(token);
    if (isAuthenticated) {
      const secretMsg = this.apiService.getSecretString();
      return res.status(200).send({
        status: true,
        msg: secretMsg
      })
    }

    return res.status(401).send({
      msg: 'Invalid token'
    })
  }
}
