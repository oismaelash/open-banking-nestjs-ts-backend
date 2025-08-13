import { IsString, IsEmail, IsDateString, IsOptional, IsBoolean, MinLength, Matches } from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class SignupStep1Dto {
  @ApiProperty({ description: 'Full name of the user' })
  @IsString()
  fullName: string;

  @ApiProperty({ description: 'CPF number (Brazilian tax ID)' })
  @IsString()
  @Matches(/^\d{3}\.\d{3}\.\d{3}-\d{2}$/, { message: 'CPF must be in format XXX.XXX.XXX-XX' })
  cpf: string;

  @ApiProperty({ description: 'Date of birth in DD/MM/YYYY format' })
  @IsDateString()
  dateOfBirth: string;
}

export class SignupStep2Dto {
  @ApiProperty({ description: 'Email address' })
  @IsEmail()
  email: string;

  @ApiProperty({ description: 'Phone number with country code' })
  @IsString()
  @Matches(/^\+55 \d{2} \d{4,5}-\d{4}$/, { message: 'Phone must be in format +55 XX XXXXX-XXXX' })
  phoneNumber: string;
}

export class VerifyEmailDto {
  @ApiProperty({ description: 'Email address' })
  @IsEmail()
  email: string;

  @ApiProperty({ description: 'Verification code' })
  @IsString()
  @MinLength(6)
  code: string;
}

export class VerifyPhoneDto {
  @ApiProperty({ description: 'Phone number' })
  @IsString()
  phoneNumber: string;

  @ApiProperty({ description: 'Verification code' })
  @IsString()
  @MinLength(6)
  code: string;
}

export class SendEmailCodeDto {
  @ApiProperty({ description: 'Email address' })
  @IsEmail()
  email: string;
}

export class SendPhoneCodeDto {
  @ApiProperty({ description: 'Phone number' })
  @IsString()
  phoneNumber: string;
}

export class SignupStep3Dto {
  @ApiProperty({ description: 'Street address' })
  @IsString()
  street: string;

  @ApiProperty({ description: 'House/building number' })
  @IsString()
  number: string;

  @ApiPropertyOptional({ description: 'Address complement' })
  @IsOptional()
  @IsString()
  complement?: string;

  @ApiProperty({ description: 'Neighborhood' })
  @IsString()
  neighborhood: string;

  @ApiProperty({ description: 'City' })
  @IsString()
  city: string;

  @ApiProperty({ description: 'State (2-letter code)' })
  @IsString()
  @MinLength(2)
  state: string;

  @ApiProperty({ description: 'ZIP code' })
  @IsString()
  @Matches(/^\d{5}-\d{3}$/, { message: 'ZIP code must be in format XXXXX-XXX' })
  zipCode: string;
}

export class SignupStep4Dto {
  @ApiProperty({ description: 'Type of document' })
  @IsString()
  documentType: string;

  @ApiProperty({ description: 'Document file (base64 or multipart)' })
  @IsString()
  documentFile: string;
}

export class SignupStep5Dto {
  @ApiProperty({ description: 'Password' })
  @IsString()
  @MinLength(8)
  @Matches(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]/, {
    message: 'Password must contain at least one uppercase letter, one lowercase letter, one number, and one special character',
  })
  password: string;

  @ApiProperty({ description: 'Password confirmation' })
  @IsString()
  confirmPassword: string;
}

export class SignupStep6Dto {
  @ApiProperty({ description: 'Accept terms and conditions' })
  @IsBoolean()
  acceptTerms: boolean;

  @ApiProperty({ description: 'Accept privacy policy' })
  @IsBoolean()
  acceptPrivacy: boolean;

  @ApiProperty({ description: 'Accept marketing communications' })
  @IsBoolean()
  acceptMarketing: boolean;
}

export class SignupStep7Dto {
  @ApiProperty({ description: 'First security question' })
  @IsString()
  securityQuestion1: string;

  @ApiProperty({ description: 'First security answer' })
  @IsString()
  securityAnswer1: string;

  @ApiProperty({ description: 'Second security question' })
  @IsString()
  securityQuestion2: string;

  @ApiProperty({ description: 'Second security answer' })
  @IsString()
  securityAnswer2: string;
}

export class SignupStep8Dto {
  @ApiProperty({ description: 'Enable biometric authentication' })
  @IsBoolean()
  enableBiometric: boolean;

  @ApiPropertyOptional({ description: 'Type of biometric' })
  @IsOptional()
  @IsString()
  biometricType?: string;

  @ApiPropertyOptional({ description: 'Encrypted biometric data' })
  @IsOptional()
  @IsString()
  biometricData?: string;
}

export class SignupStep9Dto {
  @ApiProperty({ description: 'User ID for completing registration' })
  @IsString()
  userId: string;
}
