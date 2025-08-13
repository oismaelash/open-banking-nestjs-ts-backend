import { IsString, IsOptional, IsNumber, IsDateString, IsEnum, IsArray } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export enum GroupByType {
  DAY = 'day',
  WEEK = 'week',
  MONTH = 'month',
  CATEGORY = 'category',
  MERCHANT = 'merchant',
  ACCOUNT = 'account',
}

export enum TransactionType {
  CREDIT = 'credit',
  DEBIT = 'debit',
  ALL = 'all',
}

export class TransactionAnalyticsQueryDto {
  @ApiProperty({
    description: 'Start date for analysis (YYYY-MM-DD)',
    example: '2024-01-01',
    required: false,
  })
  @IsOptional()
  @IsDateString()
  startDate?: string;

  @ApiProperty({
    description: 'End date for analysis (YYYY-MM-DD)',
    example: '2024-01-31',
    required: false,
  })
  @IsOptional()
  @IsDateString()
  endDate?: string;

  @ApiProperty({
    description: 'Filter by specific account ID',
    example: 'account-123',
    required: false,
  })
  @IsOptional()
  @IsString()
  accountId?: string;

  @ApiProperty({
    description: 'Grouping type for analysis',
    enum: GroupByType,
    example: GroupByType.CATEGORY,
    required: false,
  })
  @IsOptional()
  @IsEnum(GroupByType)
  groupBy?: GroupByType;

  @ApiProperty({
    description: 'Transaction type filter',
    enum: TransactionType,
    example: TransactionType.ALL,
    required: false,
  })
  @IsOptional()
  @IsEnum(TransactionType)
  transactionType?: TransactionType;

  @ApiProperty({
    description: 'Minimum amount filter',
    example: 100.00,
    required: false,
  })
  @IsOptional()
  @IsNumber()
  minAmount?: number;

  @ApiProperty({
    description: 'Maximum amount filter',
    example: 1000.00,
    required: false,
  })
  @IsOptional()
  @IsNumber()
  maxAmount?: number;

  @ApiProperty({
    description: 'Category filter (multiple categories)',
    example: ['Transferência', 'Alimentação'],
    required: false,
  })
  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  categories?: string[];
}

export class CategoryAnalyticsDto {
  @ApiProperty({
    description: 'Transaction category',
    example: 'Transferência',
  })
  @IsString()
  category: string;

  @ApiProperty({
    description: 'Number of transactions in this category',
    example: 50,
  })
  @IsNumber()
  count: number;

  @ApiProperty({
    description: 'Total amount in this category',
    example: 10000.00,
  })
  @IsNumber()
  amount: number;

  @ApiProperty({
    description: 'Percentage of total transactions',
    example: 33.33,
  })
  @IsNumber()
  percentage: number;

  @ApiProperty({
    description: 'Average amount per transaction',
    example: 200.00,
  })
  @IsNumber()
  averageAmount: number;
}

export class DateAnalyticsDto {
  @ApiProperty({
    description: 'Date of transactions',
    example: '2024-01-15',
  })
  @IsString()
  date: string;

  @ApiProperty({
    description: 'Number of transactions on this date',
    example: 5,
  })
  @IsNumber()
  count: number;

  @ApiProperty({
    description: 'Total amount on this date',
    example: 1000.00,
  })
  @IsNumber()
  amount: number;

  @ApiProperty({
    description: 'Average amount per transaction',
    example: 200.00,
  })
  @IsNumber()
  averageAmount: number;
}

export class MerchantAnalyticsDto {
  @ApiProperty({
    description: 'Merchant name',
    example: 'Supermercado ABC',
  })
  @IsString()
  merchant: string;

  @ApiProperty({
    description: 'Number of transactions with this merchant',
    example: 25,
  })
  @IsNumber()
  count: number;

  @ApiProperty({
    description: 'Total amount spent with this merchant',
    example: 2500.00,
  })
  @IsNumber()
  amount: number;

  @ApiProperty({
    description: 'Percentage of total spending',
    example: 10.00,
  })
  @IsNumber()
  percentage: number;
}

export class TransactionAnalyticsResponseDto {
  @ApiProperty({
    description: 'Total number of transactions',
    example: 150,
  })
  @IsNumber()
  totalTransactions: number;

  @ApiProperty({
    description: 'Total amount of all transactions',
    example: 25000.00,
  })
  @IsNumber()
  totalAmount: number;

  @ApiProperty({
    description: 'Average amount per transaction',
    example: 166.67,
  })
  @IsNumber()
  averageAmount: number;

  @ApiProperty({
    description: 'Largest transaction amount',
    example: 5000.00,
  })
  @IsNumber()
  largestTransaction: number;

  @ApiProperty({
    description: 'Smallest transaction amount',
    example: 10.00,
  })
  @IsNumber()
  smallestTransaction: number;

