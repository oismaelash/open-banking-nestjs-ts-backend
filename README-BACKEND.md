# 🏦 Open Banking Backend API

Backend API to support the **Open Banking** frontend application with authentication, consent management, account data, and PIX payment processing.

## 📋 Objective
This backend API provides all necessary endpoints to support the Open Banking frontend application, including:
- User authentication and authorization
- Consent management and scope validation
- Account and transaction data retrieval
- PIX payment processing and status tracking
- Document verification and KYC compliance
- Security and audit logging

---

## 🚀 Features

### Authentication & Authorization
- **JWT-based authentication** with secure token management
- **Multi-factor authentication** (SMS/Email verification)
- **Scope-based authorization** for Open Banking compliance
- **Session management** with secure logout
- **Password security** with strong validation and hashing

### User Management
- **Complete user registration** with 9-step KYC process
- **Document verification** with file upload support
- **Address validation** with ZIP code integration
- **Biometric enrollment** for enhanced security
- **Account recovery** with security questions

### Consent Management
- **Granular permission control** for different data access levels
- **Consent duration management** with configurable validity periods
- **Consent history tracking** with audit logs
- **Consent revocation** capabilities
- **Third-party application integration**

### Account & Transaction Data
- **Multi-account support** (checking, savings, investment)
- **Real-time balance information** with availability status
- **Transaction history** with detailed categorization
- **Balance trend analysis** with historical data
- **Account statement generation** in multiple formats

### PIX Payment System
- **All PIX key types** support (CPF, CNPJ, email, phone, random)
- **QR Code generation and scanning**
- **Payment scheduling** (immediate and future dates)
- **Transaction limits** and fee calculation
- **Payment status tracking** with real-time updates
- **Receipt generation** and proof of payment

---

## ☁️ AWS Services Architecture

### 🗄️ Data Storage & Management
- **Amazon RDS (PostgreSQL)** - Primary database for user data, accounts, transactions
- **Amazon DynamoDB** - NoSQL database for session management and real-time data
- **Amazon ElastiCache (Redis)** - Caching layer for session data and API responses
- **Amazon S3** - Document storage for KYC files, receipts, and statements
- **Amazon Glacier** - Long-term archival storage for compliance documents

### 🔐 Security & Identity
- **AWS Cognito** - User authentication, registration, and MFA
- **AWS IAM** - Role-based access control and API security
- **AWS KMS** - Encryption key management for sensitive data
- **AWS Secrets Manager** - Secure storage of API keys and credentials
- **AWS Certificate Manager** - SSL/TLS certificates for HTTPS

### 📧 Communication Services
- **Amazon SES** - Email verification and notifications
- **Amazon SNS** - SMS verification and push notifications
- **Amazon SQS** - Message queuing for async operations

### 🔍 Monitoring & Analytics
- **Amazon CloudWatch** - Application monitoring and logging
- **AWS X-Ray** - Distributed tracing and performance analysis
- **Amazon CloudTrail** - API call logging and audit trails
- **Amazon QuickSight** - Business intelligence and analytics dashboards

### 🚀 Compute & API Management
- **AWS Lambda** - Serverless functions for background processing
- **Amazon API Gateway** - API management, rate limiting, and documentation
- **AWS App Runner** or **ECS Fargate** - Containerized application hosting
- **AWS Step Functions** - Workflow orchestration for complex processes

### 🔄 Integration & External APIs
- **AWS EventBridge** - Event-driven architecture for real-time updates
- **Amazon MQ** - Message broker for PIX payment processing
- **AWS Systems Manager** - Parameter store for configuration management

---

## 🛠 Technologies

### Backend Stack
- **NestJS** - Progressive Node.js framework for building scalable server-side applications
- **TypeScript** for type safety and enhanced developer experience
- **AWS SDK v3** for AWS service integration
- **JWT** for authentication tokens
- **bcrypt** for password hashing
- **Multer** for file uploads
- **Joi** or **Zod** for request validation
- **Winston** for structured logging
- **Jest** for testing
- **Docker** for containerization

### NestJS Framework Features
- **Decorators** for clean, declarative code
- **Dependency Injection** for modular architecture
- **Guards** for authentication and authorization
- **Interceptors** for request/response transformation
- **Pipes** for data validation and transformation
- **Exception Filters** for centralized error handling
- **OpenAPI/Swagger** integration for API documentation
- **Microservices** support for scalable architecture

