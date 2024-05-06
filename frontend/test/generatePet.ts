import { Pet, PetStatusEnum } from '../src/features/pets/api/api';

export const generatePet = (partial: Partial<Pet> = {}) => {
  return {
    id: 1,
    name: 'Test Pet',
    category: {
      id: 1,
      name: 'Test Category',
    },
    photoUrls: [],
    status: PetStatusEnum.Available,
    tags: [
      {
        id: 1,
        name: 'test-tag-1',
      },
      {
        id: 2,
        name: 'test-tag-2',
      },
    ],
    ...partial,
  };
};
