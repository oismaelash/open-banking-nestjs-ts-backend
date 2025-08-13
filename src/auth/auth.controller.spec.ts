import { Test, TestingModule } from '@nestjs/testing';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';

describe('AuthController', () => {
  let controller: AuthController;
  let service: AuthService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [AuthController],
      providers: [
        {
          provide: AuthService,
          useValue: {
            signupStep1: jest.fn(),
            login: jest.fn(),
            logout: jest.fn(),
            refreshToken: jest.fn(),
          },
        },
      ],
    }).compile();

    controller = module.get<AuthController>(AuthController);
    service = module.get<AuthService>(AuthService);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  describe('signupStep1', () => {
    it('should call authService.signupStep1', async () => {
      const signupData = {
        fullName: 'João Silva Santos',
        cpf: '123.456.789-00',
        dateOfBirth: '1990-03-15',
      };
      const expectedResult = {
        success: true,
        message: 'Personal information saved',
        step: 1,
        correlationId: 'test-id',
      };

      jest.spyOn(service, 'signupStep1').mockResolvedValue(expectedResult);

      const result = await controller.signupStep1(signupData);
      expect(service.signupStep1).toHaveBeenCalledWith(signupData);
      expect(result).toEqual(expectedResult);
    });
  });

  describe('login', () => {
    it('should call authService.login', async () => {
      const loginData = {
        identifier: 'joao@email.com',
        password: 'SecurePassword123!',
        rememberMe: false,
      };
      const expectedResult = {
        success: true,
        token: 'jwt-token',
        refreshToken: 'refresh-token',
        user: {
          id: 'user-123',
          fullName: 'João Silva Santos',
          email: 'joao@email.com',
          cpf: '123.456.789-00',
        },
        correlationId: 'test-id',
      };

      jest.spyOn(service, 'login').mockResolvedValue(expectedResult);

      const result = await controller.login({} as any, loginData);
      expect(service.login).toHaveBeenCalledWith(loginData);
      expect(result).toEqual(expectedResult);
    });
  });
});
