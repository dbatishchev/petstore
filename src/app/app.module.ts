import { Module } from '@nestjs/common';
import { ApiModule } from '../api/api.module';
import { DomainModule } from '../domain/domain.module';
import { InfraModule } from '../infra/infra.module';
import FindPetsByStatusUseCase from './usecases/pet/findPetsByStatus/findPetsByStatus.usecase';
import UpdatePetByIDUseCase from './usecases/pet/updatePetByID/updatePetByID.usecase';
import UploadPetImageUseCase from './usecases/pet/uploadPetImage/uploadPetImage.usecase';
import CreatePetUseCase from './usecases/pet/createPet/createPet.usecase';
import DeletePetByIDUseCase from './usecases/pet/deletePetByID/deletePetByID.usecase';
import FindPetByIDUseCase from './usecases/pet/findPetByID/findPetByID.usecase';
import FindPetsByTagsUseCase from './usecases/pet/findPetsByTags/findPetsByTags.usecase';
import UpdatePetUseCase from './usecases/pet/updatePet/updatePet.usecase';
import DeleteOrderUseCase from './usecases/store/deleteOrder/deleteOrder.usecase';
import FindOrderByIdUseCase from './usecases/store/findOrderById/findOrderById.usecase';
import GetInventoryUseCase from './usecases/store/getInventory/getInventory.usecase';
import PlaceOrderUseCase from './usecases/store/placeOrder/placeOrder.usecase';
import CreateUserUseCase from './usecases/user/createUser/createUser.usecase';
import CreateUsersUseCase from './usecases/user/createUsers/createUsers.usecase';
import DeleteUserUseCase from './usecases/user/deleteUser/deleteUser.usecase';
import GetUserByUsernameUseCase from './usecases/user/getUserByUsername/getUserByUsername.usecase';
import LoginUseCase from './usecases/user/login/login.usecase';
import LogoutUseCase from './usecases/user/logout/logout.usecase';
import UpdateUserUseCase from './usecases/user/updateUser/updateUser.usecase';
import ImageService from './service/imageService';

const useCases = [
  CreatePetUseCase,
  DeletePetByIDUseCase,
  FindPetByIDUseCase,
  FindPetsByStatusUseCase,
  FindPetsByTagsUseCase,
  UpdatePetUseCase,
  UpdatePetByIDUseCase,
  UploadPetImageUseCase,
  DeleteOrderUseCase,
  FindOrderByIdUseCase,
  GetInventoryUseCase,
  PlaceOrderUseCase,
  CreateUserUseCase,
  CreateUsersUseCase,
  DeleteUserUseCase,
  GetUserByUsernameUseCase,
  LoginUseCase,
  LogoutUseCase,
  UpdateUserUseCase,
];

const services = [ImageService];

@Module({
  controllers: [],
  imports: [ApiModule, DomainModule, InfraModule],
  providers: [...useCases, ...services],
})
export class AppModule {}
