# 🔐 Authentication Module

This module provides comprehensive authentication functionality for the Open Banking API, including multi-step user registration, login, logout, and token management.

## 📋 Features

- **Multi-step User Registration** (9 steps with KYC process)
- **JWT-based Authentication** with secure token management
- **Email and Phone Verification** with OTP codes
- **Password Security** with bcrypt hashing
- **Refresh Token** mechanism for enhanced security
- **Session Management** with secure logout
- **Input Validation** with class-validator
- **Swagger Documentation** for all endpoints

## 🚀 Quick Start

### 1. User Registration Flow

The registration process is divided into 9 steps:

#### Step 1: Personal Information
```bash
curl -X POST http://localhost:3001/api/v1/api/auth/signup \
  -H "Content-Type: application/json" \
  -d '{
    "fullName": "João Silva Santos",
    "cpf": "123.456.789-00",
    "dateOfBirth": "1990-03-15"
  }'
```

#### Step 2: Contact Details
```bash
curl -X POST http://localhost:3001/api/v1/api/auth/signup/contact \
  -H "Content-Type: application/json" \
  -d '{
    "sessionId": "your-session-id",
    "email": "joao@email.com",
    "phoneNumber": "+55 11 99999-9999"
  }'
```

#### Step 3: Send Verification Codes
```bash
# Send email verification
curl -X POST http://localhost:3001/api/v1/api/auth/signup/send-email-code \
  -H "Content-Type: application/json" \
  -d '{"email": "joao@email.com"}'

# Send phone verification
curl -X POST http://localhost:3001/api/v1/api/auth/signup/send-phone-code \
  -H "Content-Type: application/json" \
  -d '{"phoneNumber": "+55 11 99999-9999"}'
```

#### Step 4: Verify Codes
```bash
# Verify email
curl -X POST http://localhost:3001/api/v1/api/auth/signup/verify-email \
  -H "Content-Type: application/json" \
  -d '{
    "email": "joao@email.com",
    "code": "123456"
  }'

# Verify phone
curl -X POST http://localhost:3001/api/v1/api/auth/signup/verify-phone \
  -H "Content-Type: application/json" \
  -d '{
    "phoneNumber": "+55 11 99999-9999",
    "code": "123456"
  }'
```

#### Step 5: Address Information
```bash
curl -X POST http://localhost:3001/api/v1/api/auth/signup/address \
  -H "Content-Type: application/json" \
  -d '{
    "sessionId": "your-session-id",
    "street": "Rua das Flores",
    "number": "123",
    "complement": "Apto 45",
    "neighborhood": "Centro",
    "city": "São Paulo",
    "state": "SP",
    "zipCode": "01234-567"
  }'
```

#### Step 6: Document Upload
```bash
curl -X POST http://localhost:3001/api/v1/api/auth/signup/documents \
  -H "Content-Type: application/json" \
  -d '{
    "sessionId": "your-session-id",
    "documentType": "rg",
    "documentFile": "base64_encoded_file"
  }'
```

#### Step 7: Password Setup
```bash
curl -X POST http://localhost:3001/api/v1/api/auth/signup/password \
  -H "Content-Type: application/json" \
  -d '{
    "sessionId": "your-session-id",
    "password": "SecurePassword123!",
    "confirmPassword": "SecurePassword123!"
  }'
```

#### Step 8: Terms Acceptance
```bash
curl -X POST http://localhost:3001/api/v1/api/auth/signup/terms \
  -H "Content-Type: application/json" \
  -d '{
    "sessionId": "your-session-id",
    "acceptTerms": true,
    "acceptPrivacy": true,
    "acceptMarketing": false
  }'
```

#### Step 9: Security Questions
```bash
curl -X POST http://localhost:3001/api/v1/api/auth/signup/security-questions \
  -H "Content-Type: application/json" \
  -d '{
    "sessionId": "your-session-id",
    "securityQuestion1": "What was your first pet\'s name?",
    "securityAnswer1": "Rex",
    "securityQuestion2": "In which city were you born?",
    "securityAnswer2": "São Paulo"
  }'
```

