import { Controller, Get, Post, Body, Param, Delete, Query } from '@nestjs/common';
import { HashtagService } from './hashtag.service';
import { CreateHashtagDto } from './dto/create-hashtag.dto';
import { Hashtag } from './entities/hashtag.entity';
import { PaginationResponse, ServerResponse } from '../types';

@Controller('/hashtag')
export class HashtagController {
  constructor(private readonly hashtagService: HashtagService) {}

  @Post()
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
  remove(
    @Param('id') id: string
  ): Promise<ServerResponse> {
    return this.hashtagService.remove(id);
  }
}
