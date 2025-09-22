// src/schemas/order.schema.ts

import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument } from 'mongoose';

export type OrderDocument = HydratedDocument<Order>;

// A sub-schema for the student information object
@Schema({ _id: false }) 
export class StudentInfo {
  @Prop()
  name: string;

  @Prop()
  id: string;

  @Prop()
  email: string;
}

@Schema({ timestamps: true })
export class Order {
  @Prop({ required: true })
  school_id: string;

  @Prop()
  trustee_id: string;

  @Prop({ type: StudentInfo })
  student_info: StudentInfo;

  @Prop()
  gateway_name: string;
}

export const OrderSchema = SchemaFactory.createForClass(Order);