# Dashboard Module

This module provides comprehensive dashboard functionality for the Open Banking backend, including overview data, quick actions, notifications, and statistics.

## Features

- **Dashboard Overview**: Aggregate financial data across all accounts
- **Quick Actions**: Easy access to common banking operations
- **Notifications System**: Real-time notifications with read/unread status
- **Statistics**: Financial insights and analytics
- **Consent-Based Access**: All endpoints require appropriate consent scopes

## Endpoints

### Dashboard Overview

#### Get Dashboard Overview
```bash
curl -X GET http://localhost:3001/api/v1/api/dashboard/overview \
  -H "Authorization: Bearer YOUR_JWT_TOKEN" \
  -H "X-Consent-ID: YOUR_CONSENT_ID"
```

**Response:**
```json
{
  "totalBalance": 115420.50,
  "totalAvailable": 115200.00,
  "activeAccounts": 3,
  "transactionsToday": 5,
  "lastUpdated": "2024-01-15T10:30:00Z",
  "correlationId": "corr-123456"
}
```

### Quick Actions

#### Get Quick Actions
```bash
curl -X GET http://localhost:3001/api/v1/api/dashboard/quick-actions \
  -H "Authorization: Bearer YOUR_JWT_TOKEN" \
  -H "X-Consent-ID: YOUR_CONSENT_ID"
```

**Response:**
```json
{
  "actions": [
    {
      "id": "pix-payment",
      "title": "PIX Payment",
      "description": "Send PIX payment",
      "icon": "pix-icon",
      "url": "/dashboard/pix",
      "available": true
    },
    {
      "id": "transfer",
      "title": "Transfer",
      "description": "Transfer between accounts",
      "icon": "transfer-icon",
      "url": "/dashboard/transfer",
      "available": true
    }
  ],
  "correlationId": "corr-123456"
}
```

### Notifications

#### Get Notifications
```bash
curl -X GET http://localhost:3001/api/v1/api/dashboard/notifications \
  -H "Authorization: Bearer YOUR_JWT_TOKEN" \
  -H "X-Consent-ID: YOUR_CONSENT_ID"
```

**Response:**
```json
{
  "notifications": [
    {
      "id": "notif-1",
      "type": "payment",
      "title": "Payment Completed",
      "message": "Your PIX payment to João Silva was completed",
      "timestamp": "2024-01-15T14:30:30Z",
      "read": false,
      "priority": "medium",
      "actionUrl": "/dashboard/payments",
      "actionText": "View Details"
    }
  ],
  "unreadCount": 3,
  "correlationId": "corr-123456"
}
```

#### Mark Notification as Read
```bash
curl -X POST http://localhost:3001/api/v1/api/dashboard/notifications/notif-1/read \
  -H "Authorization: Bearer YOUR_JWT_TOKEN" \
  -H "X-Consent-ID: YOUR_CONSENT_ID"
```

**Response:**
```json
{
  "success": true,
  "notification": {
    "id": "notif-1",
    "type": "payment",
    "title": "Payment Completed",
    "message": "Your PIX payment to João Silva was completed",
    "timestamp": "2024-01-15T14:30:30Z",
    "read": true,
    "priority": "medium",
    "actionUrl": "/dashboard/payments",
    "actionText": "View Details"
  },
  "correlationId": "corr-123456"
}
```

#### Mark All Notifications as Read
```bash
curl -X POST http://localhost:3001/api/v1/api/dashboard/notifications/read-all \
  -H "Authorization: Bearer YOUR_JWT_TOKEN" \
  -H "X-Consent-ID: YOUR_CONSENT_ID"
```

**Response:**
```json
{
  "success": true,
  "correlationId": "corr-123456"
}
```

#### Delete Notification
```bash
curl -X DELETE http://localhost:3001/api/v1/api/dashboard/notifications/notif-1 \
  -H "Authorization: Bearer YOUR_JWT_TOKEN" \
  -H "X-Consent-ID: YOUR_CONSENT_ID"
```

**Response:**
```json
{
  "success": true,
  "correlationId": "corr-123456"
}
```

#### Get Notification Counts
```bash
curl -X GET http://localhost:3001/api/v1/api/dashboard/notifications/counts \
  -H "Authorization: Bearer YOUR_JWT_TOKEN" \
  -H "X-Consent-ID: YOUR_CONSENT_ID"
```

**Response:**
```json
{
  "total": 5,
  "unread": 3,
  "byType": {
    "payment": 2,
    "transaction": 1,
    "security": 1,
    "system": 1,
    "promotion": 0
  },
  "correlationId": "corr-123456"
}
```

### Statistics

#### Get Dashboard Statistics
```bash
curl -X GET http://localhost:3001/api/v1/api/dashboard/stats \
  -H "Authorization: Bearer YOUR_JWT_TOKEN" \
  -H "X-Consent-ID: YOUR_CONSENT_ID"
```

**Response:**
```json
{
  "stats": {
    "monthlyIncome": 8500.00,
    "monthlyExpenses": 3200.00,
    "savingsRate": 62.4,
    "monthlyTransactions": 45,
    "averageTransaction": 256.67,
    "topCategory": "Transferência",
    "topMerchant": "Supermercado ABC"
  },
  "correlationId": "corr-123456"
}
```

## Notification Types

The module supports various notification types:

- **payment**: Payment-related notifications
- **transaction**: Transaction alerts and updates
- **security**: Security alerts and login notifications
- **system**: System maintenance and updates
- **promotion**: Promotional offers and deals

## Quick Action Types

Available quick actions:

- **pix-payment**: PIX payment functionality
- **transfer**: Account transfers
- **bill-payment**: Bill and utility payments
- **investment**: Investment management
- **loan**: Loan applications
- **insurance**: Insurance products
- **card-management**: Credit card management
- **statement**: Statement downloads
- **contacts**: Contact management
- **settings**: Account settings

## Consent Requirements

All dashboard endpoints require specific consent scopes:

- **ACCOUNTS**: Required for overview and statistics
- **BALANCES**: Required for overview
- **TRANSACTIONS**: Required for statistics
- **ANALYTICS**: Required for statistics
- **PROFILE**: Required for quick actions and notifications

## Error Handling

The module provides comprehensive error handling:

- **400 Bad Request**: Invalid request parameters
- **401 Unauthorized**: Missing or invalid JWT token
- **403 Forbidden**: Insufficient consent scopes
- **404 Not Found**: Notification not found

## Sample Data

The module includes sample data for testing:

- **Sample Notifications**: 5 pre-created notifications with different types and priorities
- **Quick Actions**: 10 predefined quick actions with availability status
- **Statistics**: Mock financial statistics for demonstration

## Security Features

- JWT authentication required for all endpoints
- Consent-based access control
- Notification priority levels (low, medium, high)
- Read/unread status tracking
- Action URLs for notification responses
- Quick actions include availability status and badge counts

## Development Notes

- Uses in-memory storage for development purposes
- Includes comprehensive notification management
- Provides realistic sample data for testing
- All endpoints include correlation IDs for tracking
- Supports notification actions with URLs and text
- Quick actions include availability status and badge counts
