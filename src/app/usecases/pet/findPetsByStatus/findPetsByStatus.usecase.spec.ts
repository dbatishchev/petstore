import { FindPetsByStatusQuery } from './findPetsByStatus.query';
import FindPetsByStatusUseCase from './findPetsByStatus.usecase';
import { FakePetRepository } from '../../../../../test/fakes/fakePetRepository';
import { PetStatusEnum } from '../../../../api/openapi/types';

describe('FindPetsByStatusUseCase', () => {
  let petRepository: FakePetRepository;
  let findPetsByStatusUseCase: FindPetsByStatusUseCase;

  beforeEach(() => {
    petRepository = new FakePetRepository();
    findPetsByStatusUseCase = new FindPetsByStatusUseCase(petRepository);
  });

  it('should return pets with given status', async () => {
    const status = PetStatusEnum.Available;
    const pets = [
      {
        id: 1,
        name: 'Rex',
        images: [],
        status: status,
        category: { id: 1, name: 'Dog' },
        tags: [],
      },
      {
        id: 2,
        name: 'Max',
        images: [],
        status: status,
        category: { id: 1, name: 'Dog' },
        tags: [],
      },
    ];
    pets.forEach(async (pet) => await petRepository.create(pet));

    const query: FindPetsByStatusQuery = { status };
    const foundPets = await findPetsByStatusUseCase.execute(query);

    expect(foundPets).toEqual(pets);
  });

  it('should return an empty array if no pets found with given status', async () => {
    const status = PetStatusEnum.Sold;

    const query: FindPetsByStatusQuery = { status };
    const foundPets = await findPetsByStatusUseCase.execute(query);

    expect(foundPets).toEqual([]);
  });
});
