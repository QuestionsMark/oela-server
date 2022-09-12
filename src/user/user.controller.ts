import { Controller, Get, Post, Body, Patch, Param, Delete, HttpCode } from '@nestjs/common';
import { UserService } from './user.service';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { ServerResponse } from '../types';

@Controller('/user')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Post()
  @HttpCode(201)
  create(
    @Body() createUserDto: CreateUserDto,
  ): Promise<ServerResponse> {
    return this.userService.create(createUserDto);
  }

  @Get('/is-account')
  findAll(): Promise<boolean> {
    return this.userService.checkIsAdminAccount();
  }
}
