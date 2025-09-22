import {
  BadGatewayException,
  Injectable,
  InternalServerErrorException,
  NotFoundException,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { HttpService } from '@nestjs/axios';
import { firstValueFrom } from 'rxjs';
import { CreatePaymentDto } from './dto/create-payment.dto';
import { JwtService } from '@nestjs/jwt';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Order } from 'src/schemas/order.schema';
import { OrderStatus } from 'src/schemas/order-status.schema';
import { User } from 'src/schemas/user.schema';
import { WebhookLog } from 'src/schemas/webhook-log.schema';
import { WebhookDto } from './dto/webhook.dto';
import { QueryParamsDto } from '../auth/dto/query-params.dto';

@Injectable()
export class PaymentsService {
  constructor(
    private readonly httpService: HttpService,
    private readonly configService: ConfigService,
    private readonly jwtService: JwtService,
    @InjectModel(Order.name) private orderModel: Model<Order>,
    @InjectModel(OrderStatus.name) private orderStatusModel: Model<OrderStatus>,
    @InjectModel(WebhookLog.name) private webhookLogModel: Model<WebhookLog>,
  ) {}

  async createPayment(createPaymentDto: CreatePaymentDto, user: User) {
    const { amount } = createPaymentDto;

    // --- 1. Create an Internal Order Record ---
    const order = await this.orderModel.create({
      school_id: this.configService.get<string>('SCHOOL_ID'),
      trustee_id: user._id,
    });

    // --- 2. Generate the 'sign' JWT for the Payment Gateway ---
    const payload = {
      school_id: this.configService.get<string>('SCHOOL_ID'),
      amount: String(amount),
      callback_url: this.configService.get<string>('CALLBACK_URL'),
    };

    const sign = this.jwtService.sign(payload, {
      secret: this.configService.get<string>('PG_KEY'),
    });

    // --- 3. Prepare and Call the External Payment API ---
    const apiUrl = this.configService.get<string>('PAYMENT_API_URL');
    const apiKey = this.configService.get<string>('API_KEY');

    if (!apiUrl) {
      throw new Error('PAYMENT_API_URL is not defined in environment variables');
    }

    if (!apiKey) {
      throw new Error('API_KEY is not defined in environment variables');
    }

    const headers = {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${apiKey}`,
    };

    const body = { ...payload, sign };

    try {
      const response = await firstValueFrom(
        this.httpService.post(apiUrl, body, { headers }),
      );

      const responseData = response.data;

      // --- 4. Create an Initial OrderStatus Record ---
      await this.orderStatusModel.create({
        collect_id: order._id,
        order_amount: amount,
        status: 'PENDING',
        bank_reference: responseData.collect_request_id,
      });

      // --- 5. Return the Payment URL ---
      return { paymentUrl: responseData.Collect_request_url };
    } catch (error) {
      console.error('Payment API Error:', error.response?.data || error.message);
      throw new BadGatewayException('Failed to create payment link.');
    }
  }

  async updatePaymentStatus(webhookDto: WebhookDto) {
    // 1. Log the entire incoming webhook payload
    await this.webhookLogModel.create({ payload: webhookDto });

    const { order_info } = webhookDto;

    // 2. Find the corresponding order status record and update it
    const updatedStatus = await this.orderStatusModel.findOneAndUpdate(
      { bank_reference: order_info.order_id },
      {
        $set: {
          status: order_info.status,
          transaction_amount: order_info.transaction_amount,
          payment_mode: order_info.payment_mode,
        },
      },
      { new: true },
    );

    if (!updatedStatus) {
      throw new NotFoundException(
        `Order status with bank_reference ${order_info.order_id} not found.`,
      );
    }

    return { message: 'Webhook received and processed successfully.' };
  }

  async getAllTransactions(queryParams: QueryParamsDto) {
    const { page = 1, limit = 10, sort, order = 'desc' } = queryParams;
    const skip = (page - 1) * limit;

    const pipeline: any[] = [
      // Stage 1: Join with the orderstatuses collection
      {
        $lookup: {
          from: 'orderstatuses', // The collection to join with
          localField: '_id', // Field from the input documents (orders)
          foreignField: 'collect_id', // Field from the documents of the "from" collection
          as: 'statusDetails', // Output array field name
        },
      },
      // Stage 2: Deconstruct the statusDetails array
      {
        $unwind: '$statusDetails',
      },
      // Stage 3: Reshape the output documents
      {
        $project: {
          _id: 0, // Exclude the default _id
          collect_id: '$_id',
          school_id: '$school_id',
          gateway: '$gateway_name',
          order_amount: '$statusDetails.order_amount',
          transaction_amount: '$statusDetails.transaction_amount',
          status: '$statusDetails.status',
          custom_order_id: '$statusDetails.bank_reference', // Using bank_reference as the custom ID
        },
      },
    ];

    // Optional Stage 4: Sorting
    if (sort) {
      pipeline.push({
        $sort: { [sort]: order === 'asc' ? 1 : -1 },
      });
    }

    // Stage 5 & 6: Pagination
    pipeline.push({ $skip: skip });
    pipeline.push({ $limit: limit });

    return this.orderModel.aggregate(pipeline);
  }

  async getTransactionsBySchool(
    schoolId: string,
    queryParams: QueryParamsDto,
  ) {
    const { page = 1, limit = 10, sort, order = 'desc' } = queryParams;
    const skip = (page - 1) * limit;

    const pipeline: any[] = [
      // Stage 1: Filter by school_id FIRST for efficiency
      {
        $match: {
          school_id: schoolId,
        },
      },
      {
        $lookup: {
          from: 'orderstatuses',
          localField: '_id',
          foreignField: 'collect_id',
          as: 'statusDetails',
        },
      },
      {
        $unwind: '$statusDetails',
      },
      {
        $project: {
          _id: 0,
          collect_id: '$_id',
          school_id: '$school_id',
          gateway: '$gateway_name',
          order_amount: '$statusDetails.order_amount',
          transaction_amount: '$statusDetails.transaction_amount',
          status: '$statusDetails.status',
          custom_order_id: '$statusDetails.bank_reference',
        },
      },
    ];

    if (sort) {
      pipeline.push({
        $sort: { [sort]: order === 'asc' ? 1 : -1 },
      });
    }

    pipeline.push({ $skip: skip });
    pipeline.push({ $limit: limit });

    return this.orderModel.aggregate(pipeline);
  }

  async getTransactionStatus(customOrderId: string) {
    // We stored the custom_order_id in the bank_reference field
    const transaction = await this.orderStatusModel.findOne({
      bank_reference: customOrderId,
    });

    if (!transaction) {
      throw new NotFoundException(
        `Transaction with ID ${customOrderId} not found.`,
      );
    }

    return { status: transaction.status };
  }
}
