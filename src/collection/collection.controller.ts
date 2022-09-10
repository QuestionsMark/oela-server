import { Controller, Get, Post, Body, Patch, Param, Delete, Query, UseInterceptors, UploadedFiles, Put } from '@nestjs/common';
import { FileFieldsInterceptor } from '@nestjs/platform-express';
import { multerStorage, multerStorageDir } from '../utils/storage.util';
import { MulterDiskUploadedFiles, PaginationResponse, ServerResponse } from '../types';
import { CollectionService } from './collection.service';
import { CreateCollectionDto } from './dto/create-collection.dto';
import { UpdateCollectionDto } from './dto/update-collection.dto';
import { Collection } from './entities/collection.entity';
import { UpdateImageAltDto } from '../file/dto/image-alt.dto';

@Controller('/collection')
export class CollectionController {
  constructor(private readonly collectionService: CollectionService) {}

  @Post()
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
    @Body() createCollectionDto: CreateCollectionDto,
    @UploadedFiles() files: MulterDiskUploadedFiles,
  ): Promise<ServerResponse> {
    return this.collectionService.create(createCollectionDto, files);
  }

  @Get()
  findAll(
    @Query('search') search: string, 
    @Query('page') page: number, 
    @Query('limit') limit: number,
  ): Promise<PaginationResponse<Collection[]>> {
    return this.collectionService.findAll(search, page, limit);
  }

  @Get('/:id')
  findOne(
    @Param('id') id: string,
  ): Promise<Collection> {
    return this.collectionService.findOne(id);
  }

  @Put('/:id')
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
    @Param('id') id: string, @Body() updateCollectionDto: UpdateCollectionDto,
    @UploadedFiles() files: MulterDiskUploadedFiles,
  ): Promise<ServerResponse> {
    return this.collectionService.update(id, updateCollectionDto, files);
  }

  @Patch('/:id/image-alt')
  uptadeAlt(
    @Param('id') id: string,
    @Body() body: UpdateImageAltDto,
  ): Promise<ServerResponse> {
    return this.collectionService.updateAlt(id, body);
  }

  @Delete('/:id/image/:imageId')
  deleteImage(
    @Param('id') id: string,
    @Param('imageId') imageId: string,
  ): Promise<ServerResponse> {
    return this.collectionService.deleteImage(id, imageId);
  }

  @Delete('/:id')
  remove(
    @Param('id') id: string,
  ): Promise<ServerResponse> {
    return this.collectionService.remove(id);
  }
}
