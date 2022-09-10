import { BadRequestException, Injectable } from '@nestjs/common';
import { FileItem } from '../file/file.entity';
import { getServerResponse } from '../utils/response.util';
import { CreateNewsInterface, MulterDiskUploadedFiles, PaginationResponse, ServerResponse } from '../types';
import { CreateNewsDto } from './dto/create-news.dto';
import { UpdateNewsDto } from './dto/update-news.dto';
import { News } from './entities/news.entity';
import { saveFiles } from '../utils/save-files.util';
import { unlinkFiles } from '../utils/unlink-files.util';
import { UpdateImageAltDto } from '../file/dto/image-alt.dto';
import { Like } from 'typeorm';

@Injectable()
export class NewsService {
  async create(createNewsDto: CreateNewsDto, files: MulterDiskUploadedFiles): Promise<ServerResponse> {
    const { description, name, preview } = JSON.parse(createNewsDto.data) as CreateNewsInterface;
    const images = files?.image ?? null;

    // Walidacja

    try {
      let imagesList: FileItem[] = [];
      if (images) {
        imagesList = await saveFiles(images, preview);
      }
      
      const newNews = new News();
      newNews.description = description;
      newNews.name = name;
      await newNews.save();
  
      newNews.images = imagesList;
      await newNews.save();
  
      return getServerResponse('News has been successfully Added!');
    } catch (e) {
      try {
        if (images) {
          await unlinkFiles(images);
        }

        // Wrócenie wszystkich danych sprzed aktualizacji

      } catch (e2) {}
      throw e;
    }
  }

  async findAll(search: string, page: number, limit: number): Promise<PaginationResponse<News[]>> {
    const [results, count] = await News.findAndCount({
      relations: ['images'],
      where: { name: Like(`%${search}%`) },
    });
    return { count, results };
  }

  async findOne(id: string): Promise<News> {
    return News.findOneOrFail({
      relations: ['images'],
      where: { id },
    });
  }

  async update(id: string, updateNewsDto: UpdateNewsDto, files: MulterDiskUploadedFiles): Promise<ServerResponse> {
    const { description, name, preview } = JSON.parse(updateNewsDto.data) as CreateNewsInterface;
    const images = files?.image ?? null;

    // Walidacja

    try {
      const updatingNews = await News.findOneOrFail({ 
        relations: ['images'],
        where: { id },
      });

      let imagesList: FileItem[] = [];
      if (images) {
        imagesList = await saveFiles(images, preview);
      }
      
      updatingNews.description = description;
      updatingNews.name = name;
      await updatingNews.save();
  
      updatingNews.images = [...updatingNews.images, ...imagesList];
      await updatingNews.save();
  
      return getServerResponse('News has been successfully updated!');
    } catch (e) {
      try {
        if (images) {
          await unlinkFiles(images);
        }

        // Wrócenie wszystkich danych sprzed aktualizacji

      } catch (e2) {}
      throw e;
    }
  }

  async updateAlt(id: string, body: UpdateImageAltDto): Promise<ServerResponse> {
    const file = await FileItem.findOneOrFail({ where: { id } });
    file.alt = body.alt;
    await file.save();
    return getServerResponse('Image alt has been successfully updated!');
  }

  async deleteImage(id: string, imageId: string): Promise<ServerResponse> {
    const news = await News.findOneOrFail({
      relations: ['images'],
      where: { id },
    });
    if (news.images.length < 2) throw new BadRequestException('Product must have at least 1 photo!');
    news.images = news.images.filter(i => i.id !== imageId);
    await news.save();

    const fileItem = await FileItem.findOneOrFail({ where: { id: imageId } });
    await unlinkFiles([{ filename: fileItem.filename }]);
    await fileItem.remove();

    // Wrócenie wszystkich danych sprzed aktualizacji

    return getServerResponse('Image has been successfully removed!');
  }

  async remove(id: string): Promise<ServerResponse> {
    const news = await News.findOneOrFail({
      relations: ['images'],
      where: { id },
    });

    const images = [...news.images];
    news.images = [];
    for (const fileItem of images) {
      await fileItem.remove();
    }
    await unlinkFiles(images);

    await news.remove();

    return getServerResponse('News has been successfully removed!');
  }
}
