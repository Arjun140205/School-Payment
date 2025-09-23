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
    @InjectModel('User') private userModel: Model<any>,
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

    try {
      console.log('Fetching all transactions with params:', queryParams);
      
      // First, let's check if we have any orders at all
      const orderCount = await this.orderModel.countDocuments();
      console.log(`Total orders in database: ${orderCount}`);
      
      if (orderCount === 0) {
        // No orders in database, return empty result set with pagination
        return {
          data: [],
          total: 0,
          page: Number(page),
          limit: Number(limit)
        };
      }

      // Now build our pipeline
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
      ];
      
      // Check if we have any orderstatuses that match
      const countPipeline = [...pipeline, { $count: 'total' }];
      const countResult = await this.orderModel.aggregate(countPipeline).exec();
      const total = countResult.length > 0 ? countResult[0].total : 0;
      
      console.log(`Total matched documents after lookup: ${total}`);
      
      if (total === 0) {
        // We have orders but no matching statuses
        return {
          data: [],
          total: 0,
          page: Number(page),
          limit: Number(limit)
        };
      }
      
      // Continue with the pipeline if we have matching documents
      pipeline.push(
        // Stage 2: Only include documents that have at least one status detail
        {
          $match: {
            'statusDetails.0': { $exists: true }
          }
        },
        // Stage 3: Deconstruct the statusDetails array
        {
          $unwind: {
            path: '$statusDetails',
            preserveNullAndEmptyArrays: false
          }
        },
        // Stage 4: Reshape the output documents
        {
          $project: {
            _id: 0, // Exclude the default _id
            collect_id: { $toString: '$_id' }, // Convert ObjectId to string
            school_id: '$school_id',
            gateway: { $ifNull: ['$gateway_name', 'Default Gateway'] },
            order_amount: { $ifNull: ['$statusDetails.order_amount', 0] },
            transaction_amount: { $ifNull: ['$statusDetails.transaction_amount', 0] },
            status: { $ifNull: ['$statusDetails.status', 'UNKNOWN'] },
            custom_order_id: { $ifNull: ['$statusDetails.bank_reference', ''] },
            createdAt: { $ifNull: ['$createdAt', new Date()] }
          },
        }
      );

      // Optional Stage 5: Sorting
      if (sort) {
        pipeline.push({
          $sort: { [sort]: order === 'asc' ? 1 : -1 },
        });
      } else {
        // Default sort by createdAt descending if no sort specified
        pipeline.push({
          $sort: { createdAt: -1 },
        });
      }

      // Get total count for pagination
      const totalCountPipeline = [...pipeline];
      const totalDocuments = await this.orderModel.aggregate(totalCountPipeline).exec();
      const totalCount = totalDocuments.length;
      
      console.log(`Total documents for pagination: ${totalCount}`);

      // Stage 6 & 7: Pagination
      pipeline.push({ $skip: skip });
      pipeline.push({ $limit: parseInt(String(limit)) });

      const data = await this.orderModel.aggregate(pipeline).exec();
      console.log(`Returning ${data.length} transactions`);

      return {
        data,
        total: totalCount,
        page: Number(page),
        limit: Number(limit)
      };
    } catch (error) {
      console.error('Error in getAllTransactions:', error);
      throw new InternalServerErrorException('Failed to fetch transactions: ' + error.message);
    }
  }

  async getTransactionsBySchool(
    schoolId: string,
    queryParams: QueryParamsDto,
  ) {
    const { page = 1, limit = 10, sort, order = 'desc' } = queryParams;
    const skip = (page - 1) * limit;

    try {
      console.log(`Fetching transactions for school: ${schoolId} with params:`, queryParams);
      
      // Check if we have any orders for this school
      const schoolOrderCount = await this.orderModel.countDocuments({ school_id: schoolId });
      console.log(`Total orders for school ${schoolId}: ${schoolOrderCount}`);
      
      if (schoolOrderCount === 0) {
        // No orders for this school, return empty result set with pagination
        return {
          data: [],
          total: 0,
          page: Number(page),
          limit: Number(limit)
        };
      }

      const pipeline: any[] = [
        // Stage 1: Filter by school_id FIRST for efficiency
        {
          $match: {
            school_id: schoolId,
          },
        },
        // Stage 2: Join with the orderstatuses collection
        {
          $lookup: {
            from: 'orderstatuses',
            localField: '_id',
            foreignField: 'collect_id',
            as: 'statusDetails',
          },
        },
      ];
      
      // Check if we have any matching statusDetails
      const countPipeline = [...pipeline, { $match: { 'statusDetails.0': { $exists: true } } }, { $count: 'total' }];
      const countResult = await this.orderModel.aggregate(countPipeline).exec();
      const total = countResult.length > 0 ? countResult[0].total : 0;
      
      console.log(`Total matched documents for school ${schoolId} after lookup: ${total}`);
      
      if (total === 0) {
        // We have orders but no matching statuses
        return {
          data: [],
          total: 0,
          page: Number(page),
          limit: Number(limit)
        };
      }
      
      // Continue with the pipeline if we have matching documents
      pipeline.push(
        // Only include documents that have at least one status detail
        {
          $match: {
            'statusDetails.0': { $exists: true }
          }
        },
        // Deconstruct the statusDetails array
        {
          $unwind: {
            path: '$statusDetails',
            preserveNullAndEmptyArrays: false
          }
        },
        // Reshape the output documents
        {
          $project: {
            _id: 0,
            collect_id: { $toString: '$_id' }, // Convert ObjectId to string
            school_id: '$school_id',
            gateway: { $ifNull: ['$gateway_name', 'Default Gateway'] },
            order_amount: { $ifNull: ['$statusDetails.order_amount', 0] },
            transaction_amount: { $ifNull: ['$statusDetails.transaction_amount', 0] },
            status: { $ifNull: ['$statusDetails.status', 'UNKNOWN'] },
            custom_order_id: { $ifNull: ['$statusDetails.bank_reference', ''] },
            createdAt: { $ifNull: ['$createdAt', new Date()] }
          },
        }
      );

      // Optional Sorting
      if (sort) {
        pipeline.push({
          $sort: { [sort]: order === 'asc' ? 1 : -1 },
        });
      } else {
        // Default sort by createdAt descending
        pipeline.push({
          $sort: { createdAt: -1 },
        });
      }

      // Get total count for pagination
      const totalCountPipeline = [...pipeline];
      const totalDocuments = await this.orderModel.aggregate(totalCountPipeline).exec();
      const totalCount = totalDocuments.length;
      
      console.log(`Total documents for school ${schoolId} pagination: ${totalCount}`);

      // Pagination
      pipeline.push({ $skip: skip });
      pipeline.push({ $limit: parseInt(String(limit)) });

      const data = await this.orderModel.aggregate(pipeline).exec();
      console.log(`Returning ${data.length} transactions for school ${schoolId}`);

      return {
        data,
        total: totalCount,
        page: Number(page),
        limit: Number(limit)
      };
    } catch (error) {
      console.error(`Error in getTransactionsBySchool for school ${schoolId}:`, error);
      throw new InternalServerErrorException(`Failed to fetch transactions for school: ${error.message}`);
    }
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

  async getSchools() {
    try {
      console.log('Fetching schools');
      
      // For demo purposes, we'll create mock schools if none exist
      const schoolCount = await this.userModel.countDocuments({ role: 'school' });
      
      if (schoolCount === 0) {
        console.log('No schools found, returning mock data');
        // Return mock school data for demo purposes
        return [
          { id: 'school-1', name: 'ABC High School' },
          { id: 'school-2', name: 'XYZ Elementary School' },
          { id: 'school-3', name: 'City Public School' }
        ];
      }
      
      // Find actual schools from the database
      const schools = await this.userModel.find({ role: 'school' })
        .select('_id schoolId name')
        .lean()
        .exec();
      
      console.log(`Found ${schools.length} schools`);
      
      // Map to expected format
      return schools.map(school => ({
        id: school.schoolId || school._id,
        name: school.name || `School ${school._id}`
      }));
    } catch (error) {
      console.error('Error fetching schools:', error);
      // Return some default schools even if error occurs
      return [
        { id: 'default-school', name: 'Default School' }
      ];
    }
  }
}
