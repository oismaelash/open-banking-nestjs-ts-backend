import { Injectable } from '@nestjs/common';
import { v4 as uuidv4 } from 'uuid';
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
  TransactionDto,
  AccountDto,
  ContactDto,
  PaginationDto,
  SearchSuggestionDto,
  TransactionType,
  TransactionCategory,
  TransactionStatus,
  AccountType,
  AccountStatus,
  ContactType,
} from './dto/search.dto';

interface Transaction {
  id: string;
  date: string;
  description: string;
  category: TransactionCategory;
  amount: number;
  type: TransactionType;
  status: TransactionStatus;
  merchant: string;
  accountId: string;
  reference: string;
  fee: number;
}

interface Account {
  id: string;
  type: AccountType;
  name: string;
  number: string;
  balance: number;
  availableBalance: number;
  status: AccountStatus;
  bank: string;
  lastUpdated: string;
}

interface Contact {
  id: string;
  name: string;
  value: string;
  type: ContactType;
  bank: string;
  createdAt: string;
}

@Injectable()
export class SearchService {
  private transactions: Transaction[] = [];
  private accounts: Account[] = [];
  private contacts: Contact[] = [];

  constructor() {
    this.initializeSampleData();
  }

  private initializeSampleData() {
    // Sample transactions
    this.transactions = [
      {
        id: 'txn-1',
        date: '2024-01-15T14:30:00Z',
        description: 'Pagamento PIX - João Silva',
        category: TransactionCategory.PIX,
        amount: 150.00,
        type: TransactionType.DEBIT,
        status: TransactionStatus.COMPLETED,
        merchant: 'João Silva',
        accountId: 'account-1',
        reference: 'PIX123456789',
        fee: 0.00,
      },
      {
        id: 'txn-2',
        date: '2024-01-15T12:00:00Z',
        description: 'Compra no Supermercado ABC',
        category: TransactionCategory.COMPRA,
        amount: 89.50,
        type: TransactionType.DEBIT,
        status: TransactionStatus.COMPLETED,
        merchant: 'Supermercado ABC',
        accountId: 'account-1',
        reference: 'COMP789456123',
        fee: 0.00,
      },
      {
        id: 'txn-3',
        date: '2024-01-15T10:15:00Z',
        description: 'Depósito - Salário',
        category: TransactionCategory.DEPOSITO,
        amount: 5000.00,
        type: TransactionType.CREDIT,
        status: TransactionStatus.COMPLETED,
        merchant: 'Empresa XYZ',
        accountId: 'account-1',
        reference: 'DEP456789123',
        fee: 0.00,
      },
      {
        id: 'txn-4',
        date: '2024-01-14T16:45:00Z',
        description: 'Transferência para Conta Poupança',
        category: TransactionCategory.TRANSFERENCIA,
        amount: 1000.00,
        type: TransactionType.DEBIT,
        status: TransactionStatus.COMPLETED,
        merchant: 'Transferência Interna',
        accountId: 'account-1',
        reference: 'TRF123789456',
        fee: 0.00,
      },
      {
        id: 'txn-5',
        date: '2024-01-14T14:20:00Z',
        description: 'Pagamento de Conta - Energia Elétrica',
        category: TransactionCategory.PAGAMENTO_DE_CONTA,
        amount: 250.00,
        type: TransactionType.DEBIT,
        status: TransactionStatus.COMPLETED,
        merchant: 'Companhia de Energia',
        accountId: 'account-1',
        reference: 'CONTA987654321',
        fee: 2.50,
      },
    ];

    // Sample accounts
    this.accounts = [
      {
        id: 'account-1',
        type: AccountType.CHECKING,
        name: 'Conta Corrente Principal',
        number: '****1234',
        balance: 15420.50,
        availableBalance: 15200.00,
        status: AccountStatus.ACTIVE,
        bank: 'Banco do Brasil',
        lastUpdated: '2024-01-15T15:00:00Z',
      },
      {
        id: 'account-2',
        type: AccountType.SAVINGS,
        name: 'Conta Poupança',
        number: '****5678',
        balance: 25000.00,
        availableBalance: 25000.00,
        status: AccountStatus.ACTIVE,
        bank: 'Banco do Brasil',
        lastUpdated: '2024-01-15T15:00:00Z',
      },
      {
        id: 'account-3',
        type: AccountType.INVESTMENT,
        name: 'Conta Investimento',
        number: '****9012',
        balance: 75000.00,
        availableBalance: 75000.00,
        status: AccountStatus.ACTIVE,
        bank: 'Banco do Brasil',
        lastUpdated: '2024-01-15T15:00:00Z',
      },
    ];

    // Sample contacts
    this.contacts = [
      {
        id: 'contact-1',
        name: 'João Silva',
        value: '+55 11 99999-9999',
        type: ContactType.PIX,
        bank: 'Banco do Brasil',
        createdAt: '2024-01-10T10:00:00Z',
      },
      {
        id: 'contact-2',
        name: 'Maria Santos',
        value: 'maria@email.com',
        type: ContactType.PIX,
        bank: 'Itaú',
        createdAt: '2024-01-08T14:30:00Z',
      },
      {
        id: 'contact-3',
        name: 'Pedro Costa',
        value: '123.456.789-00',
        type: ContactType.PIX,
        bank: 'Bradesco',
        createdAt: '2024-01-05T09:15:00Z',
      },
      {
        id: 'contact-4',
        name: 'Supermercado ABC',
        value: '12.345.678/0001-90',
        type: ContactType.BILL_PAYMENT,
        bank: 'Banco do Brasil',
        createdAt: '2024-01-03T11:20:00Z',
      },
    ];
  }

