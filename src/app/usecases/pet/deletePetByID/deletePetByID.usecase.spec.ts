import { DeletePetByIDCommand } from './deletePetByID.command';
import NoContent from '../../../../common/error/noContent';
import DeletePetByIDUseCase from './deletePetByID.usecase';
import { FakePetRepository } from '../../../../../test/fakes/fakePetRepository';
import { PetStatusEnum } from '../../../../api/openapi/types';

describe('DeletePetByIDUseCase', () => {
  let petRepository: FakePetRepository;
  let deletePetByIDUseCase: DeletePetByIDUseCase;

  beforeEach(() => {
    petRepository = new FakePetRepository();
    deletePetByIDUseCase = new DeletePetByIDUseCase(petRepository);
  });

  it('should delete a pet if ID exists', async () => {
    const petId = 1;
    await petRepository.create({
      name: 'Rex',
      images: [],
      status: PetStatusEnum.Available,
      category: { id: 1, name: 'Dogs' },
      tags: [],
    });

    const command: DeletePetByIDCommand = { id: petId };
    await deletePetByIDUseCase.execute(command);

    expect(await petRepository.findPetByID(petId)).toBeFalsy();
  });

  it('should throw NoContent error if pet ID does not exist', async () => {
    const invalidPetId = 999;

    const command: DeletePetByIDCommand = { id: invalidPetId };
    await expect(deletePetByIDUseCase.execute(command)).rejects.toThrow(
      NoContent,
    );
  });
});
