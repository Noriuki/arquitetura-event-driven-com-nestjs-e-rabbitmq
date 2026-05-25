import {
  Body,
  Controller,
  Get,
  Param,
  ParseUUIDPipe,
  Post,
} from '@nestjs/common';
import { CreateOrderUseCase } from '../../application/use-cases/create-order.use-case';
import { GetOrderUseCase } from '../../application/use-cases/get-order.use-case';
import { ListOrdersUseCase } from '../../application/use-cases/list-orders.use-case';
import { CreateOrderDto } from './dto/create-order.dto';

@Controller('orders')
export class OrdersController {
  constructor(
    private readonly listOrders: ListOrdersUseCase,
    private readonly getOrder: GetOrderUseCase,
    private readonly createOrder: CreateOrderUseCase,
  ) {}

  @Get()
  async findAll() {
    const data = await this.listOrders.execute();
    return { message: 'Orders fetched successfully', data };
  }

  @Get(':id')
  async findOne(@Param('id', ParseUUIDPipe) id: string) {
    const data = await this.getOrder.execute(id);
    return { message: 'Order fetched successfully', data };
  }

  @Post()
  async create(@Body() dto: CreateOrderDto) {
    const data = await this.createOrder.execute(dto);
    return { message: 'Order created successfully', data };
  }
}
