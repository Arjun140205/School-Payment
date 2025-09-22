// src/schemas/webhook-log.schema.ts
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import mongoose, { HydratedDocument } from 'mongoose';

export type WebhookLogDocument = HydratedDocument<WebhookLog>;

@Schema({ timestamps: true, strict: false })
export class WebhookLog {
  @Prop({ type: mongoose.Schema.Types.Mixed })
  payload: any;
}

export const WebhookLogSchema = SchemaFactory.createForClass(WebhookLog);