  async searchTransactions(query: TransactionSearchQueryDto): Promise<TransactionSearchResponseDto> {
    let filteredTransactions = [...this.transactions];

    // Apply search query
    if (query.q) {
      const searchTerm = query.q.toLowerCase();
      filteredTransactions = filteredTransactions.filter(txn =>
        txn.description.toLowerCase().includes(searchTerm) ||
        txn.merchant.toLowerCase().includes(searchTerm) ||
        txn.reference.toLowerCase().includes(searchTerm)
      );
    }

    // Apply filters
    if (query.accountId) {
      filteredTransactions = filteredTransactions.filter(txn => txn.accountId === query.accountId);
    }

    if (query.startDate) {
      filteredTransactions = filteredTransactions.filter(txn => txn.date >= query.startDate);
    }

    if (query.endDate) {
      filteredTransactions = filteredTransactions.filter(txn => txn.date <= query.endDate);
    }

    if (query.category) {
      filteredTransactions = filteredTransactions.filter(txn => txn.category === query.category);
    }

    if (query.type) {
      filteredTransactions = filteredTransactions.filter(txn => txn.type === query.type);
    }

    if (query.status) {
      filteredTransactions = filteredTransactions.filter(txn => txn.status === query.status);
    }

    if (query.minAmount !== undefined) {
      filteredTransactions = filteredTransactions.filter(txn => txn.amount >= query.minAmount);
    }

    if (query.maxAmount !== undefined) {
      filteredTransactions = filteredTransactions.filter(txn => txn.amount <= query.maxAmount);
    }

    if (query.merchant) {
      const merchantTerm = query.merchant.toLowerCase();
      filteredTransactions = filteredTransactions.filter(txn =>
        txn.merchant.toLowerCase().includes(merchantTerm)
      );
    }

    if (query.reference) {
      const referenceTerm = query.reference.toLowerCase();
      filteredTransactions = filteredTransactions.filter(txn =>
        txn.reference.toLowerCase().includes(referenceTerm)
      );
    }

    // Apply sorting
    const sortBy = query.sortBy || 'date';
    const sortOrder = query.sortOrder || 'desc';
    
    filteredTransactions.sort((a, b) => {
      let aValue: any, bValue: any;
      
      switch (sortBy) {
        case 'date':
          aValue = new Date(a.date).getTime();
          bValue = new Date(b.date).getTime();
          break;
        case 'amount':
          aValue = a.amount;
          bValue = b.amount;
          break;
        case 'description':
          aValue = a.description.toLowerCase();
          bValue = b.description.toLowerCase();
          break;
        case 'merchant':
          aValue = a.merchant.toLowerCase();
          bValue = b.merchant.toLowerCase();
          break;
        default:
          aValue = new Date(a.date).getTime();
          bValue = new Date(b.date).getTime();
      }

      if (sortOrder === 'asc') {
        return aValue > bValue ? 1 : -1;
      } else {
        return aValue < bValue ? 1 : -1;
      }
    });

    // Apply pagination
    const total = filteredTransactions.length;
    const limit = query.limit || 20;
    const offset = query.offset || 0;
    const paginatedTransactions = filteredTransactions.slice(offset, offset + limit);

    const pagination: PaginationDto = {
      total,
      limit,
      offset,
      hasMore: offset + limit < total,
      page: Math.floor(offset / limit) + 1,
      totalPages: Math.ceil(total / limit),
    };

    return {
      transactions: paginatedTransactions,
      pagination,
      filters: query,
      correlationId: uuidv4(),
    };
  }

