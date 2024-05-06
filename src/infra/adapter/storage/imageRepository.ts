import { ImageRepository as IImageRepository } from '../../../domain/port/imageRepository';
import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { In, Repository as TypeORMStorageLayer } from 'typeorm';
import { Image as ImageORMModel } from '../../typeorm/image.orm';
import { Image } from '../../../domain/entity/image';
import { ImageMapper } from '../../typeorm/mapper/imageMapper';

@Injectable()
export class ImageRepository implements IImageRepository {
  constructor(
    @InjectRepository(ImageORMModel)
    private imageStorage: TypeORMStorageLayer<ImageORMModel>,
  ) {}

  async create(image: Omit<Image, 'id'>): Promise<Image> {
    const result = await this.imageStorage.save(
      ImageMapper.toPersistence(image),
    );
    return ImageMapper.toDomain(result);
  }

  async findByURLs(urls: string[]): Promise<Image[]> {
    const result = await this.imageStorage.find({
      where: {
        path: In(urls),
      },
    });
    return result.map((image) => ImageMapper.toDomain(image));
  }
}
