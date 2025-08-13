import { Injectable, BadRequestException } from '@nestjs/common';
import { v4 as uuidv4 } from 'uuid';
import {
  CepResponseDto,
  CpfValidationResponseDto,
  EmailValidationResponseDto,
  PhoneValidationResponseDto,
  CnpjValidationResponseDto,
} from './dto/utils.dto';

@Injectable()
export class UtilsService {
  async getAddressByCep(cep: string): Promise<CepResponseDto> {
    // Clean CEP format
    const cleanCep = cep.replace(/\D/g, '');
    
    if (cleanCep.length !== 8) {
      throw new BadRequestException('CEP must have 8 digits');
    }

    // In a real application, this would call the ViaCEP API
    // For demo purposes, we'll return mock data
    const mockAddresses: Record<string, CepResponseDto> = {
      '01234567': {
        cep: '01234-567',
        logradouro: 'Rua das Flores',
        complemento: '',
        bairro: 'Centro',
        localidade: 'São Paulo',
        uf: 'SP',
        ibge: '3550308',
        ddd: '11',
        correlationId: `corr-${uuidv4()}`,
      },
      '20040020': {
        cep: '20040-020',
        logradouro: 'Rua do Ouvidor',
        complemento: '',
        bairro: 'Centro',
        localidade: 'Rio de Janeiro',
        uf: 'RJ',
        ibge: '3304557',
        ddd: '21',
        correlationId: `corr-${uuidv4()}`,
      },
      '40015970': {
        cep: '40015-970',
        logradouro: 'Rua Chile',
        complemento: '',
        bairro: 'Pelourinho',
        localidade: 'Salvador',
        uf: 'BA',
        ibge: '2927408',
        ddd: '71',
        correlationId: `corr-${uuidv4()}`,
      },
    };

    const address = mockAddresses[cleanCep];
    if (!address) {
      throw new BadRequestException('CEP not found');
    }

    return address;
  }

  async validateCpf(cpf: string): Promise<CpfValidationResponseDto> {
    // Clean CPF format
    const cleanCpf = cpf.replace(/\D/g, '');
    
    if (cleanCpf.length !== 11) {
      return {
        valid: false,
        formatted: cpf,
        correlationId: `corr-${uuidv4()}`,
      };
    }

    // Check for repeated digits
    if (/^(\d)\1{10}$/.test(cleanCpf)) {
      return {
        valid: false,
        formatted: this.formatCpf(cleanCpf),
        correlationId: `corr-${uuidv4()}`,
      };
    }

    // Validate CPF algorithm
    const isValid = this.validateCpfAlgorithm(cleanCpf);

    return {
      valid: isValid,
      formatted: this.formatCpf(cleanCpf),
      correlationId: `corr-${uuidv4()}`,
    };
  }

  async validateEmail(email: string): Promise<EmailValidationResponseDto> {
    // Basic email validation regex
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    const isValid = emailRegex.test(email);

    if (!isValid) {
      return {
        valid: false,
        domain: '',
        correlationId: `corr-${uuidv4()}`,
      };
    }

    // Extract domain
    const domain = email.split('@')[1];

    // In a real application, you might want to check if the domain exists
    // For demo purposes, we'll just return the domain
    return {
      valid: true,
      domain,
      correlationId: `corr-${uuidv4()}`,
    };
  }

  async validatePhone(phone: string): Promise<PhoneValidationResponseDto> {
    // Clean phone format
    const cleanPhone = phone.replace(/\D/g, '');
    
    // Brazilian phone validation
    if (cleanPhone.length < 10 || cleanPhone.length > 11) {
      return {
        valid: false,
        formatted: phone,
        type: 'invalid',
        ddd: '',
        correlationId: `corr-${uuidv4()}`,
      };
    }

    // Extract DDD (first 2 digits)
    const ddd = cleanPhone.substring(0, 2);
    
    // Determine phone type (mobile or landline)
    const phoneNumber = cleanPhone.substring(2);
    const isMobile = phoneNumber.length === 9 && phoneNumber.startsWith('9');
    const isLandline = phoneNumber.length === 8;

    if (!isMobile && !isLandline) {
      return {
        valid: false,
        formatted: phone,
        type: 'invalid',
        ddd,
        correlationId: `corr-${uuidv4()}`,
      };
    }

    return {
      valid: true,
      formatted: this.formatPhone(cleanPhone),
      type: isMobile ? 'mobile' : 'landline',
      ddd,
      correlationId: `corr-${uuidv4()}`,
    };
  }

