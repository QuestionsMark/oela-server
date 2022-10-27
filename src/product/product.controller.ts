import { Controller, Get, Post, Body, Patch, Param, Delete, Query, UseInterceptors, UploadedFiles, Put, UseGuards, HttpCode } from '@nestjs/common';
import { ProductService } from './product.service';
import { CreateProductDto } from './dto/create-product.dto';
import { UpdateProductDto } from './dto/update-product.dto';
import { Product } from './entities/product.entity';
import { MulterDiskUploadedFiles, PaginationResponse, ServerResponse } from '../types';
import { FileFieldsInterceptor } from '@nestjs/platform-express';
import { multerStorage, multerStorageDir } from '../utils/storage.util';
import { UpdateImageAltDto } from 'src/file/dto/image-alt.dto';
import { AuthGuard } from '@nestjs/passport';

@Controller('/product')
export class ProductController {
  constructor(
    private readonly productService: ProductService,
  ) {}

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
    @Query('hashtags') hashtags: string[],
    @Query('productType') productType: string,
  ): Promise<PaginationResponse<Product[]>> {
    return this.productService.findAll(search, page, limit, hashtags, productType);
  }

  @Get('/picture')
  findAllPictures(
    @Query('search') search: string, 
    @Query('page') page: number, 
    @Query('limit') limit: number,
  ): Promise<PaginationResponse<Product[]>> {
    return this.productService.findAllPictures(search, page, limit);
  }
  
  @Get('/:id')
  findOne(
    @Param('id') id: string
  ): Promise<Product> {
    return this.productService.findOne(id);
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
    @Body() updateProductDto: UpdateProductDto,
    @UploadedFiles() files: MulterDiskUploadedFiles,
  ): Promise<ServerResponse> {
    return this.productService.update(id, updateProductDto, files);
  }

  @Patch('/:id/image-alt')
  @UseGuards(AuthGuard('jwt'))
  uptadeAlt(
    @Param('id') id: string,
    @Body() body: UpdateImageAltDto,
  ): Promise<ServerResponse> {
    return this.productService.updateAlt(id, body);
  }

  @Delete('/:id/image/:imageId')
  @UseGuards(AuthGuard('jwt'))
  deleteImage(
    @Param('id') id: string,
    @Param('imageId') imageId: string,
  ): Promise<ServerResponse> {
    return this.productService.deleteImage(id, imageId);
  }

  @Delete('/:id')
  @UseGuards(AuthGuard('jwt'))
  remove(
    @Param('id') id: string,
  ): Promise<ServerResponse> {
    return this.productService.remove(id);
  }
}
