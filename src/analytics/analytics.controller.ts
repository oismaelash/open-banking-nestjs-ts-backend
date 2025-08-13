import {
  Controller,
  Get,
  Query,
  UseGuards,
  Param,
} from '@nestjs/common';
import {
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiBearerAuth,
  ApiQuery,
} from '@nestjs/swagger';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { ConsentGuard } from '../consent/guards/consent.guard';
import { RequireConsent } from '../consent/decorators/consent-scopes.decorator';
import { ConsentScope } from '../consent/dto/consent.dto';
import { AnalyticsService } from './analytics.service';
import {
  TransactionAnalyticsQueryDto,
  TransactionAnalyticsResponseDto,
  SpendingPatternsResponseDto,
  FinancialInsightsResponseDto,
  BudgetAnalysisResponseDto,
} from './dto/analytics.dto';

@ApiTags('Analytics Endpoints')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard, ConsentGuard)
@Controller('api/analytics')
export class AnalyticsController {
  constructor(private readonly analyticsService: AnalyticsService) {}

  @Get('transactions')
  @RequireConsent(ConsentScope.TRANSACTIONS, ConsentScope.ANALYTICS)
  @ApiOperation({ summary: 'Get Transaction Analytics' })
  @ApiQuery({ name: 'startDate', required: false, description: 'Start date (YYYY-MM-DD)' })
  @ApiQuery({ name: 'endDate', required: false, description: 'End date (YYYY-MM-DD)' })
  @ApiQuery({ name: 'accountId', required: false, description: 'Filter by account ID' })
  @ApiQuery({ name: 'groupBy', required: false, description: 'Grouping type', enum: ['day', 'week', 'month', 'category', 'merchant', 'account'] })
  @ApiQuery({ name: 'transactionType', required: false, description: 'Transaction type filter', enum: ['credit', 'debit', 'all'] })
  @ApiQuery({ name: 'minAmount', required: false, description: 'Minimum amount filter' })
  @ApiQuery({ name: 'maxAmount', required: false, description: 'Maximum amount filter' })
  @ApiQuery({ name: 'categories', required: false, description: 'Category filter (comma-separated)' })
  @ApiResponse({
    status: 200,
    description: 'Transaction analytics retrieved successfully',
    type: TransactionAnalyticsResponseDto,
  })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  @ApiResponse({ status: 403, description: 'Insufficient consent' })
  async getTransactionAnalytics(
    @Query() query: TransactionAnalyticsQueryDto,
  ): Promise<TransactionAnalyticsResponseDto> {
    const userId = 'user-123'; // Placeholder for demo
    return this.analyticsService.getTransactionAnalytics(userId, query);
  }

  @Get('spending-patterns')
  @RequireConsent(ConsentScope.TRANSACTIONS, ConsentScope.ANALYTICS)
  @ApiOperation({ summary: 'Get Spending Patterns' })
  @ApiResponse({
    status: 200,
    description: 'Spending patterns retrieved successfully',
    type: SpendingPatternsResponseDto,
  })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  @ApiResponse({ status: 403, description: 'Insufficient consent' })
  async getSpendingPatterns(): Promise<SpendingPatternsResponseDto> {
    const userId = 'user-123'; // Placeholder for demo
    return this.analyticsService.getSpendingPatterns(userId);
  }

  @Get('financial-insights')
  @RequireConsent(ConsentScope.TRANSACTIONS, ConsentScope.ANALYTICS)
  @ApiOperation({ summary: 'Get Financial Insights' })
  @ApiResponse({
    status: 200,
    description: 'Financial insights retrieved successfully',
    type: FinancialInsightsResponseDto,
  })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  @ApiResponse({ status: 403, description: 'Insufficient consent' })
  async getFinancialInsights(): Promise<FinancialInsightsResponseDto> {
    const userId = 'user-123'; // Placeholder for demo
    return this.analyticsService.getFinancialInsights(userId);
  }

  @Get('budget-analysis')
  @RequireConsent(ConsentScope.TRANSACTIONS, ConsentScope.ANALYTICS)
  @ApiOperation({ summary: 'Get Budget Analysis' })
  @ApiResponse({
    status: 200,
    description: 'Budget analysis retrieved successfully',
    type: BudgetAnalysisResponseDto,
  })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  @ApiResponse({ status: 403, description: 'Insufficient consent' })
  async getBudgetAnalysis(): Promise<BudgetAnalysisResponseDto> {
    const userId = 'user-123'; // Placeholder for demo
    return this.analyticsService.getBudgetAnalysis(userId);
  }