  async searchAccounts(query: AccountSearchQueryDto): Promise<AccountSearchResponseDto> {
    let filteredAccounts = [...this.accounts];

    // Apply search query
    if (query.q) {
      const searchTerm = query.q.toLowerCase();
      filteredAccounts = filteredAccounts.filter(account =>
        account.name.toLowerCase().includes(searchTerm) ||
        account.number.toLowerCase().includes(searchTerm)
      );
    }

    // Apply filters
    if (query.type) {
      filteredAccounts = filteredAccounts.filter(account => account.type === query.type);
    }

    if (query.status) {
      filteredAccounts = filteredAccounts.filter(account => account.status === query.status);
    }

    if (query.bank) {
      const bankTerm = query.bank.toLowerCase();
      filteredAccounts = filteredAccounts.filter(account =>
        account.bank.toLowerCase().includes(bankTerm)
      );
    }

    if (query.minBalance !== undefined) {
      filteredAccounts = filteredAccounts.filter(account => account.balance >= query.minBalance);
    }

    if (query.maxBalance !== undefined) {
      filteredAccounts = filteredAccounts.filter(account => account.balance <= query.maxBalance);
    }

    // Apply pagination
    const total = filteredAccounts.length;
    const limit = query.limit || 20;
    const offset = query.offset || 0;
    const paginatedAccounts = filteredAccounts.slice(offset, offset + limit);

    const pagination: PaginationDto = {
      total,
      limit,
      offset,
      hasMore: offset + limit < total,
      page: Math.floor(offset / limit) + 1,
      totalPages: Math.ceil(total / limit),
    };

    return {
      accounts: paginatedAccounts,
      pagination,
      filters: query,
      correlationId: uuidv4(),
    };
  }

  async searchContacts(query: ContactSearchQueryDto): Promise<ContactSearchResponseDto> {
    let filteredContacts = [...this.contacts];

    // Apply search query
    if (query.q) {
      const searchTerm = query.q.toLowerCase();
      filteredContacts = filteredContacts.filter(contact =>
        contact.name.toLowerCase().includes(searchTerm) ||
        contact.value.toLowerCase().includes(searchTerm)
      );
    }

    // Apply filters
    if (query.type) {
      filteredContacts = filteredContacts.filter(contact => contact.type === query.type);
    }

    if (query.bank) {
      const bankTerm = query.bank.toLowerCase();
      filteredContacts = filteredContacts.filter(contact =>
        contact.bank.toLowerCase().includes(bankTerm)
      );
    }

    // Apply pagination
    const total = filteredContacts.length;
    const limit = query.limit || 20;
    const offset = query.offset || 0;
    const paginatedContacts = filteredContacts.slice(offset, offset + limit);

    const pagination: PaginationDto = {
      total,
      limit,
      offset,
      hasMore: offset + limit < total,
      page: Math.floor(offset / limit) + 1,
      totalPages: Math.ceil(total / limit),
    };

    return {
      contacts: paginatedContacts,
      pagination,
      filters: query,
      correlationId: uuidv4(),
    };
  }

