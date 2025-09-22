import {
  Body,
  Controller,
  Post,
  Req,
  UseGuards,
  Get,
  Query,
  Param,
} from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { PaymentsService } from './payments.service';
import { CreatePaymentDto } from './dto/create-payment.dto';
import { WebhookDto } from './dto/webhook.dto';
import { QueryParamsDto } from '../auth/dto/query-params.dto';

@Controller('payments')
export class PaymentsController {
  constructor(private readonly paymentsService: PaymentsService) {}

  @Post('/create-payment')
  @UseGuards(AuthGuard()) // Protect this route
  createPayment(
    @Body() createPaymentDto: CreatePaymentDto,
    @Req() req, // Get the whole request object
  ) {
    // req.user is attached by our JwtStrategy
    return this.paymentsService.createPayment(createPaymentDto, req.user);
  }

  @Post('/webhook')
  // IMPORTANT: NO AuthGuard here. This endpoint must be public.
  handleWebhook(@Body() webhookDto: WebhookDto) {
    return this.paymentsService.updatePaymentStatus(webhookDto);
  }

  @Get('/transactions')
  @UseGuards(AuthGuard())
  getAllTransactions(@Query() queryParams: QueryParamsDto) {
    return this.paymentsService.getAllTransactions(queryParams);
  }

  @Get('/transactions/school/:schoolId')
  @UseGuards(AuthGuard())
  getTransactionsBySchool(
    @Param('schoolId') schoolId: string,
    @Query() queryParams: QueryParamsDto,
  ) {
    return this.paymentsService.getTransactionsBySchool(schoolId, queryParams);
  }

  @Get('/transaction-status/:customOrderId')
  @UseGuards(AuthGuard())
  getTransactionStatus(@Param('customOrderId') customOrderId: string) {
    return this.paymentsService.getTransactionStatus(customOrderId);
  }
}
