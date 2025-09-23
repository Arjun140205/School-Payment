// src/schemas/user.schema.ts

import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument } from 'mongoose';

export type UserDocument = HydratedDocument<User>;

@Schema()
export class User {
  // Explicitly define _id as a string to match MongoDB's ObjectId as string
  _id?: string;

  @Prop({ required: true, unique: true })
  email: string;

  @Prop({ required: true })
  password: string;

  @Prop()
  name: string;

  @Prop()
  schoolId: string;
  
  @Prop({ default: 'school' })
  role: string;
}

export const UserSchema = SchemaFactory.createForClass(User);