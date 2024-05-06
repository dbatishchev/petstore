import { PetRepository as IPetRepository } from '../../../domain/port/petRepository';
import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository as TypeORMStorageLayer } from 'typeorm';
import { Pet as PetORMModel } from '../../typeorm/pet.orm';
import { PetMapper } from '../../typeorm/mapper/petMapper';
import { Pet } from '../../../domain/entity/pet';
import { PetStatusEnum } from '../../../api/openapi/types';

@Injectable()
export class PetRepository implements IPetRepository {
  constructor(
    @InjectRepository(PetORMModel)
    private petStorage: TypeORMStorageLayer<PetORMModel>,
  ) {}

  async findPetByID(id: number): Promise<Pet | null> {
    const result = await this.petStorage.findOneBy({ id });

    if (!result) {
      return null;
    }

    return PetMapper.toDomain(result);
  }

  async create(pet: Omit<Pet, 'id'>): Promise<Pet> {
    const result = await this.petStorage.save(PetMapper.toPersistence(pet));
    return PetMapper.toDomain(result);
  }

  async deleteByID(id: number): Promise<void> {
    await this.petStorage.delete(id);
  }

  async findPetByStatus(status: PetStatusEnum): Promise<Pet[]> {
    const result = await this.petStorage.findBy({ status });
    return result.map(PetMapper.toDomain);
  }

  async findPetsByTags(tagIDs: number[]): Promise<Pet[]> {
    if (tagIDs.length === 0) {
      return [];
    }

    const result = await this.petStorage
      .createQueryBuilder('pet')
      .leftJoinAndSelect('pet.category', 'category')
      .leftJoinAndSelect('pet.images', 'images')
      .leftJoinAndSelect('pet.tags', 'tag')
      .where('tag.id IN (:...ids)', { ids: tagIDs })
      .getMany();

    return result.map(PetMapper.toDomain);
  }

  async update(pet: Pet): Promise<Pet> {
    const result = await this.petStorage.save(PetMapper.toPersistence(pet));
    return PetMapper.toDomain(result);
  }

  async findAll(): Promise<Pet[]> {
    const result = await this.petStorage.find();
    return result.map(PetMapper.toDomain);
  }
}
