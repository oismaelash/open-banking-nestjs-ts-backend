import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { v4 as uuidv4 } from 'uuid';
import {
  DocumentType,
  DocumentStatus,
  DocumentResponseDto,
  DocumentListResponseDto,
  DeleteDocumentResponseDto,
} from './dto/documents.dto';

interface Document {
  documentId: string;
  userId: string;
  filename: string;
  originalName: string;
  size: number;
  documentType: DocumentType;
  status: DocumentStatus;
  uploadedAt: string;
  expiresAt?: string;
  mimeType: string;
  filePath: string;
}

@Injectable()
export class DocumentsService {
  private documents: Map<string, Document> = new Map();
  private userDocuments: Map<string, string[]> = new Map();

  constructor() {
    this.initializeSampleData();
  }

  private initializeSampleData(): void {
    const sampleDocuments: Document[] = [
      {
        documentId: 'doc-123456789',
        userId: 'user-123',
        filename: 'rg_joao_silva_20240115.pdf',
        originalName: 'rg_joao_silva.pdf',
        size: 1024000,
        documentType: DocumentType.RG,
        status: DocumentStatus.APPROVED,
        uploadedAt: '2024-01-15T10:30:00Z',
        expiresAt: '2025-01-15T10:30:00Z',
        mimeType: 'application/pdf',
        filePath: '/uploads/documents/rg_joao_silva_20240115.pdf',
      },
      {
        documentId: 'doc-987654321',
        userId: 'user-123',
        filename: 'cpf_joao_silva_20240115.pdf',
        originalName: 'cpf_joao_silva.pdf',
        size: 512000,
        documentType: DocumentType.CPF,
        status: DocumentStatus.APPROVED,
        uploadedAt: '2024-01-15T11:00:00Z',
        expiresAt: '2025-01-15T11:00:00Z',
        mimeType: 'application/pdf',
        filePath: '/uploads/documents/cpf_joao_silva_20240115.pdf',
      },
      {
        documentId: 'doc-456789123',
        userId: 'user-123',
        filename: 'bank_statement_20240115.pdf',
        originalName: 'bank_statement.pdf',
        size: 2048000,
        documentType: DocumentType.BANK_STATEMENT,
        status: DocumentStatus.PENDING,
        uploadedAt: '2024-01-15T12:00:00Z',
        mimeType: 'application/pdf',
        filePath: '/uploads/documents/bank_statement_20240115.pdf',
      },
    ];

    sampleDocuments.forEach((doc) => {
      this.documents.set(doc.documentId, doc);
      
      if (!this.userDocuments.has(doc.userId)) {
        this.userDocuments.set(doc.userId, []);
      }
      this.userDocuments.get(doc.userId)!.push(doc.documentId);
    });
  }

  async uploadDocument(
    userId: string,
    file: Express.Multer.File,
    documentType: DocumentType,
  ): Promise<DocumentResponseDto> {
    // Validate file
    if (!file) {
      throw new BadRequestException('No file provided');
    }

    // Validate file size (10MB limit)
    const maxSize = 10 * 1024 * 1024; // 10MB
    if (file.size > maxSize) {
      throw new BadRequestException('File size exceeds 10MB limit');
    }

    // Validate file type
    const allowedMimeTypes = [
      'application/pdf',
      'image/jpeg',
      'image/png',
      'image/jpg',
    ];
    if (!allowedMimeTypes.includes(file.mimetype)) {
      throw new BadRequestException('Invalid file type. Only PDF and images are allowed');
    }

    const documentId = `doc-${uuidv4()}`;
    const timestamp = new Date().toISOString().split('T')[0];
    const filename = `${documentType}_${userId}_${timestamp}.${this.getFileExtension(file.originalname)}`;
    
    // Calculate expiration date (1 year from upload)
    const expiresAt = new Date();
    expiresAt.setFullYear(expiresAt.getFullYear() + 1);

    const document: Document = {
      documentId,
      userId,
      filename,
      originalName: file.originalname,
      size: file.size,
      documentType,
      status: DocumentStatus.PENDING,
      uploadedAt: new Date().toISOString(),
      expiresAt: expiresAt.toISOString(),
      mimeType: file.mimetype,
      filePath: `/uploads/documents/${filename}`,
    };

    // Store document
    this.documents.set(documentId, document);
    
    // Add to user's document list
    if (!this.userDocuments.has(userId)) {
      this.userDocuments.set(userId, []);
    }
    this.userDocuments.get(userId)!.push(documentId);

    return this.mapToResponseDto(document);
  }

