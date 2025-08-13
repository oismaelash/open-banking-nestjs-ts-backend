# Documents & Files Module

This module provides comprehensive document and file management capabilities for the Open Banking API, including upload, download, storage, and management of various document types.

## Features

- **Document Upload**: Secure file upload with validation and type checking
- **Document Storage**: In-memory storage with file metadata management
- **Document Retrieval**: Download documents with proper headers and streaming
- **Document Management**: List, delete, and update document status
- **Document Statistics**: Overview of document counts, types, and storage usage
- **Type Validation**: Support for multiple document types (RG, CPF, CNPJ, etc.)
- **File Validation**: Size limits, MIME type validation, and security checks
- **Consent Integration**: All operations require appropriate consent scopes

## Document Types

The module supports the following document types:

- **RG**: Identity Card
- **CPF**: Individual Taxpayer Registration
- **CNPJ**: Corporate Taxpayer Registration
- **PROOF_OF_ADDRESS**: Address verification document
- **BANK_STATEMENT**: Bank account statement
- **INCOME_PROOF**: Income verification document
- **CONTRACT**: Legal contract document
- **OTHER**: Other document types

## Document Status

Documents can have the following statuses:

- **PENDING**: Document uploaded, awaiting review
- **APPROVED**: Document approved and valid
- **REJECTED**: Document rejected during review
- **EXPIRED**: Document has expired

## API Endpoints

### Upload Document
```http
POST /api/documents/upload
Content-Type: multipart/form-data
Authorization: Bearer <jwt-token>
X-Consent-ID: <consent-id>

{
  "documentType": "rg",
  "file": <multipart-file-data>
}
```

**Response:**
```json
{
  "documentId": "doc-123456789",
  "filename": "rg_user-123_20240115.pdf",
  "size": 1024000,
  "documentType": "rg",
  "status": "pending",
  "uploadedAt": "2024-01-15T10:30:00Z",
  "expiresAt": "2025-01-15T10:30:00Z",
  "correlationId": "corr-123456789"
}
```

### Get User Documents
```http
GET /api/documents
Authorization: Bearer <jwt-token>
X-Consent-ID: <consent-id>
```

**Response:**
```json
{
  "documents": [
    {
      "documentId": "doc-123456789",
      "filename": "rg_user-123_20240115.pdf",
      "size": 1024000,
      "documentType": "rg",
      "status": "approved",
      "uploadedAt": "2024-01-15T10:30:00Z",
      "expiresAt": "2025-01-15T10:30:00Z",
      "correlationId": "corr-123456789"
    }
  ],
  "total": 1,
  "correlationId": "corr-123456789"
}
```

### Get Document (Download)
```http
GET /api/documents/{documentId}
Authorization: Bearer <jwt-token>
X-Consent-ID: <consent-id>
```

**Response:** File download with appropriate headers

### Delete Document
```http
DELETE /api/documents/{documentId}
Authorization: Bearer <jwt-token>
X-Consent-ID: <consent-id>
```

**Response:**
```json
{
  "message": "Document deleted successfully",
  "documentId": "doc-123456789",
  "correlationId": "corr-123456789"
}
```

### Get Document Statistics
```http
GET /api/documents/stats/overview
Authorization: Bearer <jwt-token>
X-Consent-ID: <consent-id>
```

**Response:**
```json
{
  "totalDocuments": 3,
  "byStatus": {
    "pending": 1,
    "approved": 2,
    "rejected": 0,
    "expired": 0
  },
  "byType": {
    "rg": 1,
    "cpf": 1,
    "cnpj": 0,
    "proof_of_address": 0,
    "bank_statement": 1,
    "income_proof": 0,
    "contract": 0,
    "other": 0
  },
  "totalSize": 3584000,
  "correlationId": "corr-123456789"
}
```

### Get Available Document Types
```http
GET /api/documents/types/available
Authorization: Bearer <jwt-token>
X-Consent-ID: <consent-id>
```

**Response:**
```json
{
  "types": [
    {
      "value": "rg",
      "label": "RG",
      "description": "Identity Card"
    },
    {
      "value": "cpf",
      "label": "CPF",
      "description": "Individual Taxpayer Registration"
    }
  ],
  "correlationId": "corr-123456789"
}
```

## Consent Requirements

All document endpoints require the `PROFILE` consent scope:

```typescript
@RequireConsent(ConsentScope.PROFILE)
```

## File Validation

The module includes comprehensive file validation:

- **File Size**: Maximum 10MB per file
- **File Types**: Only PDF and image files (JPEG, PNG, JPG) are allowed
- **MIME Type Validation**: Ensures file type matches extension
- **Security Checks**: Validates file content and structure

## Error Handling

The module provides detailed error responses:

- **400 Bad Request**: Invalid file type, size, or document type
- **401 Unauthorized**: Missing or invalid authentication
- **403 Forbidden**: Missing or invalid consent
- **404 Not Found**: Document not found or access denied

## Usage Examples

### Upload a Document
```bash
curl -X POST "http://localhost:3001/api/documents/upload" \
  -H "Authorization: Bearer valid-jwt-token" \
  -H "X-Consent-ID: valid-consent-id" \
  -F "documentType=rg" \
  -F "file=@/path/to/document.pdf"
```

### Get User Documents
```bash
curl -X GET "http://localhost:3001/api/documents" \
  -H "Authorization: Bearer valid-jwt-token" \
  -H "X-Consent-ID: valid-consent-id"
```

### Download a Document
```bash
curl -X GET "http://localhost:3001/api/documents/doc-123456789" \
  -H "Authorization: Bearer valid-jwt-token" \
  -H "X-Consent-ID: valid-consent-id" \
  --output downloaded_document.pdf
```

### Delete a Document
```bash
curl -X DELETE "http://localhost:3001/api/documents/doc-123456789" \
  -H "Authorization: Bearer valid-jwt-token" \
  -H "X-Consent-ID: valid-consent-id"
```

### Get Document Statistics
```bash
curl -X GET "http://localhost:3001/api/documents/stats/overview" \
  -H "Authorization: Bearer valid-jwt-token" \
  -H "X-Consent-ID: valid-consent-id"
```

## Implementation Notes

- **Storage**: Currently uses in-memory storage for development. In production, integrate with AWS S3 or similar cloud storage.
- **File Processing**: For production, consider adding virus scanning, OCR processing, and document analysis.
- **Security**: Implement additional security measures like file encryption, access logging, and audit trails.
- **Performance**: For large files, implement streaming uploads and downloads.
- **Compliance**: Ensure compliance with data protection regulations (GDPR, LGPD) for document storage and processing.
