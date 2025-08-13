import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { v4 as uuidv4 } from 'uuid';
import {
  AccountDto,
  AccountDetailDto,
  TransactionDto,
  BalanceHistoryDto,
  AccountsResponseDto,
  AccountDetailResponseDto,
  TransactionsResponseDto,
  BalanceHistoryResponseDto,
  TransactionFiltersDto,
  BalanceHistoryFiltersDto,
  StatementRequestDto,
  StatementResponseDto,
  AccountType,
  AccountStatus,
  TransactionType,
  TransactionStatus,
  TransactionCategory,
} from './dto/account.dto';

@Injectable()
export class AccountsService {
  // In-memory storage for development (replace with database in production)
  private accounts: Map<string, any> = new Map();
  private transactions: Map<string, any[]> = new Map();
  private balanceHistory: Map<string, any[]> = new Map();

  constructor() {
    this.initializeSampleData();
  }

  // Get all user accounts
  async getUserAccounts(userId: string): Promise<AccountsResponseDto> {
    const userAccounts = Array.from(this.accounts.values()).filter(
      account => account.userId === userId && account.status === AccountStatus.ACTIVE
    );

    const accounts: AccountDto[] = userAccounts.map(account => ({
      id: account.id,
      type: account.type,
      name: account.name,
      number: account.number,
      balance: account.balance,
      availableBalance: account.availableBalance,
      status: account.status,
      bank: account.bank,
      lastUpdated: account.lastUpdated,
    }));

    return {
      success: true,
      accounts,
      correlationId: uuidv4(),
    };
  }

  // Get account details
  async getAccountDetails(userId: string, accountId: string): Promise<AccountDetailResponseDto> {
    const account = this.accounts.get(accountId);
    if (!account) {
      throw new NotFoundException('Account not found');
    }

    // Check if user owns this account
    if (account.userId !== userId) {
      throw new NotFoundException('Account not found');
    }

    const accountDetail: AccountDetailDto = {
      id: account.id,
      type: account.type,
      name: account.name,
      number: account.number,
      balance: account.balance,
      availableBalance: account.availableBalance,
      status: account.status,
      bank: account.bank,
      lastUpdated: account.lastUpdated,
      openingDate: account.openingDate,
      monthlyFee: account.monthlyFee,
      dailyLimit: account.dailyLimit,
      monthlyLimit: account.monthlyLimit,
      description: account.description,
      holderName: account.holderName,
      holderCpf: account.holderCpf,
    };

    return {
      success: true,
      account: accountDetail,
      correlationId: uuidv4(),
    };
  }

  // Get account transactions
  async getAccountTransactions(
    userId: string,
    accountId: string,
    filters: TransactionFiltersDto,
  ): Promise<TransactionsResponseDto> {
    const account = this.accounts.get(accountId);
    if (!account || account.userId !== userId) {
      throw new NotFoundException('Account not found');
    }

    let transactions = this.transactions.get(accountId) || [];

    // Apply filters
    if (filters.startDate) {
      transactions = transactions.filter(t => t.date >= filters.startDate);
    }
    if (filters.endDate) {
      transactions = transactions.filter(t => t.date <= filters.endDate);
    }
    if (filters.category) {
      transactions = transactions.filter(t => t.category === filters.category);
    }
    if (filters.type) {
      transactions = transactions.filter(t => t.type === filters.type);
    }
    if (filters.minAmount !== undefined) {
      transactions = transactions.filter(t => t.amount >= filters.minAmount);
    }
    if (filters.maxAmount !== undefined) {
      transactions = transactions.filter(t => t.amount <= filters.maxAmount);
    }
    if (filters.search) {
      const searchTerm = filters.search.toLowerCase();
      transactions = transactions.filter(
        t => t.description.toLowerCase().includes(searchTerm) ||
             (t.merchant && t.merchant.toLowerCase().includes(searchTerm))
      );
    }

    // Sort by date (newest first)
    transactions.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());

    // Apply pagination
    const limit = filters.limit || 20;
    const offset = filters.offset || 0;
    const total = transactions.length;
    const paginatedTransactions = transactions.slice(offset, offset + limit);

    const transactionDtos: TransactionDto[] = paginatedTransactions.map(t => ({
      id: t.id,
      date: t.date,
      description: t.description,
      category: t.category,
      amount: t.amount,
      type: t.type,
      status: t.status,
      merchant: t.merchant,
      accountId: t.accountId,
      reference: t.reference,
      location: t.location,
      tags: t.tags,
    }));

