import { Module } from '@nestjs/common';
import { UserController } from './controller/user.controller';
import { PetController } from './controller/pet.controller';
import { StoreController } from './controller/store.controller';
import { HealthzController } from './controller/healtz.controller';
import { CqrsModule } from '@nestjs/cqrs';

@Module({
  imports: [CqrsModule],
  controllers: [
    PetController,
    UserController,
    StoreController,
    HealthzController,
  ],
})
export class ApiModule {}
