import { CreatePetCommand } from './createPet.command';
import InvalidArgument from '../../../../common/error/invalidArgument';
import CreatePetUseCase from './createPet.usecase';
import { FakePetRepository } from '../../../../../test/fakes/fakePetRepository';
import { FakeCategoryRepository } from '../../../../../test/fakes/fakeCategoryRepository';
import { FakeTagRepository } from '../../../../../test/fakes/fakeTagRepository';
import { PetStatusEnum } from '../../../../api/openapi/types';
import ImageService from '../../../service/imageService';
import { FakeImageRepository } from '../../../../../test/fakes/fakeImageRepository';

describe('CreatePetUseCase', () => {
  let petRepository: FakePetRepository;
  let categoryRepository: FakeCategoryRepository;
  let tagRepository: FakeTagRepository;
  let createPetUseCase: CreatePetUseCase;
  let imageService: ImageService;

  beforeEach(() => {
    petRepository = new FakePetRepository();
    categoryRepository = new FakeCategoryRepository();
    tagRepository = new FakeTagRepository();
    imageService = new ImageService(new FakeImageRepository());
    createPetUseCase = new CreatePetUseCase(
      petRepository,
      categoryRepository,
      tagRepository,
      imageService,
    );
  });

  it('should create a pet with valid data', async () => {
    categoryRepository.create({ id: 1, name: 'Dogs' });
    tagRepository.createMany([
      { id: 1, name: 'Tag1' },
      { id: 2, name: 'Tag2' },
    ]);

    const command: CreatePetCommand = {
      pet: {
        name: 'Rex',
        category: { id: 1, name: 'Dogs' },
        photoUrls: ['http://url1.jpeg', 'http://url2.jpeg'],
        tags: [
          { id: 1, name: 'Tag1' },
          { id: 2, name: 'Tag2' },
        ],
        status: PetStatusEnum.Available,
      },
    };

    const result = await createPetUseCase.execute(command);

    expect(await petRepository.findPetByID(result.id)).toMatchObject({
      name: 'Rex',
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

  it('should throw InvalidArgument error if category ID is provided but not found', async () => {
    const command: CreatePetCommand = {
      pet: {
        name: 'Rex',
        category: { id: 1 },
        photoUrls: ['url1', 'url2'],
        tags: [],
        status: PetStatusEnum.Available,
      },
    };

    await expect(createPetUseCase.execute(command)).rejects.toThrow(
      InvalidArgument,
    );
  });

  it('should throw InvalidArgument error if some tag IDs are invalid', async () => {
    categoryRepository.create({ id: 1, name: 'Dogs' });
    tagRepository.createMany([{ id: 1, name: 'Tag1' }]);
    const command: CreatePetCommand = {
      pet: {
        name: 'Rex',
        category: { id: 1, name: 'Dogs' },
        photoUrls: ['url1', 'url2'],
        tags: [
          { id: 1, name: 'Tag1' },
          { id: 2, name: 'Tag2' },
        ],
        status: PetStatusEnum.Available,
      },
    };
    await expect(createPetUseCase.execute(command)).rejects.toThrow(
      InvalidArgument,
    );
  });

  it('should create a pet without tags', async () => {
    const command: CreatePetCommand = {
      pet: {
        name: 'Rex',
        category: { id: 1, name: 'Dogs' },
        photoUrls: ['http://url1.jpeg', 'http://url2.jpeg'],
        status: PetStatusEnum.Available,
      },
    };

    await categoryRepository.create({ id: 1, name: 'Dogs' });
    const result = await createPetUseCase.execute(command);

    expect(await petRepository.findPetByID(result.id)).toMatchObject({
      name: 'Rex',
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
      tags: [],
      status: PetStatusEnum.Available,
    });
  });

  it('should create a pet with a new category', async () => {
    const command: CreatePetCommand = {
      pet: {
        name: 'Rex',
        category: { name: 'Cats' },
        photoUrls: ['url1', 'url2'],
        status: PetStatusEnum.Available,
      },
    };

    await createPetUseCase.execute(command);
    expect(await categoryRepository.findByID(1)).toEqual({
      id: 1,
      name: 'Cats',
    });
  });
});
