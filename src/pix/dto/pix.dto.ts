import { IsString, IsNumber, IsOptional, IsEnum, IsDateString, IsBase64, Min, MaxLength } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export enum PixKeyType {
  CPF = 'cpf',
  CNPJ = 'cnpj',
  EMAIL = 'email',
  PHONE = 'phone',
  RANDOM = 'random',
}

export enum PaymentStatus {
  PENDING = 'pending',
  PROCESSING = 'processing',
  COMPLETED = 'completed',
  FAILED = 'failed',
  CANCELLED = 'cancelled',
}

export enum PaymentCategory {
  TRANSFERENCIA = 'Transferência',
  PAGAMENTO = 'Pagamento',
  DEPOSITO = 'Depósito',
  SAQUE = 'Saque',
  TAXA = 'Taxa',
  JUROS = 'Juros',
  ESTORNO = 'Estorno',
  COMPRA = 'Compra',
  PAGAMENTO_DE_CONTA = 'Pagamento de Conta',
  PIX = 'PIX',
  OUTROS = 'Outros',
}

// Create PIX Payment DTO
export class CreatePixPaymentDto {
  @ApiProperty({ description: 'PIX key (CPF, CNPJ, email, phone, or random key)' })
  @IsString()
  @MaxLength(255)
  pixKey: string;

  @ApiProperty({ enum: PixKeyType, description: 'Type of PIX key' })
  @IsEnum(PixKeyType)
  pixKeyType: PixKeyType;

  @ApiProperty({ description: 'Recipient name' })
  @IsString()
  @MaxLength(255)
  recipientName: string;

  @ApiProperty({ description: 'Payment amount', minimum: 0.01 })
  @IsNumber()
  @Min(0.01)
  amount: number;

  @ApiProperty({ description: 'Payment description' })
  @IsString()
  @MaxLength(255)
  description: string;

  @ApiProperty({ description: 'Scheduled date for payment', required: false })
  @IsOptional()
  @IsDateString()
  scheduledDate?: string;

  @ApiProperty({ enum: PaymentCategory, description: 'Payment category' })
  @IsEnum(PaymentCategory)
  category: PaymentCategory;

  @ApiProperty({ description: 'Source account ID' })
  @IsString()
  accountId: string;
}

// PIX Payment Response DTO
export class PixPaymentResponseDto {
  @ApiProperty()
  success: boolean;

  @ApiProperty()
  paymentId: string;

  @ApiProperty({ enum: PaymentStatus })
  status: PaymentStatus;

  @ApiProperty()
  amount: number;

  @ApiProperty()
  fee: number;

  @ApiProperty()
  estimatedCompletion: string;

  @ApiProperty()
  correlationId: string;
}

// Payment Status Response DTO
export class PaymentStatusResponseDto {
  @ApiProperty()
  paymentId: string;

  @ApiProperty({ enum: PaymentStatus })
  status: PaymentStatus;

  @ApiProperty()
  amount: number;

  @ApiProperty()
  recipientName: string;

  @ApiProperty()
  pixKey: string;

  @ApiProperty({ enum: PixKeyType })
  pixKeyType: PixKeyType;

  @ApiProperty()
  description: string;

  @ApiProperty({ enum: PaymentCategory })
  category: PaymentCategory;

  @ApiProperty()
  initiatedAt: string;

  @ApiProperty()
  processedAt?: string;

  @ApiProperty()
  completedAt?: string;

  @ApiProperty()
  fee: number;

  @ApiProperty()
  accountId: string;

  @ApiProperty()
  bank: string;

  @ApiProperty()
  correlationId: string;
}

// Generate QR Code DTO
export class GenerateQrCodeDto {
  @ApiProperty({ description: 'PIX key' })
  @IsString()
  @MaxLength(255)
  pixKey: string;

  @ApiProperty({ enum: PixKeyType, description: 'Type of PIX key' })
  @IsEnum(PixKeyType)
  pixKeyType: PixKeyType;

  @ApiProperty({ description: 'Recipient name' })
  @IsString()
  @MaxLength(255)
  recipientName: string;

  @ApiProperty({ description: 'Payment amount', minimum: 0.01 })
  @IsNumber()
  @Min(0.01)
  amount: number;

  @ApiProperty({ description: 'Payment description' })
  @IsString()
  @MaxLength(255)
  description: string;
}

// QR Code Response DTO
export class QrCodeResponseDto {
  @ApiProperty()
  qrCode: string;

  @ApiProperty()
  qrCodeText: string;

  @ApiProperty()
  correlationId: string;
}

// Scan QR Code DTO
export class ScanQrCodeDto {
  @ApiProperty({ description: 'Base64 encoded QR code image' })
  @IsBase64()
  qrCodeImage: string;
}

// QR Code Scan Response DTO
export class QrCodeScanResponseDto {
  @ApiProperty()
  pixKey: string;

  @ApiProperty({ enum: PixKeyType })
  pixKeyType: PixKeyType;

  @ApiProperty()
  recipientName: string;

  @ApiProperty()
  amount: number;

  @ApiProperty()
  description: string;

  @ApiProperty()
  correlationId: string;
}

// PIX Contact DTO
export class PixContactDto {
  @ApiProperty({ enum: PixKeyType, description: 'Type of PIX key' })
  @IsEnum(PixKeyType)
  type: PixKeyType;

  @ApiProperty({ description: 'PIX key value' })
  @IsString()
  @MaxLength(255)
  value: string;

  @ApiProperty({ description: 'Contact name' })
  @IsString()
  @MaxLength(255)
  name: string;

  @ApiProperty({ description: 'Bank name' })
  @IsString()
  @MaxLength(255)
  bank: string;
}

// PIX Contact Response DTO
export class PixContactResponseDto {
  @ApiProperty()
  id: string;

  @ApiProperty({ enum: PixKeyType })
  type: PixKeyType;

  @ApiProperty()
  value: string;

  @ApiProperty()
  name: string;

  @ApiProperty()
  bank: string;

  @ApiProperty()
  createdAt: string;
}

// PIX Contacts Response DTO
export class PixContactsResponseDto {
  @ApiProperty({ type: [PixContactResponseDto] })
  contacts: PixContactResponseDto[];

  @ApiProperty()
  correlationId: string;
}

// PIX Limits Response DTO
export class PixLimitsResponseDto {
  @ApiProperty()
  dailyLimit: number;

  @ApiProperty()
  monthlyLimit: number;

  @ApiProperty()
  usedToday: number;

  @ApiProperty()
  usedThisMonth: number;

  @ApiProperty()
  remainingToday: number;

  @ApiProperty()
  remainingThisMonth: number;

  @ApiProperty()
  correlationId: string;
}

// Receipt Format DTO
export class ReceiptFormatDto {
  @ApiProperty({ description: 'Output format', enum: ['pdf', 'json'] })
  @IsString()
  format: 'pdf' | 'json';
}
