import {
  Controller,
  Post,
  Body,
  UseGuards,
  Request,
  HttpCode,
  HttpStatus,
  Param,
  Get,
} from '@nestjs/common';
import {
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiBearerAuth,
  ApiBody,
} from '@nestjs/swagger';
import { AuthService } from './auth.service';
import { JwtAuthGuard } from './guards/jwt-auth.guard';
import { LocalAuthGuard } from './guards/local-auth.guard';
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

@ApiTags('Authentication')
@Controller('api/auth')
export class AuthController {
  constructor(private authService: AuthService) {}

  @Post('signup')
  @ApiOperation({ summary: 'User Registration - Step 1: Personal Information' })
  @ApiResponse({
    status: 201,
    description: 'Personal information saved successfully',
    type: SignupResponseDto,
  })
  @ApiResponse({ status: 409, description: 'CPF already registered' })
  async signupStep1(@Body() data: SignupStep1Dto): Promise<SignupResponseDto> {
    return this.authService.signupStep1(data);
  }

  @Post('signup/contact')
  @ApiOperation({ summary: 'User Registration - Step 2: Contact Details' })
  @ApiResponse({
    status: 201,
    description: 'Contact details saved successfully',
    type: SignupResponseDto,
  })
  @ApiResponse({ status: 409, description: 'Email already registered' })
  async signupStep2(
    @Body('sessionId') sessionId: string,
    @Body() data: SignupStep2Dto,
  ): Promise<SignupResponseDto> {
    return this.authService.signupStep2(sessionId, data);
  }

  @Post('signup/send-email-code')
  @ApiOperation({ summary: 'Send Email Verification Code' })
  @ApiResponse({
    status: 201,
    description: 'Verification code sent to email',
    type: SignupResponseDto,
  })
  async sendEmailCode(@Body() data: SendEmailCodeDto): Promise<SignupResponseDto> {
    return this.authService.sendEmailCode(data);
  }

  @Post('signup/send-phone-code')
  @ApiOperation({ summary: 'Send SMS Verification Code' })
  @ApiResponse({
    status: 201,
    description: 'Verification code sent to phone',
    type: SignupResponseDto,
  })
  async sendPhoneCode(@Body() data: SendPhoneCodeDto): Promise<SignupResponseDto> {
    return this.authService.sendPhoneCode(data);
  }

  @Post('signup/verify-email')
  @ApiOperation({ summary: 'Verify Email Address' })
  @ApiResponse({
    status: 201,
    description: 'Email verified successfully',
    type: SignupResponseDto,
  })
  @ApiResponse({ status: 400, description: 'Invalid or expired verification code' })
  async verifyEmail(@Body() data: VerifyEmailDto): Promise<SignupResponseDto> {
    return this.authService.verifyEmail(data);
  }

  @Post('signup/verify-phone')
  @ApiOperation({ summary: 'Verify Phone Number' })
  @ApiResponse({
    status: 201,
    description: 'Phone verified successfully',
    type: SignupResponseDto,
  })
  @ApiResponse({ status: 400, description: 'Invalid or expired verification code' })
  async verifyPhone(@Body() data: VerifyPhoneDto): Promise<SignupResponseDto> {
    return this.authService.verifyPhone(data);
  }

  @Post('signup/address')
  @ApiOperation({ summary: 'User Registration - Step 3: Address Information' })
  @ApiResponse({
    status: 201,
    description: 'Address information saved successfully',
    type: SignupResponseDto,
  })
  async signupStep3(
    @Body('sessionId') sessionId: string,
    @Body() data: SignupStep3Dto,
  ): Promise<SignupResponseDto> {
    return this.authService.signupStep3(sessionId, data);
  }

  @Post('signup/documents')
  @ApiOperation({ summary: 'User Registration - Step 4: Document Verification' })
  @ApiResponse({
    status: 201,
    description: 'Document uploaded successfully',
    type: SignupResponseDto,
  })
  async signupStep4(
    @Body('sessionId') sessionId: string,
    @Body() data: SignupStep4Dto,
  ): Promise<SignupResponseDto> {
    return this.authService.signupStep4(sessionId, data);
  }

