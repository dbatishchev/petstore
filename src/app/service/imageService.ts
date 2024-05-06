import { Inject, Injectable } from '@nestjs/common';
import * as mime from 'mime-types';
import { Image, ImageType } from '../../domain/entity/image';
import { ImageRepository as ImageRepositoryToken } from '../../domain/di.tokens';
import { ImageRepository } from '../../domain/port/imageRepository';

@Injectable()
export default class ImageService {
  constructor(
    @Inject(ImageRepositoryToken)
    private readonly imageRepository: ImageRepository,
  ) {}

  public async getImagesFromPhotoURLs(photoUrls: string[]): Promise<Image[]> {
    const images = await this.imageRepository.findByURLs(photoUrls);
    const newImageURLs = photoUrls.filter(
      (url) => !images.find((i) => i.path === url),
    );
    for (const url of newImageURLs) {
      const image = await this.imageRepository.create({
        filename: this.extractFilenameFromPath(url),
        path: url,
        mime: this.extractMimeType(url),
        type: ImageType.External,
        additionalMeta: '',
      });
      images.push(image);
    }

    return images;
  }

  private extractMimeType(filename: string): string {
    const result = mime.lookup(filename);
    if (!result) {
      return '';
    }

    return result;
  }

  private extractFilenameFromPath(path: string): string {
    return path.split('/').pop() || '';
  }
}
