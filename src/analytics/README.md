# Analytics Endpoints Module

This module provides comprehensive analytics and insights for the Open Banking API, including transaction analytics, spending patterns, financial insights, and budget analysis.

## Features

- **Transaction Analytics**: Detailed analysis of transaction data with multiple grouping options
- **Spending Patterns**: AI-powered identification of recurring spending patterns
- **Financial Insights**: Intelligent insights and recommendations based on spending behavior
- **Budget Analysis**: Real-time budget tracking and analysis by category
- **Trend Analysis**: Historical trend analysis for spending, income, and savings
- **Advanced Filtering**: Multiple filter options for date ranges, categories, amounts, and transaction types
- **Data Visualization**: Structured data ready for charts and dashboards
- **Consent-Based Access**: All analytics require appropriate consent scopes

## API Endpoints

### Get Transaction Analytics
```http
GET /api/analytics/transactions
Authorization: Bearer <jwt-token>
X-Consent-ID: <consent-id>
```

**Query Parameters:**
- `startDate`: Start date for analysis (YYYY-MM-DD)
- `endDate`: End date for analysis (YYYY-MM-DD)
- `accountId`: Filter by specific account ID
- `groupBy`: Grouping type (day, week, month, category, merchant, account)
- `transactionType`: Transaction type filter (credit, debit, all)
- `minAmount`: Minimum amount filter
- `maxAmount`: Maximum amount filter
- `categories`: Category filter (comma-separated)

**Response:**
```json
{
  "totalTransactions": 150,
  "totalAmount": 25000.00,
  "averageAmount": 166.67,
  "largestTransaction": 5000.00,
  "smallestTransaction": 10.00,
  "byCategory": [
    {
      "category": "Transferência",
      "count": 50,
      "amount": 10000.00,
      "percentage": 33.33,
      "averageAmount": 200.00
    }
  ],
  "byDate": [
    {
      "date": "2024-01-15",
      "count": 5,
      "amount": 1000.00,
      "averageAmount": 200.00
    }
  ],
  "byMerchant": [
    {
      "merchant": "Supermercado ABC",
      "count": 25,
      "amount": 2500.00,
      "percentage": 10.00
    }
  ],
  "correlationId": "corr-123456789"
}
```

### Get Spending Patterns
```http
GET /api/analytics/spending-patterns
Authorization: Bearer <jwt-token>
X-Consent-ID: <consent-id>
```

**Response:**
```json
{
  "patterns": [
    {
      "patternType": "monthly_recurring",
      "description": "Monthly subscription payment to Netflix",
      "averageAmount": 39.90,
      "frequency": "monthly",
      "confidence": 95
    }
  ],
  "totalPatterns": 3,
  "correlationId": "corr-123456789"
}
```

### Get Financial Insights
```http
GET /api/analytics/financial-insights
Authorization: Bearer <jwt-token>
X-Consent-ID: <consent-id>
```

**Response:**
```json
{
  "insights": [
    {
      "insightType": "spending_increase",
      "title": "Spending Increase Detected",
      "description": "Your spending has increased by 15% compared to last month",
      "severity": "medium",
      "recommendation": "Review your recent transactions and consider setting spending limits",
      "timestamp": "2024-01-15T10:30:00Z"
    }
  ],
  "totalInsights": 5,
  "correlationId": "corr-123456789"
}
```

### Get Budget Analysis
```http
GET /api/analytics/budget-analysis
Authorization: Bearer <jwt-token>
X-Consent-ID: <consent-id>
```

**Response:**
```json
{
  "categories": [
    {
      "category": "Alimentação",
      "budgetLimit": 1000.00,
      "actualSpending": 850.00,
      "remainingBudget": 150.00,
      "percentageUsed": 85.00,
      "status": "under_budget"
    }
  ],
  "totalBudget": 5000.00,
  "totalSpending": 4200.00,
  "overallStatus": "under_budget",
  "correlationId": "corr-123456789"
}
```

### Get Trend Analysis
```http
GET /api/analytics/trends/{period}
Authorization: Bearer <jwt-token>
X-Consent-ID: <consent-id>
```

**Response:**
```json
{
  "spendingTrend": 5.2,
  "incomeTrend": 0.0,
  "savingsRate": 15.8,
  "topCategories": ["Alimentação", "Transporte", "Entretenimento"],
  "correlationId": "corr-123456789"
}
```

### Get Analytics Summary
```http
GET /api/analytics/summary
Authorization: Bearer <jwt-token>
X-Consent-ID: <consent-id>
```

**Response:**
```json
{
  "totalSpending": 1145.40,
  "totalIncome": 5000.00,
  "netSavings": 3854.60,
  "topSpendingCategory": "Alimentação",
  "averageTransactionAmount": 768.18,
  "transactionCount": 8,
  "correlationId": "corr-123456789"
}
```

### Get Top Spending Categories
```http
GET /api/analytics/categories/top?limit=5
Authorization: Bearer <jwt-token>
X-Consent-ID: <consent-id>
```

**Response:**
```json
{
  "categories": [
    {
      "category": "Alimentação",
      "amount": 370.00,
      "percentage": 25.0,
      "count": 2
    }
  ],
  "correlationId": "corr-123456789"
}
```

