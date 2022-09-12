import { BadRequestException, Injectable } from '@nestjs/common';
import { getServerResponse } from '../utils/response.util';
import { PaginationResponse, ServerResponse } from '../types';
import { CreateProductTypeDto } from './dto/create-product-type.dto';
import { ProductType } from './entities/product-type.entity';
import { Product } from '../product/entities/product.entity';
import { Like } from 'typeorm';
import { maxLimit } from '../utils/max-count.util';

@Injectable()
export class ProductTypeService {
  async create(createProductTypeDto: CreateProductTypeDto) {
    const { name } = createProductTypeDto;
    const newProductType = new ProductType();
    newProductType.name = name;
    await newProductType.save();
    return getServerResponse('Product type has been successfully added!');
  }

  async findAll(search: string, page: number, limit: number): Promise<PaginationResponse<ProductType[]>> {
    const [results, count] = await ProductType.findAndCount({
      where: { name: Like(`%${search}%`) },
      skip: (page - 1) * limit,
      take: maxLimit(limit),
    });
    return { count, results };
  }

  async findAllForForm(): Promise<ProductType[]> {
    return ProductType.find();
  }

  async remove(id: string): Promise<ServerResponse> {
    const productType = await ProductType.findOneOrFail({ where: { id } });
    const products = await Product.find({
      relations: ['productType'],
    });
    const withProductType = products.filter(p => p.productType.id === id);
    if (withProductType.length !== 0) throw new BadRequestException(`Product types that are in use, cannot be removed! Products that use this type: ${withProductType.map(p => p.name).join(', ')}.`);
    await productType.remove();
    return getServerResponse('Product type has been successfully removed!');
  }
}
