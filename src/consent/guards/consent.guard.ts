import { Injectable, CanActivate, ExecutionContext, ForbiddenException } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { ConsentService } from '../consent.service';
import { ConsentScope } from '../dto/consent.dto';

@Injectable()
export class ConsentGuard implements CanActivate {
  constructor(
    private reflector: Reflector,
    private consentService: ConsentService,
  ) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const requiredScopes = this.reflector.get<ConsentScope[]>('consentScopes', context.getHandler());
    
    if (!requiredScopes) {
      return true; // No consent required
    }

    const request = context.switchToHttp().getRequest();
    const user = request.user;
    const consentId = request.headers['x-consent-id'];

    if (!consentId) {
      throw new ForbiddenException('Consent ID is required');
    }

    const hasValidConsent = await this.consentService.validateConsent(
      user.id,
      consentId,
      requiredScopes,
    );

    if (!hasValidConsent) {
      throw new ForbiddenException('Invalid or insufficient consent');
    }

    return true;
  }
}
