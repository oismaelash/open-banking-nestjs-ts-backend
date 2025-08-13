import { IsString, IsOptional, IsNumber, IsEnum, IsDateString, Min, Max, IsArray } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
import { Transform, Type } from 'class-transformer';

export enum TransactionType {
  CREDIT = 'credit',
  DEBIT = 'debit',
}

export enum TransactionCategory {
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

export enum TransactionStatus {
  PENDING = 'pending',
  COMPLETED = 'completed',
  FAILED = 'failed',
  CANCELLED = 'cancelled',
}

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
}

export enum ContactType {
  PIX = 'pix',
  TRANSFER = 'transfer',
  BILL_PAYMENT = 'bill_payment',
}

// Transaction Search Query DTO
export class TransactionSearchQueryDto {
  @ApiProperty({ description: 'Search query for transaction description, merchant, or reference', required: false })
  @IsOptional()
  @IsString()
  q?: string;

  @ApiProperty({ description: 'Filter by account ID', required: false })
  @IsOptional()
  @IsString()
  accountId?: string;

  @ApiProperty({ description: 'Start date filter (ISO format)', required: false })
  @IsOptional()
  @IsDateString()
  startDate?: string;

  @ApiProperty({ description: 'End date filter (ISO format)', required: false })
  @IsOptional()
  @IsDateString()
  endDate?: string;

  @ApiProperty({ enum: TransactionCategory, description: 'Filter by transaction category', required: false })
  @IsOptional()
  @IsEnum(TransactionCategory)
  category?: TransactionCategory;

  @ApiProperty({ enum: TransactionType, description: 'Filter by transaction type', required: false })
  @IsOptional()
  @IsEnum(TransactionType)
  type?: TransactionType;

  @ApiProperty({ enum: TransactionStatus, description: 'Filter by transaction status', required: false })
  @IsOptional()
  @IsEnum(TransactionStatus)
  status?: TransactionStatus;

  @ApiProperty({ description: 'Minimum amount filter', required: false, minimum: 0 })
  @IsOptional()
  @Type(() => Number)
  @IsNumber()
  @Min(0)
  minAmount?: number;

  @ApiProperty({ description: 'Maximum amount filter', required: false, minimum: 0 })
  @IsOptional()
  @Type(() => Number)
  @IsNumber()
  @Min(0)
  maxAmount?: number;

  @ApiProperty({ description: 'Filter by merchant name', required: false })
  @IsOptional()
  @IsString()
  merchant?: string;

  @ApiProperty({ description: 'Filter by reference number', required: false })
  @IsOptional()
  @IsString()
  reference?: string;

  @ApiProperty({ description: 'Number of results to return', required: false, default: 20, minimum: 1, maximum: 100 })
  @IsOptional()
  @Type(() => Number)
  @IsNumber()
  @Min(1)
  @Max(100)
  limit?: number = 20;

  @ApiProperty({ description: 'Pagination offset', required: false, default: 0, minimum: 0 })
  @IsOptional()
  @Type(() => Number)
  @IsNumber()
  @Min(0)
  offset?: number = 0;

  @ApiProperty({ description: 'Sort field', required: false, enum: ['date', 'amount', 'description', 'merchant'] })
  @IsOptional()
  @IsString()
  sortBy?: 'date' | 'amount' | 'description' | 'merchant';

  @ApiProperty({ description: 'Sort order', required: false, enum: ['asc', 'desc'], default: 'desc' })
  @IsOptional()
  @IsString()
  sortOrder?: 'asc' | 'desc' = 'desc';
}

// Account Search Query DTO
export class AccountSearchQueryDto {
  @ApiProperty({ description: 'Search query for account name or number', required: false })
  @IsOptional()
  @IsString()
  q?: string;

  @ApiProperty({ enum: AccountType, description: 'Filter by account type', required: false })
  @IsOptional()
  @IsEnum(AccountType)
  type?: AccountType;

  @ApiProperty({ enum: AccountStatus, description: 'Filter by account status', required: false })
  @IsOptional()
  @IsEnum(AccountStatus)
  status?: AccountStatus;

  @ApiProperty({ description: 'Filter by bank name', required: false })
  @IsOptional()
  @IsString()
  bank?: string;

  @ApiProperty({ description: 'Minimum balance filter', required: false, minimum: 0 })
  @IsOptional()
  @Type(() => Number)
  @IsNumber()
  @Min(0)
  minBalance?: number;

