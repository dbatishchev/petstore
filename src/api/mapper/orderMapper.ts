import { Order } from '../openapi/types';
import { Order as OrderDomain } from '../../domain/entity/order';
import { OrderDTO } from '../../app/dto/order.dto';

export class OrderMapper {
  public static toEventDTO(order: Order): OrderDTO {
    return { ...order };
  }

  public static fromDomain(order?: OrderDomain): Order {
    return {
      ...order,
      petId: order.pet.id,
      shipDate: order.shipDate.toISOString(),
    };
  }
}