### AWS Services Integration
- **AWS Cognito** for user authentication and management
- **Amazon RDS** for relational data storage
- **Amazon S3** for file storage and document management
- **Amazon SES** for email services
- **Amazon SNS** for SMS and push notifications
- **Amazon CloudWatch** for monitoring and logging
- **AWS Lambda** for serverless processing
- **Amazon API Gateway** for API management

### External Integrations
- **ViaCEP API** for Brazilian address validation
- **PIX API** for payment processing
- **Document Verification API** for KYC
- **Bank APIs** for account data (simulated)

---

## 📡 API Endpoints

### 🔐 Authentication Endpoints

#### POST `/api/auth/signup`
**User Registration - Step 1: Personal Information**
```json
{
  "fullName": "João Silva Santos",
  "cpf": "123.456.789-00",
  "dateOfBirth": "15/03/1990"
}
```
**Response:**
```json
{
  "success": true,
  "message": "Personal information saved",
  "step": 1,
  "correlationId": "corr-123456"
}
```

#### POST `/api/auth/signup/contact`
**User Registration - Step 2: Contact Details**
```json
{
  "email": "joao@email.com",
  "phoneNumber": "+55 11 99999-9999"
}
```
**Response:**
```json
{
  "success": true,
  "message": "Contact details saved",
  "step": 2,
  "correlationId": "corr-123456"
}
```

#### POST `/api/auth/signup/verify-email`
**Email Verification**
```json
{
  "email": "joao@email.com",
  "code": "123456"
}
```

#### POST `/api/auth/signup/verify-phone`
**Phone Verification**
```json
{
  "phoneNumber": "+55 11 99999-9999",
  "code": "123456"
}
```

#### POST `/api/auth/signup/send-email-code`
**Send Email Verification Code**
```json
{
  "email": "joao@email.com"
}
```

#### POST `/api/auth/signup/send-phone-code`
**Send SMS Verification Code**
```json
{
  "phoneNumber": "+55 11 99999-9999"
}
```

#### POST `/api/auth/signup/address`
**User Registration - Step 3: Address Information**
```json
{
  "street": "Rua das Flores",
  "number": "123",
  "complement": "Apto 45",
  "neighborhood": "Centro",
  "city": "São Paulo",
  "state": "SP",
  "zipCode": "01234-567"
}
```

#### POST `/api/auth/signup/documents`
**User Registration - Step 4: Document Verification**
```json
{
  "documentType": "rg",
  "documentFile": "base64_encoded_file_or_multipart"
}
```

#### POST `/api/auth/signup/password`
**User Registration - Step 5: Password Security**
```json
{
  "password": "SecurePassword123!",
  "confirmPassword": "SecurePassword123!"
}
```

#### POST `/api/auth/signup/terms`
**User Registration - Step 6: Terms & Conditions**
```json
{
  "acceptTerms": true,
  "acceptPrivacy": true,
  "acceptMarketing": false
}
```

#### POST `/api/auth/signup/security-questions`
**User Registration - Step 7: Security Questions**
```json
{
  "securityQuestion1": "What was your first pet's name?",
  "securityAnswer1": "Rex",
  "securityQuestion2": "In which city were you born?",
  "securityAnswer2": "São Paulo"
}
```

#### POST `/api/auth/signup/biometric`
**User Registration - Step 8: Biometric Setup**
```json
{
  "enableBiometric": true,
  "biometricType": "fingerprint",
  "biometricData": "encrypted_biometric_data"
}
```

#### POST `/api/auth/signup/complete`
**User Registration - Step 9: Complete Registration**
```json
{
  "userId": "user-123"
}
```

#### POST `/api/auth/login`
**User Login**
```json
{
  "identifier": "joao@email.com",
  "password": "SecurePassword123!",
  "rememberMe": false,
  "twoFactorCode": "123456"
}
```
**Response:**
```json
{
  "success": true,
  "token": "jwt_token_here",
  "user": {
    "id": "user-123",
    "fullName": "João Silva Santos",
    "email": "joao@email.com",
    "cpf": "123.456.789-00"
  },
  "correlationId": "corr-123456"
}
```

