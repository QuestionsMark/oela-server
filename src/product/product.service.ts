import { BadRequestException, Injectable } from '@nestjs/common';
import { ProductType } from '../product-type/entities/product-type.entity';
import { getServerResponse } from '../utils/response.util';
import { unlinkFiles } from '../utils/unlink-files.util';
import { In, Like } from 'typeorm';
import { Hashtag } from '../hashtag/entities/hashtag.entity';
import { CreateProductDataInterface, MulterDiskUploadedFiles, PaginationResponse, ServerResponse } from '../types';
import { CreateProductDto } from './dto/create-product.dto';
import { UpdateProductDto } from './dto/update-product.dto';
import { Product } from './entities/product.entity';
import { Specification } from './entities/specification.entity';
import { saveFiles } from '../utils/save-files.util';
import { FileItem } from '../file/file.entity';
import { UpdateImageAltDto } from '../file/dto/image-alt.dto';
import { changeAltValidation, createProductValidation } from 'src/utils/validation.util';

@Injectable()
export class ProductService {
  async create(createProductDto: CreateProductDto, files: MulterDiskUploadedFiles): Promise<ServerResponse> {
    const data = JSON.parse(createProductDto.data) as CreateProductDataInterface;
    const { description, hashtags, name, productType, shopLink, specifications, preview } = data;
    const images = files?.image ?? null;
    
    try {
      createProductValidation(data, images);

      let imagesList: FileItem[] = [];
      if (images) {
        imagesList = await saveFiles(images, preview);
      }

      const specificationsList: Specification[] = [];
      for (const { name, value } of specifications) {
        const newSpec = new Specification();
        newSpec.name = name;
        newSpec.value = value;
        const spec = await newSpec.save();
        specificationsList.push(spec);
      }

      const hashtagsList = await Hashtag.find({
        where: {
          id: In(hashtags),
        }
      });
  
      const productTypeObj = await ProductType.findOne({
        where: {
          id: productType,
        }
      });
      
      const newProduct = new Product();
      newProduct.description = description;
      newProduct.name = name;
      newProduct.shopLink = shopLink;
      await newProduct.save();
  
      newProduct.productType = productTypeObj;
      newProduct.hashtags = hashtagsList;
      newProduct.specifications = specificationsList;
      newProduct.images = imagesList;
      await newProduct.save();
  
      return getServerResponse('Product has been successfully added!');
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

  async findAll(search: string, page: number, limit: number): Promise<PaginationResponse<Product[]>> {
    const [results, count] = await Product.findAndCount({
      relations: ['images'],
      where: { name: Like(`%${search}%`) },
    });
    return { count, results };
  }

  async findOne(id: string): Promise<Product> {
    return Product.findOne({
      relations: ['images', 'specifications', 'productType', 'hashtags'],
      where: { id },
    });
  }

  async update(
    id: string,
    updateProductDto: UpdateProductDto,
    files: MulterDiskUploadedFiles,
  ): Promise<ServerResponse> {
    const data = JSON.parse(updateProductDto.data) as CreateProductDataInterface;
    const { description, hashtags, name, productType, shopLink, specifications, preview } = data;
    const images = files?.image ?? null;

    try {
      createProductValidation(data, images, true);

      const updatingProduct = await Product.findOneOrFail({
        relations: ['specifications', 'images'],
        where: { id },
      });

      let imagesList: FileItem[] = [];
      if (images) {
        imagesList = await saveFiles(images, preview);
      }

      const oldSpecifications = await Specification.find({
        where: {
          id: In(updatingProduct.specifications.map(s => s.id)),
        },
      });
      for (const oldSpec of oldSpecifications) {
        await oldSpec.remove();
      }
      
      const specificationsList: Specification[] = [];
      for (const { name, value } of specifications) {
        const newSpec = new Specification();
        newSpec.name = name;
        newSpec.value = value;
        const spec = await newSpec.save();
        specificationsList.push(spec);
      }

      const hashtagsList = await Hashtag.find({
        where: {
          id: In(hashtags),
        }
      });
  
      const productTypeObj = await ProductType.findOne({
        where: {
          id: productType,
        }
      });

      updatingProduct.description = description;
      updatingProduct.name = name;
      updatingProduct.shopLink = shopLink;
      await updatingProduct.save();
  
      updatingProduct.productType = productTypeObj;
      updatingProduct.hashtags = hashtagsList;
      updatingProduct.specifications = specificationsList;
      updatingProduct.images = [...updatingProduct.images, ...imagesList];
      await updatingProduct.save();
  
      return getServerResponse('Product has been successfully updated!');
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
    const product = await Product.findOneOrFail({
      relations: ['images'],
      where: { id },
    });
    if (product.images.length < 3) throw new BadRequestException('Product must have at least 2 photos!');
    product.images = product.images.filter(i => i.id !== imageId);
    await product.save();

    const fileItem = await FileItem.findOneOrFail({ where: { id: imageId } });
    await unlinkFiles([{ filename: fileItem.filename }]);
    await fileItem.remove();

    // Wrócenie wszystkich danych sprzed aktualizacji

    return getServerResponse('Image has been successfully removed!');
  }

  async remove(id: string): Promise<ServerResponse> {
    const product = await Product.findOneOrFail({
      relations: ['images', 'specifications', 'hashtags', 'collection'],
      where: { id },
    });

    const images = [...product.images];
    product.images = [];
    for (const fileItem of images) {
      await fileItem.remove();
    }
    await unlinkFiles(images);

    const specifications = [...product.specifications];
    product.specifications = [];
    for (const spec of specifications) {
      await spec.remove();
    }

    product.hashtags = [];
    product.collection = null;

    await product.save();
    await product.remove();

    return getServerResponse('Product has been successfully removed!');
  }
}
