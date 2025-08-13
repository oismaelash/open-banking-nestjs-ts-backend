import { Test, TestingModule } from '@nestjs/testing';
import { ConsentController } from './consent.controller';
import { ConsentService } from './consent.service';
import { ConsentScope, ConsentStatus } from './dto/consent.dto';

describe('ConsentController', () => {
  let controller: ConsentController;
  let service: ConsentService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [ConsentController],
      providers: [
        {
          provide: ConsentService,
          useValue: {
            createConsent: jest.fn(),
            getConsent: jest.fn(),
            updateConsent: jest.fn(),
            revokeConsent: jest.fn(),
            getConsentHistory: jest.fn(),
            getActiveConsents: jest.fn(),
            getConsentStats: jest.fn(),
            suspendConsent: jest.fn(),
            reactivateConsent: jest.fn(),
          },
        },
      ],
    }).compile();

    controller = module.get<ConsentController>(ConsentController);
    service = module.get<ConsentService>(ConsentService);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  describe('createConsent', () => {
    it('should call consentService.createConsent', async () => {
      const createConsentData = {
        scopes: [ConsentScope.ACCOUNTS, ConsentScope.BALANCES],
        duration: '30',
        acceptTerms: true,
        thirdPartyApp: {
          name: 'Finance App',
          description: 'Personal finance management app',
        },
      };
      const expectedResult = {
        success: true,
        consentId: 'consent-123',
        scopes: [ConsentScope.ACCOUNTS, ConsentScope.BALANCES],
        status: ConsentStatus.ACTIVE,
        createdAt: '2024-01-15T10:30:00Z',
        expiresAt: '2024-02-15T10:30:00Z',
        lastUsed: null,
        thirdPartyApp: {
          name: 'Finance App',
          description: 'Personal finance management app',
        },
        correlationId: 'corr-123456',
      };

      jest.spyOn(service, 'createConsent').mockResolvedValue(expectedResult);

      const result = await controller.createConsent({ user: { id: 'user-123' } }, createConsentData);
      expect(service.createConsent).toHaveBeenCalledWith('user-123', createConsentData);
      expect(result).toEqual(expectedResult);
    });
  });

  describe('getConsent', () => {
    it('should call consentService.getConsent', async () => {
      const consentId = 'consent-123';
      const expectedResult = {
        consentId: 'consent-123',
        scopes: [ConsentScope.ACCOUNTS, ConsentScope.BALANCES],
        status: ConsentStatus.ACTIVE,
        createdAt: '2024-01-15T10:30:00Z',
        expiresAt: '2024-02-15T10:30:00Z',
        lastUsed: null,
        thirdPartyApp: {
          name: 'Finance App',
          description: 'Personal finance management app',
        },
        metadata: null,
        revokedAt: null,
        revocationReason: null,
      };

      jest.spyOn(service, 'getConsent').mockResolvedValue(expectedResult);

      const result = await controller.getConsent({ user: { id: 'user-123' } }, consentId);
      expect(service.getConsent).toHaveBeenCalledWith('user-123', consentId);
      expect(result).toEqual(expectedResult);
    });
  });

  describe('getConsentHistory', () => {
    it('should call consentService.getConsentHistory', async () => {
      const expectedResult = {
        success: true,
        consents: [
          {
            consentId: 'consent-123',
            scopes: [ConsentScope.ACCOUNTS, ConsentScope.BALANCES],
            status: ConsentStatus.REVOKED,
            createdAt: '2024-01-10T10:30:00Z',
            revokedAt: '2024-01-15T14:30:00Z',
            revocationReason: 'User requested revocation',
            thirdPartyApp: {
              name: 'Finance App',
              description: 'Personal finance management app',
            },
          },
        ],
        correlationId: 'corr-123456',
      };

      jest.spyOn(service, 'getConsentHistory').mockResolvedValue(expectedResult);

      const result = await controller.getConsentHistory({ user: { id: 'user-123' } });
      expect(service.getConsentHistory).toHaveBeenCalledWith('user-123');
      expect(result).toEqual(expectedResult);
    });
  });
});
