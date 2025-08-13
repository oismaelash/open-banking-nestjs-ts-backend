import { Test, TestingModule } from '@nestjs/testing';
import { AccountsController } from './accounts.controller';
import { AccountsService } from './accounts.service';
import { AccountType, AccountStatus, TransactionType, TransactionStatus, TransactionCategory } from './dto/account.dto';

describe('AccountsController', () => {
  let controller: AccountsController;
  let service: AccountsService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [AccountsController],
      providers: [
        {
          provide: AccountsService,
          useValue: {
            getUserAccounts: jest.fn(),
            getAccountDetails: jest.fn(),
            getAccountTransactions: jest.fn(),
            getBalanceHistory: jest.fn(),
            generateStatement: jest.fn(),
          },
        },
      ],
    }).compile();

    controller = module.get<AccountsController>(AccountsController);
    service = module.get<AccountsService>(AccountsService);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  describe('getUserAccounts', () => {
    it('should call accountsService.getUserAccounts', async () => {
      const expectedResult = {
        success: true,
        accounts: [
          {
            id: 'account-1',
            type: AccountType.CHECKING,
            name: 'Conta Corrente Principal',
            number: '****1234',
            balance: 15420.50,
            availableBalance: 15200.00,
            status: AccountStatus.ACTIVE,
            bank: 'Banco do Brasil',
            lastUpdated: '2024-01-15T10:30:00Z',
          },
        ],
        correlationId: 'corr-123456',
      };

      jest.spyOn(service, 'getUserAccounts').mockResolvedValue(expectedResult);

      const result = await controller.getUserAccounts({ user: { id: 'user-123' } });
      expect(service.getUserAccounts).toHaveBeenCalledWith('user-123');
      expect(result).toEqual(expectedResult);
    });
  });

  describe('getAccountDetails', () => {
    it('should call accountsService.getAccountDetails', async () => {
      const accountId = 'account-1';
      const expectedResult = {
        success: true,
        account: {
          id: 'account-1',
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
        correlationId: 'corr-123456',
      };

      jest.spyOn(service, 'getAccountDetails').mockResolvedValue(expectedResult);

      const result = await controller.getAccountDetails({ user: { id: 'user-123' } }, accountId);
      expect(service.getAccountDetails).toHaveBeenCalledWith('user-123', accountId);
      expect(result).toEqual(expectedResult);
    });
  });

  describe('getAccountTransactions', () => {
    it('should call accountsService.getAccountTransactions', async () => {
      const accountId = 'account-1';
      const filters = {
        startDate: '2024-01-01',
        endDate: '2024-01-31',
        limit: 20,
        offset: 0,
      };
      const expectedResult = {
        success: true,
        transactions: [
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
        ],
        pagination: {
          total: 1,
          limit: 20,
          offset: 0,
          hasMore: false,
        },
        correlationId: 'corr-123456',
      };

      jest.spyOn(service, 'getAccountTransactions').mockResolvedValue(expectedResult);

      const result = await controller.getAccountTransactions({ user: { id: 'user-123' } }, accountId, filters);
      expect(service.getAccountTransactions).toHaveBeenCalledWith('user-123', accountId, filters);
      expect(result).toEqual(expectedResult);
    });
  });

  describe('getBalanceHistory', () => {
    it('should call accountsService.getBalanceHistory', async () => {
      const accountId = 'account-1';
      const filters = {
        startDate: '2024-01-01',
        endDate: '2024-01-31',
        interval: 'daily',
      };
      const expectedResult = {
        success: true,
        balanceHistory: [
          {
            date: '2024-01-15',
            balance: 15420.50,
            availableBalance: 15200.00,
            change: 150.00,
            changePercentage: 0.98,
          },
        ],
        correlationId: 'corr-123456',
      };

      jest.spyOn(service, 'getBalanceHistory').mockResolvedValue(expectedResult);

      const result = await controller.getBalanceHistory({ user: { id: 'user-123' } }, accountId, filters);
      expect(service.getBalanceHistory).toHaveBeenCalledWith('user-123', accountId, filters);
      expect(result).toEqual(expectedResult);
    });
  });

  describe('generateStatement', () => {
    it('should call accountsService.generateStatement', async () => {
      const accountId = 'account-1';
      const request = {
        startDate: '2024-01-01',
        endDate: '2024-01-31',
        format: 'json',
        includePending: false,
      };
      const expectedResult = {
        success: true,
        statement: '{"account":{"id":"account-1","name":"Conta Corrente Principal"}}',
        format: 'json',
        period: {
          startDate: '2024-01-01',
          endDate: '2024-01-31',
        },
        correlationId: 'corr-123456',
      };

      jest.spyOn(service, 'generateStatement').mockResolvedValue(expectedResult);

      const result = await controller.generateStatement({ user: { id: 'user-123' } }, accountId, request);
      expect(service.generateStatement).toHaveBeenCalledWith('user-123', accountId, request);
      expect(result).toEqual(expectedResult);
    });
  });
});
