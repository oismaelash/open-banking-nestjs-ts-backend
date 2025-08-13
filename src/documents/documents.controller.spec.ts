import { Test, TestingModule } from '@nestjs/testing';
import { DocumentsController } from './documents.controller';
import { DocumentsService } from './documents.service';
import { DocumentType, DocumentStatus } from './dto/documents.dto';

describe('DocumentsController', () => {
  let controller: DocumentsController;
  let service: DocumentsService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [DocumentsController],
      providers: [
        {
          provide: DocumentsService,
          useValue: {
            uploadDocument: jest.fn(),
            getUserDocuments: jest.fn(),
            getDocument: jest.fn(),
            deleteDocument: jest.fn(),
            getDocumentStats: jest.fn(),
          },
        },
      ],
    }).compile();

    controller = module.get<DocumentsController>(DocumentsController);
    service = module.get<DocumentsService>(DocumentsService);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  describe('uploadDocument', () => {
    it('should upload a document successfully', async () => {
      const mockFile = {
        fieldname: 'file',
        originalname: 'test.pdf',
        encoding: '7bit',
        mimetype: 'application/pdf',
        size: 1024,
        buffer: Buffer.from('test'),
        stream: null,
        destination: '',
        filename: '',
        path: '',
      } as Express.Multer.File;

      const mockResponse = {
        documentId: 'doc-123',
        filename: 'rg_user-123_20240115.pdf',
        size: 1024,
        documentType: DocumentType.RG,
        status: DocumentStatus.PENDING,
        uploadedAt: '2024-01-15T10:30:00Z',
        correlationId: 'corr-123',
      };

      jest.spyOn(service, 'uploadDocument').mockResolvedValue(mockResponse);

      const result = await controller.uploadDocument(mockFile, DocumentType.RG);

      expect(result).toEqual(mockResponse);
      expect(service.uploadDocument).toHaveBeenCalledWith('user-123', mockFile, DocumentType.RG);
    });
  });

  describe('getUserDocuments', () => {
    it('should return user documents', async () => {
      const mockResponse = {
        documents: [],
        total: 0,
        correlationId: 'corr-123',
      };

      jest.spyOn(service, 'getUserDocuments').mockResolvedValue(mockResponse);

      const result = await controller.getUserDocuments();

      expect(result).toEqual(mockResponse);
      expect(service.getUserDocuments).toHaveBeenCalledWith('user-123');
    });
  });

  describe('deleteDocument', () => {
    it('should delete a document successfully', async () => {
      const mockResponse = {
        message: 'Document deleted successfully',
        documentId: 'doc-123',
        correlationId: 'corr-123',
      };

      jest.spyOn(service, 'deleteDocument').mockResolvedValue(mockResponse);

      const result = await controller.deleteDocument('doc-123');

      expect(result).toEqual(mockResponse);
      expect(service.deleteDocument).toHaveBeenCalledWith('doc-123', 'user-123');
    });
  });

  describe('getDocumentStats', () => {
    it('should return document statistics', async () => {
      const mockResponse = {
        totalDocuments: 3,
        byStatus: {
          [DocumentStatus.PENDING]: 1,
          [DocumentStatus.APPROVED]: 2,
          [DocumentStatus.REJECTED]: 0,
          [DocumentStatus.EXPIRED]: 0,
        },
        byType: {
          [DocumentType.RG]: 1,
          [DocumentType.CPF]: 1,
          [DocumentType.CNPJ]: 0,
          [DocumentType.PROOF_OF_ADDRESS]: 0,
          [DocumentType.BANK_STATEMENT]: 1,
          [DocumentType.INCOME_PROOF]: 0,
          [DocumentType.CONTRACT]: 0,
          [DocumentType.OTHER]: 0,
        },
        totalSize: 3584000,
        correlationId: 'corr-123',
      };

      jest.spyOn(service, 'getDocumentStats').mockResolvedValue(mockResponse);

      const result = await controller.getDocumentStats();

      expect(result).toEqual(mockResponse);
      expect(service.getDocumentStats).toHaveBeenCalledWith('user-123');
    });
  });

  describe('getAvailableDocumentTypes', () => {
    it('should return available document types', async () => {
      const result = await controller.getAvailableDocumentTypes();

      expect(result).toHaveProperty('types');
      expect(result).toHaveProperty('correlationId');
      expect(result.types).toHaveLength(8);
      expect(result.types[0]).toHaveProperty('value', DocumentType.RG);
      expect(result.types[0]).toHaveProperty('label', 'RG');
    });
  });
});
