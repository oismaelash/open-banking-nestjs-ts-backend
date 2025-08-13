import { Injectable, NotFoundException, BadRequestException, ForbiddenException } from '@nestjs/common';
import { v4 as uuidv4 } from 'uuid';
import {
  CreateConsentDto,
  UpdateConsentDto,
  ConsentResponseDto,
  ConsentDetailDto,
  ConsentHistoryResponseDto,
  RevokeConsentDto,
  ConsentScope,
  ConsentStatus,
  ThirdPartyAppDto,
} from './dto/consent.dto';

@Injectable()
export class ConsentService {
  // In-memory storage for development (replace with database in production)
  private consents: Map<string, any> = new Map();
  private consentHistory: Map<string, any[]> = new Map();

  // Create new consent
  async createConsent(userId: string, data: CreateConsentDto): Promise<ConsentResponseDto> {
    if (!data.acceptTerms) {
      throw new BadRequestException('Terms and conditions must be accepted');
    }

    // Validate scopes
    this.validateScopes(data.scopes);

    // Calculate expiration date
    const durationDays = parseInt(data.duration, 10);
    if (isNaN(durationDays) || durationDays <= 0) {
      throw new BadRequestException('Invalid duration');
    }

    const createdAt = new Date();
    const expiresAt = new Date(createdAt.getTime() + durationDays * 24 * 60 * 60 * 1000);

    // Create consent
    const consentId = uuidv4();
    const consent = {
      id: consentId,
      userId,
      scopes: data.scopes,
      status: ConsentStatus.ACTIVE,
      createdAt: createdAt.toISOString(),
      expiresAt: expiresAt.toISOString(),
      lastUsed: null,
      thirdPartyApp: data.thirdPartyApp,
      metadata: data.metadata,
      revokedAt: null,
      revocationReason: null,
    };

    this.consents.set(consentId, consent);

    // Add to history
    if (!this.consentHistory.has(userId)) {
      this.consentHistory.set(userId, []);
    }
    this.consentHistory.get(userId).push({
      ...consent,
      action: 'created',
    });

    return {
      success: true,
      consentId,
      scopes: consent.scopes,
      status: consent.status,
      createdAt: consent.createdAt,
      expiresAt: consent.expiresAt,
      lastUsed: consent.lastUsed,
      thirdPartyApp: consent.thirdPartyApp,
      correlationId: uuidv4(),
    };
  }

  // Get consent details
  async getConsent(userId: string, consentId: string): Promise<ConsentDetailDto> {
    const consent = this.consents.get(consentId);
    if (!consent) {
      throw new NotFoundException('Consent not found');
    }

    // Check if user owns this consent
    if (consent.userId !== userId) {
      throw new ForbiddenException('Access denied');
    }

    // Check if consent is expired
    if (new Date(consent.expiresAt) < new Date() && consent.status === ConsentStatus.ACTIVE) {
      consent.status = ConsentStatus.EXPIRED;
      this.consents.set(consentId, consent);
    }

    return {
      consentId: consent.id,
      scopes: consent.scopes,
      status: consent.status,
      createdAt: consent.createdAt,
      expiresAt: consent.expiresAt,
      lastUsed: consent.lastUsed,
      thirdPartyApp: consent.thirdPartyApp,
      metadata: consent.metadata,
      revokedAt: consent.revokedAt,
      revocationReason: consent.revocationReason,
    };
  }

  // Update consent
  async updateConsent(userId: string, consentId: string, data: UpdateConsentDto): Promise<ConsentResponseDto> {
    const consent = this.consents.get(consentId);
    if (!consent) {
      throw new NotFoundException('Consent not found');
    }

    // Check if user owns this consent
    if (consent.userId !== userId) {
      throw new ForbiddenException('Access denied');
    }

    // Check if consent can be updated
    if (consent.status !== ConsentStatus.ACTIVE) {
      throw new BadRequestException('Only active consents can be updated');
    }

    // Check if consent is expired
    if (new Date(consent.expiresAt) < new Date()) {
      throw new BadRequestException('Cannot update expired consent');
    }

    // Update scopes if provided
    if (data.scopes) {
      this.validateScopes(data.scopes);
      consent.scopes = data.scopes;
    }

    // Update duration if provided
    if (data.duration) {
      const durationDays = parseInt(data.duration, 10);
      if (isNaN(durationDays) || durationDays <= 0) {
        throw new BadRequestException('Invalid duration');
      }

      const createdAt = new Date(consent.createdAt);
      const newExpiresAt = new Date(createdAt.getTime() + durationDays * 24 * 60 * 60 * 1000);
      consent.expiresAt = newExpiresAt.toISOString();
    }

    // Update metadata if provided
    if (data.metadata !== undefined) {
      consent.metadata = data.metadata;
    }

    this.consents.set(consentId, consent);

    // Add to history
    this.consentHistory.get(userId).push({
      ...consent,
      action: 'updated',
    });

    return {
      success: true,
      consentId: consent.id,
      scopes: consent.scopes,
      status: consent.status,
      createdAt: consent.createdAt,
      expiresAt: consent.expiresAt,
      lastUsed: consent.lastUsed,
      thirdPartyApp: consent.thirdPartyApp,
      correlationId: uuidv4(),
    };
  }

