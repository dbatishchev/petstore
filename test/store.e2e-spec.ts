import { INestApplication } from '@nestjs/common';
import * as request from 'supertest';
import { useApplication } from './useApplication';
import { OrderStatusEnum } from '../src/api/openapi/types';

describe('StoreController (e2e)', () => {
  let app: INestApplication;
  let pet;

  const getApplication = useApplication();
  const { addOrder, addPet } = getApplication();

  beforeAll(async () => {
    const appState = getApplication();
    app = appState.app;
  });

  beforeEach(async () => {
    pet = await addPet();
  });

  describe('/inventory (GET)', () => {
    it('should return inventory levels', async () => {
      await addOrder({ status: OrderStatusEnum.Approved, pet });
      await addOrder({ status: OrderStatusEnum.Approved, pet });
      await addOrder({ status: OrderStatusEnum.Approved, pet });
      await addOrder({ status: OrderStatusEnum.Delivered, pet });
      await addOrder({ status: OrderStatusEnum.Placed, pet });
      await addOrder({ status: OrderStatusEnum.Placed, pet });
      await addOrder({ status: OrderStatusEnum.Placed, pet });
      await addOrder({ status: OrderStatusEnum.Placed, pet });

      return request(app.getHttpServer())
        .get('/store/inventory')
        .expect(200)
        .expect((res) => {
          expect(res.body).toEqual({ approved: 3, placed: 4, delivered: 1 });
        });
    });

    it('should return 0 for all statuses if there are no orders', async () => {
      return request(app.getHttpServer())
        .get('/store/inventory')
        .expect(200)
        .expect((res) => {
          expect(res.body).toEqual({ approved: 0, placed: 0, delivered: 0 });
        });
    });
  });

  describe('/order (POST)', () => {
    it('should place an order', async () => {
      return request(app.getHttpServer())
        .post('/store/order')
        .send({
          petId: pet.id,
          quantity: 1,
          shipDate: new Date().toISOString(),
          status: 'placed',
          complete: false,
        })
        .expect(201)
        .expect((res) => {
          expect(res.body.id).toBeDefined();
          expect(res.body.petId).toBe(pet.id);
          expect(res.body.quantity).toBe(1);
          expect(res.body.status).toBe('placed');
          expect(res.body.complete).toBe(false);
        });
    });

    it('should throw an error if petId is not valid', async () => {
      return request(app.getHttpServer())
        .post('/store/order')
        .send({
          petId: 'invalid-id',
          quantity: 1,
          shipDate: new Date().toISOString(),
          status: 'placed',
          complete: false,
        })
        .expect(400);
    });

    it('should throw an error if petId is missing', async () => {
      return request(app.getHttpServer())
        .post('/store/order')
        .send({
          quantity: 1,
          shipDate: new Date().toISOString(),
          status: 'placed',
          complete: false,
        })
        .expect(400);
    });

    it('should throw an error if quantity is missing', async () => {
      return request(app.getHttpServer())
        .post('/store/order')
        .send({
          petId: pet.id,
          shipDate: new Date().toISOString(),
          status: 'placed',
          complete: false,
        })
        .expect(400);
    });
    it('should throw an error if shipDate is missing', async () => {
      return request(app.getHttpServer())
        .post('/store/order')
        .send({
          petId: pet.id,
          quantity: 1,
          status: 'placed',
          complete: false,
        })
        .expect(400);
    });

    it('should throw an error if status is missing', async () => {
      return request(app.getHttpServer())
        .post('/store/order')
        .send({
          petId: pet.id,
          quantity: 1,
          shipDate: new Date().toISOString(),
          complete: false,
        })
        .expect(400);
    });

    it('should throw an error if complete is missing', async () => {
      return request(app.getHttpServer())
        .post('/store/order')
        .send({
          petId: pet.id,
          quantity: 1,
          shipDate: new Date().toISOString(),
          status: 'placed',
        })
        .expect(400);
    });

    it('should throw an error if the status is not valid', async () => {
      return request(app.getHttpServer())
        .post('/store/order')
        .send({
          petId: pet.id,
          quantity: 1,
          shipDate: new Date().toISOString(),
          status: 'invalid-status',
          complete: false,
        })
        .expect(400);
    });

    it('should throw an error if the quantity is not valid', async () => {
      return request(app.getHttpServer())
        .post('/store/order')
        .send({
          petId: pet.id,
          quantity: -1,
          shipDate: new Date().toISOString(),
          status: 'placed',
          complete: false,
        })
        .expect(400);
    });

    it('should throw an error if the shipDate is not valid', async () => {
      return request(app.getHttpServer())
        .post('/store/order')
        .send({
          petId: pet.id,
          quantity: 1,
          shipDate: 'invalid-date',
          status: 'placed',
          complete: false,
        })
        .expect(400);
    });
  });

  describe('/order/:orderId (GET)', () => {
    it('should return the order with the given ID', async () => {
      const existingOrder = await addOrder({
        status: OrderStatusEnum.Approved,
        pet,
      });
      return request(app.getHttpServer())
        .get(`/store/order/${existingOrder.id}`)
        .expect(200)
        .expect((res) => {
          expect(res.body.id).toBe(existingOrder.id);
          expect(res.body.petId).toBe(pet.id);
          expect(res.body.quantity).toBe(1);
          expect(res.body.status).toBe('approved');
          expect(res.body.complete).toBe(false);
        });
    });

    it('should throw an error if the order ID is not valid', async () => {
      return request(app.getHttpServer())
        .get('/store/order/invalid-id')
        .expect(400);
    });

    it('should throw an error if the order is not found', async () => {
      const orderId = 9999; // assuming there's no order with ID 9999
      return request(app.getHttpServer())
        .get(`/store/order/${orderId}`)
        .expect(404);
    });
  });

  describe('/order/:orderId (DELETE)', () => {
    it('should delete the order with the given ID', async () => {
      const orderId = 1; // assuming there's an order with ID 1
      return request(app.getHttpServer())
        .delete(`/store/order/${orderId}`)
        .expect(204);
    });

    it('should throw an error if the order ID is not valid', async () => {
      return request(app.getHttpServer())
        .delete('/store/order/invalid-id')
        .expect(400);
    });

    it('should return 204 if the order is not found', async () => {
      const orderId = 9999; // assuming there's no order with ID 9999
      return request(app.getHttpServer())
        .delete(`/store/order/${orderId}`)
        .expect(204);
    });
  });
});
