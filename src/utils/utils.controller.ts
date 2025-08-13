import {
  Controller,
  Get,
  Param,
  UseGuards,
} from '@nestjs/common';
import {
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiBearerAuth,
  ApiParam,
} from '@nestjs/swagger';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { UtilsService } from './utils.service';
import {
  CepResponseDto,
  CpfValidationResponseDto,
  EmailValidationResponseDto,
  PhoneValidationResponseDto,
  CnpjValidationResponseDto,
} from './dto/utils.dto';

@ApiTags('Utility Endpoints')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard)
@Controller('api/utils')
export class UtilsController {
  constructor(private readonly utilsService: UtilsService) {}

  @Get('cep/:cep')
  @ApiOperation({ summary: 'Get Address by ZIP Code (CEP)' })
  @ApiParam({ name: 'cep', description: 'ZIP code (CEP)', example: '01234-567' })
  @ApiResponse({
    status: 200,
    description: 'Address retrieved successfully',
    type: CepResponseDto,
  })
  @ApiResponse({ status: 400, description: 'Invalid CEP format' })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  async getAddressByCep(@Param('cep') cep: string): Promise<CepResponseDto> {
    return this.utilsService.getAddressByCep(cep);
  }

  @Get('validate-cpf/:cpf')
  @ApiOperation({ summary: 'Validate CPF' })
  @ApiParam({ name: 'cpf', description: 'CPF to validate', example: '123.456.789-00' })
  @ApiResponse({
    status: 200,
    description: 'CPF validation result',
    type: CpfValidationResponseDto,
  })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  async validateCpf(@Param('cpf') cpf: string): Promise<CpfValidationResponseDto> {
    return this.utilsService.validateCpf(cpf);
  }

  @Get('validate-email/:email')
  @ApiOperation({ summary: 'Validate Email' })
  @ApiParam({ name: 'email', description: 'Email to validate', example: 'user@example.com' })
  @ApiResponse({
    status: 200,
    description: 'Email validation result',
    type: EmailValidationResponseDto,
  })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  async validateEmail(@Param('email') email: string): Promise<EmailValidationResponseDto> {
    return this.utilsService.validateEmail(email);
  }

  @Get('validate-phone/:phone')
  @ApiOperation({ summary: 'Validate Phone Number' })
  @ApiParam({ name: 'phone', description: 'Phone number to validate', example: '+55 11 99999-9999' })
  @ApiResponse({
    status: 200,
    description: 'Phone validation result',
    type: PhoneValidationResponseDto,
  })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  async validatePhone(@Param('phone') phone: string): Promise<PhoneValidationResponseDto> {
    return this.utilsService.validatePhone(phone);
  }

  @Get('validate-cnpj/:cnpj')
  @ApiOperation({ summary: 'Validate CNPJ' })
  @ApiParam({ name: 'cnpj', description: 'CNPJ to validate', example: '12.345.678/0001-90' })
  @ApiResponse({
    status: 200,
    description: 'CNPJ validation result',
    type: CnpjValidationResponseDto,
  })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  async validateCnpj(@Param('cnpj') cnpj: string): Promise<CnpjValidationResponseDto> {
    return this.utilsService.validateCnpj(cnpj);
  }

  @Get('system/info')
  @ApiOperation({ summary: 'Get System Information' })
  @ApiResponse({
    status: 200,
    description: 'System information retrieved successfully',
  })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
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
    return this.utilsService.getSystemInfo();
  }

  @Get('health/check')
  @ApiOperation({ summary: 'Health Check' })
  @ApiResponse({
    status: 200,
    description: 'Service is healthy',
  })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  async healthCheck(): Promise<{
    status: string;
    timestamp: string;
    service: string;
    correlationId: string;
  }> {
    return {
      status: 'healthy',
      timestamp: new Date().toISOString(),
      service: 'open-banking-api',
      correlationId: `corr-${Date.now()}`,
    };
  }

  @Get('time/current')
  @ApiOperation({ summary: 'Get Current Time' })
  @ApiResponse({
    status: 200,
    description: 'Current time retrieved successfully',
  })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  async getCurrentTime(): Promise<{
    timestamp: string;
    iso: string;
    utc: string;
    timezone: string;
    correlationId: string;
  }> {
    const now = new Date();
    return {
      timestamp: now.getTime().toString(),
      iso: now.toISOString(),
      utc: now.toUTCString(),
      timezone: Intl.DateTimeFormat().resolvedOptions().timeZone,
      correlationId: `corr-${Date.now()}`,
    };
  }
}
