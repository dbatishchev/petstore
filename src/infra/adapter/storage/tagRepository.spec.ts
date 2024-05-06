import { Test, TestingModule } from '@nestjs/testing';
import { DataSource } from 'typeorm';
import { TagRepository } from './tagRepository';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Tag } from '../../typeorm/tag.orm';
import { generateTag } from '../../../../test/generator/generateTag';
import { TypeormTestingModule } from '../../../../test/setup/typeorm-testing.module';

describe('TagRepository', () => {
  let module: TestingModule;
  let connection: DataSource;
  let repository: TagRepository;

  beforeAll(async () => {
    module = await Test.createTestingModule({
      imports: [...TypeormTestingModule(), TypeOrmModule.forFeature([Tag])],
      providers: [TagRepository],
    }).compile();

    connection = module.get<DataSource>(DataSource);
    repository = module.get<TagRepository>(TagRepository);
  });

  afterEach(async () => {
    const tagRepository = connection.getRepository(Tag);
    await tagRepository.clear();
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

  describe('findByNames', () => {
    it('should return an array of tags with the given names', async () => {
      const tags = [
        generateTag({ name: 'Tag1' }),
        generateTag({ name: 'Tag2' }),
      ];
      await connection.manager.save(Tag, tags);

      const result = await repository.findByNames(['Tag1', 'Tag2']);

      expect(result.length).toEqual(2);
    });

    it('should return an empty array if no tags found with the given names', async () => {
      const result = await repository.findByNames(['NonExistingTag']);

      expect(result.length).toEqual(0);
    });
  });

  describe('findByIDs', () => {
    it('should return an array of tags with the given IDs', async () => {
      const tags = [
        generateTag({ name: 'Test Tag 1' }),
        generateTag({ name: 'Test Tag 2' }),
      ];
      await connection.manager.save(Tag, tags);

      const result = await repository.findByIDs([tags[0].id, tags[1].id]);

      expect(result.length).toEqual(2);
    });

    it('should return an empty array if no tags found with the given IDs', async () => {
      const result = await repository.findByIDs([9999, 8888]);

      expect(result.length).toEqual(0);
    });
  });

  describe('findOrByNameCreate', () => {
    it('should return an existing tag if found by name', async () => {
      const tagName = 'Existing Tag';
      const tag = generateTag({ name: tagName });
      await connection.manager.save(Tag, tag);

      const result = await repository.findOrByNameCreate(tagName);
      expect(result.name).toEqual(tagName);
    });

    it('should create and return a new tag if not found by name', async () => {
      const tagName = 'New Tag';

      const result = await repository.findOrByNameCreate(tagName);
      expect(result.name).toEqual(tagName);
    });
  });
});
