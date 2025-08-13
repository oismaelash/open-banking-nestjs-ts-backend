import { Test, TestingModule } from '@nestjs/testing';
import { AnalyticsController } from './analytics.controller';
import { AnalyticsService } from './analytics.service';

describe('AnalyticsController', () => {
  let controller: AnalyticsController;
  let service: AnalyticsService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [AnalyticsController],
      providers: [
        {
          provide: AnalyticsService,
          useValue: {
            getTransactionAnalytics: jest.fn(),
            getSpendingPatterns: jest.fn(),
            getFinancialInsights: jest.fn(),
            getBudgetAnalysis: jest.fn(),
            getTrendAnalysis: jest.fn(),
          },
        },
      ],
    }).compile();

    controller = module.get<AnalyticsController>(AnalyticsController);
    service = module.get<AnalyticsService>(AnalyticsService);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  describe('getTransactionAnalytics', () => {
    it('should return transaction analytics', async () => {
      const mockResponse = {
        totalTransactions: 150,
        totalAmount: 25000.00,
        averageAmount: 166.67,
        largestTransaction: 5000.00,
        smallestTransaction: 10.00,
        byCategory: [],
        byDate: [],
        byMerchant: [],
        correlationId: 'corr-123',
      };

      jest.spyOn(service, 'getTransactionAnalytics').mockResolvedValue(mockResponse);

      const result = await controller.getTransactionAnalytics({});

      expect(result).toEqual(mockResponse);
      expect(service.getTransactionAnalytics).toHaveBeenCalledWith('user-123', {});
    });
  });

  describe('getSpendingPatterns', () => {
    it('should return spending patterns', async () => {
      const mockResponse = {
        patterns: [],
        totalPatterns: 3,
        correlationId: 'corr-123',
      };

      jest.spyOn(service, 'getSpendingPatterns').mockResolvedValue(mockResponse);

      const result = await controller.getSpendingPatterns();

      expect(result).toEqual(mockResponse);
      expect(service.getSpendingPatterns).toHaveBeenCalledWith('user-123');
    });
  });

  describe('getFinancialInsights', () => {
    it('should return financial insights', async () => {
      const mockResponse = {
        insights: [],
        totalInsights: 5,
        correlationId: 'corr-123',
      };

      jest.spyOn(service, 'getFinancialInsights').mockResolvedValue(mockResponse);

      const result = await controller.getFinancialInsights();

      expect(result).toEqual(mockResponse);
      expect(service.getFinancialInsights).toHaveBeenCalledWith('user-123');
    });
  });

  describe('getBudgetAnalysis', () => {
    it('should return budget analysis', async () => {
      const mockResponse = {
        categories: [],
        totalBudget: 5000.00,
        totalSpending: 4200.00,
        overallStatus: 'under_budget',
        correlationId: 'corr-123',
      };

      jest.spyOn(service, 'getBudgetAnalysis').mockResolvedValue(mockResponse);

      const result = await controller.getBudgetAnalysis();

      expect(result).toEqual(mockResponse);
      expect(service.getBudgetAnalysis).toHaveBeenCalledWith('user-123');
    });
  });

  describe('getTrendAnalysis', () => {
    it('should return trend analysis', async () => {
      const mockResponse = {
        spendingTrend: 5.2,
        incomeTrend: 0.0,
        savingsRate: 15.8,
        topCategories: ['Alimentação', 'Transporte'],
        correlationId: 'corr-123',
      };

      jest.spyOn(service, 'getTrendAnalysis').mockResolvedValue(mockResponse);

      const result = await controller.getTrendAnalysis('30d');

      expect(result).toEqual(mockResponse);
      expect(service.getTrendAnalysis).toHaveBeenCalledWith('user-123', '30d');
    });
  });

  describe('getAnalyticsSummary', () => {
    it('should return analytics summary', async () => {
      jest.spyOn(service, 'getTransactionAnalytics').mockResolvedValue({
        totalTransactions: 8,
        totalAmount: 6145.40,
        averageAmount: 768.18,
        largestTransaction: 5000.00,
        smallestTransaction: 39.90,
        byCategory: [
          { category: 'Renda', count: 1, amount: 5000.00, percentage: 12.5, averageAmount: 5000.00 },
          { category: 'Alimentação', count: 2, amount: 370.00, percentage: 25, averageAmount: 185.00 },
        ],
        byDate: [],
        byMerchant: [],
        correlationId: 'corr-123',
      });

      const result = await controller.getAnalyticsSummary();

      expect(result).toHaveProperty('totalSpending');
      expect(result).toHaveProperty('totalIncome');
      expect(result).toHaveProperty('netSavings');
      expect(result).toHaveProperty('topSpendingCategory');
      expect(result).toHaveProperty('averageTransactionAmount');
      expect(result).toHaveProperty('transactionCount');
      expect(result).toHaveProperty('correlationId');
    });
  });

  describe('getTopSpendingCategories', () => {
    it('should return top spending categories', async () => {
      jest.spyOn(service, 'getTransactionAnalytics').mockResolvedValue({
        totalTransactions: 8,
        totalAmount: 6145.40,
        averageAmount: 768.18,
        largestTransaction: 5000.00,
        smallestTransaction: 39.90,
        byCategory: [
          { category: 'Alimentação', count: 2, amount: 370.00, percentage: 25, averageAmount: 185.00 },
          { category: 'Transporte', count: 1, amount: 200.00, percentage: 12.5, averageAmount: 200.00 },
        ],
        byDate: [],
        byMerchant: [],
        correlationId: 'corr-123',
      });

      const result = await controller.getTopSpendingCategories(5);

      expect(result).toHaveProperty('categories');
      expect(result).toHaveProperty('correlationId');
      expect(result.categories).toHaveLength(2);
    });
  });

  describe('getTopMerchants', () => {
    it('should return top merchants', async () => {
      jest.spyOn(service, 'getTransactionAnalytics').mockResolvedValue({
        totalTransactions: 8,
        totalAmount: 6145.40,
        averageAmount: 768.18,
        largestTransaction: 5000.00,
        smallestTransaction: 39.90,
        byCategory: [],
        byDate: [],
        byMerchant: [
          { merchant: 'Supermercado ABC', count: 1, amount: 250.00, percentage: 4.07 },
          { merchant: 'Netflix', count: 1, amount: 39.90, percentage: 0.65 },
        ],
        correlationId: 'corr-123',
      });

      const result = await controller.getTopMerchants(10);

      expect(result).toHaveProperty('merchants');
      expect(result).toHaveProperty('correlationId');
      expect(result.merchants).toHaveLength(2);
    });
  });
});
