# Utility Endpoints Module

This module provides various utility endpoints for the Open Banking API, including address lookup, document validation, system information, and health checks.

## Features

- **CEP (ZIP Code) Lookup**: Get address information by Brazilian ZIP code
- **CPF Validation**: Validate and format Brazilian individual taxpayer numbers
- **CNPJ Validation**: Validate and format Brazilian corporate taxpayer numbers
- **Email Validation**: Validate email addresses and extract domain information
- **Phone Validation**: Validate Brazilian phone numbers with formatting
- **System Information**: Get system status, memory usage, and uptime
- **Health Checks**: Service health monitoring endpoints
- **Time Utilities**: Current time and timezone information

## API Endpoints

### Get Address by ZIP Code (CEP)
```http
GET /api/utils/cep/{cep}
Authorization: Bearer <jwt-token>
```

**Response:**
```json
{
  "cep": "01234-567",
  "logradouro": "Rua das Flores",
  "complemento": "",
  "bairro": "Centro",
  "localidade": "São Paulo",
  "uf": "SP",
  "ibge": "3550308",
  "ddd": "11",
  "correlationId": "corr-123456789"
}
```

### Validate CPF
```http
GET /api/utils/validate-cpf/{cpf}
Authorization: Bearer <jwt-token>
```

**Response:**
```json
{
  "valid": true,
  "formatted": "123.456.789-00",
  "correlationId": "corr-123456789"
}
```

### Validate Email
```http
GET /api/utils/validate-email/{email}
Authorization: Bearer <jwt-token>
```

**Response:**
```json
{
  "valid": true,
  "domain": "example.com",
  "correlationId": "corr-123456789"
}
```

### Validate Phone Number
```http
GET /api/utils/validate-phone/{phone}
Authorization: Bearer <jwt-token>
```

**Response:**
```json
{
  "valid": true,
  "formatted": "+55 11 99999-9999",
  "type": "mobile",
  "ddd": "11",
  "correlationId": "corr-123456789"
}
```

### Validate CNPJ
```http
GET /api/utils/validate-cnpj/{cnpj}
Authorization: Bearer <jwt-token>
```

**Response:**
```json
{
  "valid": true,
  "formatted": "12.345.678/0001-90",
  "correlationId": "corr-123456789"
}
```

### Get System Information
```http
GET /api/utils/system/info
Authorization: Bearer <jwt-token>
```

**Response:**
```json
{
  "version": "1.0.0",
  "environment": "development",
  "timestamp": "2024-01-15T10:30:00Z",
  "uptime": 3600,
  "memory": {
    "used": 50,
    "total": 100,
    "free": 50
  },
  "correlationId": "corr-123456789"
}
```

### Health Check
```http
GET /api/utils/health/check
Authorization: Bearer <jwt-token>
```

**Response:**
```json
{
  "status": "healthy",
  "timestamp": "2024-01-15T10:30:00Z",
  "service": "open-banking-api",
  "correlationId": "corr-123456789"
}
```

### Get Current Time
```http
GET /api/utils/time/current
Authorization: Bearer <jwt-token>
```

**Response:**
```json
{
  "timestamp": "1705312200000",
  "iso": "2024-01-15T10:30:00.000Z",
  "utc": "Mon, 15 Jan 2024 10:30:00 GMT",
  "timezone": "America/Sao_Paulo",
  "correlationId": "corr-123456789"
}
```

## Validation Algorithms

### CPF Validation
The CPF validation uses the official Brazilian algorithm:
1. Remove non-digit characters
2. Check for 11 digits
3. Validate first verification digit
4. Validate second verification digit
5. Check for repeated digits (invalid)

### CNPJ Validation
The CNPJ validation uses the official Brazilian algorithm:
1. Remove non-digit characters
2. Check for 14 digits
3. Validate first verification digit
4. Validate second verification digit
5. Check for repeated digits (invalid)

### Phone Validation
Brazilian phone number validation:
- **Mobile**: 11 digits (DDD + 9 + 8 digits)
- **Landline**: 10 digits (DDD + 8 digits)
- **DDD**: First 2 digits (area code)
- **Mobile indicator**: 9th digit must be 9 for mobile numbers

## Error Handling

The module provides detailed error responses:

- **400 Bad Request**: Invalid input format (CEP, CPF, CNPJ, etc.)
- **401 Unauthorized**: Missing or invalid authentication
- **404 Not Found**: CEP not found in database

## Usage Examples

### Get Address by CEP
```bash
curl -X GET "http://localhost:3001/api/v1/api/utils/cep/01234-567" \
  -H "Authorization: Bearer valid-jwt-token"
```

### Validate CPF
```bash
curl -X GET "http://localhost:3001/api/v1/api/utils/validate-cpf/123.456.789-00" \
  -H "Authorization: Bearer valid-jwt-token"
```

### Validate Email
```bash
curl -X GET "http://localhost:3001/api/v1/api/utils/validate-email/user@example.com" \
  -H "Authorization: Bearer valid-jwt-token"
```

### Validate Phone Number
```bash
curl -X GET "http://localhost:3001/api/v1/api/utils/validate-phone/+55%2011%2099999-9999" \
  -H "Authorization: Bearer valid-jwt-token"
```

### Validate CNPJ
```bash
curl -X GET "http://localhost:3001/api/v1/api/utils/validate-cnpj/12.345.678/0001-90" \
  -H "Authorization: Bearer valid-jwt-token"
```

### Get System Information
```bash
curl -X GET "http://localhost:3001/api/v1/api/utils/system/info" \
  -H "Authorization: Bearer valid-jwt-token"
```

### Health Check
```bash
curl -X GET "http://localhost:3001/api/v1/api/utils/health/check" \
  -H "Authorization: Bearer valid-jwt-token"
```

## Implementation Notes

- **CEP Lookup**: Currently uses mock data. In production, integrate with ViaCEP API or similar service.
- **Validation**: All validation algorithms follow official Brazilian standards.
- **Authentication**: All endpoints require JWT authentication.
- **Rate Limiting**: Consider implementing rate limiting for validation endpoints.
- **Caching**: Consider caching CEP lookups and validation results for performance.
- **Internationalization**: Phone validation is specific to Brazilian numbers. Extend for international support if needed.

## External Dependencies

- **ViaCEP API**: For real CEP lookups (not implemented in demo)
- **Email Validation**: Basic regex validation. Consider DNS lookup for production.
- **Phone Validation**: Brazilian-specific validation. Extend for international numbers.

## Security Considerations

- **Input Sanitization**: All inputs are sanitized to prevent injection attacks
- **Rate Limiting**: Implement rate limiting to prevent abuse
- **Logging**: All validation attempts are logged for audit purposes
- **Data Privacy**: No personal data is stored or logged