#### POST `/api/auth/logout`
**User Logout**
```json
{
  "token": "jwt_token_here"
}
```

#### POST `/api/auth/refresh`
**Refresh Token**
```json
{
  "refreshToken": "refresh_token_here"
}
```

### 🔐 Consent Management Endpoints

#### POST `/api/consent/create`
**Create New Consent**
```json
{
  "scopes": ["accounts", "balances", "transactions", "payments"],
  "duration": "30",
  "acceptTerms": true,
  "thirdPartyApp": {
    "name": "Finance App",
    "description": "Personal finance management app"
  }
}
```
**Response:**
```json
{
  "success": true,
  "consentId": "consent-123",
  "scopes": ["accounts", "balances", "transactions", "payments"],
  "expiresAt": "2024-02-15T10:30:00Z",
  "correlationId": "corr-123456"
}
```

#### GET `/api/consent/{consentId}`
**Get Consent Details**
**Response:**
```json
{
  "consentId": "consent-123",
  "scopes": ["accounts", "balances", "transactions", "payments"],
  "status": "active",
  "createdAt": "2024-01-15T10:30:00Z",
  "expiresAt": "2024-02-15T10:30:00Z",
  "lastUsed": "2024-01-15T14:30:00Z"
}
```

#### PUT `/api/consent/{consentId}`
**Update Consent**
```json
{
  "scopes": ["accounts", "balances"],
  "duration": "7"
}
```

#### DELETE `/api/consent/{consentId}`
**Revoke Consent**

#### GET `/api/consent/history`
**Get Consent History**
**Response:**
```json
{
  "consents": [
    {
      "consentId": "consent-123",
      "scopes": ["accounts", "balances"],
      "status": "revoked",
      "createdAt": "2024-01-10T10:30:00Z",
      "revokedAt": "2024-01-15T14:30:00Z"
    }
  ]
}
```

### 💰 Account & Transaction Endpoints

