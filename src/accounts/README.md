# 💰 Account & Transaction Management Module

This module provides comprehensive account and transaction management functionality for the Open Banking API, including multi-account support, transaction history, balance tracking, and statement generation.

## 📋 Features

- **Multi-Account Support** (checking, savings, investment, credit, loan)
- **Real-time Balance Information** with availability status
- **Transaction History** with detailed categorization and filtering
- **Balance Trend Analysis** with historical data
- **Account Statement Generation** in multiple formats (JSON, CSV, PDF)
- **Transaction Analytics** with summary and categorization
- **Consent-based Access Control** for Open Banking compliance
- **Advanced Filtering** and search capabilities
- **Pagination Support** for large datasets

## 🚀 Quick Start

### 1. Get User Accounts

```bash
curl -X GET http://localhost:3001/api/v1/api/accounts \
  -H "Authorization: Bearer jwt_token_here" \
  -H "X-Consent-ID: consent-123"
```

**Response:**
```json
{
  "success": true,
  "accounts": [
    {
      "id": "account-1",
      "type": "checking",
      "name": "Conta Corrente Principal",
      "number": "****1234",
      "balance": 15420.50,
      "availableBalance": 15200.00,
      "status": "active",
      "bank": "Banco do Brasil",
      "lastUpdated": "2024-01-15T10:30:00Z"
    }
  ],
  "correlationId": "corr-123456"
}
```

### 2. Get Account Details

```bash
curl -X GET http://localhost:3001/api/v1/api/accounts/account-1 \
  -H "Authorization: Bearer jwt_token_here" \
  -H "X-Consent-ID: consent-123"
```

### 3. Get Account Transactions

```bash
curl -X GET "http://localhost:3001/api/v1/api/accounts/account-1/transactions?startDate=2024-01-01&endDate=2024-01-31&limit=20&offset=0" \
  -H "Authorization: Bearer jwt_token_here" \
  -H "X-Consent-ID: consent-123"
```

**Response:**
```json
{
  "success": true,
  "transactions": [
    {
      "id": "txn-1",
      "date": "2024-01-15",
      "description": "Pagamento PIX - João Silva",
      "category": "PIX",
      "amount": 150.00,
      "type": "debit",
      "status": "completed",
      "merchant": "João Silva",
      "accountId": "account-1",
      "reference": "PIX123456789",
      "location": "São Paulo, SP",
      "tags": ["pix", "transfer"]
    }
  ],
  "pagination": {
    "total": 150,
    "limit": 20,
    "offset": 0,
    "hasMore": true
  },
  "correlationId": "corr-123456"
}
```

### 4. Get Balance History

```bash
curl -X GET "http://localhost:3001/api/v1/api/accounts/account-1/balance-history?startDate=2024-01-01&endDate=2024-01-31&interval=daily" \
  -H "Authorization: Bearer jwt_token_here" \
  -H "X-Consent-ID: consent-123"
```

### 5. Generate Account Statement

```bash
curl -X POST http://localhost:3001/api/v1/api/accounts/account-1/statement \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer jwt_token_here" \
  -H "X-Consent-ID: consent-123" \
  -d '{
    "startDate": "2024-01-01",
    "endDate": "2024-01-31",
    "format": "json",
    "includePending": false
  }'
```

## 🔧 Transaction Filtering

### Available Filters

| Parameter | Type | Description | Example |
|-----------|------|-------------|---------|
| `startDate` | string | Start date (YYYY-MM-DD) | `2024-01-01` |
| `endDate` | string | End date (YYYY-MM-DD) | `2024-01-31` |
| `category` | string | Transaction category | `PIX`, `Pagamento`, `Depósito` |
| `type` | string | Transaction type | `credit`, `debit` |
| `minAmount` | number | Minimum amount | `100.00` |
| `maxAmount` | number | Maximum amount | `1000.00` |
| `search` | string | Search in description/merchant | `supermercado` |
| `limit` | number | Number of results (default: 20) | `50` |
| `offset` | number | Pagination offset (default: 0) | `20` |

### Filter Examples

```bash
# Filter by date range
curl -X GET "http://localhost:3001/api/v1/api/accounts/account-1/transactions?startDate=2024-01-01&endDate=2024-01-31"

# Filter by category
curl -X GET "http://localhost:3001/api/v1/api/accounts/account-1/transactions?category=PIX"

# Filter by amount range
curl -X GET "http://localhost:3001/api/v1/api/accounts/account-1/transactions?minAmount=100&maxAmount=500"

# Search transactions
curl -X GET "http://localhost:3001/api/v1/api/accounts/account-1/transactions?search=supermercado"

# Combine multiple filters
curl -X GET "http://localhost:3001/api/v1/api/accounts/account-1/transactions?startDate=2024-01-01&category=PIX&minAmount=100&limit=10"
```

## 📊 Transaction Categories

