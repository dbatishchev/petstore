import { TagRepository as ITagRepository } from '../../../domain/port/tagRepository';
import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { In, Repository as TypeORMStorageLayer } from 'typeorm';
import { Tag as TagORMModel } from '../../typeorm/tag.orm';
import { Tag } from '../../../domain/entity/tag';
import { TagMapper } from '../../typeorm/mapper/tagMapper';

@Injectable()
export class TagRepository implements ITagRepository {
  constructor(
    @InjectRepository(TagORMModel)
    private tagStorage: TypeORMStorageLayer<TagORMModel>,
  ) {}

  async findByNames(names: string[]): Promise<Tag[]> {
    const result = await this.tagStorage.find({
      where: {
        name: In(names),
      },
    });

    if (!result) {
      return [];
    }

    return result.map(TagMapper.toDomain);
  }

  async findByIDs(ids: number[]): Promise<Tag[]> {
    const result = await this.tagStorage.find({
      where: {
        id: In(ids),
      },
    });

    if (!result) {
      return [];
    }

    return result.map(TagMapper.toDomain);
  }

  async findOrByNameCreate(name: string): Promise<Tag> {
    const result = await this.tagStorage.findOneBy({ name });

    if (!result) {
      const category = new TagORMModel();
      category.name = name;
      await this.tagStorage.save(category);
      return TagMapper.toDomain(category);
    }

    return TagMapper.toDomain(result);
  }
}