#### GET `/api/accounts`
**Get User Accounts**
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
      "lastUpdated": "2024-01-15T10:30:00Z"
    }
  ],
  "correlationId": "corr-123456"
}
```

#### GET `/api/accounts/{accountId}`
**Get Account Details**
**Response:**
```json
{
  "id": "account-1",
  "type": "checking",
  "name": "Conta Corrente Principal",
  "number": "****1234",
  "balance": 15420.50,
  "availableBalance": 15200.00,
  "status": "active",
  "bank": "Banco do Brasil",
  "openingDate": "2020-03-15T00:00:00Z",
  "monthlyFee": 0.00,
  "dailyLimit": 10000,
  "monthlyLimit": 50000,
  "lastUpdated": "2024-01-15T10:30:00Z"
}
```

#### GET `/api/accounts/{accountId}/transactions`
**Get Account Transactions**
**Query Parameters:**
- `startDate`: Start date for filtering
- `endDate`: End date for filtering
- `category`: Transaction category filter
- `type`: Transaction type (credit/debit)
- `limit`: Number of transactions to return
- `offset`: Pagination offset

**Response:**
```json
{
  "transactions": [
    {
      "id": "txn-1",
      "date": "2024-01-15T14:30:00Z",
      "description": "Pagamento PIX - João Silva",
      "category": "Transferência",
      "amount": 150.00,
      "type": "debit",
      "status": "completed",
      "merchant": "João Silva",
      "accountId": "account-1"
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

#### GET `/api/accounts/{accountId}/balance-history`
**Get Balance History**
**Query Parameters:**
- `startDate`: Start date for filtering
- `endDate`: End date for filtering
- `interval`: Data interval (daily, weekly, monthly)

**Response:**
```json
{
  "balanceHistory": [
    {
      "date": "2024-01-15",
      "balance": 15420.50,
      "availableBalance": 15200.00
    }
  ],
  "correlationId": "corr-123456"
}
```

#### GET `/api/accounts/{accountId}/statement`
**Get Account Statement**
**Query Parameters:**
- `startDate`: Start date for statement
- `endDate`: End date for statement
- `format`: Output format (pdf, csv, json)

**Response:** File download or JSON data

### 💸 PIX Payment Endpoints

#### POST `/api/pix/payment`
**Create PIX Payment**
```json
{
  "pixKey": "+55 11 99999-9999",
  "pixKeyType": "phone",
  "recipientName": "João Silva",
  "amount": 150.00,
  "description": "Pagamento para João Silva",
  "scheduledDate": "2024-01-15T14:30:00Z",
  "category": "Transferência",
  "accountId": "account-1"
}
```
**Response:**
```json
{
  "success": true,
  "paymentId": "PIX123456789",
  "status": "pending",
  "amount": 150.00,
  "fee": 0.00,
  "estimatedCompletion": "2024-01-15T14:30:30Z",
  "correlationId": "corr-123456"
}
```

#### GET `/api/pix/payment/{paymentId}`
**Get Payment Status**
**Response:**
```json
{
  "paymentId": "PIX123456789",
  "status": "completed",
  "amount": 150.00,
  "recipientName": "João Silva",
  "pixKey": "+55 11 99999-9999",
  "pixKeyType": "phone",
  "description": "Pagamento para João Silva",
  "category": "Transferência",
  "initiatedAt": "2024-01-15T14:30:00Z",
  "processedAt": "2024-01-15T14:30:15Z",
  "completedAt": "2024-01-15T14:30:30Z",
  "fee": 0.00,
  "accountId": "account-1",
  "bank": "Banco do Brasil",
  "correlationId": "corr-123456"
}
```

#### GET `/api/pix/payment/{paymentId}/receipt`
**Get Payment Receipt**
**Query Parameters:**
- `format`: Output format (pdf, json)

**Response:** File download or JSON data

#### POST `/api/pix/qr-code/generate`
**Generate PIX QR Code**
```json
{
  "pixKey": "+55 11 99999-9999",
  "pixKeyType": "phone",
  "recipientName": "João Silva",
  "amount": 150.00,
  "description": "Pagamento para João Silva"
}
```
**Response:**
```json
{
  "qrCode": "base64_encoded_qr_code",
  "qrCodeText": "pix_qr_code_text",
  "correlationId": "corr-123456"
}
```

#### POST `/api/pix/qr-code/scan`
**Scan PIX QR Code**
```json
{
  "qrCodeImage": "base64_encoded_image"
}
```
**Response:**
```json
{
  "pixKey": "+55 11 99999-9999",
  "pixKeyType": "phone",
  "recipientName": "João Silva",
  "amount": 150.00,
  "description": "Pagamento para João Silva",
  "correlationId": "corr-123456"
}
```

#### GET `/api/pix/contacts`
**Get PIX Contacts**
**Response:**
```json
{
  "contacts": [
    {
      "type": "phone",
      "value": "+55 11 99999-9999",
      "name": "João Silva",
      "bank": "Banco do Brasil"
    }
  ],
  "correlationId": "corr-123456"
}
```

#### POST `/api/pix/contacts`
**Add PIX Contact**
```json
{
  "type": "phone",
  "value": "+55 11 99999-9999",
  "name": "João Silva",
  "bank": "Banco do Brasil"
}
```

#### DELETE `/api/pix/contacts/{contactId}`
**Remove PIX Contact**

#### GET `/api/pix/limits`
**Get PIX Limits**
**Response:**
```json
{
  "dailyLimit": 10000,
  "monthlyLimit": 50000,
  "usedToday": 1500,
  "usedThisMonth": 5000,
  "remainingToday": 8500,
  "remainingThisMonth": 45000,
  "correlationId": "corr-123456"
}
```

### 📊 Dashboard Endpoints

#### GET `/api/dashboard/overview`
**Get Dashboard Overview**
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

#### GET `/api/dashboard/quick-actions`
**Get Quick Actions**
**Response:**
```json
{
  "actions": [
    {
      "id": "pix-payment",
      "title": "PIX Payment",
      "description": "Send PIX payment",
      "icon": "pix-icon",
      "url": "/dashboard/pix"
    }
  ],
  "correlationId": "corr-123456"
}
```

#### GET `/api/dashboard/notifications`
**Get Notifications**
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
      "read": false
    }
  ],
  "correlationId": "corr-123456"
}
```

### 🔍 Search & Filter Endpoints

#### GET `/api/search/transactions`
**Search Transactions**
**Query Parameters:**
- `q`: Search query
- `accountId`: Filter by account
- `startDate`: Start date filter
- `endDate`: End date filter
- `category`: Category filter
- `type`: Transaction type filter
- `minAmount`: Minimum amount filter
- `maxAmount`: Maximum amount filter
- `limit`: Number of results
- `offset`: Pagination offset

**Response:**
```json
{
  "transactions": [...],
  "pagination": {
    "total": 150,
    "limit": 20,
    "offset": 0,
    "hasMore": true
  },
  "correlationId": "corr-123456"
}
```

### 📄 Document & File Endpoints

#### POST `/api/documents/upload`
**Upload Document**
```json
{
  "documentType": "rg",
  "file": "multipart_file_data"
}
```
**Response:**
```json
{
  "documentId": "doc-123",
  "filename": "rg_joao_silva.pdf",
  "size": 1024000,
  "uploadedAt": "2024-01-15T10:30:00Z",
  "correlationId": "corr-123456"
}
```

#### GET `/api/documents/{documentId}`
**Get Document**
**Response:** File download

#### DELETE `/api/documents/{documentId}`
**Delete Document**

### 🔧 Utility Endpoints

#### GET `/api/utils/cep/{cep}`
**Get Address by ZIP Code**
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
  "correlationId": "corr-123456"
}
```

