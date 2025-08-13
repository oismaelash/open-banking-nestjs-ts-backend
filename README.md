# Open Banking NestJS Backend

A comprehensive Open Banking API built with NestJS and TypeScript, featuring a Hello World application with banking operations.

## 🚀 Features

- **Hello World API**: Basic welcome endpoint
- **Health Check**: API health monitoring
- **Account Management**: View accounts and account details
- **Transaction History**: Retrieve transaction records
- **Money Transfers**: Create transfers between accounts
- **Balance Inquiry**: Check account balances
- **Swagger Documentation**: Interactive API documentation
- **CORS Enabled**: Cross-origin resource sharing support

## 📋 Prerequisites

- Node.js (v16 or higher)
- npm or yarn

## 🛠️ Installation

1. Clone the repository:
```bash
git clone <repository-url>
cd open-banking-nestjs-ts-backend
```

2. Install dependencies:
```bash
npm install
```

## 🏃‍♂️ Running the Application

### Development Mode
```bash
npm run start:dev
```

### Production Mode
```bash
npm run build
npm run start:prod
```

### Debug Mode
```bash
npm run start:debug
```

## 📚 API Documentation

Once the application is running, you can access the Swagger documentation at:

**http://localhost:3000/docs**

The documentation includes:
- Interactive API explorer
- Request/response examples
- Endpoint descriptions
- Schema definitions

## 🔗 Available Endpoints

### Health & Info
- `GET /api/v1/` - Hello World message
- `GET /api/v1/health` - Health check

### Banking Operations
- `GET /api/v1/banking` - Banking information
- `GET /api/v1/banking/accounts` - Get all accounts
- `GET /api/v1/banking/accounts/:id` - Get account by ID
- `GET /api/v1/banking/transactions` - Get all transactions
- `GET /api/v1/banking/balance` - Get account balances
- `POST /api/v1/banking/transfer` - Create money transfer

## 🏗️ Project Structure

```
src/
├── main.ts                 # Application entry point
├── app.module.ts          # Root module
├── app.controller.ts      # Main controller
├── app.service.ts         # Main service
└── banking/
    ├── banking.module.ts  # Banking module
    ├── banking.controller.ts  # Banking controller
    └── banking.service.ts     # Banking service
```

## 🧪 Testing

```bash
# Unit tests
npm run test

# e2e tests
npm run test:e2e

# Test coverage
npm run test:cov
```

## 📦 Build

```bash
npm run build
```

## 🔧 Configuration

The application uses the following default configuration:
- **Port**: 3000 (configurable via PORT environment variable)
- **API Prefix**: `/api/v1`
- **CORS**: Enabled for all origins
- **Swagger**: Available at `/docs`

## 🛡️ Security

- CORS enabled for cross-origin requests
- Input validation (can be enhanced with DTOs)
- Error handling for invalid requests

## 📈 Future Enhancements

- Database integration (PostgreSQL, MongoDB)
- Authentication & Authorization
- Rate limiting
- Request validation with DTOs
- Logging and monitoring
- Docker containerization
- CI/CD pipeline

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Commit your changes
4. Push to the branch
5. Create a Pull Request

## 📄 License

This project is licensed under the MIT License.

## 🆘 Support

For support and questions, please open an issue in the repository. 