  @ApiProperty({
    description: 'Analytics grouped by category',
    type: [CategoryAnalyticsDto],
  })
  @IsArray()
  byCategory: CategoryAnalyticsDto[];

  @ApiProperty({
    description: 'Analytics grouped by date',
    type: [DateAnalyticsDto],
  })
  @IsArray()
  byDate: DateAnalyticsDto[];

  @ApiProperty({
    description: 'Analytics grouped by merchant',
    type: [MerchantAnalyticsDto],
  })
  @IsArray()
  byMerchant: MerchantAnalyticsDto[];

  @ApiProperty({
    description: 'Correlation ID for tracking',
    example: 'corr-123456789',
  })
  @IsString()
  correlationId: string;
}

export class SpendingPatternDto {
  @ApiProperty({
    description: 'Pattern type',
    example: 'monthly_recurring',
  })
  @IsString()
  patternType: string;

  @ApiProperty({
    description: 'Pattern description',
    example: 'Monthly subscription payment',
  })
  @IsString()
  description: string;

  @ApiProperty({
    description: 'Average amount for this pattern',
    example: 99.90,
  })
  @IsNumber()
  averageAmount: number;

  @ApiProperty({
    description: 'Frequency of this pattern',
    example: 'monthly',
  })
  @IsString()
  frequency: string;

  @ApiProperty({
    description: 'Confidence level (0-100)',
    example: 85,
  })
  @IsNumber()
  confidence: number;
}

export class SpendingPatternsResponseDto {
  @ApiProperty({
    description: 'List of identified spending patterns',
    type: [SpendingPatternDto],
  })
  @IsArray()
  patterns: SpendingPatternDto[];

  @ApiProperty({
    description: 'Total number of patterns found',
    example: 3,
  })
  @IsNumber()
  totalPatterns: number;

  @ApiProperty({
    description: 'Correlation ID for tracking',
    example: 'corr-123456789',
  })
  @IsString()
  correlationId: string;
}

export class FinancialInsightsDto {
  @ApiProperty({
    description: 'Insight type',
    example: 'spending_increase',
  })
  @IsString()
  insightType: string;

  @ApiProperty({
    description: 'Insight title',
    example: 'Spending Increase Detected',
  })
  @IsString()
  title: string;

  @ApiProperty({
    description: 'Insight description',
    example: 'Your spending has increased by 15% compared to last month',
  })
  @IsString()
  description: string;

  @ApiProperty({
    description: 'Insight severity level',
    example: 'medium',
  })
  @IsString()
  severity: string;

  @ApiProperty({
    description: 'Recommended action',
    example: 'Review your recent transactions',
  })
  @IsString()
  recommendation: string;

  @ApiProperty({
    description: 'Insight timestamp',
    example: '2024-01-15T10:30:00Z',
  })
  @IsString()
  timestamp: string;
}

export class FinancialInsightsResponseDto {
  @ApiProperty({
    description: 'List of financial insights',
    type: [FinancialInsightsDto],
  })
  @IsArray()
  insights: FinancialInsightsDto[];

  @ApiProperty({
    description: 'Total number of insights',
    example: 5,
  })
  @IsNumber()
  totalInsights: number;

  @ApiProperty({
    description: 'Correlation ID for tracking',
    example: 'corr-123456789',
  })
  @IsString()
  correlationId: string;
}

export class BudgetAnalysisDto {
  @ApiProperty({
    description: 'Budget category',
    example: 'Alimentação',
  })
  @IsString()
  category: string;

  @ApiProperty({
    description: 'Budget limit',
    example: 1000.00,
  })
  @IsNumber()
  budgetLimit: number;

  @ApiProperty({
    description: 'Actual spending',
    example: 850.00,
  })
  @IsNumber()
  actualSpending: number;

  @ApiProperty({
    description: 'Remaining budget',
    example: 150.00,
  })
  @IsNumber()
  remainingBudget: number;

  @ApiProperty({
    description: 'Percentage used',
    example: 85.00,
  })
  @IsNumber()
  percentageUsed: number;

  @ApiProperty({
    description: 'Status (under_budget, over_budget, on_track)',
    example: 'under_budget',
  })
  @IsString()
  status: string;
}

export class BudgetAnalysisResponseDto {
  @ApiProperty({
    description: 'Budget analysis by category',
    type: [BudgetAnalysisDto],
  })
  @IsArray()
  categories: BudgetAnalysisDto[];

  @ApiProperty({
    description: 'Total budget limit',
    example: 5000.00,
  })
  @IsNumber()
  totalBudget: number;

  @ApiProperty({
    description: 'Total actual spending',
    example: 4200.00,
  })
  @IsNumber()
  totalSpending: number;

  @ApiProperty({
    description: 'Overall budget status',
    example: 'under_budget',
  })
  @IsString()
  overallStatus: string;

  @ApiProperty({
    description: 'Correlation ID for tracking',
    example: 'corr-123456789',
  })
  @IsString()
  correlationId: string;
}