  // Revoke consent
  async revokeConsent(userId: string, consentId: string, data?: RevokeConsentDto): Promise<ConsentResponseDto> {
    const consent = this.consents.get(consentId);
    if (!consent) {
      throw new NotFoundException('Consent not found');
    }

    // Check if user owns this consent
    if (consent.userId !== userId) {
      throw new ForbiddenException('Access denied');
    }

    // Check if consent can be revoked
    if (consent.status === ConsentStatus.REVOKED) {
      throw new BadRequestException('Consent is already revoked');
    }

    // Revoke consent
    const revokedAt = new Date();
    consent.status = ConsentStatus.REVOKED;
    consent.revokedAt = revokedAt.toISOString();
    consent.revocationReason = data?.reason || 'User requested revocation';

    this.consents.set(consentId, consent);

    // Add to history
    this.consentHistory.get(userId).push({
      ...consent,
      action: 'revoked',
    });

    return {
      success: true,
      consentId: consent.id,
      scopes: consent.scopes,
      status: consent.status,
      createdAt: consent.createdAt,
      expiresAt: consent.expiresAt,
      lastUsed: consent.lastUsed,
      thirdPartyApp: consent.thirdPartyApp,
      correlationId: uuidv4(),
    };
  }

  // Get consent history
  async getConsentHistory(userId: string): Promise<ConsentHistoryResponseDto> {
    const history = this.consentHistory.get(userId) || [];

    // Get unique consents (latest state of each consent)
    const uniqueConsents = new Map();
    history.forEach(entry => {
      uniqueConsents.set(entry.id, entry);
    });

    const consents = Array.from(uniqueConsents.values()).map(consent => ({
      consentId: consent.id,
      scopes: consent.scopes,
      status: consent.status,
      createdAt: consent.createdAt,
      revokedAt: consent.revokedAt,
      revocationReason: consent.revocationReason,
      thirdPartyApp: consent.thirdPartyApp,
    }));

    return {
      success: true,
      consents,
      correlationId: uuidv4(),
    };
  }

  // Validate consent for API access
  async validateConsent(userId: string, consentId: string, requiredScopes: ConsentScope[]): Promise<boolean> {
    const consent = this.consents.get(consentId);
    if (!consent) {
      return false;
    }

    // Check if user owns this consent
    if (consent.userId !== userId) {
      return false;
    }

    // Check if consent is active
    if (consent.status !== ConsentStatus.ACTIVE) {
      return false;
    }

    // Check if consent is expired
    if (new Date(consent.expiresAt) < new Date()) {
      consent.status = ConsentStatus.EXPIRED;
      this.consents.set(consentId, consent);
      return false;
    }

    // Check if consent has required scopes
    const hasRequiredScopes = requiredScopes.every(scope => consent.scopes.includes(scope));
    if (!hasRequiredScopes) {
      return false;
    }

    // Update last used timestamp
    consent.lastUsed = new Date().toISOString();
    this.consents.set(consentId, consent);

    return true;
  }

