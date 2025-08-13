import { SetMetadata } from '@nestjs/common';
import { ConsentScope } from '../dto/consent.dto';

export const CONSENT_SCOPES_KEY = 'consentScopes';
export const RequireConsent = (...scopes: ConsentScope[]) => SetMetadata(CONSENT_SCOPES_KEY, scopes);
