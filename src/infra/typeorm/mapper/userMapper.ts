import { User as UserPersistenceModel } from '../user.orm';
import { User } from '../../../domain/entity/user';

export class UserMapper {
  static toDomain(user: UserPersistenceModel): User {
    return {
      id: user.id,
      username: user.username,
      firstName: user.firstName,
      lastName: user.lastName,
      email: user.email,
      password: user.password,
      phone: user.password,
      userStatus: user.userStatus,
    };
  }

  static toPersistence(user: PartialBy<User, 'id'>): UserPersistenceModel {
    const u = new UserPersistenceModel();
    u.id = user.id;
    u.username = user.username;
    u.firstName = user.firstName;
    u.lastName = user.lastName;
    u.email = user.email;
    u.password = user.password;
    u.phone = user.password;
    u.userStatus = user.userStatus;
    return u;
  }
}
