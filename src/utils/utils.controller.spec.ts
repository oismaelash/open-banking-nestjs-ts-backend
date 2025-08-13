import { Test, TestingModule } from '@nestjs/testing';
import { UtilsController } from './utils.controller';
import { UtilsService } from './utils.service';

describe('UtilsController', () => {
  let controller: UtilsController;
  let service: UtilsService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [UtilsController],
      providers: [
        {
          provide: UtilsService,
          useValue: {
            getAddressByCep: jest.fn(),
            validateCpf: jest.fn(),
            validateEmail: jest.fn(),
            validatePhone: jest.fn(),
            validateCnpj: jest.fn(),
            getSystemInfo: jest.fn(),
          },
        },
      ],
    }).compile();

    controller = module.get<UtilsController>(UtilsController);
    service = module.get<UtilsService>(UtilsService);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  describe('getAddressByCep', () => {
    it('should return address for valid CEP', async () => {
      const mockResponse = {
        cep: '01234-567',
        logradouro: 'Rua das Flores',
        complemento: '',
        bairro: 'Centro',
        localidade: 'São Paulo',
        uf: 'SP',
        ibge: '3550308',
        ddd: '11',
        correlationId: 'corr-123',
      };

      jest.spyOn(service, 'getAddressByCep').mockResolvedValue(mockResponse);

      const result = await controller.getAddressByCep('01234-567');

      expect(result).toEqual(mockResponse);
      expect(service.getAddressByCep).toHaveBeenCalledWith('01234-567');
    });
  });

  describe('validateCpf', () => {
    it('should validate CPF successfully', async () => {
      const mockResponse = {
        valid: true,
        formatted: '123.456.789-00',
        correlationId: 'corr-123',
      };

      jest.spyOn(service, 'validateCpf').mockResolvedValue(mockResponse);

      const result = await controller.validateCpf('123.456.789-00');

      expect(result).toEqual(mockResponse);
      expect(service.validateCpf).toHaveBeenCalledWith('123.456.789-00');
    });
  });

  describe('validateEmail', () => {
    it('should validate email successfully', async () => {
      const mockResponse = {
        valid: true,
        domain: 'example.com',
        correlationId: 'corr-123',
      };

      jest.spyOn(service, 'validateEmail').mockResolvedValue(mockResponse);

      const result = await controller.validateEmail('user@example.com');

      expect(result).toEqual(mockResponse);
      expect(service.validateEmail).toHaveBeenCalledWith('user@example.com');
    });
  });

  describe('validatePhone', () => {
    it('should validate phone number successfully', async () => {
      const mockResponse = {
        valid: true,
        formatted: '+55 11 99999-9999',
        type: 'mobile',
        ddd: '11',
        correlationId: 'corr-123',
      };

      jest.spyOn(service, 'validatePhone').mockResolvedValue(mockResponse);

      const result = await controller.validatePhone('+55 11 99999-9999');

      expect(result).toEqual(mockResponse);
      expect(service.validatePhone).toHaveBeenCalledWith('+55 11 99999-9999');
    });
  });

  describe('validateCnpj', () => {
    it('should validate CNPJ successfully', async () => {
      const mockResponse = {
        valid: true,
        formatted: '12.345.678/0001-90',
        correlationId: 'corr-123',
      };

      jest.spyOn(service, 'validateCnpj').mockResolvedValue(mockResponse);

      const result = await controller.validateCnpj('12.345.678/0001-90');

      expect(result).toEqual(mockResponse);
      expect(service.validateCnpj).toHaveBeenCalledWith('12.345.678/0001-90');
    });
  });

  describe('getSystemInfo', () => {
    it('should return system information', async () => {
      const mockResponse = {
        version: '1.0.0',
        environment: 'development',
        timestamp: '2024-01-15T10:30:00Z',
        uptime: 3600,
        memory: {
          used: 50,
          total: 100,
          free: 50,
        },
        correlationId: 'corr-123',
      };

      jest.spyOn(service, 'getSystemInfo').mockResolvedValue(mockResponse);

      const result = await controller.getSystemInfo();

      expect(result).toEqual(mockResponse);
      expect(service.getSystemInfo).toHaveBeenCalled();
    });
  });

  describe('healthCheck', () => {
    it('should return health status', async () => {
      const result = await controller.healthCheck();

      expect(result).toHaveProperty('status', 'healthy');
      expect(result).toHaveProperty('service', 'open-banking-api');
      expect(result).toHaveProperty('timestamp');
      expect(result).toHaveProperty('correlationId');
    });
  });

  describe('getCurrentTime', () => {
    it('should return current time information', async () => {
      const result = await controller.getCurrentTime();

      expect(result).toHaveProperty('timestamp');
      expect(result).toHaveProperty('iso');
      expect(result).toHaveProperty('utc');
      expect(result).toHaveProperty('timezone');
      expect(result).toHaveProperty('correlationId');
    });
  });
});
