import { IsString, IsOptional, IsNumber, IsDateString, IsEnum } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export enum DocumentType {
  RG = 'rg',
  CPF = 'cpf',
  CNPJ = 'cnpj',
  PROOF_OF_ADDRESS = 'proof_of_address',
  BANK_STATEMENT = 'bank_statement',
  INCOME_PROOF = 'income_proof',
  CONTRACT = 'contract',
  OTHER = 'other',
}

export enum DocumentStatus {
  PENDING = 'pending',
  APPROVED = 'approved',
  REJECTED = 'rejected',
  EXPIRED = 'expired',
}

export class UploadDocumentDto {
  @ApiProperty({
    description: 'Type of document being uploaded',
    enum: DocumentType,
    example: DocumentType.RG,
  })
  @IsEnum(DocumentType)
  documentType: DocumentType;

  @ApiProperty({
    description: 'Document file (multipart file)',
    type: 'string',
    format: 'binary',
  })
  file: Express.Multer.File;
}

export class DocumentResponseDto {
  @ApiProperty({
    description: 'Unique document identifier',
    example: 'doc-123456789',
  })
  @IsString()
  documentId: string;

  @ApiProperty({
    description: 'Original filename',
    example: 'rg_joao_silva.pdf',
  })
  @IsString()
  filename: string;

  @ApiProperty({
    description: 'File size in bytes',
    example: 1024000,
  })
  @IsNumber()
  size: number;

  @ApiProperty({
    description: 'Type of document',
    enum: DocumentType,
    example: DocumentType.RG,
  })
  @IsEnum(DocumentType)
  documentType: DocumentType;

  @ApiProperty({
    description: 'Document status',
    enum: DocumentStatus,
    example: DocumentStatus.PENDING,
  })
  @IsEnum(DocumentStatus)
  status: DocumentStatus;

  @ApiProperty({
    description: 'Upload timestamp',
    example: '2024-01-15T10:30:00Z',
  })
  @IsDateString()
  uploadedAt: string;

  @ApiProperty({
    description: 'Document expiration date',
    example: '2025-01-15T10:30:00Z',
    required: false,
  })
  @IsOptional()
  @IsDateString()
  expiresAt?: string;

  @ApiProperty({
    description: 'Correlation ID for tracking',
    example: 'corr-123456789',
  })
  @IsString()
  correlationId: string;
}

export class DocumentListResponseDto {
  @ApiProperty({
    description: 'List of documents',
    type: [DocumentResponseDto],
  })
  documents: DocumentResponseDto[];

  @ApiProperty({
    description: 'Total number of documents',
    example: 5,
  })
  @IsNumber()
  total: number;

  @ApiProperty({
    description: 'Correlation ID for tracking',
    example: 'corr-123456789',
  })
  @IsString()
  correlationId: string;
}

export class DeleteDocumentResponseDto {
  @ApiProperty({
    description: 'Success message',
    example: 'Document deleted successfully',
  })
  @IsString()
  message: string;

  @ApiProperty({
    description: 'Deleted document ID',
    example: 'doc-123456789',
  })
  @IsString()
  documentId: string;

  @ApiProperty({
    description: 'Correlation ID for tracking',
    example: 'corr-123456789',
  })
  @IsString()
  correlationId: string;
}
