import { INestApplication } from '@nestjs/common';
import * as request from 'supertest';
import { useApplication } from './useApplication';

describe('UserController (e2e)', () => {
  let app: INestApplication;

  const getApplication = useApplication();
  const { addUser } = getApplication();

  beforeAll(async () => {
    const appState = getApplication();
    app = appState.app;
  });

  describe('POST /user', () => {
    it('should create a user if the request is valid', async () => {
      return request(app.getHttpServer())
        .post('/user')
        .send({
          username: 'testUser',
          email: 'test@test.com',
        })
        .expect(201)
        .expect((res) => {
          expect(res.body.id).toBeDefined();
          expect(res.body.username).toEqual('testUser');
          expect(res.body.email).toEqual('test@test.com');
        });
    });

    it('should return 400 if email is missing', async () => {
      return request(app.getHttpServer())
        .post('/user')
        .send({
          username: 'testUser',
        })
        .expect(400);
    });

    it('should return 400 if username is missing', async () => {
      return request(app.getHttpServer()).post('/user').send({
        email: 'test@test.com',
      });
    });

    it('should return 400 if email is not valid', async () => {
      return request(app.getHttpServer())
        .post('/user')
        .send({
          username: 'testUser',
          email: 'invalidEmail',
        })
        .expect(400);
    });

    it('should not allow to create a user with the same username', async () => {
      await addUser({ username: 'Batman' });

      await request(app.getHttpServer())
        .post('/user')
        .send({
          username: 'Batman',
          email: 'test@test.com',
        })
        .expect(409);
    });

    it('should provide a default status', async () => {
      return request(app.getHttpServer())
        .post('/user')
        .send({
          username: 'testUser',
          email: 'test@test.com',
        })
        .expect(201)
        .expect((res) => {
          expect(res.body.userStatus).toEqual(1);
        });
    });
  });

  describe('POST /user/createWithList', () => {
    it('should create users if the request is valid', async () => {
      return request(app.getHttpServer())
        .post('/user/createWithList')
        .send([
          {
            username: 'testUser1',
            email: 'test1@test.com',
            password: 'password1',
          },
          {
            username: 'testUser2',
            email: 'test2@test.com',
            password: 'password2',
          },
          // Add more users in the list as needed
        ])
        .expect(201)
        .expect((res) => {
          for (const user of res.body) {
            expect(user.id).toBeDefined();
            expect(user.username).toBeDefined();
            expect(user.email).toBeDefined();
          }
        });
    });

    it('should not allow to create users with the same username', async () => {
      return request(app.getHttpServer())
        .post('/user/createWithList')
        .send([
          {
            username: 'testUser1',
            email: 'test@test.com',
          },
          {
            username: 'testUser1',
            email: 'test@test.com',
          },
        ])
        .expect(409);
    });

    it('should return 409 if one of the users already exists', async () => {
      await addUser({ username: 'testUser1' });

      return request(app.getHttpServer())
        .post('/user/createWithList')
        .send([
          {
            username: 'testUser1',
            email: 'test1@test.com',
          },
          {
            username: 'testUser2',
            email: 'test2@test.com',
          },
        ])
        .expect(409);
    });

    it('should provide a default status', async () => {
      return request(app.getHttpServer())
        .post('/user/createWithList')
        .send([
          {
            username: 'testUser1',
            email: 'test@test.com',
          },
        ])
        .expect(201)
        .expect((res) => {
          expect(res.body[0].userStatus).toEqual(1);
        });
    });
  });

  describe('GET /user/{username}', () => {
    it('should return user details if the username exists', async () => {
      await addUser({ username: 'test-user' });

      return request(app.getHttpServer())
        .get('/user/test-user')
        .expect(200)
        .expect((res) => {
          expect(res.body.username).toEqual('test-user');
        });
    });

    it('should return 404 if the username does not exist', async () => {
      return request(app.getHttpServer())
        .get('/user/nonExistingUser')
        .expect(404);
    });
  });

  describe('POST /user/{username}', () => {
    it('should update user details if the username exists', async () => {
      const existingUser = await addUser({ username: 'testUser' });

      return request(app.getHttpServer())
        .put(`/user/${existingUser.username}`)
        .send({
          id: existingUser.id,
          username: existingUser.username,
          email: 'updated@test.com',
        })
        .expect(200)
        .expect((res) => {
          expect(res.body.email).toEqual('updated@test.com');
        });
    });

    it('should return 404 if the username does not exist', async () => {
      return request(app.getHttpServer())
        .post('/user/nonExistingUser')
        .send({
          email: 'updated@test.com',
          username: 'nonExistingUser',
        })
        .expect(404);
    });
  });

  describe('DELETE /user/{username}', () => {
    it('should delete the user if the username exists', async () => {
      await addUser({ username: 'testUser' });
      return request(app.getHttpServer()).delete('/user/testUser').expect(200);
    });

    it('should return 204 if the username does not exist', async () => {
      return request(app.getHttpServer())
        .delete('/user/nonExistingUser')
        .expect(204);
    });
  });

  describe('GET /user/login', () => {
    it('should return a token if login is successful', async () => {
      return request(app.getHttpServer())
        .get('/user/login')
        .query({
          username: 'testUser',
          password: 'password',
        })
        .expect(200);
    });
  });

  describe('GET /user/logout', () => {
    it('should log out the user', async () => {
      return request(app.getHttpServer()).get('/user/logout').expect(200);
    });
  });
});
