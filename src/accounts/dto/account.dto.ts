import { IsString, IsNumber, IsOptional, IsEnum, IsDateString, IsBoolean } from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export enum AccountType {
  CHECKING = 'checking',
  SAVINGS = 'savings',
  INVESTMENT = 'investment',
  CREDIT = 'credit',
  LOAN = 'loan',
}

export enum AccountStatus {
  ACTIVE = 'active',
  INACTIVE = 'inactive',
  SUSPENDED = 'suspended',
  CLOSED = 'closed',
  PENDING = 'pending',
}

export enum TransactionType {
  CREDIT = 'credit',
  DEBIT = 'debit',
}

export enum TransactionStatus {
  PENDING = 'pending',
  COMPLETED = 'completed',
  FAILED = 'failed',
  CANCELLED = 'cancelled',
  REVERSED = 'reversed',
}

export enum TransactionCategory {
  TRANSFER = 'Transferência',
  PAYMENT = 'Pagamento',
  DEPOSIT = 'Depósito',
  WITHDRAWAL = 'Saque',
  FEE = 'Taxa',
  INTEREST = 'Juros',
  REFUND = 'Estorno',
  PURCHASE = 'Compra',
  BILL_PAYMENT = 'Pagamento de Conta',
  PIX = 'PIX',
  OTHER = 'Outros',
}

export class AccountDto {
  @ApiProperty({ description: 'Account ID' })
  id: string;

  @ApiProperty({ description: 'Account type', enum: AccountType })
  type: AccountType;

  @ApiProperty({ description: 'Account name' })
  name: string;

  @ApiProperty({ description: 'Masked account number' })
  number: string;

  @ApiProperty({ description: 'Current balance' })
  balance: number;

  @ApiProperty({ description: 'Available balance' })
  availableBalance: number;

  @ApiProperty({ description: 'Account status', enum: AccountStatus })
  status: AccountStatus;

  @ApiProperty({ description: 'Bank name' })
  bank: string;

  @ApiProperty({ description: 'Last updated timestamp' })
  lastUpdated: string;
}

export class AccountDetailDto extends AccountDto {
  @ApiProperty({ description: 'Account opening date' })
  openingDate: string;

  @ApiProperty({ description: 'Monthly maintenance fee' })
  monthlyFee: number;

  @ApiProperty({ description: 'Daily transaction limit' })
  dailyLimit: number;

  @ApiProperty({ description: 'Monthly transaction limit' })
  monthlyLimit: number;

  @ApiPropertyOptional({ description: 'Account description' })
  description?: string;

  @ApiPropertyOptional({ description: 'Account holder name' })
  holderName?: string;

  @ApiPropertyOptional({ description: 'Account holder CPF' })
  holderCpf?: string;
}

export class TransactionDto {
  @ApiProperty({ description: 'Transaction ID' })
  id: string;

  @ApiProperty({ description: 'Transaction date' })
  date: string;

  @ApiProperty({ description: 'Transaction description' })
  description: string;

  @ApiProperty({ description: 'Transaction category', enum: TransactionCategory })
  category: TransactionCategory;

  @ApiProperty({ description: 'Transaction amount' })
  amount: number;

  @ApiProperty({ description: 'Transaction type', enum: TransactionType })
  type: TransactionType;

  @ApiProperty({ description: 'Transaction status', enum: TransactionStatus })
  status: TransactionStatus;

  @ApiPropertyOptional({ description: 'Merchant name' })
  merchant?: string;

  @ApiProperty({ description: 'Account ID' })
  accountId: string;

  @ApiPropertyOptional({ description: 'Transaction reference' })
  reference?: string;

  @ApiPropertyOptional({ description: 'Transaction location' })
  location?: string;

  @ApiPropertyOptional({ description: 'Transaction tags' })
  tags?: string[];
}

export class BalanceHistoryDto {
  @ApiProperty({ description: 'Date of balance record' })
  date: string;

  @ApiProperty({ description: 'Balance amount' })
  balance: number;

  @ApiProperty({ description: 'Available balance amount' })
  availableBalance: number;

  @ApiPropertyOptional({ description: 'Balance change from previous day' })
  change?: number;

  @ApiPropertyOptional({ description: 'Percentage change from previous day' })
  changePercentage?: number;
}

export class AccountsResponseDto {
  @ApiProperty({ description: 'Success status' })
  success: boolean;

