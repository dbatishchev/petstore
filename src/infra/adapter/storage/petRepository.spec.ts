import { Test, TestingModule } from '@nestjs/testing';
import { DataSource } from 'typeorm';
import { PetRepository } from './petRepository';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Pet } from '../../typeorm/pet.orm';
import { Category } from '../../typeorm/category.orm';
import { Tag } from '../../typeorm/tag.orm';
import { PetStatusEnum } from '../../../api/openapi/types';
import { generatePet } from '../../../../test/generator/generatePet';
import { TypeormTestingModule } from '../../../../test/setup/typeorm-testing.module';

describe('PetRepository', () => {
  let module: TestingModule;
  let connection: DataSource;
  let repository: PetRepository;

  beforeAll(async () => {
    module = await Test.createTestingModule({
      imports: [
        ...TypeormTestingModule(),
        TypeOrmModule.forFeature([Pet, Category, Tag]),
      ],
      providers: [PetRepository],
    }).compile();

    connection = module.get<DataSource>(DataSource);
    repository = module.get<PetRepository>(PetRepository);
  });

  afterEach(async () => {
    for (const entity of [Pet, Category, Tag]) {
      const repository = connection.getRepository(entity.name);
      await repository.clear();
    }
  });

  afterAll(async () => {
    await connection.close();
  });

  beforeEach(async () => {
    await connection.synchronize(true);
  });

  it('should be defined', () => {
    expect(repository).toBeDefined();
  });

  describe('findPetByID', () => {
    it('should return null if pet with given id is not found', async () => {
      const result = await repository.findPetByID(1);
      expect(result).toBeNull();
    });

    it('should return a Pet object if pet with given id is found', async () => {
      const pet = generatePet();
      const insertedPet = await connection.manager.save(Pet, pet);

      const result = await repository.findPetByID(insertedPet.id);
      expect(result.id).toEqual(insertedPet.id);
    });
  });

  describe('create', () => {
    it('should create a new pet and return it', async () => {
      const pet = generatePet({});
      const createdPet = await repository.create(pet);

      expect(createdPet.id).toBeDefined();
    });
  });

  describe('deleteByID', () => {
    it('should delete the pet with the given id', async () => {
      const pet = generatePet();
      const insertedPet = await connection.manager.save(Pet, pet);

      await repository.deleteByID(insertedPet.id);

      const result = await repository.findPetByID(insertedPet.id);
      expect(result).toBeNull();
    });
  });

  describe('findPetByStatus', () => {
    it('should return an array of pets with the given status', async () => {
      const pets = [
        generatePet(
          {
            status: PetStatusEnum.Pending,
          },
          'category-1',
          'tag-1',
        ),
        generatePet(
          {
            status: PetStatusEnum.Pending,
          },
          'category-2',
          'tag-2',
        ),
      ];
      await connection.manager.save(Pet, pets);

      const result = await repository.findPetByStatus(PetStatusEnum.Pending);

      expect(result.length).toBeGreaterThan(0);
    });
  });

  describe('findPetsByTags', () => {
    it('should return an array of pets with the given tag IDs', async () => {
      const pet = generatePet();
      await connection.manager.save(Pet, pet);

      const result = await repository.findPetsByTags([1]);
      expect(result.length).toBeGreaterThan(0);
    });
  });

  describe('update', () => {
    it('should update the given pet and return the updated pet', async () => {
      const pet = generatePet();
      const insertedPet = await connection.manager.save(Pet, pet);

      insertedPet.name = 'Updated Name';
      const updatedPet = await repository.update(insertedPet);

      expect(updatedPet.name).toEqual('Updated Name');
    });
  });
});
