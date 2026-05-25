import { Type } from 'class-transformer';
import {
  IsArray,
  IsEnum,
  IsInt,
  IsNotEmpty,
  IsNumber,
  IsString,
  IsUUID,
  Min,
  ValidateNested,
} from 'class-validator';
import { DeliveryMethod, PaymentMethod } from './order.enums';

class OrderItemDto {
  @IsNotEmpty()
  @IsString()
  @IsUUID()
  productId: string;

  @IsNotEmpty()
  @IsInt()
  @Min(1)
  quantity: number;

  @IsNotEmpty()
  @IsNumber()
  price: number;
}

class PaymentDto {
  @IsNotEmpty()
  @IsString()
  @IsEnum(PaymentMethod)
  method: string;

  @IsNotEmpty()
  @IsInt()
  @Min(1)
  amount: number;
}

class DeliveryDto {
  @IsNotEmpty()
  @IsString()
  @IsEnum(DeliveryMethod)
  method: string;

  @IsNotEmpty()
  @IsString()
  @IsUUID()
  addressId: string;
}

export class CreateOrderDto {
  @IsNotEmpty()
  @IsString()
  @IsUUID()
  customerId: string;

  @IsNotEmpty()
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => OrderItemDto)
  items: OrderItemDto[];

  @IsNotEmpty()
  @Type(() => PaymentDto)
  payment: PaymentDto;

  @IsNotEmpty()
  @Type(() => DeliveryDto)
  delivery: DeliveryDto;
}
