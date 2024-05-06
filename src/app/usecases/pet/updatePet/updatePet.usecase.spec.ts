import { UpdatePetCommand } from './updatePet.command';
import NotFound from '../../../../common/error/notFound';
import InvalidArgument from '../../../../common/error/invalidArgument';
import UpdatePetUseCase from './updatePet.usecase';
import { FakePetRepository } from '../../../../../test/fakes/fakePetRepository';
import { FakeCategoryRepository } from '../../../../../test/fakes/fakeCategoryRepository';
import { FakeTagRepository } from '../../../../../test/fakes/fakeTagRepository';
import { PetStatusEnum } from '../../../../api/openapi/types';
import ImageService from '../../../service/imageService';
import { FakeImageRepository } from '../../../../../test/fakes/fakeImageRepository';

describe('UpdatePetUseCase', () => {
  let petRepository: FakePetRepository;
  let categoryRepository: FakeCategoryRepository;
  let tagRepository: FakeTagRepository;
  let updatePetUseCase: UpdatePetUseCase;
  let imageService: ImageService;

  beforeEach(() => {
    petRepository = new FakePetRepository();
    categoryRepository = new FakeCategoryRepository();
    tagRepository = new FakeTagRepository();
    imageService = new ImageService(new FakeImageRepository());
    updatePetUseCase = new UpdatePetUseCase(
      petRepository,
      categoryRepository,
      tagRepository,
      imageService,
    );
  });

  it('should update pet with valid data', async () => {
    const petId = 1;
    const initialPetData = {
      id: petId,
      name: 'Rex',
      images: [],
      status: PetStatusEnum.Available,
      category: { id: 1, name: 'Dogs' },
      tags: [{ id: 1, name: 'Tag1' }],
    };
    await petRepository.create(initialPetData);

    categoryRepository.create({ id: 1, name: 'Dogs' });
    tagRepository.createMany([
      { id: 1, name: 'Tag1' },
      { id: 2, name: 'Tag2' },
    ]);

    const command: UpdatePetCommand = {
      pet: {
        id: petId,
        name: 'Updated Rex',
        category: { id: 1, name: 'Dogs' },
        photoUrls: ['http://url1.jpeg', 'http://url2.jpeg'],
        tags: [
          { id: 1, name: 'Tag1' },
          { id: 2, name: 'Tag2' },
        ],
        status: PetStatusEnum.Available,
      },
    };
    await updatePetUseCase.execute(command);

    const updatedPet = await petRepository.findPetByID(petId);
    expect(updatedPet).toEqual({
      id: petId,
      name: 'Updated Rex',
      category: { id: 1, name: 'Dogs' },
      images: [
        {
          additionalMeta: '',
          filename: 'url1.jpeg',
          id: 1,
          mime: 'image/jpeg',
          path: 'http://url1.jpeg',
          type: 'external',
        },
        {
          additionalMeta: '',
          filename: 'url2.jpeg',
          id: 2,
          mime: 'image/jpeg',
          path: 'http://url2.jpeg',
          type: 'external',
        },
      ],
      tags: [
        { id: 1, name: 'Tag1' },
        { id: 2, name: 'Tag2' },
      ],
      status: PetStatusEnum.Available,
    });
  });

  it('should throw NotFound error if pet ID does not exist', async () => {
    const invalidPetId = 999;

    const command: UpdatePetCommand = {
      pet: {
        id: invalidPetId,
        name: 'Rex',
        photoUrls: [],
        status: PetStatusEnum.Available,
      },
    };
    await expect(updatePetUseCase.execute(command)).rejects.toThrow(NotFound);
  });

  it('should throw InvalidArgument error if category ID is provided but not found', async () => {
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

    const invalidCategoryId = 999;
    const updatedPetData = {
      id: petId,
      name: 'Updated Rex',
      category: { id: invalidCategoryId },
      photoUrls: ['url1', 'url2'],
      status: PetStatusEnum.Available,
    };

    const command: UpdatePetCommand = { pet: updatedPetData };
    await expect(updatePetUseCase.execute(command)).rejects.toThrow(
      InvalidArgument,
    );
  });

  it('should throw InvalidArgument error if some tag IDs are invalid', async () => {
    const petId = 1;
    const initialPetData = {
      id: petId,
      name: 'Rex',
      images: [],
      status: PetStatusEnum.Available,
      category: { id: 1, name: 'Dogs' },
      tags: [{ id: 1, name: 'Tag1' }],
    };
    await petRepository.create(initialPetData);

    categoryRepository.create({ id: 1, name: 'Dogs' });
    tagRepository.createMany([{ id: 1, name: 'Tag1' }]);

    const updatedPetData = {
      id: petId,
      name: 'Updated Rex',
      category: { id: 1, name: 'Dogs' },
      photoUrls: ['url1', 'url2'],
      tags: [
        { id: 1, name: 'Tag1' },
        { id: 2, name: 'Tag2' },
      ],
      status: PetStatusEnum.Available,
    };

    const command: UpdatePetCommand = { pet: updatedPetData };
    await expect(updatePetUseCase.execute(command)).rejects.toThrow(
      InvalidArgument,
    );
  });
});
