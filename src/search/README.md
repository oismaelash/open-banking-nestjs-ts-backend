# Search & Filter Module

This module provides comprehensive search and filtering functionality for the Open Banking backend, including transaction search, account search, contact search, global search, and search suggestions.

## Features

- **Transaction Search**: Advanced filtering by date, amount, category, merchant, and more
- **Account Search**: Search accounts by name, type, status, and balance
- **Contact Search**: Find contacts by name, type, and bank
- **Global Search**: Search across all data types simultaneously
- **Search Suggestions**: Intelligent autocomplete suggestions
- **Pagination**: Built-in pagination support for all search results
- **Sorting**: Multiple sorting options for search results
- **Consent-Based Access**: All endpoints require appropriate consent scopes

## Endpoints

### Transaction Search

#### Search Transactions
```bash
curl -X GET "http://localhost:3001/api/v1/api/search/transactions?q=PIX&category=PIX&minAmount=100&maxAmount=200&limit=10" \
  -H "Authorization: Bearer YOUR_JWT_TOKEN" \
  -H "X-Consent-ID: YOUR_CONSENT_ID"
```

**Query Parameters:**
- `q`: Search query for description, merchant, or reference
- `accountId`: Filter by account ID
- `startDate`: Start date filter (ISO format)
- `endDate`: End date filter (ISO format)
- `category`: Filter by transaction category
- `type`: Filter by transaction type (credit/debit)
- `status`: Filter by transaction status
- `minAmount`: Minimum amount filter
- `maxAmount`: Maximum amount filter
- `merchant`: Filter by merchant name
- `reference`: Filter by reference number
- `limit`: Number of results (1-100, default: 20)
- `offset`: Pagination offset (default: 0)
- `sortBy`: Sort field (date, amount, description, merchant)
- `sortOrder`: Sort order (asc, desc, default: desc)

**Response:**
```json
{
  "transactions": [
    {
      "id": "txn-1",
      "date": "2024-01-15T14:30:00Z",
      "description": "Pagamento PIX - João Silva",
      "category": "PIX",
      "amount": 150.00,
      "type": "debit",
      "status": "completed",
      "merchant": "João Silva",
      "accountId": "account-1",
      "reference": "PIX123456789",
      "fee": 0.00
    }
  ],
  "pagination": {
    "total": 5,
    "limit": 10,
    "offset": 0,
    "hasMore": false,
    "page": 1,
    "totalPages": 1
  },
  "filters": {
    "q": "PIX",
    "category": "PIX",
    "minAmount": 100,
    "maxAmount": 200,
    "limit": 10
  },
  "correlationId": "corr-123456"
}
```

### Account Search

#### Search Accounts
```bash
curl -X GET "http://localhost:3001/api/v1/api/search/accounts?q=Principal&type=checking&status=active&limit=10" \
  -H "Authorization: Bearer YOUR_JWT_TOKEN" \
  -H "X-Consent-ID: YOUR_CONSENT_ID"
```

**Query Parameters:**
- `q`: Search query for account name or number
- `type`: Filter by account type
- `status`: Filter by account status
- `bank`: Filter by bank name
- `minBalance`: Minimum balance filter
- `maxBalance`: Maximum balance filter
- `limit`: Number of results (1-100, default: 20)
- `offset`: Pagination offset (default: 0)

**Response:**
```json
{
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
      "lastUpdated": "2024-01-15T15:00:00Z"
    }
  ],
  "pagination": {
    "total": 3,
    "limit": 10,
    "offset": 0,
    "hasMore": false,
    "page": 1,
    "totalPages": 1
  },
  "filters": {
    "q": "Principal",
    "type": "checking",
    "status": "active",
    "limit": 10
  },
  "correlationId": "corr-123456"
}
```

### Contact Search

#### Search Contacts
```bash
curl -X GET "http://localhost:3001/api/v1/api/search/contacts?q=João&type=pix&limit=10" \
  -H "Authorization: Bearer YOUR_JWT_TOKEN" \
  -H "X-Consent-ID: YOUR_CONSENT_ID"
```

