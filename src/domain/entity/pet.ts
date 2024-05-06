import { Category } from './category';
import { Tag } from './tag';
import { PetStatusEnum } from '../../api/openapi/types';
import { Image } from './image';

export interface Pet {
  id: number;
  name: string;
  category: Category;
  tags: Tag[];
  status: PetStatusEnum;
  images: Image[];
}
