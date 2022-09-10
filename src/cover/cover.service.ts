import { Injectable } from '@nestjs/common';
import { getServerResponse } from '../utils/response.util';
import { CreateCoverInterface, MulterDiskUploadedFiles, PaginationResponse, ServerResponse } from '../types';
import { CreateCoverDto } from './dto/create-cover.dto';
import { Cover } from './entities/cover.entity';
import { saveFiles } from '../utils/save-files.util';
import { unlinkFiles } from '../utils/unlink-files.util';

@Injectable()
export class CoverService {
  async create(createCoverDto: CreateCoverDto, files: MulterDiskUploadedFiles): Promise<ServerResponse> {
    const { preview } = JSON.parse(createCoverDto.data) as CreateCoverInterface;
    const images = files?.image ?? null;
    
    try {
      const imagesList = await saveFiles(images, preview);
      for (const image of imagesList) {
        const newCover = new Cover();
        await newCover.save();
        newCover.image = image;
        await newCover.save();
      }
      return getServerResponse('Cover has been successfully added!');
    } catch (e) {
      try {
        if (images) {
          await unlinkFiles(images);
        }
      } catch (e2) {}
      throw e;
    }
  }

  async findAll(page: number, limit: number): Promise<PaginationResponse<Cover[]>> {
    const [results, count] = await Cover.findAndCount({ relations: ['image'] });
    return { count, results };
  }

  async remove(id: string): Promise<ServerResponse> {
    const cover = await Cover.findOneOrFail({
      relations: ['image'],
      where: { id },
    });
    const image = cover.image;
    await cover.remove();
    await unlinkFiles([image]);
    await image.remove();
    return getServerResponse('Cover has been successfully removed!');
  }
}
