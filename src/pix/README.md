# PIX Payment Module

This module provides comprehensive PIX payment functionality for the Open Banking backend, including payment processing, QR code generation, contact management, and limits tracking.

## Features

- **PIX Payment Processing**: Create and track PIX payments with real-time status updates
- **QR Code Generation**: Generate PIX QR codes for easy payment sharing
- **QR Code Scanning**: Scan PIX QR codes to extract payment information
- **Contact Management**: Manage PIX contacts for quick access
- **Limits Tracking**: Monitor daily and monthly PIX usage limits
- **Receipt Generation**: Generate payment receipts in PDF or JSON format
- **Multi-Key Support**: Support for all PIX key types (CPF, CNPJ, email, phone, random)
- **Consent-Based Access**: All endpoints require appropriate consent scopes

## Endpoints

### Payment Processing

#### Create PIX Payment
```bash
curl -X POST http://localhost:3001/api/pix/payment \
  -H "Authorization: Bearer YOUR_JWT_TOKEN" \
  -H "X-Consent-ID: YOUR_CONSENT_ID" \
  -H "Content-Type: application/json" \
  -d '{
    "pixKey": "+55 11 99999-9999",
    "pixKeyType": "phone",
    "recipientName": "João Silva",
    "amount": 150.00,
    "description": "Pagamento para João Silva",
    "category": "Transferência",
    "accountId": "account-1"
  }'
```

#### Get Payment Status
```bash
curl -X GET http://localhost:3001/api/pix/payment/PIX123456789 \
  -H "Authorization: Bearer YOUR_JWT_TOKEN" \
  -H "X-Consent-ID: YOUR_CONSENT_ID"
```

#### Get Payment Receipt
```bash
# JSON format
curl -X GET "http://localhost:3001/api/pix/payment/PIX123456789/receipt?format=json" \
  -H "Authorization: Bearer YOUR_JWT_TOKEN" \
  -H "X-Consent-ID: YOUR_CONSENT_ID"

# PDF format
curl -X GET "http://localhost:3001/api/pix/payment/PIX123456789/receipt?format=pdf" \
  -H "Authorization: Bearer YOUR_JWT_TOKEN" \
  -H "X-Consent-ID: YOUR_CONSENT_ID"
```

### QR Code Operations

#### Generate PIX QR Code
```bash
curl -X POST http://localhost:3001/api/pix/qr-code/generate \
  -H "Authorization: Bearer YOUR_JWT_TOKEN" \
  -H "X-Consent-ID: YOUR_CONSENT_ID" \
  -H "Content-Type: application/json" \
  -d '{
    "pixKey": "+55 11 99999-9999",
    "pixKeyType": "phone",
    "recipientName": "João Silva",
    "amount": 150.00,
    "description": "Pagamento para João Silva"
  }'
```

#### Scan PIX QR Code
```bash
curl -X POST http://localhost:3001/api/pix/qr-code/scan \
  -H "Authorization: Bearer YOUR_JWT_TOKEN" \
  -H "X-Consent-ID: YOUR_CONSENT_ID" \
  -H "Content-Type: application/json" \
  -d '{
    "qrCodeImage": "base64_encoded_image_data"
  }'
```

### Contact Management

#### Get PIX Contacts
```bash
curl -X GET http://localhost:3001/api/pix/contacts \
  -H "Authorization: Bearer YOUR_JWT_TOKEN" \
  -H "X-Consent-ID: YOUR_CONSENT_ID"
```

#### Add PIX Contact
```bash
curl -X POST http://localhost:3001/api/pix/contacts \
  -H "Authorization: Bearer YOUR_JWT_TOKEN" \
  -H "X-Consent-ID: YOUR_CONSENT_ID" \
  -H "Content-Type: application/json" \
  -d '{
    "type": "phone",
    "value": "+55 11 99999-9999",
    "name": "João Silva",
    "bank": "Banco do Brasil"
  }'
```

#### Remove PIX Contact
```bash
curl -X DELETE http://localhost:3001/api/pix/contacts/contact-id-123 \
  -H "Authorization: Bearer YOUR_JWT_TOKEN" \
  -H "X-Consent-ID: YOUR_CONSENT_ID"
```

### Limits

#### Get PIX Limits
```bash
curl -X GET http://localhost:3001/api/pix/limits \
  -H "Authorization: Bearer YOUR_JWT_TOKEN" \
  -H "X-Consent-ID: YOUR_CONSENT_ID"
```

## PIX Key Types

The module supports all standard PIX key types:

- **CPF**: Brazilian individual taxpayer ID (format: 123.456.789-00)
- **CNPJ**: Brazilian company taxpayer ID (format: 12.345.678/0001-90)
- **Email**: Email address (format: user@domain.com)
- **Phone**: Brazilian phone number (format: +55 11 99999-9999)
- **Random**: Random alphanumeric key (32-77 characters)

## Payment Categories

Available payment categories:

- Transferência
- Pagamento
- Depósito
- Saque
- Taxa
- Juros
- Estorno
- Compra
- Pagamento de Conta
- PIX
- Outros

## Payment Status

Payment status flow:

1. **pending**: Payment created, waiting to be processed
2. **processing**: Payment is being processed
3. **completed**: Payment completed successfully
4. **failed**: Payment failed
5. **cancelled**: Payment was cancelled

## Consent Requirements

All PIX endpoints require specific consent scopes:

- **PAYMENTS**: Required for payment creation, status checking, QR code operations, and limits
- **PROFILE**: Required for contact management

## Error Handling

The module provides comprehensive error handling:

- **400 Bad Request**: Invalid PIX key format, limit exceeded, invalid account
- **401 Unauthorized**: Missing or invalid JWT token
- **403 Forbidden**: Insufficient consent scopes
- **404 Not Found**: Payment or contact not found

## Sample Data

The module includes sample data for testing:

- **Sample Payments**: 2 pre-created payments (one completed, one pending)
- **Sample Contacts**: 3 pre-created contacts with different key types
- **Usage Tracking**: Daily and monthly usage counters

## Security Features

- JWT authentication required for all endpoints
- Consent-based access control
- PIX key format validation
- Payment limits enforcement
- Input sanitization and validation

## Development Notes

- Uses in-memory storage for development purposes
- Simulates payment processing with timeouts
- Includes comprehensive validation for all PIX key types
- Provides realistic sample data for testing
- All endpoints include correlation IDs for tracking
