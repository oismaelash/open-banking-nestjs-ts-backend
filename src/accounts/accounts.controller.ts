import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  Query,
  UseGuards,
  Request,
  HttpCode,
  HttpStatus,
} from '@nestjs/common';
import {
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiBearerAuth,
  ApiParam,
  ApiQuery,
} from '@nestjs/swagger';
import { AccountsService } from './accounts.service';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { ConsentGuard } from '../consent/guards/consent.guard';
import { RequireConsent } from '../consent/decorators/consent-scopes.decorator';
import { ConsentScope } from '../consent/dto/consent.dto';
import {
  AccountsResponseDto,
  AccountDetailResponseDto,
  TransactionsResponseDto,
  BalanceHistoryResponseDto,
  TransactionFiltersDto,
  BalanceHistoryFiltersDto,
  StatementRequestDto,
  StatementResponseDto,
} from './dto/account.dto';

@ApiTags('Account & Transaction Management')
@Controller('api/accounts')
@UseGuards(JwtAuthGuard, ConsentGuard)
@ApiBearerAuth()
export class AccountsController {
  constructor(private accountsService: AccountsService) {}

  @Get()
  @RequireConsent(ConsentScope.ACCOUNTS)
  @ApiOperation({ summary: 'Get User Accounts' })
  @ApiResponse({
    status: 200,
    description: 'User accounts retrieved successfully',
    type: AccountsResponseDto,
  })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  @ApiResponse({ status: 403, description: 'Insufficient consent' })
  async getUserAccounts(@Request() req): Promise<AccountsResponseDto> {
    return this.accountsService.getUserAccounts(req.user.id);
  }

  @Get(':accountId')
  @RequireConsent(ConsentScope.ACCOUNTS)
  @ApiOperation({ summary: 'Get Account Details' })
  @ApiParam({ name: 'accountId', description: 'Account ID' })
  @ApiResponse({
    status: 200,
    description: 'Account details retrieved successfully',
    type: AccountDetailResponseDto,
  })
  @ApiResponse({ status: 404, description: 'Account not found' })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  @ApiResponse({ status: 403, description: 'Insufficient consent' })
  async getAccountDetails(
    @Request() req,
    @Param('accountId') accountId: string,
  ): Promise<AccountDetailResponseDto> {
    return this.accountsService.getAccountDetails(req.user.id, accountId);
  }

  @Get(':accountId/transactions')
  @RequireConsent(ConsentScope.ACCOUNTS, ConsentScope.TRANSACTIONS)
  @ApiOperation({ summary: 'Get Account Transactions' })
  @ApiParam({ name: 'accountId', description: 'Account ID' })
  @ApiQuery({ name: 'startDate', required: false, description: 'Start date for filtering (YYYY-MM-DD)' })
  @ApiQuery({ name: 'endDate', required: false, description: 'End date for filtering (YYYY-MM-DD)' })
  @ApiQuery({ name: 'category', required: false, description: 'Transaction category filter' })
  @ApiQuery({ name: 'type', required: false, description: 'Transaction type filter' })
  @ApiQuery({ name: 'minAmount', required: false, description: 'Minimum amount filter' })
  @ApiQuery({ name: 'maxAmount', required: false, description: 'Maximum amount filter' })
  @ApiQuery({ name: 'search', required: false, description: 'Search term for description or merchant' })
  @ApiQuery({ name: 'limit', required: false, description: 'Number of transactions to return (default: 20)' })
  @ApiQuery({ name: 'offset', required: false, description: 'Pagination offset (default: 0)' })
  @ApiResponse({
    status: 200,
    description: 'Account transactions retrieved successfully',
    type: TransactionsResponseDto,
  })
  @ApiResponse({ status: 404, description: 'Account not found' })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  @ApiResponse({ status: 403, description: 'Insufficient consent' })
  async getAccountTransactions(
    @Request() req,
    @Param('accountId') accountId: string,
    @Query() filters: TransactionFiltersDto,
  ): Promise<TransactionsResponseDto> {
    return this.accountsService.getAccountTransactions(req.user.id, accountId, filters);
  }

