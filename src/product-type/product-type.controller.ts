import { Controller, Get, Post, Body, Param, Delete, Query } from '@nestjs/common';
import { ProductTypeService } from './product-type.service';
import { CreateProductTypeDto } from './dto/create-product-type.dto';
import { PaginationResponse, ServerResponse } from '../types';
import { ProductType } from './entities/product-type.entity';

@Controller('/product-type')
export class ProductTypeController {
  constructor(private readonly productTypeService: ProductTypeService) {}

  @Post()
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
  remove(
    @Param('id') id: string
  ): Promise<ServerResponse> {
    return this.productTypeService.remove(id);
  }
}