  async validateCnpj(cnpj: string): Promise<CnpjValidationResponseDto> {
    // Clean CNPJ format
    const cleanCnpj = cnpj.replace(/\D/g, '');
    
    if (cleanCnpj.length !== 14) {
      return {
        valid: false,
        formatted: cnpj,
        correlationId: `corr-${uuidv4()}`,
      };
    }

    // Check for repeated digits
    if (/^(\d)\1{13}$/.test(cleanCnpj)) {
      return {
        valid: false,
        formatted: this.formatCnpj(cleanCnpj),
        correlationId: `corr-${uuidv4()}`,
      };
    }

    // Validate CNPJ algorithm
    const isValid = this.validateCnpjAlgorithm(cleanCnpj);

    return {
      valid: isValid,
      formatted: this.formatCnpj(cleanCnpj),
      correlationId: `corr-${uuidv4()}`,
    };
  }

  async getSystemInfo(): Promise<{
    version: string;
    environment: string;
    timestamp: string;
    uptime: number;
    memory: {
      used: number;
      total: number;
      free: number;
    };
    correlationId: string;
  }> {
    const memUsage = process.memoryUsage();
    
    return {
      version: '1.0.0',
      environment: process.env.NODE_ENV || 'development',
      timestamp: new Date().toISOString(),
      uptime: process.uptime(),
      memory: {
        used: Math.round(memUsage.heapUsed / 1024 / 1024),
        total: Math.round(memUsage.heapTotal / 1024 / 1024),
        free: Math.round((memUsage.heapTotal - memUsage.heapUsed) / 1024 / 1024),
      },
      correlationId: `corr-${uuidv4()}`,
    };
  }

  private validateCpfAlgorithm(cpf: string): boolean {
    // CPF validation algorithm
    let sum = 0;
    let remainder;

    // First digit validation
    for (let i = 1; i <= 9; i++) {
      sum += parseInt(cpf.substring(i - 1, i)) * (11 - i);
    }
    remainder = (sum * 10) % 11;
    if (remainder === 10 || remainder === 11) remainder = 0;
    if (remainder !== parseInt(cpf.substring(9, 10))) return false;

    // Second digit validation
    sum = 0;
    for (let i = 1; i <= 10; i++) {
      sum += parseInt(cpf.substring(i - 1, i)) * (12 - i);
    }
    remainder = (sum * 10) % 11;
    if (remainder === 10 || remainder === 11) remainder = 0;
    if (remainder !== parseInt(cpf.substring(10, 11))) return false;

    return true;
  }

  private validateCnpjAlgorithm(cnpj: string): boolean {
    // CNPJ validation algorithm
    let sum = 0;
    let remainder;

    // First digit validation
    const weights1 = [5, 4, 3, 2, 9, 8, 7, 6, 5, 4, 3, 2];
    for (let i = 0; i < 12; i++) {
      sum += parseInt(cnpj.charAt(i)) * weights1[i];
    }
    remainder = sum % 11;
    if (remainder < 2) {
      if (parseInt(cnpj.charAt(12)) !== 0) return false;
    } else {
      if (parseInt(cnpj.charAt(12)) !== 11 - remainder) return false;
    }

    // Second digit validation
    sum = 0;
    const weights2 = [6, 5, 4, 3, 2, 9, 8, 7, 6, 5, 4, 3, 2];
    for (let i = 0; i < 13; i++) {
      sum += parseInt(cnpj.charAt(i)) * weights2[i];
    }
    remainder = sum % 11;
    if (remainder < 2) {
      if (parseInt(cnpj.charAt(13)) !== 0) return false;
    } else {
      if (parseInt(cnpj.charAt(13)) !== 11 - remainder) return false;
    }

    return true;
  }

  private formatCpf(cpf: string): string {
    return cpf.replace(/(\d{3})(\d{3})(\d{3})(\d{2})/, '$1.$2.$3-$4');
  }

  private formatCnpj(cnpj: string): string {
    return cnpj.replace(/(\d{2})(\d{3})(\d{3})(\d{4})(\d{2})/, '$1.$2.$3/$4-$5');
  }

  private formatPhone(phone: string): string {
    if (phone.length === 11) {
      return `+55 ${phone.substring(0, 2)} ${phone.substring(2, 7)}-${phone.substring(7)}`;
    } else {
      return `+55 ${phone.substring(0, 2)} ${phone.substring(2, 6)}-${phone.substring(6)}`;
    }
  }
}