  @Get('trends/:period')
  @RequireConsent(ConsentScope.TRANSACTIONS, ConsentScope.ANALYTICS)
  @ApiOperation({ summary: 'Get Trend Analysis' })
  @ApiQuery({ name: 'period', description: 'Analysis period (7d, 30d, 90d, 1y)', example: '30d' })
  @ApiResponse({
    status: 200,
    description: 'Trend analysis retrieved successfully',
  })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  @ApiResponse({ status: 403, description: 'Insufficient consent' })
  async getTrendAnalysis(
    @Param('period') period: string,
  ): Promise<{
    spendingTrend: number;
    incomeTrend: number;
    savingsRate: number;
    topCategories: string[];
    correlationId: string;
  }> {
    const userId = 'user-123'; // Placeholder for demo
    return this.analyticsService.getTrendAnalysis(userId, period);
  }

  @Get('summary')
  @RequireConsent(ConsentScope.TRANSACTIONS, ConsentScope.ANALYTICS)
  @ApiOperation({ summary: 'Get Analytics Summary' })
  @ApiResponse({
    status: 200,
    description: 'Analytics summary retrieved successfully',
  })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  @ApiResponse({ status: 403, description: 'Insufficient consent' })
  async getAnalyticsSummary(): Promise<{
    totalSpending: number;
    totalIncome: number;
    netSavings: number;
    topSpendingCategory: string;
    averageTransactionAmount: number;
    transactionCount: number;
    correlationId: string;
  }> {
    const userId = 'user-123'; // Placeholder for demo
    
    // Get basic analytics
    const analytics = await this.analyticsService.getTransactionAnalytics(userId, {});
    
    // Calculate summary metrics
    const totalSpending = analytics.byCategory
      .filter(cat => cat.category !== 'Renda')
      .reduce((sum, cat) => sum + cat.amount, 0);
    
    const totalIncome = analytics.byCategory
      .filter(cat => cat.category === 'Renda')
      .reduce((sum, cat) => sum + cat.amount, 0);
    
    const netSavings = totalIncome - totalSpending;
    
    const topSpendingCategory = analytics.byCategory
      .filter(cat => cat.category !== 'Renda')
      .sort((a, b) => b.amount - a.amount)[0]?.category || 'N/A';

    return {
      totalSpending,
      totalIncome,
      netSavings,
      topSpendingCategory,
      averageTransactionAmount: analytics.averageAmount,
      transactionCount: analytics.totalTransactions,
      correlationId: `corr-${Date.now()}`,
    };
  }

  @Get('categories/top')
  @RequireConsent(ConsentScope.TRANSACTIONS, ConsentScope.ANALYTICS)
  @ApiOperation({ summary: 'Get Top Spending Categories' })
  @ApiQuery({ name: 'limit', required: false, description: 'Number of categories to return', example: 5 })
  @ApiResponse({
    status: 200,
    description: 'Top spending categories retrieved successfully',
  })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  @ApiResponse({ status: 403, description: 'Insufficient consent' })
  async getTopSpendingCategories(
    @Query('limit') limit: number = 5,
  ): Promise<{
    categories: Array<{
      category: string;
      amount: number;
      percentage: number;
      count: number;
    }>;
    correlationId: string;
  }> {
    const userId = 'user-123'; // Placeholder for demo
    const analytics = await this.analyticsService.getTransactionAnalytics(userId, {});
    
    const topCategories = analytics.byCategory
      .filter(cat => cat.category !== 'Renda')
      .sort((a, b) => b.amount - a.amount)
      .slice(0, limit);

    return {
      categories: topCategories,
      correlationId: `corr-${Date.now()}`,
    };
  }

  @Get('merchants/top')
  @RequireConsent(ConsentScope.TRANSACTIONS, ConsentScope.ANALYTICS)
  @ApiOperation({ summary: 'Get Top Merchants' })
  @ApiQuery({ name: 'limit', required: false, description: 'Number of merchants to return', example: 10 })
  @ApiResponse({
    status: 200,
    description: 'Top merchants retrieved successfully',
  })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  @ApiResponse({ status: 403, description: 'Insufficient consent' })
  async getTopMerchants(
    @Query('limit') limit: number = 10,
  ): Promise<{
    merchants: Array<{
      merchant: string;
      amount: number;
      percentage: number;
      count: number;
    }>;
    correlationId: string;
  }> {
    const userId = 'user-123'; // Placeholder for demo
    const analytics = await this.analyticsService.getTransactionAnalytics(userId, {});
    
    const topMerchants = analytics.byMerchant.slice(0, limit);

    return {
      merchants: topMerchants,
      correlationId: `corr-${Date.now()}`,
    };
  }
}
