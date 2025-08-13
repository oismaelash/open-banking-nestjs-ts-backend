import {
  Controller,
  Post,
  Get,
  Delete,
  Param,
  UseGuards,
  UseInterceptors,
  UploadedFile,
  Body,
  Res,
  HttpStatus,
} from '@nestjs/common';
import {
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiBearerAuth,
  ApiConsumes,
  ApiBody,
  ApiParam,
} from '@nestjs/swagger';
import { FileInterceptor } from '@nestjs/platform-express';
import { Response } from 'express';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { ConsentGuard } from '../consent/guards/consent.guard';
import { RequireConsent } from '../consent/decorators/consent-scopes.decorator';
import { ConsentScope } from '../consent/dto/consent.dto';
import { DocumentsService } from './documents.service';
import {
  DocumentType,
  DocumentStatus,
  DocumentResponseDto,
  DocumentListResponseDto,
  DeleteDocumentResponseDto,
  UploadDocumentDto,
} from './dto/documents.dto';

@ApiTags('Documents & Files')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard, ConsentGuard)
@Controller('api/documents')
export class DocumentsController {
  constructor(private readonly documentsService: DocumentsService) {}

  @Post('upload')
  @RequireConsent(ConsentScope.PROFILE)
  @UseInterceptors(FileInterceptor('file'))
  @ApiOperation({ summary: 'Upload Document' })
  @ApiConsumes('multipart/form-data')
  @ApiBody({
    description: 'Document upload',
    type: UploadDocumentDto,
  })
  @ApiResponse({
    status: 201,
    description: 'Document uploaded successfully',
    type: DocumentResponseDto,
  })
  @ApiResponse({ status: 400, description: 'Invalid file or document type' })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  async uploadDocument(
    @UploadedFile() file: Express.Multer.File,
    @Body('documentType') documentType: DocumentType,
  ): Promise<DocumentResponseDto> {
    // In a real application, you would extract userId from JWT token
    const userId = 'user-123'; // Placeholder for demo
    return this.documentsService.uploadDocument(userId, file, documentType);
  }

  @Get()
  @RequireConsent(ConsentScope.PROFILE)
  @ApiOperation({ summary: 'Get User Documents' })
  @ApiResponse({
    status: 200,
    description: 'Documents retrieved successfully',
    type: DocumentListResponseDto,
  })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  async getUserDocuments(): Promise<DocumentListResponseDto> {
    // In a real application, you would extract userId from JWT token
    const userId = 'user-123'; // Placeholder for demo
    return this.documentsService.getUserDocuments(userId);
  }

  @Get(':documentId')
  @RequireConsent(ConsentScope.PROFILE)
  @ApiOperation({ summary: 'Get Document' })
  @ApiParam({ name: 'documentId', description: 'Document ID' })
  @ApiResponse({
    status: 200,
    description: 'Document file downloaded successfully',
  })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  @ApiResponse({ status: 404, description: 'Document not found' })
  async getDocument(
    @Param('documentId') documentId: string,
    @Res() res: Response,
  ): Promise<void> {
    // In a real application, you would extract userId from JWT token
    const userId = 'user-123'; // Placeholder for demo
    
    const document = await this.documentsService.getDocument(documentId, userId);
    
    // In a real application, you would stream the actual file from storage
    // For demo purposes, we'll return a mock file response
    res.setHeader('Content-Type', document.mimeType);
    res.setHeader('Content-Disposition', `attachment; filename="${document.originalName}"`);
    res.setHeader('Content-Length', document.size.toString());
    
    // Mock file content (in real app, this would be the actual file stream)
    const mockContent = Buffer.from('Mock document content for demo purposes');
    res.send(mockContent);
  }

  @Delete(':documentId')
  @RequireConsent(ConsentScope.PROFILE)
  @ApiOperation({ summary: 'Delete Document' })
  @ApiParam({ name: 'documentId', description: 'Document ID' })
  @ApiResponse({
    status: 200,
    description: 'Document deleted successfully',
    type: DeleteDocumentResponseDto,
  })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  @ApiResponse({ status: 404, description: 'Document not found' })
  async deleteDocument(
    @Param('documentId') documentId: string,
  ): Promise<DeleteDocumentResponseDto> {
    // In a real application, you would extract userId from JWT token
    const userId = 'user-123'; // Placeholder for demo
    return this.documentsService.deleteDocument(documentId, userId);
  }

  @Get('stats/overview')
  @RequireConsent(ConsentScope.PROFILE)
  @ApiOperation({ summary: 'Get Document Statistics' })
  @ApiResponse({
    status: 200,
    description: 'Document statistics retrieved successfully',
  })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  async getDocumentStats(): Promise<{
    totalDocuments: number;
    byStatus: Record<DocumentStatus, number>;
    byType: Record<DocumentType, number>;
    totalSize: number;
    correlationId: string;
  }> {
    // In a real application, you would extract userId from JWT token
    const userId = 'user-123'; // Placeholder for demo
    return this.documentsService.getDocumentStats(userId);
  }

  @Get('types/available')
  @RequireConsent(ConsentScope.PROFILE)
  @ApiOperation({ summary: 'Get Available Document Types' })
  @ApiResponse({
    status: 200,
    description: 'Available document types retrieved successfully',
  })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  async getAvailableDocumentTypes(): Promise<{
    types: Array<{ value: DocumentType; label: string; description: string }>;
    correlationId: string;
  }> {
    const types = [
      { value: DocumentType.RG, label: 'RG', description: 'Identity Card' },
      { value: DocumentType.CPF, label: 'CPF', description: 'Individual Taxpayer Registration' },
      { value: DocumentType.CNPJ, label: 'CNPJ', description: 'Corporate Taxpayer Registration' },
      { value: DocumentType.PROOF_OF_ADDRESS, label: 'Proof of Address', description: 'Address verification document' },
      { value: DocumentType.BANK_STATEMENT, label: 'Bank Statement', description: 'Bank account statement' },
      { value: DocumentType.INCOME_PROOF, label: 'Income Proof', description: 'Income verification document' },
      { value: DocumentType.CONTRACT, label: 'Contract', description: 'Legal contract document' },
      { value: DocumentType.OTHER, label: 'Other', description: 'Other document type' },
    ];

    return {
      types,
      correlationId: `corr-${Date.now()}`,
    };
  }
}
