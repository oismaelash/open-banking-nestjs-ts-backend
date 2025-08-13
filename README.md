# 🏦 Open Banking NestJS TypeScript Backend

A comprehensive Open Banking API built with NestJS and TypeScript, providing a complete banking solution with authentication, consent management, account operations, PIX payments, analytics, and more.

## 📋 Table of Contents

- [Overview](#overview)
- [Features](#features)
- [Architecture](#architecture)
- [Technology Stack](#technology-stack)
- [Quick Start](#quick-start)
- [API Documentation](#api-documentation)
- [Modules](#modules)
- [Docker Setup](#docker-setup)
- [Development](#development)
- [Testing](#testing)
- [Deployment](#deployment)
- [Security](#security)
- [Contributing](#contributing)

## 🎯 Overview

This Open Banking backend provides a complete API solution for financial applications, supporting:

- **Multi-step user registration** with KYC compliance
- **JWT-based authentication** with refresh tokens
- **Consent management** for Open Banking compliance
- **Account and transaction management** with real-time data
- **PIX payment processing** with QR code support
- **Advanced analytics** and financial insights
- **Document management** for KYC and compliance
- **Search and filtering** capabilities
- **Dashboard functionality** with notifications
- **Utility services** for validation and system info

## 🚀 Features

### 🔐 Authentication & Security
- **9-step KYC registration process** with document verification
- **JWT authentication** with secure token management
- **Multi-factor authentication** (SMS/Email verification)
- **Password security** with bcrypt hashing
- **Session management** with secure logout
- **Biometric authentication** support

### 💰 Banking Operations
- **Multi-account support** (checking, savings, investment, credit, loan)
- **Real-time balance information** with availability status
- **Transaction history** with detailed categorization
- **Balance trend analysis** with historical data
- **Account statement generation** in multiple formats
- **Money transfers** between accounts

### 💸 PIX Payment System
- **All PIX key types** support (CPF, CNPJ, email, phone, random)
- **QR Code generation and scanning**
- **Payment scheduling** (immediate and future dates)
- **Transaction limits** and fee calculation
- **Payment status tracking** with real-time updates
- **Receipt generation** and proof of payment
- **Contact management** for quick access

### 🔐 Consent Management
- **Granular permission control** for different data access levels
- **Consent duration management** with configurable validity periods
- **Consent history tracking** with audit logs
- **Consent revocation** capabilities
- **Third-party application integration**
- **Scope-based authorization** for Open Banking compliance

### 📊 Analytics & Insights
- **Transaction analytics** with multiple grouping options
- **Spending patterns** identification
- **Financial insights** and recommendations
- **Budget analysis** and tracking
- **Trend analysis** for spending, income, and savings
- **Advanced filtering** and data visualization

### 🔍 Search & Discovery
- **Transaction search** with advanced filtering
- **Account search** by name, type, status
- **Contact search** and management
- **Global search** across all data types
- **Search suggestions** with intelligent autocomplete
- **Pagination** and sorting support

### 📄 Document Management
- **Document upload** with validation and type checking
- **Document storage** with metadata management
- **Document retrieval** with proper headers
- **Document management** (list, delete, update status)
- **Document statistics** and overview
- **Type validation** for various document types

### 📱 Dashboard & Notifications
- **Dashboard overview** with aggregate financial data
- **Quick actions** for common banking operations
- **Notifications system** with read/unread status
- **Statistics** and financial insights
- **Real-time updates** and alerts

### 🛠️ Utility Services
- **CEP (ZIP Code) lookup** for Brazilian addresses
- **CPF/CNPJ validation** with formatting
- **Email and phone validation**
- **System information** and health checks
- **Time utilities** and timezone information

## 🏗️ Architecture

### AWS Services Integration
- **Amazon RDS (PostgreSQL)** - Primary database
- **Amazon DynamoDB** - NoSQL database for sessions
- **Amazon ElastiCache (Redis)** - Caching layer
- **Amazon S3** - Document storage
- **AWS Cognito** - User authentication and MFA
- **AWS KMS** - Encryption key management
- **Amazon SES** - Email services
- **Amazon SNS** - SMS and push notifications
- **Amazon CloudWatch** - Monitoring and logging
- **AWS Lambda** - Serverless functions
- **Amazon API Gateway** - API management

### NestJS Framework Features
- **Decorators** for clean, declarative code
- **Dependency Injection** for modular architecture
- **Guards** for authentication and authorization
- **Interceptors** for request/response transformation
- **Pipes** for data validation and transformation
- **Exception Filters** for centralized error handling
- **OpenAPI/Swagger** integration for API documentation
- **Microservices** support for scalable architecture

## 🛠️ Technology Stack

### Backend
- **NestJS** - Progressive Node.js framework
- **TypeScript** - Type safety and enhanced developer experience
- **AWS SDK v3** - AWS service integration
- **JWT** - Authentication tokens
- **bcrypt** - Password hashing
- **Multer** - File uploads
- **Joi/Zod** - Request validation
- **Winston** - Structured logging
- **Jest** - Testing framework

### Database & Storage
- **PostgreSQL** - Primary relational database
- **Redis** - Caching and session storage
- **MongoDB** - Document storage
- **AWS S3** - File storage

### Message Queues
- **RabbitMQ** - Message broker
- **Apache Kafka** - Event streaming

### Monitoring & Logging
- **Prometheus** - Metrics collection
- **Grafana** - Metrics visualization
- **Elasticsearch** - Log aggregation
- **Kibana** - Log visualization
- **Logstash** - Log processing

### Security
- **Keycloak** - Identity and access management
- **Vault** - Secrets management
- **AWS KMS** - Encryption key management

## 🚀 Quick Start

### Prerequisites
- Node.js 18+
- Docker and Docker Compose
- AWS CLI (for production)

### Local Development Setup

1. **Clone the repository**
```bash
git clone <repository-url>
cd open-banking-nestjs-ts-backend
```

2. **Start all services with Docker**
```bash
docker-compose up -d
```

3. **Install dependencies**
```bash
npm install
```

4. **Set up environment variables**
```bash
cp .env.example .env
# Edit .env with your configuration
```

5. **Run database migrations**
```bash
docker-compose exec api npm run migration:run
```

6. **Seed the database**
```bash
docker-compose exec api npm run seed
```

7. **Start the development server**
```bash
npm run start:dev
```

### Access Points
- **API**: http://localhost:3001
- **API Documentation**: http://localhost:3001/docs
- **pgAdmin**: http://localhost:5050 (admin@openbanking.com / admin)
- **Redis Commander**: http://localhost:8081
- **Mongo Express**: http://localhost:8082
- **RabbitMQ Management**: http://localhost:15672 (admin / admin123)
- **Prometheus**: http://localhost:9090
- **Grafana**: http://localhost:3000 (admin / admin)
- **Keycloak**: http://localhost:8080 (admin / admin)

## 📚 API Documentation

### Authentication Endpoints
- `POST /api/auth/signup` - User registration (9-step process)
- `POST /api/auth/login` - User login
- `POST /api/auth/logout` - User logout
- `POST /api/auth/refresh` - Refresh token
- `GET /api/auth/profile` - Get user profile

### Consent Management
- `POST /api/consent/create` - Create new consent
- `GET /api/consent/{id}` - Get consent details
- `PUT /api/consent/{id}` - Update consent
- `DELETE /api/consent/{id}` - Revoke consent
- `GET /api/consent/history` - Get consent history

### Account & Transactions
- `GET /api/accounts` - Get user accounts
- `GET /api/accounts/{id}` - Get account details
- `GET /api/accounts/{id}/transactions` - Get account transactions
- `GET /api/accounts/{id}/balance-history` - Get balance history
- `POST /api/accounts/{id}/statement` - Generate account statement

### PIX Payments
- `POST /api/pix/payment` - Create PIX payment
- `GET /api/pix/payment/{id}` - Get payment status
- `GET /api/pix/payment/{id}/receipt` - Get payment receipt
- `POST /api/pix/qr-code/generate` - Generate PIX QR code
- `POST /api/pix/qr-code/scan` - Scan PIX QR code
- `GET /api/pix/contacts` - Get PIX contacts
- `GET /api/pix/limits` - Get PIX limits

### Analytics
- `GET /api/analytics/transactions` - Get transaction analytics
- `GET /api/analytics/spending-patterns` - Get spending patterns
- `GET /api/analytics/financial-insights` - Get financial insights
- `GET /api/analytics/budget-analysis` - Get budget analysis
- `GET /api/analytics/trends/{period}` - Get trend analysis

### Search
- `GET /api/search/transactions` - Search transactions
- `GET /api/search/accounts` - Search accounts
- `GET /api/search/contacts` - Search contacts
- `GET /api/search/global` - Global search
- `GET /api/search/suggestions` - Get search suggestions

### Documents
- `POST /api/documents/upload` - Upload document
- `GET /api/documents` - Get user documents
- `GET /api/documents/{id}` - Download document
- `DELETE /api/documents/{id}` - Delete document
- `GET /api/documents/stats/overview` - Get document statistics

### Dashboard
- `GET /api/dashboard/overview` - Get dashboard overview
- `GET /api/dashboard/quick-actions` - Get quick actions
- `GET /api/dashboard/notifications` - Get notifications
- `POST /api/dashboard/notifications/{id}/read` - Mark notification as read
- `GET /api/dashboard/stats` - Get dashboard statistics

### Utilities
- `GET /api/utils/cep/{cep}` - Get address by ZIP code
- `GET /api/utils/validate-cpf/{cpf}` - Validate CPF
- `GET /api/utils/validate-email/{email}` - Validate email
- `GET /api/utils/validate-phone/{phone}` - Validate phone number
- `GET /api/utils/system/info` - Get system information
- `GET /api/utils/health/check` - Health check

## 📦 Modules

### 🔐 Authentication Module (`src/auth/`)
- Multi-step user registration with KYC process
- JWT-based authentication with refresh tokens
- Email and phone verification
- Password security and session management
- Biometric authentication support

### 💰 Accounts Module (`src/accounts/`)
- Multi-account support (checking, savings, investment, credit, loan)
- Real-time balance information
- Transaction history with categorization
- Balance trend analysis
- Account statement generation

### 💸 PIX Module (`src/pix/`)
- PIX payment processing with all key types
- QR code generation and scanning
- Payment scheduling and status tracking
- Contact management
- Limits and fee calculation

### 🔐 Consent Module (`src/consent/`)
- Granular permission control
- Consent duration management
- Consent history tracking
- Third-party application integration
- Scope-based authorization

### 📊 Analytics Module (`src/analytics/`)
- Transaction analytics with multiple grouping options
- Spending patterns identification
- Financial insights and recommendations
- Budget analysis and tracking
- Trend analysis

### 🔍 Search Module (`src/search/`)
- Transaction search with advanced filtering
- Account and contact search
- Global search across all data types
- Search suggestions with intelligent autocomplete
- Pagination and sorting support

### 📄 Documents Module (`src/documents/`)
- Document upload with validation
- Document storage and management
- Document retrieval and download
- Document statistics and overview
- Type validation for various document types

### 📱 Dashboard Module (`src/dashboard/`)
- Dashboard overview with aggregate data
- Quick actions for common operations
- Notifications system
- Statistics and insights

### 🛠️ Utils Module (`src/utils/`)
- CEP (ZIP Code) lookup
- CPF/CNPJ validation
- Email and phone validation
- System information and health checks
- Time utilities

## 🐳 Docker Setup

The project includes a comprehensive Docker setup with all necessary services:

### Database Services
- **PostgreSQL** (port 5432) - Primary database
- **Redis** (port 6379) - Caching and sessions
- **MongoDB** (port 27017) - Document storage

### Message Queues
- **RabbitMQ** (port 5672) - Message broker
- **Apache Kafka** (port 9092) - Event streaming

### Monitoring & Logging
- **Prometheus** (port 9090) - Metrics collection
- **Grafana** (port 3000) - Metrics visualization
- **Elasticsearch** (port 9200) - Log aggregation
- **Kibana** (port 5601) - Log visualization

### Security Services
- **Keycloak** (port 8080) - Identity management
- **Vault** (port 8200) - Secrets management

### Development Tools
- **MailHog** (port 8025) - Email testing
- **LocalStack** (port 4566) - AWS services emulation
- **WireMock** (port 8080) - API mocking

### File Storage
- **MinIO** (port 9001) - S3-compatible storage

## 🧪 Testing

### Run Tests
```bash
# Unit tests
npm run test

# Integration tests
npm run test:e2e

# Test coverage
npm run test:cov

# Specific test file
npm run test auth.controller.spec.ts
```

### Testing with Docker
```bash
# Run tests with all services
docker-compose exec api npm run test:e2e

# Performance testing with JMeter
docker-compose exec jmeter jmeter -n -t /tests/openbanking-api.jmx
```

## 🚀 Deployment

### Production Setup
1. **AWS Infrastructure Setup**
   - Configure AWS services (RDS, S3, Cognito, etc.)
   - Set up CI/CD pipeline with AWS CodePipeline
   - Configure monitoring with CloudWatch

2. **Environment Configuration**
   - Set production environment variables
   - Configure SSL certificates
   - Set up domain and DNS

3. **Database Migration**
   ```bash
   npm run migration:run
   npm run seed
   ```

4. **Deploy Application**
   ```bash
   npm run build
   npm run start:prod
   ```

### Docker Production
```bash
# Build production image
docker build -t openbanking-api:latest .

# Run with production configuration
docker run -d -p 3001:3001 --env-file .env.prod openbanking-api:latest
```

## 🛡️ Security

### Authentication & Authorization
- JWT-based authentication with secure token management
- Multi-factor authentication (SMS/Email)
- Scope-based authorization for Open Banking compliance
- Session management with secure logout
- Password security with bcrypt hashing

### Data Protection
- AWS KMS for encryption key management
- AWS Secrets Manager for secure credential storage
- HTTPS enforcement for all endpoints
- Request validation with strict schemas
- Input sanitization to prevent injection attacks

### Audit & Logging
- AWS CloudTrail for API call logging
- AWS CloudWatch for application monitoring
- AWS X-Ray for distributed tracing
- Correlation IDs for request tracking
- Structured logging with Winston
- Audit trails for sensitive operations

### Compliance
- AWS Artifact for compliance reports
- GDPR compliance for data handling
- LGPD compliance for Brazilian data protection
- Open Banking standards adherence
- PCI DSS compliance for payment data
- SOC 2 compliance for security controls

## 📈 Monitoring & Analytics

### Application Monitoring
- **Prometheus** - Metrics collection and storage
- **Grafana** - Metrics visualization and dashboards
- **CloudWatch** - AWS service monitoring
- **X-Ray** - Distributed tracing

### Logging
- **Elasticsearch** - Log aggregation and storage
- **Kibana** - Log visualization and search
- **Logstash** - Log processing and transformation
- **Filebeat** - Log shipping

### Health Checks
- Application health endpoints
- Database connectivity checks
- External service dependencies
- Performance metrics

## 🔮 Future Enhancements

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

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

### Development Guidelines
- Follow TypeScript best practices
- Use NestJS decorators and patterns
- Write comprehensive tests
- Update documentation
- Follow conventional commits

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🆘 Support

### Documentation
- **API Reference**: http://localhost:3001/docs
- **Integration Guide**: See module-specific READMEs
- **AWS Architecture**: See README-BACKEND.md
- **Docker Setup**: See README-DOCKER.md

### Contact
- **Technical Support**: contato@ismaelnascimento.com
- **Security Issues**: contato@ismaelnascimento.com
- **API Questions**: contato@ismaelnascimento.com

---

**Built with ❤️ using NestJS, TypeScript, and AWS** 