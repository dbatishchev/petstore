import { Pet } from '../../src/infra/typeorm/pet.orm';
import { Category } from '../../src/infra/typeorm/category.orm';
import { Tag } from '../../src/infra/typeorm/tag.orm';
import { PetStatusEnum } from '../../src/api/openapi/types';

export const generatePet = (
  partial: Partial<Pet> = {},
  categoryName = 'Test Category',
  tagName = 'Test Tag',
) => {
  const category = new Category();
  category.name = categoryName;

  const tag = new Tag();
  tag.name = tagName;

  const pet = new Pet();
  pet.name = partial.name ?? 'Test Pet';
  pet.status = (partial.status ?? PetStatusEnum.Available) as PetStatusEnum;
  pet.images = partial.images ?? [];
  pet.category = partial.category ?? category;
  pet.tags = partial.tags ?? [tag];

  return pet;
};
