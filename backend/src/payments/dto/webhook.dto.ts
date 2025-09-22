import { Type } from 'class-transformer';
import {
  IsDateString,
  IsNotEmpty,
  IsNumber,
  IsObject,
  IsString,
  ValidateNested,
} from 'class-validator';

export class OrderInfoDto {
  @IsString()
  @IsNotEmpty()
  order_id: string;

  @IsNumber()
  order_amount: number;

  @IsNumber()
  transaction_amount: number;

  @IsString()
  status: string;

  // Add other fields from the payload as needed for validation
  @IsString()
  payment_mode: string;
}

export class WebhookDto {
  @IsNumber()
  status: number;

  @IsObject()
  @ValidateNested()
  @Type(() => OrderInfoDto)
  order_info: OrderInfoDto;
}