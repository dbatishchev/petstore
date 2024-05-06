import { FindPetByIDQuery } from './findPetByID.query';
import NotFound from '../../../../common/error/notFound';
import FindPetByIDUseCase from './findPetByID.usecase';
import { FakePetRepository } from '../../../../../test/fakes/fakePetRepository';
import { PetStatusEnum } from '../../../../api/openapi/types';

describe('FindPetByIDUseCase', () => {
  let petRepository: FakePetRepository;
  let findPetByIDUseCase: FindPetByIDUseCase;

  beforeEach(() => {
    petRepository = new FakePetRepository();
    findPetByIDUseCase = new FindPetByIDUseCase(petRepository);
  });

  it('should return pet if ID exists', async () => {
    const petId = 1;
    const petData = {
      id: petId,
      name: 'Rex',
      images: [],
      status: PetStatusEnum.Available,
      category: { id: 1, name: 'Dog' },
      tags: [],
    };
    await petRepository.create(petData);

    const pet = await findPetByIDUseCase.execute({ id: petId });

    expect(pet).toEqual(petData);
  });

  it('should throw NotFound error if pet ID does not exist', async () => {
    const invalidPetId = 999;

    const query: FindPetByIDQuery = { id: invalidPetId };
    await expect(findPetByIDUseCase.execute(query)).rejects.toThrow(NotFound);
  });
});
