import { Controller, Get, Post, Body, Param, Delete, Query, UseGuards, HttpCode } from '@nestjs/common';
import { HashtagService } from './hashtag.service';
import { CreateHashtagDto } from './dto/create-hashtag.dto';
import { Hashtag } from './entities/hashtag.entity';
import { PaginationResponse, ServerResponse } from '../types';
import { AuthGuard } from '@nestjs/passport';

@Controller('/hashtag')
export class HashtagController {
  constructor(private readonly hashtagService: HashtagService) {}

  @Post()
  @UseGuards(AuthGuard('jwt'))
  @HttpCode(201)
  create(
    @Body() createHashtagDto: CreateHashtagDto,
  ): Promise<ServerResponse> {
    return this.hashtagService.create(createHashtagDto);
  }

  @Get()
  findAll(
    @Query('search') search: string, 
    @Query('page') page: number, 
    @Query('limit') limit: number,
  ): Promise<PaginationResponse<Hashtag[]>> {
    return this.hashtagService.findAll(search, page, limit);
  }

  @Get('/form')
  findAllForForm(): Promise<Hashtag[]> {
    return this.hashtagService.findAllForForm();
  }

  @Delete('/:id')
  @UseGuards(AuthGuard('jwt'))
  remove(
    @Param('id') id: string
  ): Promise<ServerResponse> {
    return this.hashtagService.remove(id);
  }
}