  @ApiProperty({ description: 'List of accounts', type: [AccountDto] })
  accounts: AccountDto[];

  @ApiProperty({ description: 'Correlation ID for tracking' })
  correlationId: string;
}

export class AccountDetailResponseDto {
  @ApiProperty({ description: 'Success status' })
  success: boolean;

  @ApiProperty({ description: 'Account details', type: AccountDetailDto })
  account: AccountDetailDto;

  @ApiProperty({ description: 'Correlation ID for tracking' })
  correlationId: string;
}

export class TransactionsResponseDto {
  @ApiProperty({ description: 'Success status' })
  success: boolean;

  @ApiProperty({ description: 'List of transactions', type: [TransactionDto] })
  transactions: TransactionDto[];

  @ApiProperty({ description: 'Pagination information' })
  pagination: {
    total: number;
    limit: number;
    offset: number;
    hasMore: boolean;
  };

  @ApiProperty({ description: 'Correlation ID for tracking' })
  correlationId: string;
}

export class BalanceHistoryResponseDto {
  @ApiProperty({ description: 'Success status' })
  success: boolean;

  @ApiProperty({ description: 'Balance history', type: [BalanceHistoryDto] })
  balanceHistory: BalanceHistoryDto[];

  @ApiProperty({ description: 'Correlation ID for tracking' })
  correlationId: string;
}

export class TransactionFiltersDto {
  @ApiPropertyOptional({ description: 'Start date for filtering (YYYY-MM-DD)' })
  @IsOptional()
  @IsString()
  startDate?: string;

  @ApiPropertyOptional({ description: 'End date for filtering (YYYY-MM-DD)' })
  @IsOptional()
  @IsString()
  endDate?: string;

  @ApiPropertyOptional({ description: 'Transaction category filter', enum: TransactionCategory })
  @IsOptional()
  @IsEnum(TransactionCategory)
  category?: TransactionCategory;

  @ApiPropertyOptional({ description: 'Transaction type filter', enum: TransactionType })
  @IsOptional()
  @IsEnum(TransactionType)
  type?: TransactionType;

  @ApiPropertyOptional({ description: 'Minimum amount filter' })
  @IsOptional()
  @IsNumber()
  minAmount?: number;

  @ApiPropertyOptional({ description: 'Maximum amount filter' })
  @IsOptional()
  @IsNumber()
  maxAmount?: number;

  @ApiPropertyOptional({ description: 'Search term for description or merchant' })
  @IsOptional()
  @IsString()
  search?: string;

  @ApiPropertyOptional({ description: 'Number of transactions to return (default: 20)' })
  @IsOptional()
  @IsNumber()
  limit?: number;

  @ApiPropertyOptional({ description: 'Pagination offset (default: 0)' })
  @IsOptional()
  @IsNumber()
  offset?: number;
}

export class BalanceHistoryFiltersDto {
  @ApiPropertyOptional({ description: 'Start date for filtering (YYYY-MM-DD)' })
  @IsOptional()
  @IsString()
  startDate?: string;

  @ApiPropertyOptional({ description: 'End date for filtering (YYYY-MM-DD)' })
  @IsOptional()
  @IsString()
  endDate?: string;

  @ApiPropertyOptional({ description: 'Data interval (daily, weekly, monthly)', enum: ['daily', 'weekly', 'monthly'] })
  @IsOptional()
  @IsString()
  interval?: string;
}

export class StatementRequestDto {
  @ApiProperty({ description: 'Start date for statement (YYYY-MM-DD)' })
  @IsString()
  startDate: string;

  @ApiProperty({ description: 'End date for statement (YYYY-MM-DD)' })
  @IsString()
  endDate: string;

  @ApiPropertyOptional({ description: 'Output format (pdf, csv, json)', enum: ['pdf', 'csv', 'json'] })
  @IsOptional()
  @IsString()
  format?: string;

  @ApiPropertyOptional({ description: 'Include pending transactions' })
  @IsOptional()
  @IsBoolean()
  includePending?: boolean;
}

export class StatementResponseDto {
  @ApiProperty({ description: 'Success status' })
  success: boolean;

  @ApiProperty({ description: 'Statement file URL or data' })
  statement: string;

  @ApiProperty({ description: 'Statement format' })
  format: string;

  @ApiProperty({ description: 'Statement period' })
  period: {
    startDate: string;
    endDate: string;
  };

  @ApiProperty({ description: 'Correlation ID for tracking' })
  correlationId: string;
}