#### Step 10: Biometric Setup
```bash
curl -X POST http://localhost:3001/api/v1/api/auth/signup/biometric \
  -H "Content-Type: application/json" \
  -d '{
    "sessionId": "your-session-id",
    "enableBiometric": true,
    "biometricType": "fingerprint",
    "biometricData": "encrypted_biometric_data"
  }'
```

#### Step 11: Complete Registration
```bash
curl -X POST http://localhost:3001/api/v1/api/auth/signup/complete \
  -H "Content-Type: application/json" \
  -d '{
    "sessionId": "your-session-id",
    "userId": "user-123"
  }'
```

### 2. User Login

```bash
curl -X POST http://localhost:3001/api/v1/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "identifier": "joao@email.com",
    "password": "SecurePassword123!",
    "rememberMe": false,
    "twoFactorCode": "123456"
  }'
```

**Response:**
```json
{
  "success": true,
  "token": "jwt_token_here",
  "refreshToken": "refresh_token_here",
  "user": {
    "id": "user-123",
    "fullName": "João Silva Santos",
    "email": "joao@email.com",
    "cpf": "123.456.789-00"
  },
  "correlationId": "corr-123456"
}
```

### 3. Token Refresh

```bash
curl -X POST http://localhost:3001/api/v1/api/auth/refresh \
  -H "Content-Type: application/json" \
  -d '{
    "refreshToken": "refresh_token_here"
  }'
```

### 4. User Logout

```bash
curl -X POST http://localhost:3001/api/v1/api/auth/logout \
  -H "Content-Type: application/json" \
  -d '{
    "token": "jwt_token_here"
  }'
```

### 5. Get User Profile

```bash
curl -X GET http://localhost:3001/api/v1/api/auth/profile \
  -H "Authorization: Bearer jwt_token_here"
```

## 🔧 Configuration

### Environment Variables

```env
# JWT Configuration
JWT_SECRET=your-super-secret-jwt-key-change-in-production
JWT_EXPIRES_IN=1h
JWT_REFRESH_EXPIRES_IN=7d

# Security
BCRYPT_ROUNDS=12
RATE_LIMIT_WINDOW=15m
RATE_LIMIT_MAX_REQUESTS=100
```

### Validation Rules

- **CPF**: Must be in format `XXX.XXX.XXX-XX`
- **Phone**: Must be in format `+55 XX XXXXX-XXXX`
- **Email**: Must be a valid email address
- **Password**: Must contain at least 8 characters, one uppercase, one lowercase, one number, and one special character
- **ZIP Code**: Must be in format `XXXXX-XXX`

## 🛡️ Security Features

- **Password Hashing**: Uses bcrypt with 12 rounds
- **JWT Tokens**: Secure token-based authentication
- **Refresh Tokens**: Automatic token refresh mechanism
- **Input Validation**: Comprehensive request validation
- **Session Management**: Secure logout and token invalidation
- **Rate Limiting**: Protection against brute force attacks

## 📚 API Documentation

The complete API documentation is available at:
- **Swagger UI**: http://localhost:3001/docs
- **OpenAPI Spec**: http://localhost:3001/docs-json

## 🧪 Testing

Run the authentication tests:

```bash
# Run all tests
npm run test

# Run auth tests only
npm run test auth.controller.spec.ts

# Run with coverage
npm run test:cov
```

## 🔄 Integration with Other Modules

The authentication module integrates with:

- **User Management**: User profile and settings
- **Consent Management**: User consent tracking
- **Account Management**: Account access control
- **PIX Payments**: Payment authorization
- **Audit Logging**: Security event tracking

## 🚨 Error Handling

The module provides comprehensive error handling:

- **400 Bad Request**: Invalid input data
- **401 Unauthorized**: Invalid credentials or expired tokens
- **409 Conflict**: Duplicate email or CPF
- **422 Unprocessable Entity**: Validation errors

## 📈 Monitoring

The module includes:

- **Correlation IDs**: Request tracking across services
- **Structured Logging**: Detailed authentication events
- **Metrics**: Login attempts, registration success rates
- **Audit Trail**: Security event logging

## 🔮 Future Enhancements

- **Multi-factor Authentication**: TOTP, SMS, Email
- **Social Login**: Google, Facebook, Apple
- **Biometric Authentication**: Fingerprint, Face ID
- **Device Management**: Trusted devices
- **Account Recovery**: Password reset, account unlock
