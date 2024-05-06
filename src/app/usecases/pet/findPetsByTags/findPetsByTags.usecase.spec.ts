import { FindPetsByTagsQuery } from './findPetsByTags.query';
import FindPetsByTagsUseCase from './findPetsByTags.usecase';
import { FakePetRepository } from '../../../../../test/fakes/fakePetRepository';
import { FakeTagRepository } from '../../../../../test/fakes/fakeTagRepository';
import { PetStatusEnum } from '../../../../api/openapi/types';

describe('FindPetsByTagsUseCase', () => {
  let petRepository: FakePetRepository;
  let tagRepository: FakeTagRepository;
  let findPetsByTagsUseCase: FindPetsByTagsUseCase;

  beforeEach(() => {
    petRepository = new FakePetRepository();
    tagRepository = new FakeTagRepository();
    findPetsByTagsUseCase = new FindPetsByTagsUseCase(
      petRepository,
      tagRepository,
    );
  });

  it('should return pets with given tags', async () => {
    tagRepository.createMany(
      ['tag1', 'tag2', 'tag3'].map((name, index) => ({ id: index + 1, name })),
    );
    const pets = [
      {
        name: 'Rex',
        images: [],
        status: PetStatusEnum.Available,
        tags: [{ id: 1, name: 'tag1' }],
        category: { id: 1, name: 'category1' },
      },
      {
        name: 'Max',
        images: [],
        status: PetStatusEnum.Available,
        tags: [{ id: 2, name: 'tag2' }],
        category: { id: 2, name: 'category2' },
      },
      {
        name: 'Buddy',
        images: [],
        status: PetStatusEnum.Available,
        tags: [{ id: 3, name: 'tag3' }],
        category: { id: 3, name: 'category3' },
      },
    ];
    pets.forEach(async (pet) => await petRepository.create(pet));

    const foundPets = await findPetsByTagsUseCase.execute({
      tags: ['tag1', 'tag2'],
    });
    expect(foundPets.length).toEqual(2);
  });

  it('should return an empty array if no pets found with given tags', async () => {
    const tags = ['tag3', 'tag4'];
    const query: FindPetsByTagsQuery = { tags };
    const foundPets = await findPetsByTagsUseCase.execute(query);

    expect(foundPets).toEqual([]);
  });

  it('should return an empty array if tags array is empty', async () => {
    const tags: string[] = [];
    const query: FindPetsByTagsQuery = { tags };
    const foundPets = await findPetsByTagsUseCase.execute(query);

    expect(foundPets).toEqual([]);
  });
});
