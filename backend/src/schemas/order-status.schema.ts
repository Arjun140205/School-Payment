// src/schemas/order-status.schema.ts

import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import mongoose, { HydratedDocument } from 'mongoose';
import { Order } from './order.schema';

export type OrderStatusDocument = HydratedDocument<OrderStatus>;

@Schema({ timestamps: true })
export class OrderStatus {
  @Prop({ type: mongoose.Schema.Types.ObjectId, ref: 'Order' })
  collect_id: Order;

  @Prop()
  order_amount: number;

  @Prop()
  transaction_amount: number;

  @Prop()
  payment_mode: string;

  @Prop()
  payment_details: string;

  @Prop()
  bank_reference: string;

  @Prop()
  payment_message: string;

  @Prop()
  status: string;

  @Prop()
  error_message: string;

  @Prop()
  payment_time: Date;
}

export const OrderStatusSchema = SchemaFactory.createForClass(OrderStatus);