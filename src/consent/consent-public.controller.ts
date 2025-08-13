import { Controller, Get } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse } from '@nestjs/swagger';
import { ConsentScope } from './dto/consent.dto';

@ApiTags('Consent Management')
@Controller('api/consent')
export class ConsentPublicController {
  @Get('scopes')
  @ApiOperation({ summary: 'Get Available Consent Scopes' })
  @ApiResponse({
    status: 200,
    description: 'Available scopes retrieved successfully',
  })
  async getAvailableScopes() {
    return {
      success: true,
      scopes: Object.values(ConsentScope),
      descriptions: {
        [ConsentScope.ACCOUNTS]: 'Access to account information',
        [ConsentScope.BALANCES]: 'Access to account balances',
        [ConsentScope.TRANSACTIONS]: 'Access to transaction history',
        [ConsentScope.PAYMENTS]: 'Ability to make payments',
        [ConsentScope.STATEMENTS]: 'Access to account statements',
        [ConsentScope.ANALYTICS]: 'Access to financial analytics',
        [ConsentScope.PROFILE]: 'Access to user profile information',
      },
      correlationId: require('uuid').v4(),
    };
  }
}
