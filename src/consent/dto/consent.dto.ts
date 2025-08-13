import { IsString, IsArray, IsBoolean, IsOptional, IsNumber, IsDateString, IsEnum } from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export enum ConsentScope {
  ACCOUNTS = 'accounts',
  BALANCES = 'balances',
  TRANSACTIONS = 'transactions',
  PAYMENTS = 'payments',
  STATEMENTS = 'statements',
  ANALYTICS = 'analytics',
  PROFILE = 'profile',
}

export enum ConsentStatus {
  PENDING = 'pending',
  ACTIVE = 'active',
  REVOKED = 'revoked',
  EXPIRED = 'expired',
  SUSPENDED = 'suspended',
}

export class ThirdPartyAppDto {
  @ApiProperty({ description: 'Third-party application name' })
  @IsString()
  name: string;

  @ApiProperty({ description: 'Third-party application description' })
  @IsString()
  description: string;

  @ApiPropertyOptional({ description: 'Third-party application logo URL' })
  @IsOptional()
  @IsString()
  logoUrl?: string;

  @ApiPropertyOptional({ description: 'Third-party application website' })
  @IsOptional()
  @IsString()
  website?: string;
}

export class CreateConsentDto {
  @ApiProperty({ 
    description: 'List of consent scopes',
    enum: ConsentScope,
    isArray: true,
    example: ['accounts', 'balances', 'transactions', 'payments']
  })
  @IsArray()
  @IsEnum(ConsentScope, { each: true })
  scopes: ConsentScope[];

  @ApiProperty({ 
    description: 'Consent duration in days',
    example: '30'
  })
  @IsString()
  duration: string;

  @ApiProperty({ description: 'Accept terms and conditions' })
  @IsBoolean()
  acceptTerms: boolean;

  @ApiProperty({ description: 'Third-party application information' })
  thirdPartyApp: ThirdPartyAppDto;

  @ApiPropertyOptional({ description: 'Additional consent metadata' })
  @IsOptional()
  @IsString()
  metadata?: string;
}

export class UpdateConsentDto {
  @ApiPropertyOptional({ 
    description: 'List of consent scopes',
    enum: ConsentScope,
    isArray: true
  })
  @IsOptional()
  @IsArray()
  @IsEnum(ConsentScope, { each: true })
  scopes?: ConsentScope[];

  @ApiPropertyOptional({ 
    description: 'Consent duration in days',
    example: '7'
  })
  @IsOptional()
  @IsString()
  duration?: string;

  @ApiPropertyOptional({ description: 'Additional consent metadata' })
  @IsOptional()
  @IsString()
  metadata?: string;
}

export class ConsentResponseDto {
  @ApiProperty({ description: 'Success status' })
  success: boolean;

  @ApiProperty({ description: 'Consent ID' })
  consentId: string;

  @ApiProperty({ 
    description: 'List of consent scopes',
    enum: ConsentScope,
    isArray: true
  })
  scopes: ConsentScope[];

  @ApiProperty({ description: 'Consent status' })
  status: ConsentStatus;

  @ApiProperty({ description: 'Consent creation date' })
  createdAt: string;

  @ApiProperty({ description: 'Consent expiration date' })
  expiresAt: string;

  @ApiPropertyOptional({ description: 'Last usage date' })
  lastUsed?: string;

  @ApiProperty({ description: 'Third-party application information' })
  thirdPartyApp: ThirdPartyAppDto;

  @ApiProperty({ description: 'Correlation ID for tracking' })
  correlationId: string;
}

export class ConsentDetailDto {
  @ApiProperty({ description: 'Consent ID' })
  consentId: string;

  @ApiProperty({ 
    description: 'List of consent scopes',
    enum: ConsentScope,
    isArray: true
  })
  scopes: ConsentScope[];

  @ApiProperty({ description: 'Consent status' })
  status: ConsentStatus;

  @ApiProperty({ description: 'Consent creation date' })
  createdAt: string;

  @ApiProperty({ description: 'Consent expiration date' })
  expiresAt: string;

  @ApiPropertyOptional({ description: 'Last usage date' })
  lastUsed?: string;

  @ApiProperty({ description: 'Third-party application information' })
  thirdPartyApp: ThirdPartyAppDto;

  @ApiPropertyOptional({ description: 'Additional consent metadata' })
  metadata?: string;

  @ApiPropertyOptional({ description: 'Revocation date' })
  revokedAt?: string;

  @ApiPropertyOptional({ description: 'Revocation reason' })
  revocationReason?: string;
}

export class ConsentHistoryDto {
  @ApiProperty({ description: 'Consent ID' })
  consentId: string;

  @ApiProperty({ 
    description: 'List of consent scopes',
    enum: ConsentScope,
    isArray: true
  })
  scopes: ConsentScope[];

  @ApiProperty({ description: 'Consent status' })
  status: ConsentStatus;

  @ApiProperty({ description: 'Consent creation date' })
  createdAt: string;

  @ApiPropertyOptional({ description: 'Revocation date' })
  revokedAt?: string;

  @ApiPropertyOptional({ description: 'Revocation reason' })
  revocationReason?: string;

  @ApiProperty({ description: 'Third-party application information' })
  thirdPartyApp: ThirdPartyAppDto;
}

export class ConsentHistoryResponseDto {
  @ApiProperty({ description: 'Success status' })
  success: boolean;

  @ApiProperty({ 
    description: 'List of consent history',
    type: [ConsentHistoryDto]
  })
  consents: ConsentHistoryDto[];

  @ApiProperty({ description: 'Correlation ID for tracking' })
  correlationId: string;
}

export class RevokeConsentDto {
  @ApiPropertyOptional({ description: 'Reason for revocation' })
  @IsOptional()
  @IsString()
  reason?: string;
}
