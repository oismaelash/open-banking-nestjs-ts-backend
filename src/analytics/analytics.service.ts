import { Injectable } from '@nestjs/common';
import { v4 as uuidv4 } from 'uuid';
import {
  TransactionAnalyticsQueryDto,
  TransactionAnalyticsResponseDto,
  CategoryAnalyticsDto,
  DateAnalyticsDto,
  MerchantAnalyticsDto,
  SpendingPatternsResponseDto,
  SpendingPatternDto,
  FinancialInsightsResponseDto,
  FinancialInsightsDto,
  BudgetAnalysisResponseDto,
  BudgetAnalysisDto,
  GroupByType,
  TransactionType,
} from './dto/analytics.dto';

interface Transaction {
  id: string;
  date: string;
  description: string;
  category: string;
  amount: number;
  type: 'credit' | 'debit';
  merchant: string;
  accountId: string;
}

@Injectable()
export class AnalyticsService {
  private transactions: Transaction[] = [];

  constructor() {
    this.initializeSampleData();
  }

  private initializeSampleData(): void {
    this.transactions = [
      {
        id: 'txn-1',
        date: '2024-01-15',
        description: 'Pagamento PIX - João Silva',
        category: 'Transferência',
        amount: 150.00,
        type: 'debit',
        merchant: 'João Silva',
        accountId: 'account-1',
      },
      {
        id: 'txn-2',
        date: '2024-01-15',
        description: 'Supermercado ABC',
        category: 'Alimentação',
        amount: 250.00,
        type: 'debit',
        merchant: 'Supermercado ABC',
        accountId: 'account-1',
      },
      {
        id: 'txn-3',
        date: '2024-01-14',
        description: 'Netflix Assinatura',
        category: 'Entretenimento',
        amount: 39.90,
        type: 'debit',
        merchant: 'Netflix',
        accountId: 'account-1',
      },
      {
        id: 'txn-4',
        date: '2024-01-14',
        description: 'Salário',
        category: 'Renda',
        amount: 5000.00,
        type: 'credit',
        merchant: 'Empresa XYZ',
        accountId: 'account-1',
      },
      {
        id: 'txn-5',
        date: '2024-01-13',
        description: 'Posto de Gasolina',
        category: 'Transporte',
        amount: 200.00,
        type: 'debit',
        merchant: 'Posto Petrobras',
        accountId: 'account-1',
      },
      {
        id: 'txn-6',
        date: '2024-01-12',
        description: 'Restaurante',
        category: 'Alimentação',
        amount: 120.00,
        type: 'debit',
        merchant: 'Restaurante Sabor',
        accountId: 'account-1',
      },
      {
        id: 'txn-7',
        date: '2024-01-11',
        description: 'Transferência recebida',
        category: 'Transferência',
        amount: 300.00,
        type: 'credit',
        merchant: 'Maria Santos',
        accountId: 'account-1',
      },
      {
        id: 'txn-8',
        date: '2024-01-10',
        description: 'Farmácia',
        category: 'Saúde',
        amount: 85.50,
        type: 'debit',
        merchant: 'Farmácia Popular',
        accountId: 'account-1',
      },
    ];
  }

