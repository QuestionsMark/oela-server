import { Controller, Get, Post, Body, Param, Delete, Query, UseGuards, HttpCode } from '@nestjs/common';
import { ProductTypeService } from './product-type.service';
import { CreateProductTypeDto } from './dto/create-product-type.dto';
import { PaginationResponse, ServerResponse } from '../types';
import { ProductType } from './entities/product-type.entity';
import { AuthGuard } from '@nestjs/passport';

@Controller('/product-type')
export class ProductTypeController {
  constructor(private readonly productTypeService: ProductTypeService) {}

  @Post()
  @UseGuards(AuthGuard('jwt'))
  @HttpCode(201)
  create(
    @Body() createProductTypeDto: CreateProductTypeDto,
  ): Promise<ServerResponse> {
    return this.productTypeService.create(createProductTypeDto);
  }

  @Get()
  findAll(
    @Query('search') search: string, 
    @Query('page') page: number, 
    @Query('limit') limit: number,
  ): Promise<PaginationResponse<ProductType[]>> {
    return this.productTypeService.findAll(search, page, limit);
  }

  @Get('/form')
  findAllForForm(): Promise<ProductType[]> {
    return this.productTypeService.findAllForForm();
  }

  @Delete('/:id')
  @UseGuards(AuthGuard('jwt'))
  remove(
    @Param('id') id: string
  ): Promise<ServerResponse> {
    return this.productTypeService.remove(id);
  }
}
