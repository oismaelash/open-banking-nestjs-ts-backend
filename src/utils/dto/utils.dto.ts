import { IsString, IsBoolean, IsOptional } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CepResponseDto {
  @ApiProperty({
    description: 'ZIP code (CEP)',
    example: '01234-567',
  })
  @IsString()
  cep: string;

  @ApiProperty({
    description: 'Street address',
    example: 'Rua das Flores',
  })
  @IsString()
  logradouro: string;

  @ApiProperty({
    description: 'Address complement',
    example: '',
    required: false,
  })
  @IsOptional()
  @IsString()
  complemento?: string;

  @ApiProperty({
    description: 'Neighborhood',
    example: 'Centro',
  })
  @IsString()
  bairro: string;

  @ApiProperty({
    description: 'City',
    example: 'São Paulo',
  })
  @IsString()
  localidade: string;

  @ApiProperty({
    description: 'State abbreviation',
    example: 'SP',
  })
  @IsString()
  uf: string;

  @ApiProperty({
    description: 'IBGE code',
    example: '3550308',
  })
  @IsString()
  ibge: string;

  @ApiProperty({
    description: 'Area code (DDD)',
    example: '11',
  })
  @IsString()
  ddd: string;

  @ApiProperty({
    description: 'Correlation ID for tracking',
    example: 'corr-123456789',
  })
  @IsString()
  correlationId: string;
}

export class CpfValidationResponseDto {
  @ApiProperty({
    description: 'Whether the CPF is valid',
    example: true,
  })
  @IsBoolean()
  valid: boolean;

  @ApiProperty({
    description: 'Formatted CPF',
    example: '123.456.789-00',
  })
  @IsString()
  formatted: string;

  @ApiProperty({
    description: 'Correlation ID for tracking',
    example: 'corr-123456789',
  })
  @IsString()
  correlationId: string;
}

export class EmailValidationResponseDto {
  @ApiProperty({
    description: 'Whether the email is valid',
    example: true,
  })
  @IsBoolean()
  valid: boolean;

  @ApiProperty({
    description: 'Email domain',
    example: 'email.com',
  })
  @IsString()
  domain: string;

  @ApiProperty({
    description: 'Correlation ID for tracking',
    example: 'corr-123456789',
  })
  @IsString()
  correlationId: string;
}

export class PhoneValidationResponseDto {
  @ApiProperty({
    description: 'Whether the phone number is valid',
    example: true,
  })
  @IsBoolean()
  valid: boolean;

  @ApiProperty({
    description: 'Formatted phone number',
    example: '+55 11 99999-9999',
  })
  @IsString()
  formatted: string;

  @ApiProperty({
    description: 'Phone number type',
    example: 'mobile',
  })
  @IsString()
  type: string;

  @ApiProperty({
    description: 'Area code (DDD)',
    example: '11',
  })
  @IsString()
  ddd: string;

  @ApiProperty({
    description: 'Correlation ID for tracking',
    example: 'corr-123456789',
  })
  @IsString()
  correlationId: string;
}

export class CnpjValidationResponseDto {
  @ApiProperty({
    description: 'Whether the CNPJ is valid',
    example: true,
  })
  @IsBoolean()
  valid: boolean;

  @ApiProperty({
    description: 'Formatted CNPJ',
    example: '12.345.678/0001-90',
  })
  @IsString()
  formatted: string;

  @ApiProperty({
    description: 'Company name (if available)',
    example: 'Empresa Exemplo Ltda',
    required: false,
  })
  @IsOptional()
  @IsString()
  companyName?: string;

  @ApiProperty({
    description: 'Correlation ID for tracking',
    example: 'corr-123456789',
  })
  @IsString()
  correlationId: string;
}
