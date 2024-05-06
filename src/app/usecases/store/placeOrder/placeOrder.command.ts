import { OrderDTO } from '../../../dto/order.dto';

export class PlaceOrderCommand {
  constructor(public readonly order: OrderDTO) {}
}