| Category | Description |
|----------|-------------|
| `Transferência` | Bank transfers |
| `Pagamento` | Payments |
| `Depósito` | Deposits |
| `Saque` | Withdrawals |
| `Taxa` | Fees |
| `Juros` | Interest |
| `Estorno` | Refunds |
| `Compra` | Purchases |
| `Pagamento de Conta` | Bill payments |
| `PIX` | PIX transfers |
| `Outros` | Other transactions |

## 🏦 Account Types

| Type | Description |
|------|-------------|
| `checking` | Checking account |
| `savings` | Savings account |
| `investment` | Investment account |
| `credit` | Credit account |
| `loan` | Loan account |

## 📈 Balance History Intervals

| Interval | Description |
|----------|-------------|
| `daily` | Daily balance records |
| `weekly` | Weekly aggregated data |
| `monthly` | Monthly aggregated data |

## 📄 Statement Formats

| Format | Description |
|--------|-------------|
| `json` | JSON format with full transaction details |
| `csv` | CSV format for spreadsheet import |
| `pdf` | PDF format for printing (production only) |

## 🔐 Consent Requirements

The accounts module requires specific consent scopes for different operations:

| Endpoint | Required Consent Scopes |
|----------|------------------------|
| `GET /accounts` | `accounts` |
| `GET /accounts/{id}` | `accounts` |
| `GET /accounts/{id}/transactions` | `accounts`, `transactions` |
| `GET /accounts/{id}/balance-history` | `accounts`, `balances` |
| `POST /accounts/{id}/statement` | `accounts`, `statements` |

### Consent Header

All requests must include the consent ID in the header:

```bash
-H "X-Consent-ID: consent-123"
```

## 📊 Analytics Endpoints

### Transaction Summary

```bash
curl -X GET "http://localhost:3001/api/v1/api/accounts/account-1/transactions/summary?startDate=2024-01-01&endDate=2024-01-31" \
  -H "Authorization: Bearer jwt_token_here" \
  -H "X-Consent-ID: consent-123"
```

### Transaction Categories

```bash
curl -X GET "http://localhost:3001/api/v1/api/accounts/account-1/transactions/categories?startDate=2024-01-01&endDate=2024-01-31" \
  -H "Authorization: Bearer jwt_token_here" \
  -H "X-Consent-ID: consent-123"
```

### Top Merchants

```bash
curl -X GET "http://localhost:3001/api/v1/api/accounts/account-1/transactions/merchants?startDate=2024-01-01&endDate=2024-01-31&limit=10" \
  -H "Authorization: Bearer jwt_token_here" \
  -H "X-Consent-ID: consent-123"
```

### Transaction Timeline

```bash
curl -X GET "http://localhost:3001/api/v1/api/accounts/account-1/transactions/timeline?startDate=2024-01-01&endDate=2024-01-31&groupBy=day" \
  -H "Authorization: Bearer jwt_token_here" \
  -H "X-Consent-ID: consent-123"
```

## 🛡️ Security Features

- **User Ownership Validation**: Users can only access their own accounts
- **Consent-based Access**: All endpoints require appropriate consent scopes
- **Input Validation**: Comprehensive validation for all parameters
- **Audit Trail**: All requests include correlation IDs for tracking
- **Data Masking**: Account numbers are masked for security

## 📚 API Documentation

The complete API documentation is available at:
- **Swagger UI**: http://localhost:3001/docs
- **OpenAPI Spec**: http://localhost:3001/docs-json

## 🧪 Testing

Run the accounts management tests:

```bash
# Run all tests
npm run test

# Run accounts tests only
npm run test accounts.controller.spec.ts

# Run with coverage
npm run test:cov
```

## 🔄 Integration with Other Modules

The accounts module integrates with:

- **Authentication**: User identification and authorization
- **Consent Management**: Consent validation for data access
- **PIX Payments**: Transaction integration with payment system
- **Analytics**: Data analysis and reporting
- **Audit Logging**: Transaction and access tracking

## 🚨 Error Handling

The module provides comprehensive error handling:

- **400 Bad Request**: Invalid parameters or date ranges
- **401 Unauthorized**: Missing or invalid authentication
- **403 Forbidden**: Insufficient consent or access denied
- **404 Not Found**: Account not found

## 📈 Monitoring

The module includes:

- **Correlation IDs**: Request tracking across services
- **Transaction Metrics**: Volume and value analytics
- **Performance Monitoring**: Response time tracking
- **Error Tracking**: Failed request monitoring

## 🔮 Future Enhancements

- **Real-time Notifications**: Transaction alerts
- **Advanced Analytics**: AI-powered insights
- **Multi-currency Support**: International account support
- **Account Aggregation**: Multi-bank account consolidation
- **Transaction Categorization**: Automatic categorization
- **Budget Tracking**: Spending analysis and alerts
- **Export Features**: Additional export formats
- **Mobile Optimization**: Mobile-specific endpoints
