import { UpdatePetByIDCommand } from './updatePetByID.command';
import NotFound from '../../../../common/error/notFound';
import UpdatePetByIDUseCase from './updatePetByID.usecase';
import { FakePetRepository } from '../../../../../test/fakes/fakePetRepository';
import { PetStatusEnum } from '../../../../api/openapi/types';

describe('UpdatePetByIDUseCase', () => {
  let petRepository: FakePetRepository;
  let updatePetByIDUseCase: UpdatePetByIDUseCase;

  beforeEach(() => {
    petRepository = new FakePetRepository();
    updatePetByIDUseCase = new UpdatePetByIDUseCase(petRepository);
  });

  it('should update pet name if provided', async () => {
    const petId = 1;
    const initialPetData = {
      id: petId,
      name: 'Rex',
      images: [],
      status: PetStatusEnum.Available,
      category: { id: 1, name: 'Dogs' },
      tags: [],
    };
    await petRepository.create(initialPetData);

    const newName = 'New Rex';
    const command: UpdatePetByIDCommand = {
      id: petId,
      name: newName,
      status: undefined,
    };

    await updatePetByIDUseCase.execute(command);

    const updatedPet = await petRepository.findPetByID(petId);
    expect(updatedPet.name).toEqual(newName);
  });

  it('should update pet status if provided', async () => {
    const petId = 1;
    const initialPetData = {
      id: petId,
      name: 'Rex',
      images: [],
      status: PetStatusEnum.Available,
      category: { id: 1, name: 'Dogs' },
      tags: [],
    };
    await petRepository.create(initialPetData);

    const newStatus = PetStatusEnum.Pending;
    const command: UpdatePetByIDCommand = {
      id: petId,
      status: newStatus,
      name: undefined,
    };

    await updatePetByIDUseCase.execute(command);

    const updatedPet = await petRepository.findPetByID(petId);
    expect(updatedPet.status).toEqual(newStatus);
  });

  it('should throw NotFound error if pet ID does not exist', async () => {
    const invalidPetId = 999;
    const command: UpdatePetByIDCommand = {
      id: invalidPetId,
      name: 'New Name',
      status: PetStatusEnum.Pending,
    };

    await expect(updatePetByIDUseCase.execute(command)).rejects.toThrow(
      NotFound,
    );
  });

  it('should not update pet if neither name nor status is provided', async () => {
    const petId = 1;
    const initialPetData = {
      id: petId,
      name: 'Rex',
      images: [],
      status: PetStatusEnum.Available,
      category: { id: 1, name: 'Dogs' },
      tags: [],
    };
    await petRepository.create(initialPetData);

    await updatePetByIDUseCase.execute({
      id: petId,
      name: undefined,
      status: undefined,
    });

    const updatedPet = await petRepository.findPetByID(petId);
    expect(updatedPet.name).toEqual(initialPetData.name);
    expect(updatedPet.status).toEqual(initialPetData.status);
  });
});
