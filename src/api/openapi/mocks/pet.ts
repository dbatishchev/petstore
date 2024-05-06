import { Pet, PetStatusEnum } from '../types';

export const petMock: Pet = {
  id: 1,
  name: 'doggie',
  category: {
    id: 1,
    name: 'test-category',
  },
  photoUrls: ['test-url'],
  tags: [
    {
      id: 1,
      name: 'test-tag',
    },
  ],
  status: PetStatusEnum.Available,
};
