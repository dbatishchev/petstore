import { ImageRepository } from '../../src/domain/port/imageRepository';
import { Image } from '../../src/domain/entity/image';

export class FakeImageRepository implements ImageRepository {
  private images: Image[];

  constructor() {
    this.images = [];
  }

  async create(image: Omit<Image, 'id'>): Promise<Image | null> {
    const newImage: Image = { ...image, id: this.images.length + 1 };
    this.images.push(newImage);
    return newImage;
  }

  async findByURLs(urls: string[]): Promise<Image[]> {
    return this.images.filter((image) => urls.includes(image.path));
  }
}
