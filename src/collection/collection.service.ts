import { BadRequestException, Injectable } from '@nestjs/common';
import { FileItem } from '../file/file.entity';
import { getServerResponse } from '../utils/response.util';
import { saveFiles } from '../utils/save-files.util';
import { CreateCollectionInterface, MulterDiskUploadedFiles, PaginationResponse, ServerResponse } from '../types';
import { CreateCollectionDto } from './dto/create-collection.dto';
import { UpdateCollectionDto } from './dto/update-collection.dto';
import { Collection } from './entities/collection.entity';
import { Product } from '../product/entities/product.entity';
import { In, Like } from 'typeorm';
import { unlinkFiles } from '../utils/unlink-files.util';
import { UpdateImageAltDto } from '../file/dto/image-alt.dto';
import { changeAltValidation, createCollectionValidation } from '../utils/validation.util';
import { sortImages, sortImagesInArray } from '../utils/sort-images.util';
import { maxLimit } from '../utils/max-count.util';

@Injectable()
export class CollectionService {
  async create(createCollectionDto: CreateCollectionDto, files: MulterDiskUploadedFiles): Promise<ServerResponse> {
    const data = JSON.parse(createCollectionDto.data) as CreateCollectionInterface;
    const { description, name, preview, products } = data;
    const images = files?.image ?? null;

    try {
      createCollectionValidation(data, images);

      let imagesList: FileItem[] = [];
      if (images) {
        imagesList = await saveFiles(images, preview);
      }

      const productsList = await Product.find({ where: { id: In(products) } });

      const newCollection = new Collection();
      newCollection.description = description;
      newCollection.name = name;
      await newCollection.save();

      newCollection.images = imagesList;
      newCollection.products = productsList;
      await newCollection.save();

      return getServerResponse('Collection has been successfully added!');
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

  async findAll(search: string, page: number, limit: number): Promise<PaginationResponse<Collection[]>> {
    const [results, count] = await Collection.findAndCount({
      relations: ['images'],
      where: { name: Like(`%${search}%`) },
      skip: (page - 1) * limit,
      take: maxLimit(limit),
    });
    return { count, results: sortImagesInArray(results) };
  }

  async findOne(id: string): Promise<Collection> {
    const collection = await Collection.findOne({
      relations: ['images', 'products'],
      where: { id },
    });
    return sortImages(collection);
  }

  async update(id: string, updateCollectionDto: UpdateCollectionDto, files: MulterDiskUploadedFiles): Promise<ServerResponse> {
    const data = JSON.parse(updateCollectionDto.data) as CreateCollectionInterface;
    const { description, name, preview, products } = data;
    const images = files?.image ?? null;

    try {
      createCollectionValidation(data, images, true);

      const updatingCollection = await Collection.findOneOrFail({
        relations: ['products', 'images'],
        where: { id },
      });

      let imagesList: FileItem[] = [];
      if (images) {
        imagesList = await saveFiles(images, preview);
      }

      const productsList = await Product.find({
        where: {
          id: In(products),
        }
      });

      updatingCollection.description = description;
      updatingCollection.name = name;
      await updatingCollection.save();
  
      updatingCollection.products = productsList;
      updatingCollection.images = [...updatingCollection.images, ...imagesList];
      await updatingCollection.save();
  
      return getServerResponse('Collection has been successfully updated!');
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
    changeAltValidation(body);
    const file = await FileItem.findOneOrFail({ where: { id } });
    file.alt = body.alt;
    await file.save();
    return getServerResponse('Image alt has been successfully updated!');
  }

  async deleteImage(id: string, imageId: string): Promise<ServerResponse> {
    const collection = await Collection.findOneOrFail({
      relations: ['images'],
      where: { id },
    });
    if (collection.images.length < 3) throw new BadRequestException('Product must have at least 2 photos!');
    collection.images = collection.images.filter(i => i.id !== imageId);
    await collection.save();

    const fileItem = await FileItem.findOneOrFail({ where: { id: imageId } });
    await unlinkFiles([{ filename: fileItem.filename }]);
    await fileItem.remove();

    // Wrócenie wszystkich danych sprzed aktualizacji

    return getServerResponse('Image has been successfully removed!');
  }

  async remove(id: string): Promise<ServerResponse> {
    const collection = await Collection.findOneOrFail({
      relations: ['images', 'products'],
      where: { id },
    });

    const images = [...collection.images];
    collection.images = [];
    for (const fileItem of images) {
      await fileItem.remove();
    }
    await unlinkFiles(images);

    const products = await Product.find({ relations: ['collection'] });
    console.log({products});
    
    const inCollection = products.filter(p => p.collection?.id === id);
    console.log({inCollection});
    if (inCollection.length !== 0) {
      collection.products = [];
      await collection.save();
    }

    await collection.remove();

    return getServerResponse('Collection has been successfully removed!');
  }
}