### Get Top Merchants
```http
GET /api/analytics/merchants/top?limit=10
Authorization: Bearer <jwt-token>
X-Consent-ID: <consent-id>
```

**Response:**
```json
{
  "merchants": [
    {
      "merchant": "Supermercado ABC",
      "amount": 250.00,
      "percentage": 4.07,
      "count": 1
    }
  ],
  "correlationId": "corr-123456789"
}
```

## Consent Requirements

All analytics endpoints require the following consent scopes:
- `transactions`: Access to transaction data
- `analytics`: Permission to perform analytics on the data

## Filtering and Grouping Options

### Group By Types
- `day`: Group transactions by day
- `week`: Group transactions by week
- `month`: Group transactions by month
- `category`: Group transactions by category
- `merchant`: Group transactions by merchant
- `account`: Group transactions by account

### Transaction Types
- `credit`: Only credit transactions
- `debit`: Only debit transactions
- `all`: All transactions (default)

### Date Filtering
- `startDate`: Filter transactions from this date onwards
- `endDate`: Filter transactions up to this date
- Both dates should be in YYYY-MM-DD format

### Amount Filtering
- `minAmount`: Minimum transaction amount
- `maxAmount`: Maximum transaction amount
- Both values should be positive numbers

### Category Filtering
- `categories`: Comma-separated list of categories to include
- Example: `categories=Alimentação,Transporte,Entretenimento`

## Usage Examples

### Get Transaction Analytics for Last Month
```bash
curl -X GET "http://localhost:3001/api/v1/api/analytics/transactions?startDate=2024-01-01&endDate=2024-01-31&groupBy=category" \
  -H "Authorization: Bearer valid-jwt-token" \
  -H "X-Consent-ID: valid-consent-id"
```

### Get Spending Patterns
```bash
curl -X GET "http://localhost:3001/api/v1/api/analytics/spending-patterns" \
  -H "Authorization: Bearer valid-jwt-token" \
  -H "X-Consent-ID: valid-consent-id"
```

### Get Financial Insights
```bash
curl -X GET "http://localhost:3001/api/v1/api/analytics/financial-insights" \
  -H "Authorization: Bearer valid-jwt-token" \
  -H "X-Consent-ID: valid-consent-id"
```

### Get Budget Analysis
```bash
curl -X GET "http://localhost:3001/api/v1/api/analytics/budget-analysis" \
  -H "Authorization: Bearer valid-jwt-token" \
  -H "X-Consent-ID: valid-consent-id"
```

### Get Trend Analysis for 30 Days
```bash
curl -X GET "http://localhost:3001/api/v1/api/analytics/trends/30d" \
  -H "Authorization: Bearer valid-jwt-token" \
  -H "X-Consent-ID: valid-consent-id"
```

### Get Analytics Summary
```bash
curl -X GET "http://localhost:3001/api/v1/api/analytics/summary" \
  -H "Authorization: Bearer valid-jwt-token" \
  -H "X-Consent-ID: valid-consent-id"
```

### Get Top 5 Spending Categories
```bash
curl -X GET "http://localhost:3001/api/v1/api/analytics/categories/top?limit=5" \
  -H "Authorization: Bearer valid-jwt-token" \
  -H "X-Consent-ID: valid-consent-id"
```

### Get Top 10 Merchants
```bash
curl -X GET "http://localhost:3001/api/v1/api/analytics/merchants/top?limit=10" \
  -H "Authorization: Bearer valid-jwt-token" \
  -H "X-Consent-ID: valid-consent-id"
```

## Implementation Notes

- **Data Source**: Currently uses mock data for demonstration. In production, integrate with actual transaction databases.
- **Performance**: Consider implementing caching for frequently accessed analytics data.
- **Real-time Updates**: Analytics are calculated on-demand. Consider implementing background jobs for pre-calculated analytics.
- **Data Privacy**: All analytics respect user consent and data privacy regulations.
- **Scalability**: The analytics engine is designed to handle large datasets with efficient filtering and aggregation.

## Error Handling

The module provides detailed error responses:

- **400 Bad Request**: Invalid query parameters (dates, amounts, etc.)
- **401 Unauthorized**: Missing or invalid authentication
- **403 Forbidden**: Insufficient consent scopes
- **404 Not Found**: No data found for the specified criteria

## Security Considerations

- **Consent Validation**: All endpoints validate consent scopes before processing
- **Data Filtering**: User data is filtered to ensure users only see their own analytics
- **Input Validation**: All query parameters are validated to prevent injection attacks
- **Rate Limiting**: Consider implementing rate limiting for analytics endpoints
- **Audit Logging**: All analytics requests are logged for audit purposes

## Future Enhancements

- **Machine Learning**: Implement ML models for better pattern recognition
- **Predictive Analytics**: Add spending predictions and forecasting
- **Real-time Analytics**: Implement real-time analytics with WebSocket support
- **Custom Dashboards**: Allow users to create custom analytics dashboards
- **Export Functionality**: Add support for exporting analytics data in various formats
- **Advanced Visualizations**: Provide chart-ready data for advanced visualizations
