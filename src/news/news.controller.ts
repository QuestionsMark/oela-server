import { Controller, Get, Post, Body, Param, Delete, Query, UploadedFiles, UseInterceptors, Put, Patch, UseGuards, HttpCode } from '@nestjs/common';
import { NewsService } from './news.service';
import { CreateNewsDto } from './dto/create-news.dto';
import { UpdateNewsDto } from './dto/update-news.dto';
import { News } from './entities/news.entity';
import { MulterDiskUploadedFiles, PaginationResponse, ServerResponse } from '../types';
import { FileFieldsInterceptor } from '@nestjs/platform-express';
import { multerStorage, multerStorageDir } from '../utils/storage.util';
import { UpdateImageAltDto } from '../file/dto/image-alt.dto';
import { AuthGuard } from '@nestjs/passport';

@Controller('/news')
export class NewsController {
  constructor(private readonly newsService: NewsService) {}

  @Post()
  @UseGuards(AuthGuard('jwt'))
  @HttpCode(201)
  @UseInterceptors(
    FileFieldsInterceptor([
      {
        name: 'image',
        maxCount: 10,
      },
    ], {
      storage: multerStorage(multerStorageDir()),
      limits: {
        fileSize: 10 * 1024 * 1024,
      },
    }),
  )
  create(
    @Body() createNewsDto: CreateNewsDto,
    @UploadedFiles() files: MulterDiskUploadedFiles,
  ): Promise<ServerResponse> {
    return this.newsService.create(createNewsDto, files);
  }

  @Get()
  findAll(
    @Query('search') search: string, 
    @Query('page') page: number, 
    @Query('limit') limit: number,
  ): Promise<PaginationResponse<News[]>> {
    return this.newsService.findAll(search, page, limit);
  }

  @Get('/:id')
  findOne(
    @Param('id') id: string,
  ): Promise<News> {
    return this.newsService.findOne(id);
  }

  @Put('/:id')
  @UseGuards(AuthGuard('jwt'))
  @UseInterceptors(
    FileFieldsInterceptor([
      {
        name: 'image',
        maxCount: 10,
      },
    ], {
      storage: multerStorage(multerStorageDir()),
      limits: {
        fileSize: 10 * 1024 * 1024,
      },
    }),
  )
  update(
    @Param('id') id: string,
    @Body() updateNewsDto: UpdateNewsDto,
    @UploadedFiles() files: MulterDiskUploadedFiles,
  ): Promise<ServerResponse> {
    return this.newsService.update(id, updateNewsDto, files);
  }

  @Patch('/:id/image-alt')
  @UseGuards(AuthGuard('jwt'))
  uptadeAlt(
    @Param('id') id: string,
    @Body() body: UpdateImageAltDto,
  ): Promise<ServerResponse> {
    return this.newsService.updateAlt(id, body);
  }

  @Delete('/:id/image/:imageId')
  @UseGuards(AuthGuard('jwt'))
  deleteImage(
    @Param('id') id: string,
    @Param('imageId') imageId: string,
  ): Promise<ServerResponse> {
    return this.newsService.deleteImage(id, imageId);
  }

  @Delete('/:id')
  @UseGuards(AuthGuard('jwt'))
  remove(
    @Param('id') id: string,
  ): Promise<ServerResponse> {
    return this.newsService.remove(id);
  }
}