    return {
      success: true,
      transactions: transactionDtos,
      pagination: {
        total,
        limit,
        offset,
        hasMore: offset + limit < total,
      },
      correlationId: uuidv4(),
    };
  }

  // Get balance history
  async getBalanceHistory(
    userId: string,
    accountId: string,
    filters: BalanceHistoryFiltersDto,
  ): Promise<BalanceHistoryResponseDto> {
    const account = this.accounts.get(accountId);
    if (!account || account.userId !== userId) {
      throw new NotFoundException('Account not found');
    }

    let balanceHistory = this.balanceHistory.get(accountId) || [];

    // Apply date filters
    if (filters.startDate) {
      balanceHistory = balanceHistory.filter(b => b.date >= filters.startDate);
    }
    if (filters.endDate) {
      balanceHistory = balanceHistory.filter(b => b.date <= filters.endDate);
    }

    // Apply interval grouping if specified
    if (filters.interval) {
      balanceHistory = this.groupBalanceHistoryByInterval(balanceHistory, filters.interval);
    }

    // Sort by date (newest first)
    balanceHistory.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());

    const balanceHistoryDtos: BalanceHistoryDto[] = balanceHistory.map(b => ({
      date: b.date,
      balance: b.balance,
      availableBalance: b.availableBalance,
      change: b.change,
      changePercentage: b.changePercentage,
    }));

    return {
      success: true,
      balanceHistory: balanceHistoryDtos,
      correlationId: uuidv4(),
    };
  }

  // Generate account statement
  async generateStatement(
    userId: string,
    accountId: string,
    request: StatementRequestDto,
  ): Promise<StatementResponseDto> {
    const account = this.accounts.get(accountId);
    if (!account || account.userId !== userId) {
      throw new NotFoundException('Account not found');
    }

    // Validate date range
    const startDate = new Date(request.startDate);
    const endDate = new Date(request.endDate);
    if (startDate > endDate) {
      throw new BadRequestException('Start date must be before end date');
    }

    // Get transactions for the period
    const transactions = this.transactions.get(accountId) || [];
    const periodTransactions = transactions.filter(t => {
      const transactionDate = new Date(t.date);
      return transactionDate >= startDate && transactionDate <= endDate;
    });

    // Filter pending transactions if requested
    const filteredTransactions = request.includePending
      ? periodTransactions
      : periodTransactions.filter(t => t.status === TransactionStatus.COMPLETED);

    // Generate statement based on format
    const format = request.format || 'json';
    let statement: string;

    switch (format) {
      case 'json':
        statement = JSON.stringify({
          account: {
            id: account.id,
            name: account.name,
            number: account.number,
            bank: account.bank,
          },
          period: {
            startDate: request.startDate,
            endDate: request.endDate,
          },
          transactions: filteredTransactions,
          summary: {
            totalTransactions: filteredTransactions.length,
            totalCredits: filteredTransactions
              .filter(t => t.type === TransactionType.CREDIT)
              .reduce((sum, t) => sum + t.amount, 0),
            totalDebits: filteredTransactions
              .filter(t => t.type === TransactionType.DEBIT)
              .reduce((sum, t) => sum + t.amount, 0),
          },
        }, null, 2);
        break;

      case 'csv':
        statement = this.generateCsvStatement(account, filteredTransactions, request);
        break;

      case 'pdf':
        // In production, generate PDF using a library like PDFKit
        statement = `PDF statement for account ${account.id} from ${request.startDate} to ${request.endDate}`;
        break;

      default:
        throw new BadRequestException('Unsupported format');
    }

    return {
      success: true,
      statement,
      format,
      period: {
        startDate: request.startDate,
        endDate: request.endDate,
      },
      correlationId: uuidv4(),
    };
  }

  // Add a new transaction (for testing/demo purposes)
  async addTransaction(accountId: string, transactionData: Partial<TransactionDto>): Promise<void> {
    const account = this.accounts.get(accountId);
    if (!account) {
      throw new NotFoundException('Account not found');
    }

    const transaction = {
      id: uuidv4(),
      date: new Date().toISOString().split('T')[0],
      description: transactionData.description || 'Sample transaction',
      category: transactionData.category || TransactionCategory.OTHER,
      amount: transactionData.amount || 0,
      type: transactionData.type || TransactionType.DEBIT,
      status: TransactionStatus.COMPLETED,
      merchant: transactionData.merchant,
      accountId,
      reference: transactionData.reference,
      location: transactionData.location,
      tags: transactionData.tags || [],
    };

    if (!this.transactions.has(accountId)) {
      this.transactions.set(accountId, []);
    }
    this.transactions.get(accountId).push(transaction);

    // Update account balance
    if (transaction.type === TransactionType.CREDIT) {
      account.balance += transaction.amount;
      account.availableBalance += transaction.amount;
    } else {
      account.balance -= transaction.amount;
      account.availableBalance -= transaction.amount;
    }
    account.lastUpdated = new Date().toISOString();

    // Add to balance history
    this.addBalanceHistoryEntry(accountId, account.balance, account.availableBalance);
  }

  private initializeSampleData(): void {
    // Sample accounts
    const sampleAccounts = [
      {
        id: 'account-1',
        userId: 'user-123',
        type: AccountType.CHECKING,
        name: 'Conta Corrente Principal',
        number: '****1234',
        balance: 15420.50,
        availableBalance: 15200.00,
        status: AccountStatus.ACTIVE,
        bank: 'Banco do Brasil',
        lastUpdated: '2024-01-15T10:30:00Z',
        openingDate: '2020-03-15T00:00:00Z',
        monthlyFee: 0.00,
        dailyLimit: 10000,
        monthlyLimit: 50000,
        description: 'Conta corrente principal para transações diárias',
        holderName: 'João Silva Santos',
        holderCpf: '123.456.789-00',
      },
      {
        id: 'account-2',
        userId: 'user-123',
        type: AccountType.SAVINGS,
        name: 'Conta Poupança',
        number: '****5678',
        balance: 50000.00,
        availableBalance: 50000.00,
        status: AccountStatus.ACTIVE,
        bank: 'Banco do Brasil',
        lastUpdated: '2024-01-15T10:30:00Z',
        openingDate: '2019-06-10T00:00:00Z',
        monthlyFee: 0.00,
        dailyLimit: 5000,
        monthlyLimit: 20000,
        description: 'Conta poupança para reserva de emergência',
        holderName: 'João Silva Santos',
        holderCpf: '123.456.789-00',
      },
    ];

    sampleAccounts.forEach(account => {
      this.accounts.set(account.id, account);
    });

    // Sample transactions
    const sampleTransactions = [
      {
        id: 'txn-1',
        date: '2024-01-15',
        description: 'Pagamento PIX - João Silva',
        category: TransactionCategory.PIX,
        amount: 150.00,
        type: TransactionType.DEBIT,
        status: TransactionStatus.COMPLETED,
        merchant: 'João Silva',
        accountId: 'account-1',
        reference: 'PIX123456789',
        location: 'São Paulo, SP',
        tags: ['pix', 'transfer'],
      },
      {
        id: 'txn-2',
        date: '2024-01-14',
        description: 'Depósito em conta',
        category: TransactionCategory.DEPOSIT,
        amount: 2000.00,
        type: TransactionType.CREDIT,
        status: TransactionStatus.COMPLETED,
        merchant: 'Banco do Brasil',
        accountId: 'account-1',
        reference: 'DEP123456',
        location: 'São Paulo, SP',
        tags: ['deposit'],
      },
      {
        id: 'txn-3',
        date: '2024-01-13',
        description: 'Compra no cartão - Supermercado',
        category: TransactionCategory.PURCHASE,
        amount: 89.50,
        type: TransactionType.DEBIT,
        status: TransactionStatus.COMPLETED,
        merchant: 'Supermercado ABC',
        accountId: 'account-1',
        reference: 'COMP789456',
        location: 'São Paulo, SP',
        tags: ['purchase', 'food'],
      },
    ];

    sampleTransactions.forEach(transaction => {
      if (!this.transactions.has(transaction.accountId)) {
        this.transactions.set(transaction.accountId, []);
      }
      this.transactions.get(transaction.accountId).push(transaction);
    });

    // Initialize balance history
    sampleAccounts.forEach(account => {
      this.addBalanceHistoryEntry(account.id, account.balance, account.availableBalance);
    });
  }

  private addBalanceHistoryEntry(accountId: string, balance: number, availableBalance: number): void {
    if (!this.balanceHistory.has(accountId)) {
      this.balanceHistory.set(accountId, []);
    }

    const history = this.balanceHistory.get(accountId);
    const previousEntry = history[history.length - 1];

    const entry = {
      date: new Date().toISOString().split('T')[0],
      balance,
      availableBalance,
      change: previousEntry ? balance - previousEntry.balance : 0,
      changePercentage: previousEntry ? ((balance - previousEntry.balance) / previousEntry.balance) * 100 : 0,
    };

    history.push(entry);
  }

  private groupBalanceHistoryByInterval(history: any[], interval: string): any[] {
    const grouped = new Map();

    history.forEach(entry => {
      let key: string;
      const date = new Date(entry.date);

      switch (interval) {
        case 'weekly':
          const weekStart = new Date(date);
          weekStart.setDate(date.getDate() - date.getDay());
          key = weekStart.toISOString().split('T')[0];
          break;
        case 'monthly':
          key = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}`;
          break;
        default: // daily
          key = entry.date;
      }

      if (!grouped.has(key)) {
        grouped.set(key, {
          date: key,
          balance: entry.balance,
          availableBalance: entry.availableBalance,
          change: 0,
          changePercentage: 0,
        });
      } else {
        const existing = grouped.get(key);
        existing.balance = entry.balance;
        existing.availableBalance = entry.availableBalance;
      }
    });

    return Array.from(grouped.values());
  }

  private generateCsvStatement(account: any, transactions: any[], request: StatementRequestDto): string {
    const headers = ['Date', 'Description', 'Category', 'Type', 'Amount', 'Status', 'Reference'];
    const rows = transactions.map(t => [
      t.date,
      t.description,
      t.category,
      t.type,
      t.amount.toFixed(2),
      t.status,
      t.reference || '',
    ]);

    const csvContent = [headers, ...rows]
      .map(row => row.map(cell => `"${cell}"`).join(','))
      .join('\n');

    return csvContent;
  }
}