**Query Parameters:**
- `q`: Search query for contact name or value
- `type`: Filter by contact type
- `bank`: Filter by bank name
- `limit`: Number of results (1-100, default: 20)
- `offset`: Pagination offset (default: 0)

**Response:**
```json
{
  "contacts": [
    {
      "id": "contact-1",
      "name": "João Silva",
      "value": "+55 11 99999-9999",
      "type": "pix",
      "bank": "Banco do Brasil",
      "createdAt": "2024-01-10T10:00:00Z"
    }
  ],
  "pagination": {
    "total": 1,
    "limit": 10,
    "offset": 0,
    "hasMore": false,
    "page": 1,
    "totalPages": 1
  },
  "filters": {
    "q": "João",
    "type": "pix",
    "limit": 10
  },
  "correlationId": "corr-123456"
}
```

### Global Search

#### Global Search
```bash
curl -X GET "http://localhost:3001/api/v1/api/search/global?q=João&includeTransactions=true&includeAccounts=true&includeContacts=true&limit=10" \
  -H "Authorization: Bearer YOUR_JWT_TOKEN" \
  -H "X-Consent-ID: YOUR_CONSENT_ID"
```

**Query Parameters:**
- `q`: Search query (required)
- `includeTransactions`: Search in transactions (default: true)
- `includeAccounts`: Search in accounts (default: true)
- `includeContacts`: Search in contacts (default: true)
- `limit`: Number of results per category (1-50, default: 10)

**Response:**
```json
{
  "transactions": [
    {
      "id": "txn-1",
      "date": "2024-01-15T14:30:00Z",
      "description": "Pagamento PIX - João Silva",
      "category": "PIX",
      "amount": 150.00,
      "type": "debit",
      "status": "completed",
      "merchant": "João Silva",
      "accountId": "account-1",
      "reference": "PIX123456789",
      "fee": 0.00
    }
  ],
  "accounts": [],
  "contacts": [
    {
      "id": "contact-1",
      "name": "João Silva",
      "value": "+55 11 99999-9999",
      "type": "pix",
      "bank": "Banco do Brasil",
      "createdAt": "2024-01-10T10:00:00Z"
    }
  ],
  "totalResults": 2,
  "query": "João",
  "correlationId": "corr-123456"
}
```

### Search Suggestions

#### Get Search Suggestions
```bash
curl -X GET "http://localhost:3001/api/v1/api/search/suggestions?q=Jo&type=all&limit=10" \
  -H "Authorization: Bearer YOUR_JWT_TOKEN" \
  -H "X-Consent-ID: YOUR_CONSENT_ID"
```

**Query Parameters:**
- `q`: Partial search query (required)
- `type`: Type of suggestions (transactions, accounts, contacts, all, default: all)
- `limit`: Maximum number of suggestions (1-20, default: 10)

**Response:**
```json
{
  "suggestions": [
    {
      "text": "João Silva",
      "type": "contact",
      "value": "contact-1",
      "score": 90
    },
    {
      "text": "João Silva",
      "type": "merchant",
      "value": "João Silva",
      "score": 90
    }
  ],
  "query": "Jo",
  "correlationId": "corr-123456"
}
```

### Search Statistics

#### Get Search Statistics
```bash
curl -X GET "http://localhost:3001/api/v1/api/search/stats" \
  -H "Authorization: Bearer YOUR_JWT_TOKEN" \
  -H "X-Consent-ID: YOUR_CONSENT_ID"
```

**Response:**
```json
{
  "totalTransactions": 5,
  "totalAccounts": 3,
  "totalContacts": 4,
  "correlationId": "corr-123456"
}
```

### Filter Options

#### Get Transaction Categories
```bash
curl -X GET "http://localhost:3001/api/v1/api/search/transactions/categories" \
  -H "Authorization: Bearer YOUR_JWT_TOKEN" \
  -H "X-Consent-ID: YOUR_CONSENT_ID"
```

**Response:**
```json
{
  "categories": [
    "Transferência",
    "Pagamento",
    "Depósito",
    "Saque",
    "Taxa",
    "Juros",
    "Estorno",
    "Compra",
    "Pagamento de Conta",
    "PIX",
    "Outros"
  ],
  "correlationId": "corr-123456"
}
```