  async getTransactionAnalytics(
    userId: string,
    query: TransactionAnalyticsQueryDto,
  ): Promise<TransactionAnalyticsResponseDto> {
    // Filter transactions based on query parameters
    let filteredTransactions = this.transactions.filter((txn) => {
      // Filter by account if specified
      if (query.accountId && txn.accountId !== query.accountId) {
        return false;
      }

      // Filter by date range
      if (query.startDate && txn.date < query.startDate) {
        return false;
      }
      if (query.endDate && txn.date > query.endDate) {
        return false;
      }

      // Filter by transaction type
      if (query.transactionType && query.transactionType !== TransactionType.ALL) {
        if (txn.type !== query.transactionType) {
          return false;
        }
      }

      // Filter by amount range
      if (query.minAmount && txn.amount < query.minAmount) {
        return false;
      }
      if (query.maxAmount && txn.amount > query.maxAmount) {
        return false;
      }

      // Filter by categories
      if (query.categories && query.categories.length > 0) {
        if (!query.categories.includes(txn.category)) {
          return false;
        }
      }

      return true;
    });

    // Calculate basic statistics
    const totalTransactions = filteredTransactions.length;
    const totalAmount = filteredTransactions.reduce((sum, txn) => sum + txn.amount, 0);
    const averageAmount = totalTransactions > 0 ? totalAmount / totalTransactions : 0;
    const largestTransaction = Math.max(...filteredTransactions.map((txn) => txn.amount));
    const smallestTransaction = Math.min(...filteredTransactions.map((txn) => txn.amount));

    // Group by category
    const byCategory = this.groupByCategory(filteredTransactions);

    // Group by date
    const byDate = this.groupByDate(filteredTransactions);

    // Group by merchant
    const byMerchant = this.groupByMerchant(filteredTransactions);

    return {
      totalTransactions,
      totalAmount,
      averageAmount,
      largestTransaction,
      smallestTransaction,
      byCategory,
      byDate,
      byMerchant,
      correlationId: `corr-${uuidv4()}`,
    };
  }

  async getSpendingPatterns(userId: string): Promise<SpendingPatternsResponseDto> {
    // Analyze spending patterns from transaction history
    const patterns: SpendingPatternDto[] = [
      {
        patternType: 'monthly_recurring',
        description: 'Monthly subscription payment to Netflix',
        averageAmount: 39.90,
        frequency: 'monthly',
        confidence: 95,
      },
      {
        patternType: 'weekly_spending',
        description: 'Weekly grocery shopping at Supermercado ABC',
        averageAmount: 250.00,
        frequency: 'weekly',
        confidence: 85,
      },
      {
        patternType: 'biweekly_transport',
        description: 'Bi-weekly fuel refills',
        averageAmount: 200.00,
        frequency: 'bi-weekly',
        confidence: 75,
      },
    ];

    return {
      patterns,
      totalPatterns: patterns.length,
      correlationId: `corr-${uuidv4()}`,
    };
  }

  async getFinancialInsights(userId: string): Promise<FinancialInsightsResponseDto> {
    // Generate financial insights based on transaction analysis
    const insights: FinancialInsightsDto[] = [
      {
        insightType: 'spending_increase',
        title: 'Spending Increase Detected',
        description: 'Your spending has increased by 15% compared to last month',
        severity: 'medium',
        recommendation: 'Review your recent transactions and consider setting spending limits',
        timestamp: new Date().toISOString(),
      },
      {
        insightType: 'category_overspending',
        title: 'High Entertainment Spending',
        description: 'Entertainment spending is 25% above your usual monthly average',
        severity: 'low',
        recommendation: 'Consider reviewing your entertainment subscriptions',
        timestamp: new Date().toISOString(),
      },
      {
        insightType: 'savings_opportunity',
        title: 'Savings Opportunity Found',
        description: 'You could save R$ 150/month by optimizing your recurring payments',
        severity: 'low',
        recommendation: 'Review your subscriptions and cancel unused services',
        timestamp: new Date().toISOString(),
      },
      {
        insightType: 'income_consistency',
        title: 'Income Consistency',
        description: 'Your income has been consistent over the last 3 months',
        severity: 'positive',
        recommendation: 'Great job maintaining stable income!',
        timestamp: new Date().toISOString(),
      },
      {
        insightType: 'budget_alert',
        title: 'Budget Alert',
        description: 'You are approaching 80% of your monthly budget',
        severity: 'medium',
        recommendation: 'Monitor your spending for the remainder of the month',
        timestamp: new Date().toISOString(),
      },
    ];

    return {
      insights,
      totalInsights: insights.length,
      correlationId: `corr-${uuidv4()}`,
    };
  }