  @Post('signup/password')
  @ApiOperation({ summary: 'User Registration - Step 5: Password Security' })
  @ApiResponse({
    status: 201,
    description: 'Password set successfully',
    type: SignupResponseDto,
  })
  @ApiResponse({ status: 400, description: 'Passwords do not match' })
  async signupStep5(
    @Body('sessionId') sessionId: string,
    @Body() data: SignupStep5Dto,
  ): Promise<SignupResponseDto> {
    return this.authService.signupStep5(sessionId, data);
  }

  @Post('signup/terms')
  @ApiOperation({ summary: 'User Registration - Step 6: Terms & Conditions' })
  @ApiResponse({
    status: 201,
    description: 'Terms accepted successfully',
    type: SignupResponseDto,
  })
  @ApiResponse({ status: 400, description: 'Terms and Privacy Policy must be accepted' })
  async signupStep6(
    @Body('sessionId') sessionId: string,
    @Body() data: SignupStep6Dto,
  ): Promise<SignupResponseDto> {
    return this.authService.signupStep6(sessionId, data);
  }

  @Post('signup/security-questions')
  @ApiOperation({ summary: 'User Registration - Step 7: Security Questions' })
  @ApiResponse({
    status: 201,
    description: 'Security questions saved',
    type: SignupResponseDto,
  })
  async signupStep7(
    @Body('sessionId') sessionId: string,
    @Body() data: SignupStep7Dto,
  ): Promise<SignupResponseDto> {
    return this.authService.signupStep7(sessionId, data);
  }

  @Post('signup/biometric')
  @ApiOperation({ summary: 'User Registration - Step 8: Biometric Setup' })
  @ApiResponse({
    status: 201,
    description: 'Biometric setup completed',
    type: SignupResponseDto,
  })
  async signupStep8(
    @Body('sessionId') sessionId: string,
    @Body() data: SignupStep8Dto,
  ): Promise<SignupResponseDto> {
    return this.authService.signupStep8(sessionId, data);
  }

  @Post('signup/complete')
  @ApiOperation({ summary: 'User Registration - Step 9: Complete Registration' })
  @ApiResponse({
    status: 201,
    description: 'Registration completed successfully',
    type: SignupResponseDto,
  })
  async signupStep9(
    @Body('sessionId') sessionId: string,
    @Body() data: SignupStep9Dto,
  ): Promise<SignupResponseDto> {
    return this.authService.signupStep9(sessionId, data);
  }

  @Post('login')
  @HttpCode(HttpStatus.OK)
  @UseGuards(LocalAuthGuard)
  @ApiOperation({ summary: 'User Login' })
  @ApiResponse({
    status: 200,
    description: 'Login successful',
    type: LoginResponseDto,
  })
  @ApiResponse({ status: 401, description: 'Invalid credentials' })
  async login(@Request() req, @Body() loginDto: LoginDto): Promise<LoginResponseDto> {
    return this.authService.login(loginDto);
  }

  @Post('logout')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'User Logout' })
  @ApiResponse({
    status: 200,
    description: 'Logged out successfully',
    type: SignupResponseDto,
  })
  async logout(@Body() data: LogoutDto): Promise<SignupResponseDto> {
    return this.authService.logout(data);
  }

  @Post('refresh')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Refresh Token' })
  @ApiResponse({
    status: 200,
    description: 'Token refreshed successfully',
    type: LoginResponseDto,
  })
  @ApiResponse({ status: 401, description: 'Invalid or expired refresh token' })
  async refreshToken(@Body() data: RefreshTokenDto): Promise<LoginResponseDto> {
    return this.authService.refreshToken(data);
  }

  @Get('profile')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Get User Profile' })
  @ApiResponse({
    status: 200,
    description: 'User profile retrieved successfully',
  })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  getProfile(@Request() req) {
    return req.user;
  }
}
