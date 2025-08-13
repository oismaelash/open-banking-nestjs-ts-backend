import { Test, TestingModule } from '@nestjs/testing';
import { PixController } from './pix.controller';
import { PixService } from './pix.service';
import { PixKeyType, PaymentCategory } from './dto/pix.dto';

describe('PixController', () => {
  let controller: PixController;
  let service: PixService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [PixController],
      providers: [PixService],
    }).compile();

    controller = module.get<PixController>(PixController);
    service = module.get<PixService>(PixService);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  describe('createPixPayment', () => {
    it('should create a PIX payment', async () => {
      const createPixPaymentDto = {
        pixKey: '+55 11 99999-9999',
        pixKeyType: PixKeyType.PHONE,
        recipientName: 'João Silva',
        amount: 150.00,
        description: 'Pagamento para João Silva',
        category: PaymentCategory.TRANSFERENCIA,
        accountId: 'account-1',
      };

      const result = await controller.createPixPayment(createPixPaymentDto);
      expect(result.success).toBe(true);
      expect(result.paymentId).toBeDefined();
      expect(result.status).toBe('pending');
    });
  });

  describe('getPaymentStatus', () => {
    it('should get payment status', async () => {
      const paymentId = 'PIX123456789';
      const result = await controller.getPaymentStatus(paymentId);
      expect(result.paymentId).toBe(paymentId);
      expect(result.status).toBeDefined();
    });
  });

  describe('getContacts', () => {
    it('should get PIX contacts', async () => {
      const result = await controller.getContacts();
      expect(result.contacts).toBeDefined();
      expect(Array.isArray(result.contacts)).toBe(true);
    });
  });

  describe('getLimits', () => {
    it('should get PIX limits', async () => {
      const result = await controller.getLimits();
      expect(result.dailyLimit).toBeDefined();
      expect(result.monthlyLimit).toBeDefined();
      expect(result.usedToday).toBeDefined();
      expect(result.usedThisMonth).toBeDefined();
    });
  });
});
