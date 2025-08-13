import {
  Controller,
  Post,
  Get,
  Delete,
  Body,
  Param,
  Query,
  UseGuards,
} from '@nestjs/common';
import {
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiBearerAuth,
  ApiParam,
  ApiQuery,
} from '@nestjs/swagger';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { ConsentGuard } from '../consent/guards/consent.guard';
import { RequireConsent } from '../consent/decorators/consent-scopes.decorator';
import { ConsentScope } from '../consent/dto/consent.dto';
import { PixService } from './pix.service';
import {
  CreatePixPaymentDto,
  PixPaymentResponseDto,
  PaymentStatusResponseDto,
  GenerateQrCodeDto,
  QrCodeResponseDto,
  ScanQrCodeDto,
  QrCodeScanResponseDto,
  PixContactDto,
  PixContactResponseDto,
  PixContactsResponseDto,
  PixLimitsResponseDto,
  ReceiptFormatDto,
} from './dto/pix.dto';

@ApiTags('PIX Payment')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard, ConsentGuard)
@Controller('api/pix')
export class PixController {
  constructor(private readonly pixService: PixService) {}

  @Post('payment')
  @RequireConsent(ConsentScope.PAYMENTS)
  @ApiOperation({ summary: 'Create PIX Payment' })
  @ApiResponse({
    status: 201,
    description: 'PIX payment created successfully',
    type: PixPaymentResponseDto,
  })
  @ApiResponse({ status: 400, description: 'Bad request' })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  @ApiResponse({ status: 403, description: 'Insufficient consent' })
  async createPixPayment(
    @Body() createPixPaymentDto: CreatePixPaymentDto,
  ): Promise<PixPaymentResponseDto> {
    return this.pixService.createPixPayment(createPixPaymentDto);
  }

  @Get('payment/:paymentId')
  @RequireConsent(ConsentScope.PAYMENTS)
  @ApiOperation({ summary: 'Get Payment Status' })
  @ApiParam({ name: 'paymentId', description: 'Payment ID' })
  @ApiResponse({
    status: 200,
    description: 'Payment status retrieved successfully',
    type: PaymentStatusResponseDto,
  })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  @ApiResponse({ status: 403, description: 'Insufficient consent' })
  @ApiResponse({ status: 404, description: 'Payment not found' })
  async getPaymentStatus(
    @Param('paymentId') paymentId: string,
  ): Promise<PaymentStatusResponseDto> {
    return this.pixService.getPaymentStatus(paymentId);
  }

  @Get('payment/:paymentId/receipt')
  @RequireConsent(ConsentScope.PAYMENTS)
  @ApiOperation({ summary: 'Get Payment Receipt' })
  @ApiParam({ name: 'paymentId', description: 'Payment ID' })
  @ApiQuery({ name: 'format', enum: ['pdf', 'json'], required: false })
  @ApiResponse({
    status: 200,
    description: 'Payment receipt retrieved successfully',
  })
  @ApiResponse({ status: 400, description: 'Bad request' })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  @ApiResponse({ status: 403, description: 'Insufficient consent' })
  @ApiResponse({ status: 404, description: 'Payment not found' })
  async getPaymentReceipt(
    @Param('paymentId') paymentId: string,
    @Query() query: ReceiptFormatDto,
  ): Promise<any> {
    return this.pixService.getPaymentReceipt(paymentId, query.format);
  }

  @Post('qr-code/generate')
  @RequireConsent(ConsentScope.PAYMENTS)
  @ApiOperation({ summary: 'Generate PIX QR Code' })
  @ApiResponse({
    status: 201,
    description: 'QR code generated successfully',
    type: QrCodeResponseDto,
  })
  @ApiResponse({ status: 400, description: 'Bad request' })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  @ApiResponse({ status: 403, description: 'Insufficient consent' })
  async generateQrCode(
    @Body() generateQrCodeDto: GenerateQrCodeDto,
  ): Promise<QrCodeResponseDto> {
    return this.pixService.generateQrCode(generateQrCodeDto);
  }

  @Post('qr-code/scan')
  @RequireConsent(ConsentScope.PAYMENTS)
  @ApiOperation({ summary: 'Scan PIX QR Code' })
  @ApiResponse({
    status: 201,
    description: 'QR code scanned successfully',
    type: QrCodeScanResponseDto,
  })
  @ApiResponse({ status: 400, description: 'Bad request' })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  @ApiResponse({ status: 403, description: 'Insufficient consent' })
  async scanQrCode(
    @Body() scanQrCodeDto: ScanQrCodeDto,
  ): Promise<QrCodeScanResponseDto> {
    return this.pixService.scanQrCode(scanQrCodeDto);
  }

  @Get('contacts')
  @RequireConsent(ConsentScope.PROFILE)
  @ApiOperation({ summary: 'Get PIX Contacts' })
  @ApiResponse({
    status: 200,
    description: 'PIX contacts retrieved successfully',
    type: PixContactsResponseDto,
  })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  @ApiResponse({ status: 403, description: 'Insufficient consent' })
  async getContacts(): Promise<PixContactsResponseDto> {
    return this.pixService.getContacts();
  }

  @Post('contacts')
  @RequireConsent(ConsentScope.PROFILE)
  @ApiOperation({ summary: 'Add PIX Contact' })
  @ApiResponse({
    status: 201,
    description: 'PIX contact added successfully',
    type: PixContactResponseDto,
  })
  @ApiResponse({ status: 400, description: 'Bad request' })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  @ApiResponse({ status: 403, description: 'Insufficient consent' })
  async addContact(
    @Body() pixContactDto: PixContactDto,
  ): Promise<PixContactResponseDto> {
    return this.pixService.addContact(pixContactDto);
  }

  @Delete('contacts/:contactId')
  @RequireConsent(ConsentScope.PROFILE)
  @ApiOperation({ summary: 'Remove PIX Contact' })
  @ApiParam({ name: 'contactId', description: 'Contact ID' })
  @ApiResponse({
    status: 200,
    description: 'PIX contact removed successfully',
  })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  @ApiResponse({ status: 403, description: 'Insufficient consent' })
  @ApiResponse({ status: 404, description: 'Contact not found' })
  async removeContact(
    @Param('contactId') contactId: string,
  ): Promise<{ success: boolean; correlationId: string }> {
    return this.pixService.removeContact(contactId);
  }

  @Get('limits')
  @RequireConsent(ConsentScope.PAYMENTS)
  @ApiOperation({ summary: 'Get PIX Limits' })
  @ApiResponse({
    status: 200,
    description: 'PIX limits retrieved successfully',
    type: PixLimitsResponseDto,
  })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  @ApiResponse({ status: 403, description: 'Insufficient consent' })
  async getLimits(): Promise<PixLimitsResponseDto> {
    return this.pixService.getLimits();
  }
}