#### GET `/api/utils/validate-cpf/{cpf}`
**Validate CPF**
**Response:**
```json
{
  "valid": true,
  "formatted": "123.456.789-00",
  "correlationId": "corr-123456"
}
```

#### GET `/api/utils/validate-email/{email}`
**Validate Email**
**Response:**
```json
{
  "valid": true,
  "domain": "email.com",
  "correlationId": "corr-123456"
}
```

### 📊 Analytics Endpoints

#### GET `/api/analytics/transactions`
**Get Transaction Analytics**
**Query Parameters:**
- `startDate`: Start date for analysis
- `endDate`: End date for analysis
- `accountId`: Filter by account
- `groupBy`: Grouping (day, week, month, category)

**Response:**
```json
{
  "totalTransactions": 150,
  "totalAmount": 25000.00,
  "averageAmount": 166.67,
  "byCategory": [
    {
      "category": "Transferência",
      "count": 50,
      "amount": 10000.00
    }
  ],
  "byDate": [
    {
      "date": "2024-01-15",
      "count": 5,
      "amount": 1000.00
    }
  ],
  "correlationId": "corr-123456"
}
```

---

## 🔐 Security Considerations

### Authentication & Authorization
- **AWS Cognito** for user authentication and MFA
- **AWS IAM** for role-based access control
- **JWT tokens** with secure signing and expiration
- **Refresh token rotation** for enhanced security
- **Rate limiting** on authentication endpoints
- **Session management** with secure logout

### Data Protection
- **AWS KMS** for encryption key management
- **AWS Secrets Manager** for secure credential storage
- **HTTPS enforcement** for all endpoints
- **Request validation** with strict schemas
- **Input sanitization** to prevent injection attacks
- **CORS configuration** for frontend integration

### Audit & Logging
- **AWS CloudTrail** for API call logging
- **AWS CloudWatch** for application monitoring
- **AWS X-Ray** for distributed tracing
- **Correlation IDs** for request tracking
- **Structured logging** with Winston
- **Audit trails** for sensitive operations
- **Error tracking** with Sentry integration

### Compliance
- **AWS Artifact** for compliance reports
- **AWS Config** for compliance monitoring
- **GDPR compliance** for data handling
- **LGPD compliance** for Brazilian data protection
- **Open Banking standards** adherence
- **PCI DSS compliance** for payment data
- **SOC 2 compliance** for security controls

---

## 📋 Environment Variables