#### Get Transaction Merchants
```bash
curl -X GET "http://localhost:3001/api/v1/api/search/transactions/merchants" \
  -H "Authorization: Bearer YOUR_JWT_TOKEN" \
  -H "X-Consent-ID: YOUR_CONSENT_ID"
```

**Response:**
```json
{
  "merchants": [
    "João Silva",
    "Supermercado ABC",
    "Empresa XYZ",
    "Transferência Interna",
    "Companhia de Energia",
    "Maria Santos",
    "Pedro Costa",
    "Restaurante XYZ",
    "Farmácia ABC",
    "Posto de Gasolina"
  ],
  "correlationId": "corr-123456"
}
```

#### Get Account Types
```bash
curl -X GET "http://localhost:3001/api/v1/api/search/accounts/types" \
  -H "Authorization: Bearer YOUR_JWT_TOKEN" \
  -H "X-Consent-ID: YOUR_CONSENT_ID"
```

**Response:**
```json
{
  "types": [
    "checking",
    "savings",
    "investment",
    "credit",
    "loan"
  ],
  "correlationId": "corr-123456"
}
```

#### Get Contact Types
```bash
curl -X GET "http://localhost:3001/api/v1/api/search/contacts/types" \
  -H "Authorization: Bearer YOUR_JWT_TOKEN" \
  -H "X-Consent-ID: YOUR_CONSENT_ID"
```

**Response:**
```json
{
  "types": [
    "pix",
    "transfer",
    "bill_payment"
  ],
  "correlationId": "corr-123456"
}
```

## Search Features

### Advanced Filtering
- **Date Range**: Filter by start and end dates
- **Amount Range**: Filter by minimum and maximum amounts
- **Category Filtering**: Filter by transaction categories
- **Status Filtering**: Filter by transaction status
- **Type Filtering**: Filter by transaction type (credit/debit)
- **Merchant Filtering**: Filter by merchant name
- **Reference Filtering**: Filter by reference number

### Sorting Options
- **Date**: Sort by transaction date
- **Amount**: Sort by transaction amount
- **Description**: Sort by transaction description
- **Merchant**: Sort by merchant name
- **Order**: Ascending or descending

### Pagination
- **Limit**: Control number of results per page (1-100)
- **Offset**: Control pagination offset
- **Page Info**: Current page, total pages, has more results

### Search Suggestions
- **Intelligent Matching**: Relevance-based scoring
- **Multiple Types**: Transaction, account, contact, merchant, category suggestions
- **Partial Matching**: Works with partial search terms
- **Scoring System**: Relevance scores for better suggestions

## Consent Requirements

All search endpoints require specific consent scopes:

- **TRANSACTIONS**: Required for transaction search and related endpoints
- **ACCOUNTS**: Required for account search and related endpoints
- **PROFILE**: Required for contact search and related endpoints
- **Multiple Scopes**: Global search and suggestions require multiple scopes

## Error Handling

The module provides comprehensive error handling:

- **400 Bad Request**: Invalid query parameters
- **401 Unauthorized**: Missing or invalid JWT token
- **403 Forbidden**: Insufficient consent scopes
- **422 Unprocessable Entity**: Validation errors in query parameters

## Sample Data

The module includes sample data for testing:

- **Sample Transactions**: 5 transactions with different categories, amounts, and merchants
- **Sample Accounts**: 3 accounts with different types and balances
- **Sample Contacts**: 4 contacts with different types and banks
- **Realistic Data**: All sample data represents realistic banking scenarios

## Security Features

- JWT authentication required for all endpoints
- Consent-based access control
- Input validation and sanitization
- Pagination limits to prevent abuse
- Correlation IDs for request tracking

## Development Notes

- Uses in-memory storage for development purposes
- Includes comprehensive search functionality
- Provides realistic sample data for testing
- All endpoints include correlation IDs for tracking
- Supports advanced filtering and sorting options
- Intelligent search suggestions with relevance scoring
- Built-in pagination for all search results
