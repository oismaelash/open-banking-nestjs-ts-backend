import { Injectable, UnauthorizedException, BadRequestException, ConflictException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';
import { v4 as uuidv4 } from 'uuid';
import {
  SignupStep1Dto,
  SignupStep2Dto,
  SignupStep3Dto,
  SignupStep4Dto,
  SignupStep5Dto,
  SignupStep6Dto,
  SignupStep7Dto,
  SignupStep8Dto,
  SignupStep9Dto,
  VerifyEmailDto,
  VerifyPhoneDto,
  SendEmailCodeDto,
  SendPhoneCodeDto,
  LoginDto,
  LogoutDto,
  RefreshTokenDto,
  LoginResponseDto,
  SignupResponseDto,
} from './dto';

@Injectable()
export class AuthService {
  // In-memory storage for development (replace with database in production)
  private users: Map<string, any> = new Map();
  private signupSessions: Map<string, any> = new Map();
  private verificationCodes: Map<string, { code: string; expiresAt: Date }> = new Map();
  private refreshTokens: Map<string, { userId: string; expiresAt: Date }> = new Map();

  constructor(private jwtService: JwtService) {}

  // Step 1: Personal Information
  async signupStep1(data: SignupStep1Dto): Promise<SignupResponseDto> {
    const correlationId = uuidv4();
    
    // Validate CPF format and uniqueness
    if (this.users.has(data.cpf)) {
      throw new ConflictException('CPF already registered');
    }

    // Create signup session
    const sessionId = uuidv4();
    this.signupSessions.set(sessionId, {
      step: 1,
      data: { ...data },
      correlationId,
    });

    return {
      success: true,
      message: 'Personal information saved',
      step: 1,
      correlationId,
    };
  }

  // Step 2: Contact Details
  async signupStep2(sessionId: string, data: SignupStep2Dto): Promise<SignupResponseDto> {
    const session = this.signupSessions.get(sessionId);
    if (!session || session.step !== 1) {
      throw new BadRequestException('Invalid signup session or step');
    }

    // Check if email is already registered
    const existingUser = Array.from(this.users.values()).find(user => user.email === data.email);
    if (existingUser) {
      throw new ConflictException('Email already registered');
    }

    // Update session
    session.step = 2;
    session.data = { ...session.data, ...data };
    session.correlationId = uuidv4();

    return {
      success: true,
      message: 'Contact details saved',
      step: 2,
      correlationId: session.correlationId,
    };
  }

  // Send Email Verification Code
  async sendEmailCode(data: SendEmailCodeDto): Promise<SignupResponseDto> {
    const code = this.generateVerificationCode();
    const expiresAt = new Date(Date.now() + 10 * 60 * 1000); // 10 minutes

    this.verificationCodes.set(data.email, { code, expiresAt });

    // In production, send email via AWS SES
    console.log(`Email verification code for ${data.email}: ${code}`);

    return {
      success: true,
      message: 'Verification code sent to email',
      step: 0,
      correlationId: uuidv4(),
    };
  }

  // Send Phone Verification Code
  async sendPhoneCode(data: SendPhoneCodeDto): Promise<SignupResponseDto> {
    const code = this.generateVerificationCode();
    const expiresAt = new Date(Date.now() + 10 * 60 * 1000); // 10 minutes

    this.verificationCodes.set(data.phoneNumber, { code, expiresAt });

    // In production, send SMS via AWS SNS
    console.log(`SMS verification code for ${data.phoneNumber}: ${code}`);

    return {
      success: true,
      message: 'Verification code sent to phone',
      step: 0,
      correlationId: uuidv4(),
    };
  }

  // Verify Email
  async verifyEmail(data: VerifyEmailDto): Promise<SignupResponseDto> {
    const stored = this.verificationCodes.get(data.email);
    if (!stored || stored.code !== data.code || stored.expiresAt < new Date()) {
      throw new BadRequestException('Invalid or expired verification code');
    }

    this.verificationCodes.delete(data.email);

    return {
      success: true,
      message: 'Email verified successfully',
      step: 0,
      correlationId: uuidv4(),
    };
  }

  // Verify Phone
  async verifyPhone(data: VerifyPhoneDto): Promise<SignupResponseDto> {
    const stored = this.verificationCodes.get(data.phoneNumber);
    if (!stored || stored.code !== data.code || stored.expiresAt < new Date()) {
      throw new BadRequestException('Invalid or expired verification code');
    }

    this.verificationCodes.delete(data.phoneNumber);

    return {
      success: true,
      message: 'Phone verified successfully',
      step: 0,
      correlationId: uuidv4(),
    };
  }

  // Step 3: Address Information
  async signupStep3(sessionId: string, data: SignupStep3Dto): Promise<SignupResponseDto> {
    const session = this.signupSessions.get(sessionId);
    if (!session || session.step !== 2) {
      throw new BadRequestException('Invalid signup session or step');
    }

    session.step = 3;
    session.data = { ...session.data, ...data };
    session.correlationId = uuidv4();

    return {
      success: true,
      message: 'Address information saved',
      step: 3,
      correlationId: session.correlationId,
    };
  }

  // Step 4: Document Verification
  async signupStep4(sessionId: string, data: SignupStep4Dto): Promise<SignupResponseDto> {
    const session = this.signupSessions.get(sessionId);
    if (!session || session.step !== 3) {
      throw new BadRequestException('Invalid signup session or step');
    }

    // In production, upload document to AWS S3 and verify via external API
    session.step = 4;
    session.data = { ...session.data, ...data };
    session.correlationId = uuidv4();

    return {
      success: true,
      message: 'Document uploaded successfully',
      step: 4,
      correlationId: session.correlationId,
    };
  }

  // Step 5: Password Security
  async signupStep5(sessionId: string, data: SignupStep5Dto): Promise<SignupResponseDto> {
    const session = this.signupSessions.get(sessionId);
    if (!session || session.step !== 4) {
      throw new BadRequestException('Invalid signup session or step');
    }

    if (data.password !== data.confirmPassword) {
      throw new BadRequestException('Passwords do not match');
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(data.password, 12);

    session.step = 5;
    session.data = { ...session.data, password: hashedPassword };
    session.correlationId = uuidv4();

    return {
      success: true,
      message: 'Password set successfully',
      step: 5,
      correlationId: session.correlationId,
    };
  }

  // Step 6: Terms & Conditions
  async signupStep6(sessionId: string, data: SignupStep6Dto): Promise<SignupResponseDto> {
    const session = this.signupSessions.get(sessionId);
    if (!session || session.step !== 5) {
      throw new BadRequestException('Invalid signup session or step');
    }

    if (!data.acceptTerms || !data.acceptPrivacy) {
      throw new BadRequestException('Terms and Privacy Policy must be accepted');
    }

    session.step = 6;
    session.data = { ...session.data, ...data };
    session.correlationId = uuidv4();

    return {
      success: true,
      message: 'Terms accepted successfully',
      step: 6,
      correlationId: session.correlationId,
    };
  }

  // Step 7: Security Questions
  async signupStep7(sessionId: string, data: SignupStep7Dto): Promise<SignupResponseDto> {
    const session = this.signupSessions.get(sessionId);
    if (!session || session.step !== 6) {
      throw new BadRequestException('Invalid signup session or step');
    }

    session.step = 7;
    session.data = { ...session.data, ...data };
    session.correlationId = uuidv4();

    return {
      success: true,
      message: 'Security questions saved',
      step: 7,
      correlationId: session.correlationId,
    };
  }

  // Step 8: Biometric Setup
  async signupStep8(sessionId: string, data: SignupStep8Dto): Promise<SignupResponseDto> {
    const session = this.signupSessions.get(sessionId);
    if (!session || session.step !== 7) {
      throw new BadRequestException('Invalid signup session or step');
    }

    session.step = 8;
    session.data = { ...session.data, ...data };
    session.correlationId = uuidv4();

    return {
      success: true,
      message: 'Biometric setup completed',
      step: 8,
      correlationId: session.correlationId,
    };
  }

  // Step 9: Complete Registration
  async signupStep9(sessionId: string, data: SignupStep9Dto): Promise<SignupResponseDto> {
    const session = this.signupSessions.get(sessionId);
    if (!session || session.step !== 8) {
      throw new BadRequestException('Invalid signup session or step');
    }

    // Create user
    const userId = uuidv4();
    const user = {
      id: userId,
      ...session.data,
      createdAt: new Date(),
      updatedAt: new Date(),
      status: 'active',
    };

    this.users.set(user.cpf, user);
    this.signupSessions.delete(sessionId);

    return {
      success: true,
      message: 'Registration completed successfully',
      step: 9,
      correlationId: uuidv4(),
    };
  }

  // Login
  async login(data: LoginDto): Promise<LoginResponseDto> {
    // Find user by email or CPF
    const user = Array.from(this.users.values()).find(
      u => u.email === data.identifier || u.cpf === data.identifier
    );

    if (!user) {
      throw new UnauthorizedException('Invalid credentials');
    }

    // Verify password
    const isPasswordValid = await bcrypt.compare(data.password, user.password);
    if (!isPasswordValid) {
      throw new UnauthorizedException('Invalid credentials');
    }

    // Check 2FA if enabled
    if (user.twoFactorEnabled && data.twoFactorCode) {
      // In production, verify 2FA code
      console.log(`2FA code verification for user ${user.id}: ${data.twoFactorCode}`);
    }

    // Generate tokens
    const payload = { sub: user.id, email: user.email, cpf: user.cpf };
    const token = this.jwtService.sign(payload);
    const refreshToken = this.generateRefreshToken(user.id);

    return {
      success: true,
      token,
      refreshToken,
      user: {
        id: user.id,
        fullName: user.fullName,
        email: user.email,
        cpf: user.cpf,
      },
      correlationId: uuidv4(),
    };
  }

  // Logout
  async logout(data: LogoutDto): Promise<SignupResponseDto> {
    // In production, add token to blacklist
    console.log(`Logging out token: ${data.token}`);

    return {
      success: true,
      message: 'Logged out successfully',
      step: 0,
      correlationId: uuidv4(),
    };
  }

  // Refresh Token
  async refreshToken(data: RefreshTokenDto): Promise<LoginResponseDto> {
    const stored = this.refreshTokens.get(data.refreshToken);
    if (!stored || stored.expiresAt < new Date()) {
      throw new UnauthorizedException('Invalid or expired refresh token');
    }

    const user = Array.from(this.users.values()).find(u => u.id === stored.userId);
    if (!user) {
      throw new UnauthorizedException('User not found');
    }

    // Generate new tokens
    const payload = { sub: user.id, email: user.email, cpf: user.cpf };
    const token = this.jwtService.sign(payload);
    const refreshToken = this.generateRefreshToken(user.id);

    // Remove old refresh token
    this.refreshTokens.delete(data.refreshToken);

    return {
      success: true,
      token,
      refreshToken,
      user: {
        id: user.id,
        fullName: user.fullName,
        email: user.email,
        cpf: user.cpf,
      },
      correlationId: uuidv4(),
    };
  }

  // Validate user for JWT strategy
  async validateUser(userId: string): Promise<any> {
    const user = Array.from(this.users.values()).find(u => u.id === userId);
    if (!user) {
      throw new UnauthorizedException('User not found');
    }
    return user;
  }

  // Validate user by credentials for Local strategy
  async validateUserByCredentials(identifier: string, password: string): Promise<any> {
    const user = Array.from(this.users.values()).find(
      u => u.email === identifier || u.cpf === identifier
    );

    if (!user) {
      return null;
    }

    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      return null;
    }

    return user;
  }

  private generateVerificationCode(): string {
    return Math.floor(100000 + Math.random() * 900000).toString();
  }

  private generateRefreshToken(userId: string): string {
    const refreshToken = uuidv4();
    const expiresAt = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000); // 7 days
    this.refreshTokens.set(refreshToken, { userId, expiresAt });
    return refreshToken;
  }
}