```env
# Server Configuration
PORT=3001
NODE_ENV=development
API_VERSION=v1

# AWS Configuration
AWS_REGION=us-east-1
AWS_ACCESS_KEY_ID=your-aws-access-key
AWS_SECRET_ACCESS_KEY=your-aws-secret-key

# AWS Cognito
AWS_COGNITO_USER_POOL_ID=us-east-1_xxxxxxxxx
AWS_COGNITO_CLIENT_ID=your-cognito-client-id
AWS_COGNITO_CLIENT_SECRET=your-cognito-client-secret

# AWS RDS (PostgreSQL)
AWS_RDS_HOST=your-rds-endpoint.region.rds.amazonaws.com
AWS_RDS_PORT=5432
AWS_RDS_DATABASE=openbanking
AWS_RDS_USERNAME=your-rds-username
AWS_RDS_PASSWORD=your-rds-password

# AWS S3
AWS_S3_BUCKET=openbanking-documents
AWS_S3_REGION=us-east-1
AWS_S3_ACCESS_KEY_ID=your-s3-access-key
AWS_S3_SECRET_ACCESS_KEY=your-s3-secret-key

# AWS ElastiCache (Redis)
AWS_ELASTICACHE_ENDPOINT=your-elasticache-endpoint.cache.amazonaws.com
AWS_ELASTICACHE_PORT=6379

# AWS SES (Email)
AWS_SES_REGION=us-east-1
AWS_SES_ACCESS_KEY_ID=your-ses-access-key
AWS_SES_SECRET_ACCESS_KEY=your-ses-secret-key
AWS_SES_FROM_EMAIL=noreply@yourdomain.com

# AWS SNS (SMS)
AWS_SNS_REGION=us-east-1
AWS_SNS_ACCESS_KEY_ID=your-sns-access-key
AWS_SNS_SECRET_ACCESS_KEY=your-sns-secret-key

# AWS KMS
AWS_KMS_KEY_ID=your-kms-key-id
AWS_KMS_REGION=us-east-1

# AWS Secrets Manager
AWS_SECRETS_MANAGER_REGION=us-east-1
AWS_SECRETS_MANAGER_SECRET_NAME=openbanking-secrets

# AWS CloudWatch
AWS_CLOUDWATCH_REGION=us-east-1
AWS_CLOUDWATCH_LOG_GROUP=/aws/openbanking/api
AWS_CLOUDWATCH_LOG_STREAM=application-logs

# External APIs
VIACEP_API_URL=https://viacep.com.br/ws
PIX_API_URL=https://pix-api.example.com
PIX_API_KEY=your-pix-api-key

# JWT Configuration
JWT_SECRET=your-super-secret-jwt-key
JWT_EXPIRES_IN=1h
JWT_REFRESH_EXPIRES_IN=7d

# Monitoring
SENTRY_DSN=your-sentry-dsn
LOG_LEVEL=info

# Security
BCRYPT_ROUNDS=12
RATE_LIMIT_WINDOW=15m
RATE_LIMIT_MAX_REQUESTS=100
```

---

## 🚀 Getting Started

### Prerequisites
- Node.js 18+ 
- AWS CLI configured with appropriate permissions
- Docker (optional)

### AWS Setup
```bash
# Install AWS CLI
curl "https://awscli.amazonaws.com/awscli-exe-linux-x86_64.zip" -o "awscliv2.zip"
unzip awscliv2.zip
sudo ./aws/install

# Configure AWS CLI
aws configure

# Create AWS resources using CloudFormation or Terraform
aws cloudformation create-stack --stack-name openbanking-backend --template-body file://infrastructure/cloudformation.yaml
```

### Installation
```bash
# Clone the repository
git clone https://github.com/your-org/open-banking-backend.git
cd open-banking-backend

# Install NestJS CLI globally (if not already installed)
npm install -g @nestjs/cli

# Install dependencies
npm install

# Set up environment variables
cp .env.example .env
# Edit .env with your AWS configuration

# Run database migrations
npm run migration:run

# Start the development server
npm run start:dev
```

### NestJS CLI Commands
```bash
# Generate a new controller
nest generate controller auth

# Generate a new service
nest generate service auth

# Generate a new module
nest generate module auth

# Generate a new guard
nest generate guard auth

# Generate a new interceptor
nest generate interceptor logging

# Generate a new pipe
nest generate pipe validation

# Generate a new filter
nest generate filter http-exception
```

### Docker Setup
```bash
# Build and run with Docker Compose
docker-compose up -d

# Run migrations
docker-compose exec api npm run migration:run

# Seed database
docker-compose exec api npm run seed
```

### Testing
```bash
# Run all tests
npm run test

# Run tests with coverage
npm run test:cov

# Run e2e tests
npm run test:e2e

# Run specific test file
npm run test auth.service.spec.ts
```

---

## 📚 API Documentation

### Swagger/OpenAPI
The API documentation is automatically generated using NestJS's built-in Swagger integration and is available at `/api-docs` when running in development mode.

