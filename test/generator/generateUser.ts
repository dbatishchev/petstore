import { User } from '../../src/infra/typeorm/user.orm';
import { v4 as uuidv4 } from 'uuid';

export const generateUser = (partial: Partial<User> = {}) => {
  const user = new User();
  user.username = partial.username ?? `TestUser-${uuidv4()}`;
  user.firstName = partial.firstName ?? 'TestUser';
  user.lastName = partial.lastName ?? 'TestUser';
  user.email = partial.email ?? 'test@mail.com';
  user.password = partial.password ?? 'TestPassword';
  user.phone = partial.phone ?? '1234567890';
  user.userStatus = partial.userStatus ?? 1;
  return user;
};