  @ApiProperty({ description: 'Maximum balance filter', required: false, minimum: 0 })
  @IsOptional()
  @Type(() => Number)
  @IsNumber()
  @Min(0)
  maxBalance?: number;

  @ApiProperty({ description: 'Number of results to return', required: false, default: 20, minimum: 1, maximum: 100 })
  @IsOptional()
  @Type(() => Number)
  @IsNumber()
  @Min(1)
  @Max(100)
  limit?: number = 20;

  @ApiProperty({ description: 'Pagination offset', required: false, default: 0, minimum: 0 })
  @IsOptional()
  @Type(() => Number)
  @IsNumber()
  @Min(0)
  offset?: number = 0;
}

// Contact Search Query DTO
export class ContactSearchQueryDto {
  @ApiProperty({ description: 'Search query for contact name or value', required: false })
  @IsOptional()
  @IsString()
  q?: string;

  @ApiProperty({ enum: ContactType, description: 'Filter by contact type', required: false })
  @IsOptional()
  @IsEnum(ContactType)
  type?: ContactType;

  @ApiProperty({ description: 'Filter by bank name', required: false })
  @IsOptional()
  @IsString()
  bank?: string;

  @ApiProperty({ description: 'Number of results to return', required: false, default: 20, minimum: 1, maximum: 100 })
  @IsOptional()
  @Type(() => Number)
  @IsNumber()
  @Min(1)
  @Max(100)
  limit?: number = 20;

  @ApiProperty({ description: 'Pagination offset', required: false, default: 0, minimum: 0 })
  @IsOptional()
  @Type(() => Number)
  @IsNumber()
  @Min(0)
  offset?: number = 0;
}

// Transaction DTO
export class TransactionDto {
  @ApiProperty({ description: 'Transaction ID' })
  id: string;

  @ApiProperty({ description: 'Transaction date' })
  date: string;

  @ApiProperty({ description: 'Transaction description' })
  description: string;

  @ApiProperty({ enum: TransactionCategory, description: 'Transaction category' })
  category: TransactionCategory;

  @ApiProperty({ description: 'Transaction amount' })
  amount: number;

  @ApiProperty({ enum: TransactionType, description: 'Transaction type' })
  type: TransactionType;

  @ApiProperty({ enum: TransactionStatus, description: 'Transaction status' })
  status: TransactionStatus;

  @ApiProperty({ description: 'Merchant name' })
  merchant: string;

  @ApiProperty({ description: 'Account ID' })
  accountId: string;

  @ApiProperty({ description: 'Reference number' })
  reference: string;

  @ApiProperty({ description: 'Transaction fee' })
  fee: number;
}

// Account DTO
export class AccountDto {
  @ApiProperty({ description: 'Account ID' })
  id: string;

  @ApiProperty({ enum: AccountType, description: 'Account type' })
  type: AccountType;

  @ApiProperty({ description: 'Account name' })
  name: string;

  @ApiProperty({ description: 'Account number (masked)' })
  number: string;

  @ApiProperty({ description: 'Account balance' })
  balance: number;

  @ApiProperty({ description: 'Available balance' })
  availableBalance: number;

  @ApiProperty({ enum: AccountStatus, description: 'Account status' })
  status: AccountStatus;

  @ApiProperty({ description: 'Bank name' })
  bank: string;

  @ApiProperty({ description: 'Last updated timestamp' })
  lastUpdated: string;
}

// Contact DTO
export class ContactDto {
  @ApiProperty({ description: 'Contact ID' })
  id: string;

  @ApiProperty({ description: 'Contact name' })
  name: string;

  @ApiProperty({ description: 'Contact value (PIX key, account number, etc.)' })
  value: string;

  @ApiProperty({ enum: ContactType, description: 'Contact type' })
  type: ContactType;

  @ApiProperty({ description: 'Bank name' })
  bank: string;

  @ApiProperty({ description: 'Contact created date' })
  createdAt: string;
}

// Pagination DTO
export class PaginationDto {
  @ApiProperty({ description: 'Total number of results' })
  total: number;

  @ApiProperty({ description: 'Number of results per page' })
  limit: number;

  @ApiProperty({ description: 'Current offset' })
  offset: number;

  @ApiProperty({ description: 'Whether there are more results' })
  hasMore: boolean;

  @ApiProperty({ description: 'Current page number' })
  page: number;

  @ApiProperty({ description: 'Total number of pages' })
  totalPages: number;
}

// Transaction Search Response DTO
export class TransactionSearchResponseDto {
  @ApiProperty({ type: [TransactionDto], description: 'Found transactions' })
  transactions: TransactionDto[];

