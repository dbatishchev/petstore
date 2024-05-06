import { Pet as PetPersistenceModel } from '../pet.orm';
import { Pet } from '../../../domain/entity/pet';
import { PetStatusEnum } from '../../../api/openapi/types';

export class PetMapper {
  static toDomain(pet: PetPersistenceModel): Pet {
    return {
      id: pet.id,
      name: pet.name,
      category: pet.category,
      images: pet.images,
      tags: pet.tags,
      status: pet.status as PetStatusEnum,
    };
  }

  static toPersistence(pet: PartialBy<Pet, 'id'>): PetPersistenceModel {
    const petPersistenceModel = new PetPersistenceModel();
    petPersistenceModel.id = pet.id;
    petPersistenceModel.name = pet.name;
    petPersistenceModel.category = pet.category;
    petPersistenceModel.images = pet.images;
    petPersistenceModel.tags = pet.tags;
    petPersistenceModel.status = pet.status;
    return petPersistenceModel;
  }
}