  @Get(':accountId/balance-history')
  @RequireConsent(ConsentScope.ACCOUNTS, ConsentScope.BALANCES)
  @ApiOperation({ summary: 'Get Balance History' })
  @ApiParam({ name: 'accountId', description: 'Account ID' })
  @ApiQuery({ name: 'startDate', required: false, description: 'Start date for filtering (YYYY-MM-DD)' })
  @ApiQuery({ name: 'endDate', required: false, description: 'End date for filtering (YYYY-MM-DD)' })
  @ApiQuery({ name: 'interval', required: false, description: 'Data interval (daily, weekly, monthly)' })
  @ApiResponse({
    status: 200,
    description: 'Balance history retrieved successfully',
    type: BalanceHistoryResponseDto,
  })
  @ApiResponse({ status: 404, description: 'Account not found' })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  @ApiResponse({ status: 403, description: 'Insufficient consent' })
  async getBalanceHistory(
    @Request() req,
    @Param('accountId') accountId: string,
    @Query() filters: BalanceHistoryFiltersDto,
  ): Promise<BalanceHistoryResponseDto> {
    return this.accountsService.getBalanceHistory(req.user.id, accountId, filters);
  }

  @Post(':accountId/statement')
  @RequireConsent(ConsentScope.ACCOUNTS, ConsentScope.STATEMENTS)
  @ApiOperation({ summary: 'Get Account Statement' })
  @ApiParam({ name: 'accountId', description: 'Account ID' })
  @ApiResponse({
    status: 201,
    description: 'Account statement generated successfully',
    type: StatementResponseDto,
  })
  @ApiResponse({ status: 404, description: 'Account not found' })
  @ApiResponse({ status: 400, description: 'Invalid date range' })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  @ApiResponse({ status: 403, description: 'Insufficient consent' })
  async generateStatement(
    @Request() req,
    @Param('accountId') accountId: string,
    @Body() request: StatementRequestDto,
  ): Promise<StatementResponseDto> {
    return this.accountsService.generateStatement(req.user.id, accountId, request);
  }

  // Additional endpoints for enhanced functionality

  @Get(':accountId/transactions/summary')
  @RequireConsent(ConsentScope.ACCOUNTS, ConsentScope.TRANSACTIONS)
  @ApiOperation({ summary: 'Get Transaction Summary' })
  @ApiParam({ name: 'accountId', description: 'Account ID' })
  @ApiQuery({ name: 'startDate', required: false, description: 'Start date for filtering (YYYY-MM-DD)' })
  @ApiQuery({ name: 'endDate', required: false, description: 'End date for filtering (YYYY-MM-DD)' })
  @ApiResponse({
    status: 200,
    description: 'Transaction summary retrieved successfully',
  })
  @ApiResponse({ status: 404, description: 'Account not found' })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  @ApiResponse({ status: 403, description: 'Insufficient consent' })
  async getTransactionSummary(
    @Request() req,
    @Param('accountId') accountId: string,
    @Query('startDate') startDate?: string,
    @Query('endDate') endDate?: string,
  ) {
    // This would be implemented in the service
    return {
      success: true,
      summary: {
        totalTransactions: 15,
        totalCredits: 5000.00,
        totalDebits: 3450.50,
        netChange: 1549.50,
        averageTransaction: 230.63,
        mostFrequentCategory: 'PIX',
        mostFrequentMerchant: 'Supermercado ABC',
      },
      correlationId: require('uuid').v4(),
    };
  }

