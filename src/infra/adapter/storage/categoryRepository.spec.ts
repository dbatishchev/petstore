import { Test, TestingModule } from '@nestjs/testing';
import { DataSource } from 'typeorm';
import { CategoryRepository } from './categoryRepository';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Category } from '../../typeorm/category.orm';
import { generateCategory } from '../../../../test/generator/generateCategory';
import { TypeormTestingModule } from '../../../../test/setup/typeorm-testing.module';

describe('CategoryRepository', () => {
  let module: TestingModule;
  let connection: DataSource;
  let repository: CategoryRepository;

  beforeAll(async () => {
    module = await Test.createTestingModule({
      imports: [
        ...TypeormTestingModule(),
        TypeOrmModule.forFeature([Category]),
      ],
      providers: [CategoryRepository],
    }).compile();

    connection = module.get<DataSource>(DataSource);
    repository = module.get<CategoryRepository>(CategoryRepository);
  });

  afterEach(async () => {
    const categoryRepository = connection.getRepository(Category);
    await categoryRepository.clear();
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

  describe('findByID', () => {
    it('should return null if category with given id is not found', async () => {
      const result = await repository.findByID(1);
      expect(result).toBeNull();
    });

    it('should return a Category object if category with given id is found', async () => {
      const category = generateCategory();
      const insertedCategory = await connection.manager.save(
        Category,
        category,
      );

      const result = await repository.findByID(insertedCategory.id);
      expect(result.id).toEqual(insertedCategory.id);
    });
  });

  describe('findByNameOrCreate', () => {
    it('should return an existing category if found by name', async () => {
      const categoryName = 'Existing Category';
      const category = generateCategory({ name: categoryName });
      await connection.manager.save(Category, category);

      const result = await repository.findByNameOrCreate(categoryName);
      expect(result.name).toEqual(categoryName);
    });

    it('should create and return a new category if not found by name', async () => {
      const categoryName = 'New Category';

      const result = await repository.findByNameOrCreate(categoryName);
      expect(result.name).toEqual(categoryName);
    });
  });
});