  async globalSearch(query: GlobalSearchQueryDto): Promise<GlobalSearchResultDto> {
    const results = {
      transactions: [] as TransactionDto[],
      accounts: [] as AccountDto[],
      contacts: [] as ContactDto[],
    };

    const searchTerm = query.q.toLowerCase();
    const limit = query.limit || 10;

    // Search transactions
    if (query.includeTransactions !== false) {
      results.transactions = this.transactions
        .filter(txn =>
          txn.description.toLowerCase().includes(searchTerm) ||
          txn.merchant.toLowerCase().includes(searchTerm) ||
          txn.reference.toLowerCase().includes(searchTerm)
        )
        .slice(0, limit);
    }

    // Search accounts
    if (query.includeAccounts !== false) {
      results.accounts = this.accounts
        .filter(account =>
          account.name.toLowerCase().includes(searchTerm) ||
          account.number.toLowerCase().includes(searchTerm)
        )
        .slice(0, limit);
    }

    // Search contacts
    if (query.includeContacts !== false) {
      results.contacts = this.contacts
        .filter(contact =>
          contact.name.toLowerCase().includes(searchTerm) ||
          contact.value.toLowerCase().includes(searchTerm)
        )
        .slice(0, limit);
    }

    const totalResults = results.transactions.length + results.accounts.length + results.contacts.length;

    return {
      ...results,
      totalResults,
      query: query.q,
      correlationId: uuidv4(),
    };
  }

  async getSearchSuggestions(query: SearchSuggestionsQueryDto): Promise<SearchSuggestionsResponseDto> {
    const suggestions: SearchSuggestionDto[] = [];
    const searchTerm = query.q.toLowerCase();
    const limit = query.limit || 10;

    // Generate transaction suggestions
    if (query.type === 'all' || query.type === 'transactions') {
      // Merchant suggestions
      const merchants = [...new Set(this.transactions.map(txn => txn.merchant))];
      merchants.forEach(merchant => {
        if (merchant.toLowerCase().includes(searchTerm)) {
          suggestions.push({
            text: merchant,
            type: 'merchant',
            value: merchant,
            score: this.calculateRelevanceScore(merchant, searchTerm),
          });
        }
      });

      // Category suggestions
      const categories = [...new Set(this.transactions.map(txn => txn.category))];
      categories.forEach(category => {
        if (category.toLowerCase().includes(searchTerm)) {
          suggestions.push({
            text: category,
            type: 'category',
            value: category,
            score: this.calculateRelevanceScore(category, searchTerm),
          });
        }
      });
    }

    // Generate account suggestions
    if (query.type === 'all' || query.type === 'accounts') {
      this.accounts.forEach(account => {
        if (account.name.toLowerCase().includes(searchTerm)) {
          suggestions.push({
            text: account.name,
            type: 'account',
            value: account.id,
            score: this.calculateRelevanceScore(account.name, searchTerm),
          });
        }
      });
    }

    // Generate contact suggestions
    if (query.type === 'all' || query.type === 'contacts') {
      this.contacts.forEach(contact => {
        if (contact.name.toLowerCase().includes(searchTerm)) {
          suggestions.push({
            text: contact.name,
            type: 'contact',
            value: contact.id,
            score: this.calculateRelevanceScore(contact.name, searchTerm),
          });
        }
      });
    }

    // Sort by relevance score and limit results
    suggestions.sort((a, b) => b.score - a.score);
    const limitedSuggestions = suggestions.slice(0, limit);

    return {
      suggestions: limitedSuggestions,
      query: query.q,
      correlationId: uuidv4(),
    };
  }

  private calculateRelevanceScore(text: string, searchTerm: string): number {
    const textLower = text.toLowerCase();
    const searchLower = searchTerm.toLowerCase();
    
    // Exact match gets highest score
    if (textLower === searchLower) return 100;
    
    // Starts with search term gets high score
    if (textLower.startsWith(searchLower)) return 90;
    
    // Contains search term gets medium score
    if (textLower.includes(searchLower)) return 70;
    
    // Partial match gets lower score
    const words = searchLower.split(' ');
    const textWords = textLower.split(' ');
    const matchingWords = words.filter(word => 
      textWords.some(textWord => textWord.includes(word))
    );
    
    return (matchingWords.length / words.length) * 50;
  }

  async getSearchStats(): Promise<{
    totalTransactions: number;
    totalAccounts: number;
    totalContacts: number;
    correlationId: string;
  }> {
    return {
      totalTransactions: this.transactions.length,
      totalAccounts: this.accounts.length,
      totalContacts: this.contacts.length,
      correlationId: uuidv4(),
    };
  }
}
