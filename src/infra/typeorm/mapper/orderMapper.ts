import { Order as OrderPersistenceModel } from '../order.orm';
import { Order } from '../../../domain/entity/order';
import { PetMapper } from './petMapper';

export class OrderMapper {
  static toDomain(order: OrderPersistenceModel): Order {
    return {
      id: order.id,
      pet: PetMapper.toDomain(order.pet),
      quantity: order.quantity,
      shipDate: order.shipDate,
      status: order.status,
      complete: order.complete,
    };
  }

  static toPersistence(pet: PartialBy<Order, 'id'>): OrderPersistenceModel {
    const orderPersistenceModel = new OrderPersistenceModel();
    orderPersistenceModel.id = pet.id;
    orderPersistenceModel.pet = PetMapper.toPersistence(pet.pet);
    orderPersistenceModel.quantity = pet.quantity;
    orderPersistenceModel.shipDate = pet.shipDate;
    orderPersistenceModel.status = pet.status;
    orderPersistenceModel.complete = pet.complete;
    return orderPersistenceModel;
  }
}
