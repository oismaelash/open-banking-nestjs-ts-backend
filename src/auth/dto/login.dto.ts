import { IsString, IsOptional, IsBoolean } from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class LoginDto {
  @ApiProperty({ description: 'Email or CPF for login' })
  @IsString()
  identifier: string;

  @ApiProperty({ description: 'User password' })
  @IsString()
  password: string;

  @ApiPropertyOptional({ description: 'Remember user session' })
  @IsOptional()
  @IsBoolean()
  rememberMe?: boolean;

  @ApiPropertyOptional({ description: 'Two-factor authentication code' })
  @IsOptional()
  @IsString()
  twoFactorCode?: string;
}

export class LogoutDto {
  @ApiProperty({ description: 'JWT token to invalidate' })
  @IsString()
  token: string;
}

export class RefreshTokenDto {
  @ApiProperty({ description: 'Refresh token' })
  @IsString()
  refreshToken: string;
}

export class LoginResponseDto {
  @ApiProperty({ description: 'Success status' })
  success: boolean;

  @ApiProperty({ description: 'JWT access token' })
  token: string;

  @ApiProperty({ description: 'Refresh token' })
  refreshToken: string;

  @ApiProperty({ description: 'User information' })
  user: {
    id: string;
    fullName: string;
    email: string;
    cpf: string;
  };

  @ApiProperty({ description: 'Correlation ID for tracking' })
  correlationId: string;
}

export class SignupResponseDto {
  @ApiProperty({ description: 'Success status' })
  success: boolean;

  @ApiProperty({ description: 'Response message' })
  message: string;

  @ApiProperty({ description: 'Current step number' })
  step: number;

  @ApiProperty({ description: 'Correlation ID for tracking' })
  correlationId: string;
}