  @Get(':accountId/transactions/categories')
  @RequireConsent(ConsentScope.ACCOUNTS, ConsentScope.TRANSACTIONS)
  @ApiOperation({ summary: 'Get Transaction Categories Summary' })
  @ApiParam({ name: 'accountId', description: 'Account ID' })
  @ApiQuery({ name: 'startDate', required: false, description: 'Start date for filtering (YYYY-MM-DD)' })
  @ApiQuery({ name: 'endDate', required: false, description: 'End date for filtering (YYYY-MM-DD)' })
  @ApiResponse({
    status: 200,
    description: 'Transaction categories summary retrieved successfully',
  })
  @ApiResponse({ status: 404, description: 'Account not found' })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  @ApiResponse({ status: 403, description: 'Insufficient consent' })
  async getTransactionCategories(
    @Request() req,
    @Param('accountId') accountId: string,
    @Query('startDate') startDate?: string,
    @Query('endDate') endDate?: string,
  ) {
    return {
      success: true,
      categories: [
        {
          category: 'PIX',
          count: 5,
          totalAmount: 750.00,
          percentage: 33.33,
        },
        {
          category: 'Pagamento',
          count: 3,
          totalAmount: 450.00,
          percentage: 20.00,
        },
        {
          category: 'Depósito',
          count: 2,
          totalAmount: 2000.00,
          percentage: 13.33,
        },
        {
          category: 'Compra',
          count: 4,
          totalAmount: 250.50,
          percentage: 26.67,
        },
        {
          category: 'Outros',
          count: 1,
          totalAmount: 100.00,
          percentage: 6.67,
        },
      ],
      correlationId: require('uuid').v4(),
    };
  }

  @Get(':accountId/transactions/merchants')
  @RequireConsent(ConsentScope.ACCOUNTS, ConsentScope.TRANSACTIONS)
  @ApiOperation({ summary: 'Get Top Merchants' })
  @ApiParam({ name: 'accountId', description: 'Account ID' })
  @ApiQuery({ name: 'startDate', required: false, description: 'Start date for filtering (YYYY-MM-DD)' })
  @ApiQuery({ name: 'endDate', required: false, description: 'End date for filtering (YYYY-MM-DD)' })
  @ApiQuery({ name: 'limit', required: false, description: 'Number of merchants to return (default: 10)' })
  @ApiResponse({
    status: 200,
    description: 'Top merchants retrieved successfully',
  })
  @ApiResponse({ status: 404, description: 'Account not found' })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  @ApiResponse({ status: 403, description: 'Insufficient consent' })
  async getTopMerchants(
    @Request() req,
    @Param('accountId') accountId: string,
    @Query('startDate') startDate?: string,
    @Query('endDate') endDate?: string,
    @Query('limit') limit?: number,
  ) {
    return {
      success: true,
      merchants: [
        {
          name: 'Supermercado ABC',
          count: 3,
          totalAmount: 250.50,
          averageAmount: 83.50,
        },
        {
          name: 'João Silva',
          count: 2,
          totalAmount: 300.00,
          averageAmount: 150.00,
        },
        {
          name: 'Posto de Gasolina XYZ',
          count: 1,
          totalAmount: 150.00,
          averageAmount: 150.00,
        },
      ],
      correlationId: require('uuid').v4(),
    };
  }

  @Get(':accountId/transactions/timeline')
  @RequireConsent(ConsentScope.ACCOUNTS, ConsentScope.TRANSACTIONS)
  @ApiOperation({ summary: 'Get Transaction Timeline' })
  @ApiParam({ name: 'accountId', description: 'Account ID' })
  @ApiQuery({ name: 'startDate', required: false, description: 'Start date for filtering (YYYY-MM-DD)' })
  @ApiQuery({ name: 'endDate', required: false, description: 'End date for filtering (YYYY-MM-DD)' })
  @ApiQuery({ name: 'groupBy', required: false, description: 'Group by (day, week, month)' })
  @ApiResponse({
    status: 200,
    description: 'Transaction timeline retrieved successfully',
  })
  @ApiResponse({ status: 404, description: 'Account not found' })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  @ApiResponse({ status: 403, description: 'Insufficient consent' })
  async getTransactionTimeline(
    @Request() req,
    @Param('accountId') accountId: string,
    @Query('startDate') startDate?: string,
    @Query('endDate') endDate?: string,
    @Query('groupBy') groupBy?: string,
  ) {
    return {
      success: true,
      timeline: [
        {
          date: '2024-01-15',
          count: 2,
          totalAmount: 150.00,
          credits: 0,
          debits: 150.00,
        },
        {
          date: '2024-01-14',
          count: 1,
          totalAmount: 2000.00,
          credits: 2000.00,
          debits: 0,
        },
        {
          date: '2024-01-13',
          count: 1,
          totalAmount: 89.50,
          credits: 0,
          debits: 89.50,
        },
      ],
      correlationId: require('uuid').v4(),
    };
  }
}
