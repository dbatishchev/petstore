import { INestApplication } from '@nestjs/common';
import * as request from 'supertest';
import { useApplication } from './useApplication';
import { PetStatusEnum } from '../src/api/openapi/types';

describe('PetController (e2e)', () => {
  let app: INestApplication;

  const getApplication = useApplication();
  const { addPet, addCategory, addTag } = getApplication();

  beforeAll(async () => {
    const appState = getApplication();
    app = appState.app;
  });

  describe('/ (POST)', () => {
    it('should create a pet if the request is valid', () => {
      return request(app.getHttpServer())
        .post('/pet')
        .send({
          name: 'test-1',
          category: {
            name: 'test-category-1',
          },
          photoUrls: [],
          tags: [{ name: 'test-tag-1' }],
          status: 'available',
        })
        .expect(201)
        .expect((res) => {
          expect(res.body.name).toBe('test-1');
          expect(res.body.category.name).toBe('test-category-1');
          expect(res.body.tags[0].name).toBe('test-tag-1');
          expect(res.body.status).toBe('available');
        });
    });

    it('it should throw an error if the name does not provided', () => {
      return request(app.getHttpServer())
        .post('/pet')
        .send({
          category: {
            name: 'test-category-1',
          },
          photoUrls: [],
          tags: [{ name: 'test-tag-1' }],
          status: 'available',
        })
        .expect(400);
    });

    it('should create a pet even if the status is not provided', () => {
      return request(app.getHttpServer())
        .post('/pet')
        .send({
          name: 'test-1',
          category: {
            name: 'test-category-1',
          },
          photoUrls: [],
          tags: [{ name: 'test-tag-1' }],
        })
        .expect(201)
        .expect((res) => {
          expect(res.body.name).toBe('test-1');
        });
    });

    it('should create a pet even if the tags are not provided', () => {
      return request(app.getHttpServer())
        .post('/pet')
        .send({
          name: 'test-1',
          category: {
            name: 'test-category-1',
          },
          photoUrls: [],
          status: 'available',
        })
        .expect(201)
        .expect((res) => {
          expect(res.body.name).toBe('test-1');
        });
    });

    it('should create a pet even if the category is not provided', () => {
      return request(app.getHttpServer())
        .post('/pet')
        .send({
          name: 'test-1',
          category: {
            name: 'test-category-1',
          },
          photoUrls: [],
          status: 'available',
        })
        .expect(201)
        .expect((res) => {
          expect(res.body.name).toBe('test-1');
        });
    });

    it('should create a pet with "available" status if it is not provided', () => {
      return request(app.getHttpServer())
        .post('/pet')
        .send({
          name: 'test-1',
          category: {
            name: 'test-category-1',
          },
          photoUrls: [],
          tags: [{ name: 'test-tag-1' }],
        })
        .expect(201)
        .expect((res) => {
          expect(res.body.status).toBe('available');
        });
    });

    it('should create a pet with a new category if its id is not provided', () => {
      return request(app.getHttpServer())
        .post('/pet')
        .send({
          name: 'test-1',
          category: {
            name: 'new-category-1',
          },
          photoUrls: [],
          tags: [{ name: 'test-tag-1' }],
          status: 'available',
        })
        .expect(201)
        .expect((res) => {
          expect(res.body.category.name).toBe('new-category-1');
          expect(res.body.category.id).toBeDefined();
        });
    });

    it('should create a pet with a new tag if its id is not provided', () => {
      return request(app.getHttpServer())
        .post('/pet')
        .send({
          name: 'test-1',
          category: {
            name: 'test-category-1',
          },
          photoUrls: [],
          tags: [{ name: 'new-tag-1' }],
          status: 'available',
        })
        .expect(201)
        .expect((res) => {
          expect(res.body.tags[0].name).toBe('new-tag-1');
          expect(res.body.tags[0].id).toBeDefined();
        });
    });

    it('should throw an error if a category id is provided and not found', () => {
      return request(app.getHttpServer())
        .post('/pet')
        .send({
          name: 'test-1',
          category: {
            id: 999,
          },
          photoUrls: [],
          tags: [{ name: 'test-tag-1' }],
          status: 'available',
        })
        .expect(400);
    });

    it('should throw an error if a tag id is provided and not found', () => {
      return request(app.getHttpServer())
        .post('/pet')
        .send({
          name: 'test-1',
          category: {
            name: 'test-category-1',
          },
          photoUrls: [],
          tags: [{ id: 999, name: 'test-tag-1' }],
          status: 'available',
        })
        .expect(400);
    });

    it('should reuse existing category if its name is provided and it exists', async () => {
      const existingCategory = await addCategory({ name: 'new-category' });
      return request(app.getHttpServer())
        .post('/pet')
        .send({
          name: 'test-1',
          category: {
            name: existingCategory.name,
          },
          photoUrls: [],
          tags: [{ name: 'test-tag-1' }],
          status: 'available',
        })
        .expect(201)
        .expect((res) => {
          expect(res.body.category.id).toBe(existingCategory.id);
        });
    });
  });

  describe('/ (PUT)', () => {
    let existingCategory;
    let existingTag;
    let existingPet;

    beforeEach(async () => {
      existingCategory = await addCategory({ name: 'test-category-1' });
      existingTag = await addTag({ name: 'test-tag-1' });
      existingPet = await addPet({
        name: 'test-1',
        category: existingCategory,
        images: [],
        tags: [existingTag],
        status: PetStatusEnum.Available,
      });
    });

    it('should update a pet if the request is valid', async () => {
      return request(app.getHttpServer())
        .put('/pet')
        .send({
          id: existingPet.id,
          name: 'updated-test-1',
          category: existingCategory,
          photoUrls: [],
          tags: [existingTag],
          status: PetStatusEnum.Sold,
        })
        .expect(200)
        .expect((res) => {
          expect(res.body.name).toBe('updated-test-1');
          expect(res.body.photoUrls).toEqual([]);
          expect(res.body.status).toBe('sold');
        });
    });

    it('should throw an error if the pet id is not provided', () => {
      return request(app.getHttpServer())
        .put('/pet')
        .send({
          name: 'updated-test-1',
          category: {
            name: 'test-category-1',
          },
          photoUrls: [],
          tags: [{ name: 'test-tag-1' }],
          status: 'sold',
        })
        .expect(400);
    });

    it('should throw an error if the pet id is not found', () => {
      return request(app.getHttpServer())
        .put('/pet')
        .send({
          id: 9999,
          name: 'updated-test-1',
          category: {
            name: 'test-category-1',
          },
          photoUrls: [],
          tags: [{ name: 'test-tag-1' }],
          status: 'sold',
        })
        .expect(404);
    });

    it('should throw an error if the category id is provided and not found', () => {
      return request(app.getHttpServer())
        .put('/pet')
        .send({
          id: existingPet.id,
          name: 'updated-test-1',
          category: {
            id: 999,
          },
          photoUrls: [],
          tags: [{ name: 'test-tag-1' }],
          status: 'sold',
        })
        .expect(400);
    });

    it('should throw an error if the tag id is provided and not found', () => {
      return request(app.getHttpServer())
        .put('/pet')
        .send({
          id: existingPet.id,
          name: 'updated-test-1',
          category: {
            name: 'test-category-1',
          },
          photoUrls: [],
          tags: [{ id: 999, name: 'test-tag-1' }],
          status: 'sold',
        })
        .expect(400);
    });

    it('should reuse existing category if its name is provided and it exists', async () => {
      const existingCategory = await addCategory({ name: 'new-category' });
      return request(app.getHttpServer())
        .put('/pet')
        .send({
          id: existingPet.id,
          name: 'test-1',
          category: {
            name: existingCategory.name,
          },
          photoUrls: [],
          tags: [{ name: 'test-tag-1' }],
          status: 'available',
        })
        .expect(200)
        .expect((res) => {
          expect(res.body.category.id).toBe(existingCategory.id);
        });
    });

    it('should reuse existing tag if its name is provided and it exists', async () => {
      const existingTag = await addTag({ name: 'new-tag' });
      return request(app.getHttpServer())
        .put('/pet')
        .send({
          id: existingPet.id,
          name: 'test-1',
          category: {
            name: 'test-category-1',
          },
          photoUrls: [],
          tags: [{ name: existingTag.name }],
          status: 'available',
        })
        .expect(200)
        .expect((res) => {
          expect(res.body.tags[0].id).toBe(existingTag.id);
        });
    });

    it('should make category empty if its not provided', async () => {
      return request(app.getHttpServer())
        .put('/pet')
        .send({
          id: existingPet.id,
          name: 'test-1',
          photoUrls: [],
          tags: [{ name: 'test-tag-1' }],
          status: 'available',
        })
        .expect(200)
        .expect((res) => {
          expect(res.body.category).toBe(null);
        });
    });

    it('should make tags empty if its not provided', async () => {
      return request(app.getHttpServer())
        .put('/pet')
        .send({
          id: existingPet.id,
          name: 'test-1',
          category: {
            name: 'test-category-1',
          },
          photoUrls: [],
          status: 'available',
        })
        .expect(200)
        .expect((res) => {
          expect(res.body.tags).toEqual([]);
        });
    });
  });

  describe('/findByStatus (GET)', () => {
    it('should return pets with the given status', async () => {
      await addPet({ status: PetStatusEnum.Available });
      await addPet({ status: PetStatusEnum.Pending });
      await addPet({ status: PetStatusEnum.Sold });

      return request(app.getHttpServer())
        .get('/pet/findByStatus')
        .query({ status: 'available' })
        .expect(200)
        .expect((res) => {
          expect(Array.isArray(res.body)).toBeTruthy();
          expect(res.body.length).toBeGreaterThan(0);
          expect(
            res.body.every((pet) => pet.status === 'available'),
          ).toBeTruthy();
        });
    });

    it('should return empty array if no pets found with the given status', async () => {
      await addPet({ status: PetStatusEnum.Available });
      await addPet({ status: PetStatusEnum.Available });
      await addPet({ status: PetStatusEnum.Sold });
      await addPet({ status: PetStatusEnum.Sold });

      return request(app.getHttpServer())
        .get('/pet/findByStatus')
        .query({ status: PetStatusEnum.Pending })
        .expect(200)
        .expect((res) => {
          expect(Array.isArray(res.body)).toBeTruthy();
          expect(res.body.length).toBe(0);
        });
    });

    it('should return pets with status "Available" if no status is provided', async () => {
      await addPet({ status: PetStatusEnum.Available });
      await addPet({ status: PetStatusEnum.Available });
      await addPet({ status: PetStatusEnum.Sold });
      await addPet({ status: PetStatusEnum.Sold });

      return request(app.getHttpServer())
        .get('/pet/findByStatus')
        .expect(200)
        .expect((res) => {
          expect(Array.isArray(res.body)).toBeTruthy();
          expect(res.body.length).toBeGreaterThan(0);
          expect(
            res.body.every((pet) => pet.status === 'available'),
          ).toBeTruthy();
        });
    });

    it('should throw an error if the status is not valid', async () => {
      return request(app.getHttpServer())
        .get('/pet/findByStatus')
        .query({ status: 'invalid-status' })
        .expect(400);
    });
  });

  describe('/findByTags (GET)', () => {
    it('should return pets with the given tags', async () => {
      const tag1 = await addTag({ name: 'tag1' });
      const tag2 = await addTag({ name: 'tag2' });
      const tag3 = await addTag({ name: 'tag3' });
      await addPet({ tags: [{ id: tag1.id, name: 'tag1' }] });
      await addPet({ tags: [{ id: tag1.id, name: 'tag1' }] });
      await addPet({ tags: [{ id: tag2.id, name: 'tag2' }] });
      await addPet({ tags: [{ id: tag2.id, name: 'tag2' }] });
      await addPet({ tags: [{ id: tag3.id, name: 'tag3' }] });
      await addPet({ tags: [{ id: tag3.id, name: 'tag3' }] });

      return request(app.getHttpServer())
        .get('/pet/findByTags')
        .query({ tags: ['tag1', 'tag2'] })
        .expect(200)
        .expect((res) => {
          expect(
            res.body.every((pet) =>
              pet.tags.some((tag) => ['tag1', 'tag2'].includes(tag.name)),
            ),
          ).toBeTruthy();
        });
    });

    it('should return all pets if no tags are provided', async () => {
      const tag1 = await addTag({ name: 'tag1' });
      const tag2 = await addTag({ name: 'tag2' });
      const tag3 = await addTag({ name: 'tag3' });
      await addPet({ tags: [{ id: tag1.id, name: 'tag1' }] });
      await addPet({ tags: [{ id: tag2.id, name: 'tag2' }] });
      await addPet({ tags: [{ id: tag3.id, name: 'tag3' }] });

      return request(app.getHttpServer())
        .get('/pet/findByTags')
        .query({ tags: [] })
        .expect(200)
        .expect((res) => {
          expect(Array.isArray(res.body)).toBeTruthy();
          expect(res.body.length).toBe(3);
        });
    });
  });

  it('should return empty response if no exising tags are provided', async () => {
    const tag1 = await addTag({ name: 'tag1' });
    const tag2 = await addTag({ name: 'tag2' });
    const tag3 = await addTag({ name: 'tag3' });
    await addPet({ tags: [{ id: tag1.id, name: 'tag1' }] });
    await addPet({ tags: [{ id: tag2.id, name: 'tag2' }] });
    await addPet({ tags: [{ id: tag3.id, name: 'tag3' }] });

    return request(app.getHttpServer())
      .get('/pet/findByTags')
      .query({ tags: ['tag4', 'tag5'] })
      .expect(200)
      .expect((res) => {
        expect(Array.isArray(res.body)).toBeTruthy();
        expect(res.body.length).toBe(0);
      });
  });

  describe('/:petId (GET)', () => {
    it('should return a pet with the given id', async () => {
      const pet = await addPet();

      return request(app.getHttpServer())
        .get(`/pet/${pet.id}`)
        .expect(200)
        .expect((res) => {
          expect(res.body.id).toBe(pet.id);
        });
    });

    it('should throw an error if the pet is not found', async () => {
      return request(app.getHttpServer()).get('/pet/9999').expect(404);
    });

    it('should throw an error if the pet id is not valid', async () => {
      return request(app.getHttpServer()).get('/pet/invalid-id').expect(400);
    });
  });

  describe('/:petId (POST)', () => {
    it('should update a pet with the given id', async () => {
      const pet = await addPet();

      return request(app.getHttpServer())
        .post(`/pet/${pet.id}?name=updated-test-1&status=sold`)
        .expect(200)
        .expect((res) => {
          expect(res.body.name).toBe('updated-test-1');
          expect(res.body.status).toBe('sold');
        });
    });

    it('should throw an error if the pet id is not valid', async () => {
      return request(app.getHttpServer()).post('/pet/invalid-id').expect(400);
    });

    it('should throw an error if the status is not valid', async () => {
      const pet = await addPet();

      return request(app.getHttpServer())
        .post(`/pet/${pet.id}?status=invalid-status`)
        .expect(400);
    });

    it('should throw an error if the pet id is not found', async () => {
      return request(app.getHttpServer()).post('/pet/9999').expect(404);
    });

    it('should keep the old status if the new status is not provided', async () => {
      const pet = await addPet({ status: PetStatusEnum.Available });

      return request(app.getHttpServer())
        .post(`/pet/${pet.id}?name=updated-test-1`)
        .expect(200)
        .expect((res) => {
          expect(res.body.status).toBe('available');
        });
    });

    it('should keep the old name if the new name is not provided', async () => {
      const pet = await addPet({ name: 'test-1' });

      return request(app.getHttpServer())
        .post(`/pet/${pet.id}?status=sold`)
        .expect(200)
        .expect((res) => {
          expect(res.body.name).toBe('test-1');
        });
    });
  });

  describe('/:petId (DELETE)', () => {
    it('should delete a pet with the given id', async () => {
      const pet = await addPet();

      return request(app.getHttpServer()).delete(`/pet/${pet.id}`).expect(200);
    });

    it('should throw an error if the pet id is not valid', async () => {
      return request(app.getHttpServer()).delete('/pet/invalid-id').expect(400);
    });

    it('should return 204 if the pet is not found', async () => {
      return request(app.getHttpServer()).delete('/pet/9999').expect(204);
    });
  });

  // it('/:petId/uploadImage (POST)', () => {
  //   const petId = 1; // assuming there's a pet with ID 1
  //   return request(app.getHttpServer())
  //     .post(`/pet/${petId}/uploadImage`)
  //     .expect(200)
  //     .expect((res) => {
  //       // Add your own expectations based on what the API returns for this endpoint
  //     });
  // });
});
