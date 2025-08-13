import {
  Controller,
  Get,
  Query,
  UseGuards,
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
import { SearchService } from './search.service';
import {
  TransactionSearchQueryDto,
  AccountSearchQueryDto,
  ContactSearchQueryDto,
  GlobalSearchQueryDto,
  SearchSuggestionsQueryDto,
  TransactionSearchResponseDto,
  AccountSearchResponseDto,
  ContactSearchResponseDto,
  GlobalSearchResultDto,
  SearchSuggestionsResponseDto,
} from './dto/search.dto';

@ApiTags('Search & Filter')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard, ConsentGuard)
@Controller('api/search')
export class SearchController {
  constructor(private readonly searchService: SearchService) {}

  @Get('transactions')
  @RequireConsent(ConsentScope.TRANSACTIONS)
  @ApiOperation({ summary: 'Search Transactions' })
  @ApiResponse({
    status: 200,
    description: 'Transactions found successfully',
    type: TransactionSearchResponseDto,
  })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  @ApiResponse({ status: 403, description: 'Insufficient consent' })
  async searchTransactions(
    @Query() query: TransactionSearchQueryDto,
  ): Promise<TransactionSearchResponseDto> {
    return this.searchService.searchTransactions(query);
  }

  @Get('accounts')
  @RequireConsent(ConsentScope.ACCOUNTS)
  @ApiOperation({ summary: 'Search Accounts' })
  @ApiResponse({
    status: 200,
    description: 'Accounts found successfully',
    type: AccountSearchResponseDto,
  })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  @ApiResponse({ status: 403, description: 'Insufficient consent' })
  async searchAccounts(
    @Query() query: AccountSearchQueryDto,
  ): Promise<AccountSearchResponseDto> {
    return this.searchService.searchAccounts(query);
  }

  @Get('contacts')
  @RequireConsent(ConsentScope.PROFILE)
  @ApiOperation({ summary: 'Search Contacts' })
  @ApiResponse({
    status: 200,
    description: 'Contacts found successfully',
    type: ContactSearchResponseDto,
  })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  @ApiResponse({ status: 403, description: 'Insufficient consent' })
  async searchContacts(
    @Query() query: ContactSearchQueryDto,
  ): Promise<ContactSearchResponseDto> {
    return this.searchService.searchContacts(query);
  }

  @Get('global')
  @RequireConsent(ConsentScope.ACCOUNTS, ConsentScope.TRANSACTIONS, ConsentScope.PROFILE)
  @ApiOperation({ summary: 'Global Search' })
  @ApiResponse({
    status: 200,
    description: 'Global search completed successfully',
    type: GlobalSearchResultDto,
  })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  @ApiResponse({ status: 403, description: 'Insufficient consent' })
  async globalSearch(
    @Query() query: GlobalSearchQueryDto,
  ): Promise<GlobalSearchResultDto> {
    return this.searchService.globalSearch(query);
  }

  @Get('suggestions')
  @RequireConsent(ConsentScope.ACCOUNTS, ConsentScope.TRANSACTIONS, ConsentScope.PROFILE)
  @ApiOperation({ summary: 'Get Search Suggestions' })
  @ApiResponse({
    status: 200,
    description: 'Search suggestions retrieved successfully',
    type: SearchSuggestionsResponseDto,
  })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  @ApiResponse({ status: 403, description: 'Insufficient consent' })
  async getSearchSuggestions(
    @Query() query: SearchSuggestionsQueryDto,
  ): Promise<SearchSuggestionsResponseDto> {
    return this.searchService.getSearchSuggestions(query);
  }

  @Get('stats')
  @RequireConsent(ConsentScope.ACCOUNTS, ConsentScope.TRANSACTIONS, ConsentScope.PROFILE)
  @ApiOperation({ summary: 'Get Search Statistics' })
  @ApiResponse({
    status: 200,
    description: 'Search statistics retrieved successfully',
  })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  @ApiResponse({ status: 403, description: 'Insufficient consent' })
  async getSearchStats(): Promise<{
    totalTransactions: number;
    totalAccounts: number;
    totalContacts: number;
    correlationId: string;
  }> {
    return this.searchService.getSearchStats();
  }

  @Get('transactions/categories')
  @RequireConsent(ConsentScope.TRANSACTIONS)
  @ApiOperation({ summary: 'Get Transaction Categories' })
  @ApiResponse({
    status: 200,
    description: 'Transaction categories retrieved successfully',
  })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  @ApiResponse({ status: 403, description: 'Insufficient consent' })
  async getTransactionCategories(): Promise<{
    categories: string[];
    correlationId: string;
  }> {
    const categories = [
      'Transferência',
      'Pagamento',
      'Depósito',
      'Saque',
      'Taxa',
      'Juros',
      'Estorno',
      'Compra',
      'Pagamento de Conta',
      'PIX',
      'Outros',
    ];

    return {
      categories,
      correlationId: require('uuid').v4(),
    };
  }

  @Get('transactions/merchants')
  @RequireConsent(ConsentScope.TRANSACTIONS)
  @ApiOperation({ summary: 'Get Transaction Merchants' })
  @ApiResponse({
    status: 200,
    description: 'Transaction merchants retrieved successfully',
  })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  @ApiResponse({ status: 403, description: 'Insufficient consent' })
  async getTransactionMerchants(): Promise<{
    merchants: string[];
    correlationId: string;
  }> {
    const merchants = [
      'João Silva',
      'Supermercado ABC',
      'Empresa XYZ',
      'Transferência Interna',
      'Companhia de Energia',
      'Maria Santos',
      'Pedro Costa',
      'Restaurante XYZ',
      'Farmácia ABC',
      'Posto de Gasolina',
    ];

    return {
      merchants,
      correlationId: require('uuid').v4(),
    };
  }

  @Get('accounts/types')
  @RequireConsent(ConsentScope.ACCOUNTS)
  @ApiOperation({ summary: 'Get Account Types' })
  @ApiResponse({
    status: 200,
    description: 'Account types retrieved successfully',
  })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  @ApiResponse({ status: 403, description: 'Insufficient consent' })
  async getAccountTypes(): Promise<{
    types: string[];
    correlationId: string;
  }> {
    const types = [
      'checking',
      'savings',
      'investment',
      'credit',
      'loan',
    ];

    return {
      types,
      correlationId: require('uuid').v4(),
    };
  }

  @Get('contacts/types')
  @RequireConsent(ConsentScope.PROFILE)
  @ApiOperation({ summary: 'Get Contact Types' })
  @ApiResponse({
    status: 200,
    description: 'Contact types retrieved successfully',
  })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  @ApiResponse({ status: 403, description: 'Insufficient consent' })
  async getContactTypes(): Promise<{
    types: string[];
    correlationId: string;
  }> {
    const types = [
      'pix',
      'transfer',
      'bill_payment',
    ];

    return {
      types,
      correlationId: require('uuid').v4(),
    };
  }
}
