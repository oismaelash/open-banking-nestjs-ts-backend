import {
  Controller,
  Post,
  Get,
  Put,
  Delete,
  Body,
  Param,
  UseGuards,
  Request,
  HttpCode,
  HttpStatus,
} from '@nestjs/common';
import {
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiBearerAuth,
  ApiParam,
} from '@nestjs/swagger';
import { ConsentService } from './consent.service';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import {
  CreateConsentDto,
  UpdateConsentDto,
  ConsentResponseDto,
  ConsentDetailDto,
  ConsentHistoryResponseDto,
  RevokeConsentDto,
  ConsentScope,
} from './dto/consent.dto';

@ApiTags('Consent Management')
@Controller('api/consent')
@UseGuards(JwtAuthGuard)
@ApiBearerAuth()
export class ConsentController {
  constructor(private consentService: ConsentService) {}

  @Post('create')
  @ApiOperation({ summary: 'Create New Consent' })
  @ApiResponse({
    status: 201,
    description: 'Consent created successfully',
    type: ConsentResponseDto,
  })
  @ApiResponse({ status: 400, description: 'Invalid consent data' })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  async createConsent(
    @Request() req,
    @Body() data: CreateConsentDto,
  ): Promise<ConsentResponseDto> {
    return this.consentService.createConsent(req.user.id, data);
  }

  @Get(':consentId')
  @ApiOperation({ summary: 'Get Consent Details' })
  @ApiParam({ name: 'consentId', description: 'Consent ID' })
  @ApiResponse({
    status: 200,
    description: 'Consent details retrieved successfully',
    type: ConsentDetailDto,
  })
  @ApiResponse({ status: 404, description: 'Consent not found' })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  @ApiResponse({ status: 403, description: 'Access denied' })
  async getConsent(
    @Request() req,
    @Param('consentId') consentId: string,
  ): Promise<ConsentDetailDto> {
    return this.consentService.getConsent(req.user.id, consentId);
  }

  @Put(':consentId')
  @ApiOperation({ summary: 'Update Consent' })
  @ApiParam({ name: 'consentId', description: 'Consent ID' })
  @ApiResponse({
    status: 200,
    description: 'Consent updated successfully',
    type: ConsentResponseDto,
  })
  @ApiResponse({ status: 404, description: 'Consent not found' })
  @ApiResponse({ status: 400, description: 'Invalid update data' })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  @ApiResponse({ status: 403, description: 'Access denied' })
  async updateConsent(
    @Request() req,
    @Param('consentId') consentId: string,
    @Body() data: UpdateConsentDto,
  ): Promise<ConsentResponseDto> {
    return this.consentService.updateConsent(req.user.id, consentId, data);
  }

  @Delete(':consentId')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Revoke Consent' })
  @ApiParam({ name: 'consentId', description: 'Consent ID' })
  @ApiResponse({
    status: 200,
    description: 'Consent revoked successfully',
    type: ConsentResponseDto,
  })
  @ApiResponse({ status: 404, description: 'Consent not found' })
  @ApiResponse({ status: 400, description: 'Consent already revoked' })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  @ApiResponse({ status: 403, description: 'Access denied' })
  async revokeConsent(
    @Request() req,
    @Param('consentId') consentId: string,
    @Body() data?: RevokeConsentDto,
  ): Promise<ConsentResponseDto> {
    return this.consentService.revokeConsent(req.user.id, consentId, data);
  }

  @Get('history')
  @ApiOperation({ summary: 'Get Consent History' })
  @ApiResponse({
    status: 200,
    description: 'Consent history retrieved successfully',
    type: ConsentHistoryResponseDto,
  })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  async getConsentHistory(@Request() req): Promise<ConsentHistoryResponseDto> {
    return this.consentService.getConsentHistory(req.user.id);
  }

  @Get('active')
  @ApiOperation({ summary: 'Get Active Consents' })
  @ApiResponse({
    status: 200,
    description: 'Active consents retrieved successfully',
    type: [ConsentDetailDto],
  })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  async getActiveConsents(@Request() req): Promise<ConsentDetailDto[]> {
    return this.consentService.getActiveConsents(req.user.id);
  }

  @Get('stats')
  @ApiOperation({ summary: 'Get Consent Statistics' })
  @ApiResponse({
    status: 200,
    description: 'Consent statistics retrieved successfully',
  })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  async getConsentStats(@Request() req) {
    return this.consentService.getConsentStats(req.user.id);
  }

  @Post(':consentId/suspend')
  @ApiOperation({ summary: 'Suspend Consent' })
  @ApiParam({ name: 'consentId', description: 'Consent ID' })
  @ApiResponse({
    status: 201,
    description: 'Consent suspended successfully',
    type: ConsentResponseDto,
  })
  @ApiResponse({ status: 404, description: 'Consent not found' })
  @ApiResponse({ status: 400, description: 'Cannot suspend consent' })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  @ApiResponse({ status: 403, description: 'Access denied' })
  async suspendConsent(
    @Request() req,
    @Param('consentId') consentId: string,
    @Body() data: { reason: string },
  ): Promise<ConsentResponseDto> {
    return this.consentService.suspendConsent(req.user.id, consentId, data.reason);
  }

  @Post(':consentId/reactivate')
  @ApiOperation({ summary: 'Reactivate Suspended Consent' })
  @ApiParam({ name: 'consentId', description: 'Consent ID' })
  @ApiResponse({
    status: 201,
    description: 'Consent reactivated successfully',
    type: ConsentResponseDto,
  })
  @ApiResponse({ status: 404, description: 'Consent not found' })
  @ApiResponse({ status: 400, description: 'Cannot reactivate consent' })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  @ApiResponse({ status: 403, description: 'Access denied' })
  async reactivateConsent(
    @Request() req,
    @Param('consentId') consentId: string,
  ): Promise<ConsentResponseDto> {
    return this.consentService.reactivateConsent(req.user.id, consentId);
  }


}