  async getDocument(documentId: string, userId: string): Promise<Document> {
    const document = this.documents.get(documentId);
    
    if (!document) {
      throw new NotFoundException('Document not found');
    }

    if (document.userId !== userId) {
      throw new NotFoundException('Document not found');
    }

    return document;
  }

  async getUserDocuments(userId: string): Promise<DocumentListResponseDto> {
    const userDocIds = this.userDocuments.get(userId) || [];
    const documents = userDocIds
      .map((docId) => this.documents.get(docId))
      .filter((doc) => doc !== undefined)
      .map((doc) => this.mapToResponseDto(doc!));

    return {
      documents,
      total: documents.length,
      correlationId: `corr-${uuidv4()}`,
    };
  }

  async deleteDocument(documentId: string, userId: string): Promise<DeleteDocumentResponseDto> {
    const document = this.documents.get(documentId);
    
    if (!document) {
      throw new NotFoundException('Document not found');
    }

    if (document.userId !== userId) {
      throw new NotFoundException('Document not found');
    }

    // Remove from storage
    this.documents.delete(documentId);
    
    // Remove from user's document list
    const userDocIds = this.userDocuments.get(userId) || [];
    const updatedUserDocs = userDocIds.filter((id) => id !== documentId);
    this.userDocuments.set(userId, updatedUserDocs);

    return {
      message: 'Document deleted successfully',
      documentId,
      correlationId: `corr-${uuidv4()}`,
    };
  }

  async updateDocumentStatus(
    documentId: string,
    status: DocumentStatus,
    userId: string,
  ): Promise<DocumentResponseDto> {
    const document = this.documents.get(documentId);
    
    if (!document) {
      throw new NotFoundException('Document not found');
    }

    if (document.userId !== userId) {
      throw new NotFoundException('Document not found');
    }

    document.status = status;
    this.documents.set(documentId, document);

    return this.mapToResponseDto(document);
  }

  async getDocumentStats(userId: string): Promise<{
    totalDocuments: number;
    byStatus: Record<DocumentStatus, number>;
    byType: Record<DocumentType, number>;
    totalSize: number;
    correlationId: string;
  }> {
    const userDocIds = this.userDocuments.get(userId) || [];
    const documents = userDocIds
      .map((docId) => this.documents.get(docId))
      .filter((doc) => doc !== undefined);

    const byStatus: Record<DocumentStatus, number> = {
      [DocumentStatus.PENDING]: 0,
      [DocumentStatus.APPROVED]: 0,
      [DocumentStatus.REJECTED]: 0,
      [DocumentStatus.EXPIRED]: 0,
    };

    const byType: Record<DocumentType, number> = {
      [DocumentType.RG]: 0,
      [DocumentType.CPF]: 0,
      [DocumentType.CNPJ]: 0,
      [DocumentType.PROOF_OF_ADDRESS]: 0,
      [DocumentType.BANK_STATEMENT]: 0,
      [DocumentType.INCOME_PROOF]: 0,
      [DocumentType.CONTRACT]: 0,
      [DocumentType.OTHER]: 0,
    };

    let totalSize = 0;

    documents.forEach((doc) => {
      byStatus[doc!.status]++;
      byType[doc!.documentType]++;
      totalSize += doc!.size;
    });

    return {
      totalDocuments: documents.length,
      byStatus,
      byType,
      totalSize,
      correlationId: `corr-${uuidv4()}`,
    };
  }

  private mapToResponseDto(document: Document): DocumentResponseDto {
    return {
      documentId: document.documentId,
      filename: document.filename,
      size: document.size,
      documentType: document.documentType,
      status: document.status,
      uploadedAt: document.uploadedAt,
      expiresAt: document.expiresAt,
      correlationId: `corr-${uuidv4()}`,
    };
  }

  private getFileExtension(filename: string): string {
    return filename.split('.').pop() || 'pdf';
  }
}
