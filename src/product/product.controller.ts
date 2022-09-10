import { Controller, Get, Post, Body, Patch, Param, Delete, Query, UseInterceptors, UploadedFiles, Put } from '@nestjs/common';
import { ProductService } from './product.service';
import { CreateProductDto } from './dto/create-product.dto';
import { UpdateProductDto } from './dto/update-product.dto';
import { Product } from './entities/product.entity';
import { MulterDiskUploadedFiles, PaginationResponse, ServerResponse } from '../types';
import { FileFieldsInterceptor } from '@nestjs/platform-express';
import { multerStorage, multerStorageDir } from '../utils/storage.util';
import { UpdateImageAltDto } from 'src/file/dto/image-alt.dto';

@Controller('/product')
export class ProductController {
  constructor(private readonly productService: ProductService) {}

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
    @Body() createProductDto: CreateProductDto,
    @UploadedFiles() files: MulterDiskUploadedFiles,
  ): Promise<ServerResponse> {
    return this.productService.create(createProductDto, files);
  }

  @Get()
  findAll(
    @Query('search') search: string, 
    @Query('page') page: number, 
    @Query('limit') limit: number,
  ): Promise<PaginationResponse<Product[]>> {
    return this.productService.findAll(search, page, limit);
  }

  @Get('/:id')
  findOne(
    @Param('id') id: string
  ): Promise<Product> {
    return this.productService.findOne(id);
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
    @Param('id') id: string,
    @Body() updateProductDto: UpdateProductDto,
    @UploadedFiles() files: MulterDiskUploadedFiles,
  ): Promise<ServerResponse> {
    return this.productService.update(id, updateProductDto, files);
  }

  @Patch('/:id/image-alt')
  uptadeAlt(
    @Param('id') id: string,
    @Body() body: UpdateImageAltDto,
  ): Promise<ServerResponse> {
    return this.productService.updateAlt(id, body);
  }

  @Delete('/:id/image/:imageId')
  deleteImage(
    @Param('id') id: string,
    @Param('imageId') imageId: string,
  ): Promise<ServerResponse> {
    return this.productService.deleteImage(id, imageId);
  }

  @Delete('/:id')
  remove(
    @Param('id') id: string,
  ): Promise<ServerResponse> {
    return this.productService.remove(id);
  }
}
