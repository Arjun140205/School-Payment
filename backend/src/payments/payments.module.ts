import { Module } from '@nestjs/common';
import { PaymentsController } from './payments.controller';
import { PaymentsService } from './payments.service';
import { HttpModule } from '@nestjs/axios';
import { ConfigModule } from '@nestjs/config';
import { MongooseModule } from '@nestjs/mongoose';
import { Order, OrderSchema } from 'src/schemas/order.schema';
import {OrderStatus,OrderStatusSchema,} from 'src/schemas/order-status.schema';
import { AuthModule } from 'src/auth/auth.module';
import { JwtModule } from '@nestjs/jwt';
import { WebhookLog, WebhookLogSchema } from 'src/schemas/webhook-log.schema';
import { User, UserSchema } from 'src/schemas/user.schema';

@Module({
  imports: [
    HttpModule,
    ConfigModule,
    AuthModule, // To use AuthGuard
    JwtModule.register({}), // We need JwtService for signing the payload
    MongooseModule.forFeature([
      { name: Order.name, schema: OrderSchema },
      { name: OrderStatus.name, schema: OrderStatusSchema },
      { name: WebhookLog.name, schema: WebhookLogSchema }, // Add WebhookLog schema
      { name: User.name, schema: UserSchema } // Add User schema for schools lookup
    ]),
  ],
  controllers: [PaymentsController],
  providers: [PaymentsService],
})
export class PaymentsModule {}
