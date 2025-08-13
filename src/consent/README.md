# 🔐 Consent Management Module

This module provides comprehensive consent management functionality for the Open Banking API, including granular permission control, consent duration management, and third-party application integration.

## 📋 Features

- **Granular Permission Control** for different data access levels
- **Consent Duration Management** with configurable validity periods
- **Consent History Tracking** with audit logs
- **Consent Revocation** capabilities
- **Third-party Application Integration**
- **Consent Validation** for API access control
- **Consent Statistics** and reporting
- **Consent Suspension** for security reasons

## 🚀 Quick Start

### 1. Create New Consent

```bash
curl -X POST http://localhost:3001/api/v1/api/consent/create \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer jwt_token_here" \
  -d '{
    "scopes": ["accounts", "balances", "transactions", "payments"],
    "duration": "30",
    "acceptTerms": true,
    "thirdPartyApp": {
      "name": "Finance App",
      "description": "Personal finance management app"
    }
  }'
```

**Response:**
```json
{
  "success": true,
  "consentId": "consent-123",
  "scopes": ["accounts", "balances", "transactions", "payments"],
  "status": "active",
  "createdAt": "2024-01-15T10:30:00Z",
  "expiresAt": "2024-02-15T10:30:00Z",
  "lastUsed": null,
  "thirdPartyApp": {
    "name": "Finance App",
    "description": "Personal finance management app"
  },
  "correlationId": "corr-123456"
}
```

### 2. Get Consent Details

```bash
curl -X GET http://localhost:3001/api/v1/api/consent/consent-123 \
  -H "Authorization: Bearer jwt_token_here"
```

### 3. Update Consent

```bash
curl -X PUT http://localhost:3001/api/v1/api/consent/consent-123 \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer jwt_token_here" \
  -d '{
    "scopes": ["accounts", "balances"],
    "duration": "7"
  }'
```

### 4. Revoke Consent

```bash
curl -X DELETE http://localhost:3001/api/v1/api/consent/consent-123 \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer jwt_token_here" \
  -d '{
    "reason": "No longer needed"
  }'
```

### 5. Get Consent History

```bash
curl -X GET http://localhost:3001/api/v1/api/consent/history \
  -H "Authorization: Bearer jwt_token_here"
```

### 6. Get Active Consents

```bash
curl -X GET http://localhost:3001/api/v1/api/consent/active \
  -H "Authorization: Bearer jwt_token_here"
```

### 7. Get Consent Statistics

```bash
curl -X GET http://localhost:3001/api/v1/api/consent/stats \
  -H "Authorization: Bearer jwt_token_here"
```

### 8. Suspend Consent

```bash
curl -X POST http://localhost:3001/api/v1/api/consent/consent-123/suspend \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer jwt_token_here" \
  -d '{
    "reason": "Security concern detected"
  }'
```

### 9. Reactivate Suspended Consent

```bash
curl -X POST http://localhost:3001/api/v1/api/consent/consent-123/reactivate \
  -H "Authorization: Bearer jwt_token_here"
```

### 10. Get Available Scopes

```bash
curl -X GET http://localhost:3001/api/v1/api/consent/scopes \
  -H "Authorization: Bearer jwt_token_here"
```

## 🔧 Using Consent Guard in Other Modules

### 1. Import the Guard and Decorator

```typescript
import { UseGuards } from '@nestjs/common';
import { ConsentGuard } from '../consent/guards/consent.guard';
import { RequireConsent } from '../consent/decorators/consent-scopes.decorator';
import { ConsentScope } from '../consent/dto/consent.dto';
```

### 2. Apply to Controller Methods

```typescript
@Controller('api/accounts')
@UseGuards(JwtAuthGuard, ConsentGuard)
export class AccountsController {
  
  @Get()
  @RequireConsent(ConsentScope.ACCOUNTS)
  async getAccounts(@Request() req) {
    // This endpoint requires 'accounts' consent
    return this.accountsService.getAccounts(req.user.id);
  }

  @Get(':accountId/transactions')
  @RequireConsent(ConsentScope.ACCOUNTS, ConsentScope.TRANSACTIONS)
  async getTransactions(@Request() req, @Param('accountId') accountId: string) {
    // This endpoint requires both 'accounts' and 'transactions' consent
    return this.accountsService.getTransactions(req.user.id, accountId);
  }
}
```

### 3. Include Consent ID in Request Headers

```bash
curl -X GET http://localhost:3001/api/v1/api/accounts \
  -H "Authorization: Bearer jwt_token_here" \
  -H "X-Consent-ID: consent-123"
```

## 📊 Available Consent Scopes

| Scope | Description |
|-------|-------------|
| `accounts` | Access to account information |
| `balances` | Access to account balances |
| `transactions` | Access to transaction history |
| `payments` | Ability to make payments |
| `statements` | Access to account statements |
| `analytics` | Access to financial analytics |
| `profile` | Access to user profile information |

## 🔄 Consent Status Flow

```
PENDING → ACTIVE → REVOKED/EXPIRED/SUSPENDED
   ↓         ↓
ACTIVE → SUSPENDED → ACTIVE (reactivate)
   ↓
EXPIRED (automatic)
```

## 🛡️ Security Features

- **Scope Validation**: Ensures only authorized scopes are granted
- **Duration Limits**: Configurable consent expiration
- **User Ownership**: Users can only manage their own consents
- **Audit Trail**: Complete history of consent changes
- **Suspension**: Ability to temporarily suspend consents
- **Revocation**: Immediate consent revocation capability

## 📚 API Documentation

The complete API documentation is available at:
- **Swagger UI**: http://localhost:3001/docs
- **OpenAPI Spec**: http://localhost:3001/docs-json

## 🧪 Testing

Run the consent management tests:

```bash
# Run all tests
npm run test

# Run consent tests only
npm run test consent.controller.spec.ts

# Run with coverage
npm run test:cov
```

## 🔄 Integration with Other Modules

The consent management module integrates with:

- **Authentication**: User identification and authorization
- **Account Management**: Consent validation for account access
- **Transaction Management**: Consent validation for transaction data
- **PIX Payments**: Consent validation for payment operations
- **Analytics**: Consent validation for data analysis
- **Audit Logging**: Consent change tracking

## 🚨 Error Handling

The module provides comprehensive error handling:

- **400 Bad Request**: Invalid consent data or scope
- **401 Unauthorized**: Missing or invalid authentication
- **403 Forbidden**: Insufficient consent or access denied
- **404 Not Found**: Consent not found

## 📈 Monitoring

The module includes:

- **Correlation IDs**: Request tracking across services
- **Consent Statistics**: Usage and status metrics
- **Audit Logging**: Complete consent lifecycle tracking
- **Performance Metrics**: Consent validation performance

## 🔮 Future Enhancements

- **Consent Templates**: Predefined consent configurations
- **Bulk Operations**: Manage multiple consents at once
- **Consent Notifications**: Expiration and usage alerts
- **Advanced Analytics**: Consent usage patterns
- **Compliance Reporting**: Regulatory compliance features
- **Consent Delegation**: Allow users to delegate consent management
