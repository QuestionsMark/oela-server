import { Controller, Get, Post, Body, Param, Delete, Query, UseInterceptors, UploadedFiles, UseGuards, HttpCode } from '@nestjs/common';
import { FileFieldsInterceptor } from '@nestjs/platform-express';
import { multerStorage, multerStorageDir } from '../utils/storage.util';
import { MulterDiskUploadedFiles, PaginationResponse, ServerResponse } from '../types';
import { CoverService } from './cover.service';
import { CreateCoverDto } from './dto/create-cover.dto';
import { Cover } from './entities/cover.entity';
import { AuthGuard } from '@nestjs/passport';

@Controller('/cover')
export class CoverController {
  constructor(private readonly coverService: CoverService) {}

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
    @Body() createCoverDto: CreateCoverDto,
    @UploadedFiles() files: MulterDiskUploadedFiles,
  ): Promise<ServerResponse> {
    return this.coverService.create(createCoverDto, files);
  }

  @Get()
  findAll(
    @Query('page') page: number, 
    @Query('limit') limit: number,
  ): Promise<PaginationResponse<Cover[]>> {
    return this.coverService.findAll(page, limit);
  }

  @Delete('/:id')
  @UseGuards(AuthGuard('jwt'))
  remove(
    @Param('id') id: string,
  ): Promise<ServerResponse> {
    return this.coverService.remove(id);
  }
}
