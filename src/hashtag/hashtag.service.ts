import { BadRequestException, Injectable } from '@nestjs/common';
import { Product } from '../product/entities/product.entity';
import { getServerResponse } from '../utils/response.util';
import { PaginationResponse, ServerResponse } from '../types';
import { CreateHashtagDto } from './dto/create-hashtag.dto';
import { Hashtag } from './entities/hashtag.entity';
import { Like } from 'typeorm';
import { maxLimit, skip } from '../utils/pagination.util';

@Injectable()
export class HashtagService {
  async create(createHashtagDto: CreateHashtagDto): Promise<ServerResponse> {
    const { name } = createHashtagDto;
    const newHashtag = new Hashtag();
    newHashtag.name = name;
    await newHashtag.save();
    return getServerResponse('Hashtag has been successfully added!');
  }

  async findAll(search: string, page: number, limit: number): Promise<PaginationResponse<Hashtag[]>> {
    const [results, count] = await Hashtag.findAndCount({
      where: { name: Like(`%${search ?? ''}%`) },
      skip: skip(page, limit),
      take: maxLimit(limit),
    });
    return { count, results };
  }

  async findAllForForm(): Promise<Hashtag[]> {
    return Hashtag.find();
  }

  async remove(id: string): Promise<ServerResponse> {
    const hashtag = await Hashtag.findOneOrFail({ where: { id } });
    const products = await Product.find({ relations: ['hashtags'] });
    const withHashtag = products.filter(p => p.hashtags.map(h => h.id).includes(id));
    if (withHashtag.length !== 0) throw new BadRequestException(`Hashtags that are in use, cannot be removed! Products that use this hashtag: ${withHashtag.map(h => h.name).join(', ')}.`);
    await hashtag.remove();

    return getServerResponse('Hashtag has been successfully removed!');
  }
}
