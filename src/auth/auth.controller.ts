import { Body, Controller, Get, HttpCode, Post, Res, UseGuards } from '@nestjs/common';
import { Response } from 'express';
import { AuthGuard } from '@nestjs/passport';
import { User } from '../user/entities/user.entity';
import { UserObject } from '../decorators/user.decorator';
import { AuthService } from './auth.service';
import { LoginDto } from './dto/login.dto';

@Controller('/auth')
export class AuthController {
  constructor(
    private readonly authService: AuthService
  ) {}

  @Post('/login')
  @HttpCode(200)
  async login(
    @Body() loginDto: LoginDto,
    @Res() res: Response,
  ) {
    return this.authService.login(loginDto, res);
  }

  @Get('/logout')
  @UseGuards(AuthGuard('jwt'))
  async logout(
    @UserObject() user: User,
    @Res() res: Response,
  ) {
    return this.authService.logout(user, res);
  }

  @Get('/is-logged')
  @UseGuards(AuthGuard('jwt'))
  async isLogged() {
    return true;
  }
}
