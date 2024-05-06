import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  ParseIntPipe,
  Post,
  UseFilters,
  UsePipes,
} from '@nestjs/common';
import { Order } from '../openapi/types';
import { CommandBus, QueryBus } from '@nestjs/cqrs';
import { GetInventoryQuery } from '../../app/usecases/store/getInventory/getInventory.query';
import { PlaceOrderCommand } from '../../app/usecases/store/placeOrder/placeOrder.command';
import { FindOrderByIdQuery } from '../../app/usecases/store/findOrderById/findOrderById.query';
import { DeleteOrderCommand } from '../../app/usecases/store/deleteOrder/deleteOrder.command';
import { OrderMapper } from '../mapper/orderMapper';
import { ValidatorPipe } from '../pipe/validation.pipe';
import { PlaceOrderReqSchema } from '../validation/placeOrderReq.schema';
import { HttpExceptionFilter } from '../filter/httpException.filter';

@Controller('store')
@UseFilters(HttpExceptionFilter)
export class StoreController {
  constructor(
    private readonly commandBus: CommandBus,
    private readonly queryBus: QueryBus,
  ) {}

  /**
   * There is a problem with the OpenAPI spec. OpenAPI spec expects the response to be an object with keys as string and values as number,
   * but it makes sense to return a struct with this type:
   * ```typescript
   * type Inventory = {
   *   placed: number,
   *   approved: number,
   *   delivered: number,
   * }
   * ```
   */
  @Get('/inventory')
  public async getInventory(): Promise<{ [key: string]: number }> {
    return await this.queryBus.execute(new GetInventoryQuery());
  }

  /**
   * For some reason, the OpenAPI spec says that all fields of the request body are optional, but it makes sense to have all fields as required.
   */
  @Post('/order')
  @UsePipes(new ValidatorPipe<Order>(PlaceOrderReqSchema))
  public async placeOrder(@Body() request: Order): Promise<Order> {
    const order = await this.commandBus.execute(
      new PlaceOrderCommand(OrderMapper.toEventDTO(request)),
    );
    return OrderMapper.fromDomain(order);
  }

  @Get('/order/:orderId')
  public async findOrderById(
    @Param('orderId', ParseIntPipe) orderId: number,
  ): Promise<Order> {
    const order = await this.queryBus.execute(new FindOrderByIdQuery(orderId));
    return OrderMapper.fromDomain(order);
  }

  @Delete('/order/:orderId')
  public async deleteOrder(
    @Param('orderId', ParseIntPipe) orderId: number,
  ): Promise<void> {
    return this.commandBus.execute(new DeleteOrderCommand(orderId));
  }
}