  // Get active consents for user
  async getActiveConsents(userId: string): Promise<ConsentDetailDto[]> {
    const userConsents = Array.from(this.consents.values()).filter(
      consent => consent.userId === userId && consent.status === ConsentStatus.ACTIVE
    );

    // Check for expired consents
    const now = new Date();
    userConsents.forEach(consent => {
      if (new Date(consent.expiresAt) < now) {
        consent.status = ConsentStatus.EXPIRED;
        this.consents.set(consent.id, consent);
      }
    });

    // Return only active consents
    return userConsents
      .filter(consent => consent.status === ConsentStatus.ACTIVE)
      .map(consent => ({
        consentId: consent.id,
        scopes: consent.scopes,
        status: consent.status,
        createdAt: consent.createdAt,
        expiresAt: consent.expiresAt,
        lastUsed: consent.lastUsed,
        thirdPartyApp: consent.thirdPartyApp,
        metadata: consent.metadata,
        revokedAt: consent.revokedAt,
        revocationReason: consent.revocationReason,
      }));
  }

  // Get consent statistics
  async getConsentStats(userId: string): Promise<any> {
    const userConsents = Array.from(this.consents.values()).filter(
      consent => consent.userId === userId
    );

    const stats = {
      total: userConsents.length,
      active: userConsents.filter(c => c.status === ConsentStatus.ACTIVE).length,
      revoked: userConsents.filter(c => c.status === ConsentStatus.REVOKED).length,
      expired: userConsents.filter(c => c.status === ConsentStatus.EXPIRED).length,
      pending: userConsents.filter(c => c.status === ConsentStatus.PENDING).length,
      suspended: userConsents.filter(c => c.status === ConsentStatus.SUSPENDED).length,
    };

    return {
      success: true,
      stats,
      correlationId: uuidv4(),
    };
  }

  // Suspend consent (for security reasons)
  async suspendConsent(userId: string, consentId: string, reason: string): Promise<ConsentResponseDto> {
    const consent = this.consents.get(consentId);
    if (!consent) {
      throw new NotFoundException('Consent not found');
    }

    // Check if user owns this consent
    if (consent.userId !== userId) {
      throw new ForbiddenException('Access denied');
    }

    // Check if consent can be suspended
    if (consent.status !== ConsentStatus.ACTIVE) {
      throw new BadRequestException('Only active consents can be suspended');
    }

    // Suspend consent
    consent.status = ConsentStatus.SUSPENDED;
    consent.metadata = consent.metadata ? `${consent.metadata}; SUSPENDED: ${reason}` : `SUSPENDED: ${reason}`;

    this.consents.set(consentId, consent);

    // Add to history
    this.consentHistory.get(userId).push({
      ...consent,
      action: 'suspended',
    });

    return {
      success: true,
      consentId: consent.id,
      scopes: consent.scopes,
      status: consent.status,
      createdAt: consent.createdAt,
      expiresAt: consent.expiresAt,
      lastUsed: consent.lastUsed,
      thirdPartyApp: consent.thirdPartyApp,
      correlationId: uuidv4(),
    };
  }

  // Reactivate suspended consent
  async reactivateConsent(userId: string, consentId: string): Promise<ConsentResponseDto> {
    const consent = this.consents.get(consentId);
    if (!consent) {
      throw new NotFoundException('Consent not found');
    }

    // Check if user owns this consent
    if (consent.userId !== userId) {
      throw new ForbiddenException('Access denied');
    }

    // Check if consent can be reactivated
    if (consent.status !== ConsentStatus.SUSPENDED) {
      throw new BadRequestException('Only suspended consents can be reactivated');
    }

    // Check if consent is expired
    if (new Date(consent.expiresAt) < new Date()) {
      throw new BadRequestException('Cannot reactivate expired consent');
    }

    // Reactivate consent
    consent.status = ConsentStatus.ACTIVE;

    this.consents.set(consentId, consent);

    // Add to history
    this.consentHistory.get(userId).push({
      ...consent,
      action: 'reactivated',
    });

    return {
      success: true,
      consentId: consent.id,
      scopes: consent.scopes,
      status: consent.status,
      createdAt: consent.createdAt,
      expiresAt: consent.expiresAt,
      lastUsed: consent.lastUsed,
      thirdPartyApp: consent.thirdPartyApp,
      correlationId: uuidv4(),
    };
  }

  private validateScopes(scopes: ConsentScope[]): void {
    if (!scopes || scopes.length === 0) {
      throw new BadRequestException('At least one scope must be specified');
    }

    const validScopes = Object.values(ConsentScope);
    const invalidScopes = scopes.filter(scope => !validScopes.includes(scope));
    
    if (invalidScopes.length > 0) {
      throw new BadRequestException(`Invalid scopes: ${invalidScopes.join(', ')}`);
    }
  }
}
