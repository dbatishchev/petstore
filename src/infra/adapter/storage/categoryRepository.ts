import { CategoryRepository as ICategoryRepository } from '../../../domain/port/categoryRepository';
import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository as TypeORMStorageLayer } from 'typeorm';
import { Category as CategoryORMModel } from '../../typeorm/category.orm';
import { Category } from '../../../domain/entity/category';
import { CategoryMapper } from '../../typeorm/mapper/categoryMapper';

@Injectable()
export class CategoryRepository implements ICategoryRepository {
  constructor(
    @InjectRepository(CategoryORMModel)
    private categoryStorage: TypeORMStorageLayer<CategoryORMModel>,
  ) {}

  async findByID(id: number): Promise<Category | null> {
    const result = await this.categoryStorage.findOneBy({ id });

    if (!result) {
      return null;
    }

    return CategoryMapper.toDomain(result);
  }

  async findByNameOrCreate(name: string): Promise<Category> {
    const result = await this.categoryStorage.findOneBy({ name });

    if (!result) {
      const category = new CategoryORMModel();
      category.name = name;
      await this.categoryStorage.save(category);
      return CategoryMapper.toDomain(category);
    }

    return CategoryMapper.toDomain(result);
  }
}
