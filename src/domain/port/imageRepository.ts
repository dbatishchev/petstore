import { Image } from '../entity/image';

export interface ImageRepository {
  create(image: Omit<Image, 'id'>): Promise<Image | null>;
  findByURLs(urls: string[]): Promise<Image[]>;
}