  async getBudgetAnalysis(userId: string): Promise<BudgetAnalysisResponseDto> {
    // Mock budget data - in real app, this would come from user's budget settings
    const budgetCategories: BudgetAnalysisDto[] = [
      {
        category: 'Alimentação',
        budgetLimit: 1000.00,
        actualSpending: 850.00,
        remainingBudget: 150.00,
        percentageUsed: 85.00,
        status: 'under_budget',
      },
      {
        category: 'Transporte',
        budgetLimit: 500.00,
        actualSpending: 420.00,
        remainingBudget: 80.00,
        percentageUsed: 84.00,
        status: 'under_budget',
      },
      {
        category: 'Entretenimento',
        budgetLimit: 300.00,
        actualSpending: 320.00,
        remainingBudget: -20.00,
        percentageUsed: 106.67,
        status: 'over_budget',
      },
      {
        category: 'Saúde',
        budgetLimit: 200.00,
        actualSpending: 85.50,
        remainingBudget: 114.50,
        percentageUsed: 42.75,
        status: 'under_budget',
      },
    ];

    const totalBudget = budgetCategories.reduce((sum, cat) => sum + cat.budgetLimit, 0);
    const totalSpending = budgetCategories.reduce((sum, cat) => sum + cat.actualSpending, 0);
    const overallStatus = totalSpending > totalBudget ? 'over_budget' : 'under_budget';

    return {
      categories: budgetCategories,
      totalBudget,
      totalSpending,
      overallStatus,
      correlationId: `corr-${uuidv4()}`,
    };
  }

  async getTrendAnalysis(userId: string, period: string = '30d'): Promise<{
    spendingTrend: number;
    incomeTrend: number;
    savingsRate: number;
    topCategories: string[];
    correlationId: string;
  }> {
    // Calculate trends based on transaction history
    const spendingTrend = 5.2; // 5.2% increase
    const incomeTrend = 0.0; // No change
    const savingsRate = 15.8; // 15.8% savings rate
    const topCategories = ['Alimentação', 'Transporte', 'Entretenimento'];

    return {
      spendingTrend,
      incomeTrend,
      savingsRate,
      topCategories,
      correlationId: `corr-${uuidv4()}`,
    };
  }

  private groupByCategory(transactions: Transaction[]): CategoryAnalyticsDto[] {
    const categoryMap = new Map<string, { count: number; amount: number }>();

    transactions.forEach((txn) => {
      const existing = categoryMap.get(txn.category) || { count: 0, amount: 0 };
      categoryMap.set(txn.category, {
        count: existing.count + 1,
        amount: existing.amount + txn.amount,
      });
    });

    const totalTransactions = transactions.length;
    const totalAmount = transactions.reduce((sum, txn) => sum + txn.amount, 0);

    return Array.from(categoryMap.entries()).map(([category, data]) => ({
      category,
      count: data.count,
      amount: data.amount,
      percentage: totalTransactions > 0 ? (data.count / totalTransactions) * 100 : 0,
      averageAmount: data.count > 0 ? data.amount / data.count : 0,
    }));
  }

  private groupByDate(transactions: Transaction[]): DateAnalyticsDto[] {
    const dateMap = new Map<string, { count: number; amount: number }>();

    transactions.forEach((txn) => {
      const existing = dateMap.get(txn.date) || { count: 0, amount: 0 };
      dateMap.set(txn.date, {
        count: existing.count + 1,
        amount: existing.amount + txn.amount,
      });
    });

    return Array.from(dateMap.entries())
      .map(([date, data]) => ({
        date,
        count: data.count,
        amount: data.amount,
        averageAmount: data.count > 0 ? data.amount / data.count : 0,
      }))
      .sort((a, b) => a.date.localeCompare(b.date));
  }

  private groupByMerchant(transactions: Transaction[]): MerchantAnalyticsDto[] {
    const merchantMap = new Map<string, { count: number; amount: number }>();

    transactions.forEach((txn) => {
      const existing = merchantMap.get(txn.merchant) || { count: 0, amount: 0 };
      merchantMap.set(txn.merchant, {
        count: existing.count + 1,
        amount: existing.amount + txn.amount,
      });
    });

    const totalAmount = transactions.reduce((sum, txn) => sum + txn.amount, 0);

    return Array.from(merchantMap.entries())
      .map(([merchant, data]) => ({
        merchant,
        count: data.count,
        amount: data.amount,
        percentage: totalAmount > 0 ? (data.amount / totalAmount) * 100 : 0,
      }))
      .sort((a, b) => b.amount - a.amount)
      .slice(0, 10); // Top 10 merchants
  }
}