### NestJS Swagger Setup
```typescript
// main.ts
import { NestFactory } from '@nestjs/core';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  const config = new DocumentBuilder()
    .setTitle('Open Banking API')
    .setDescription('Open Banking backend API documentation')
    .setVersion('1.0')
    .addBearerAuth()
    .build();
  
  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api-docs', app, document);

  await app.listen(3001);
}
bootstrap();
```

### Postman Collection
A Postman collection with all endpoints is available in the `docs/postman` directory.

### SDK Libraries
- **JavaScript/TypeScript**: Available via npm
- **Python**: Available via pip
- **Java**: Available via Maven
- **PHP**: Available via Composer

---

## 🔧 Development Guidelines

### Code Style
- **ESLint** and **Prettier** for code formatting
- **TypeScript** strict mode enabled
- **Conventional commits** for commit messages
- **JSDoc** comments for all public functions
- **NestJS decorators** for clean, declarative code

### NestJS Project Structure
```
src/
├── auth/                    # Authentication module
│   ├── auth.controller.ts
│   ├── auth.service.ts
│   ├── auth.module.ts
│   ├── guards/
│   ├── strategies/
│   └── dto/
├── users/                   # Users module
│   ├── users.controller.ts
│   ├── users.service.ts
│   ├── users.module.ts
│   ├── entities/
│   └── dto/
├── accounts/                # Accounts module
│   ├── accounts.controller.ts
│   ├── accounts.service.ts
│   ├── accounts.module.ts
│   ├── entities/
│   └── dto/
├── pix/                     # PIX payments module
│   ├── pix.controller.ts
│   ├── pix.service.ts
│   ├── pix.module.ts
│   ├── entities/
│   └── dto/
├── common/                  # Shared utilities
│   ├── decorators/
│   ├── filters/
│   ├── guards/
│   ├── interceptors/
│   └── pipes/
├── config/                  # Configuration
│   ├── database.config.ts
│   ├── aws.config.ts
│   └── app.config.ts
├── app.module.ts
├── main.ts
└── app.controller.ts
```

### NestJS Best Practices
- **Use DTOs** for request/response validation
- **Implement Guards** for authentication and authorization
- **Use Interceptors** for logging and transformation
- **Create Custom Pipes** for data validation
- **Implement Exception Filters** for error handling
- **Use Dependency Injection** for service management
- **Organize by Modules** for better code organization
- **Use Repository Pattern** for data access

### Testing Strategy
- **Unit tests** for all business logic using Jest
- **Integration tests** for API endpoints
- **E2E tests** for critical user flows
- **Performance tests** for high-traffic endpoints
- **Test coverage** minimum 80%

### Deployment
- **AWS CodePipeline** for CI/CD
- **AWS CodeDeploy** for deployment automation
- **AWS App Runner** or **ECS Fargate** for containerized deployment
- **Blue-green deployment** strategy
- **Health checks** for all services
- **Rollback procedures** for failed deployments

---

## 📞 Support

### Documentation
- **API Reference**: `/api-docs`
- **Integration Guide**: `docs/integration.md`
- **Troubleshooting**: `docs/troubleshooting.md`
- **AWS Architecture**: `docs/aws-architecture.md`

### Contact
- **Technical Support**: tech-support@openbanking.com
- **Security Issues**: security@openbanking.com
- **API Questions**: api-support@openbanking.com

### Status Page
- **Service Status**: https://status.openbanking.com
- **Incident History**: https://status.openbanking.com/history
- **Maintenance Schedule**: https://status.openbanking.com/maintenance

---

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

---

## 🤝 Contributing

Please read [CONTRIBUTING.md](CONTRIBUTING.md) for details on our code of conduct and the process for submitting pull requests.

---

## 📈 Roadmap

### Phase 1 (Current)
- ✅ User authentication and registration
- ✅ Consent management
- ✅ Account and transaction data
- ✅ PIX payment processing

### Phase 2 (Next)
- 🔄 Real-time notifications
- 🔄 Advanced analytics
- 🔄 Multi-bank integration
- 🔄 Mobile app support

### Phase 3 (Future)
- 📋 AI-powered insights
- 📋 Voice banking
- 📋 Blockchain integration
- 📋 International payments 