  @ApiProperty({ description: 'Pagination information' })
  pagination: PaginationDto;

  @ApiProperty({ description: 'Search filters applied' })
  filters: Partial<TransactionSearchQueryDto>;

  @ApiProperty({ description: 'Correlation ID for tracking' })
  correlationId: string;
}

// Account Search Response DTO
export class AccountSearchResponseDto {
  @ApiProperty({ type: [AccountDto], description: 'Found accounts' })
  accounts: AccountDto[];

  @ApiProperty({ description: 'Pagination information' })
  pagination: PaginationDto;

  @ApiProperty({ description: 'Search filters applied' })
  filters: Partial<AccountSearchQueryDto>;

  @ApiProperty({ description: 'Correlation ID for tracking' })
  correlationId: string;
}

// Contact Search Response DTO
export class ContactSearchResponseDto {
  @ApiProperty({ type: [ContactDto], description: 'Found contacts' })
  contacts: ContactDto[];

  @ApiProperty({ description: 'Pagination information' })
  pagination: PaginationDto;

  @ApiProperty({ description: 'Search filters applied' })
  filters: Partial<ContactSearchQueryDto>;

  @ApiProperty({ description: 'Correlation ID for tracking' })
  correlationId: string;
}

// Global Search Query DTO
export class GlobalSearchQueryDto {
  @ApiProperty({ description: 'Search query', required: true })
  @IsString()
  q: string;

  @ApiProperty({ description: 'Search in transactions', required: false, default: true })
  @IsOptional()
  @Transform(({ value }) => value === 'true' || value === true)
  includeTransactions?: boolean = true;

  @ApiProperty({ description: 'Search in accounts', required: false, default: true })
  @IsOptional()
  @Transform(({ value }) => value === 'true' || value === true)
  includeAccounts?: boolean = true;

  @ApiProperty({ description: 'Search in contacts', required: false, default: true })
  @IsOptional()
  @Transform(({ value }) => value === 'true' || value === true)
  includeContacts?: boolean = true;

  @ApiProperty({ description: 'Number of results per category', required: false, default: 10, minimum: 1, maximum: 50 })
  @IsOptional()
  @Type(() => Number)
  @IsNumber()
  @Min(1)
  @Max(50)
  limit?: number = 10;
}

// Global Search Result DTO
export class GlobalSearchResultDto {
  @ApiProperty({ type: [TransactionDto], description: 'Found transactions' })
  transactions: TransactionDto[];

  @ApiProperty({ type: [AccountDto], description: 'Found accounts' })
  accounts: AccountDto[];

  @ApiProperty({ type: [ContactDto], description: 'Found contacts' })
  contacts: ContactDto[];

  @ApiProperty({ description: 'Total results count' })
  totalResults: number;

  @ApiProperty({ description: 'Search query used' })
  query: string;

  @ApiProperty({ description: 'Correlation ID for tracking' })
  correlationId: string;
}

// Search Suggestions Query DTO
export class SearchSuggestionsQueryDto {
  @ApiProperty({ description: 'Partial search query', required: true })
  @IsString()
  q: string;

  @ApiProperty({ description: 'Type of suggestions to return', required: false, enum: ['transactions', 'accounts', 'contacts', 'all'] })
  @IsOptional()
  @IsString()
  type?: 'transactions' | 'accounts' | 'contacts' | 'all' = 'all';

  @ApiProperty({ description: 'Maximum number of suggestions', required: false, default: 10, minimum: 1, maximum: 20 })
  @IsOptional()
  @Type(() => Number)
  @IsNumber()
  @Min(1)
  @Max(20)
  limit?: number = 10;
}

// Search Suggestion DTO
export class SearchSuggestionDto {
  @ApiProperty({ description: 'Suggestion text' })
  text: string;

  @ApiProperty({ description: 'Suggestion type' })
  type: 'transaction' | 'account' | 'contact' | 'merchant' | 'category';

  @ApiProperty({ description: 'Suggestion value' })
  value: string;

  @ApiProperty({ description: 'Suggestion score/relevance' })
  score: number;
}

// Search Suggestions Response DTO
export class SearchSuggestionsResponseDto {
  @ApiProperty({ type: [SearchSuggestionDto], description: 'Search suggestions' })
  suggestions: SearchSuggestionDto[];

  @ApiProperty({ description: 'Search query used' })
  query: string;

  @ApiProperty({ description: 'Correlation ID for tracking' })
  correlationId: string;
}
