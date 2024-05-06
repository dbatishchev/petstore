import { Pet } from '../openapi/types';
import { PetDTO } from '../../app/dto/pet.dto';
import { Pet as PetDomain } from '../../domain/entity/pet';

export class PetMapper {
  public static toEventDTO(pet: Pet): PetDTO {
    return { ...pet };
  }

  public static fromDomain(pet: PetDomain): Pet {
    return {
      id: pet.id,
      name: pet.name,
      status: pet.status,
      category: pet.category,
      photoUrls: pet.images.map((image) => image.path),
      tags: pet.tags,
    };
  }
}
