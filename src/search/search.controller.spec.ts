import { Test, TestingModule } from '@nestjs/testing';
import { SearchController } from './search.controller';
import { SearchService } from './search.service';

describe('SearchController', () => {
  let controller: SearchController;
  let service: SearchService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [SearchController],
      providers: [SearchService],
    }).compile();

    controller = module.get<SearchController>(SearchController);
    service = module.get<SearchService>(SearchService);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  describe('searchTransactions', () => {
    it('should search transactions', async () => {
      const query = { q: 'PIX', limit: 10 };
      const result = await controller.searchTransactions(query);
      expect(result.transactions).toBeDefined();
      expect(Array.isArray(result.transactions)).toBe(true);
      expect(result.pagination).toBeDefined();
      expect(result.filters).toBeDefined();
      expect(result.correlationId).toBeDefined();
    });
  });

  describe('searchAccounts', () => {
    it('should search accounts', async () => {
      const query = { q: 'Principal', limit: 10 };
      const result = await controller.searchAccounts(query);
      expect(result.accounts).toBeDefined();
      expect(Array.isArray(result.accounts)).toBe(true);
      expect(result.pagination).toBeDefined();
      expect(result.filters).toBeDefined();
      expect(result.correlationId).toBeDefined();
    });
  });

  describe('searchContacts', () => {
    it('should search contacts', async () => {
      const query = { q: 'João', limit: 10 };
      const result = await controller.searchContacts(query);
      expect(result.contacts).toBeDefined();
      expect(Array.isArray(result.contacts)).toBe(true);
      expect(result.pagination).toBeDefined();
      expect(result.filters).toBeDefined();
      expect(result.correlationId).toBeDefined();
    });
  });

  describe('globalSearch', () => {
    it('should perform global search', async () => {
      const query = { q: 'João', limit: 10 };
      const result = await controller.globalSearch(query);
      expect(result.transactions).toBeDefined();
      expect(result.accounts).toBeDefined();
      expect(result.contacts).toBeDefined();
      expect(result.totalResults).toBeDefined();
      expect(result.query).toBeDefined();
      expect(result.correlationId).toBeDefined();
    });
  });

  describe('getSearchSuggestions', () => {
    it('should get search suggestions', async () => {
      const query = { q: 'João', limit: 10 };
      const result = await controller.getSearchSuggestions(query);
      expect(result.suggestions).toBeDefined();
      expect(Array.isArray(result.suggestions)).toBe(true);
      expect(result.query).toBeDefined();
      expect(result.correlationId).toBeDefined();
    });
  });

  describe('getSearchStats', () => {
    it('should get search statistics', async () => {
      const result = await controller.getSearchStats();
      expect(result.totalTransactions).toBeDefined();
      expect(result.totalAccounts).toBeDefined();
      expect(result.totalContacts).toBeDefined();
      expect(result.correlationId).toBeDefined();
    });
  });

  describe('getTransactionCategories', () => {
    it('should get transaction categories', async () => {
      const result = await controller.getTransactionCategories();
      expect(result.categories).toBeDefined();
      expect(Array.isArray(result.categories)).toBe(true);
      expect(result.correlationId).toBeDefined();
    });
  });

  describe('getTransactionMerchants', () => {
    it('should get transaction merchants', async () => {
      const result = await controller.getTransactionMerchants();
      expect(result.merchants).toBeDefined();
      expect(Array.isArray(result.merchants)).toBe(true);
      expect(result.correlationId).toBeDefined();
    });
  });

  describe('getAccountTypes', () => {
    it('should get account types', async () => {
      const result = await controller.getAccountTypes();
      expect(result.types).toBeDefined();
      expect(Array.isArray(result.types)).toBe(true);
      expect(result.correlationId).toBeDefined();
    });
  });

  describe('getContactTypes', () => {
    it('should get contact types', async () => {
      const result = await controller.getContactTypes();
      expect(result.types).toBeDefined();
      expect(Array.isArray(result.types)).toBe(true);
      expect(result.correlationId).toBeDefined();
    });
  });
});
