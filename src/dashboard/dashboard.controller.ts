import {
  Controller,
  Get,
  Post,
  Delete,
  Body,
  Param,
  UseGuards,
} from '@nestjs/common';
import {
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiBearerAuth,
  ApiParam,
} from '@nestjs/swagger';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { ConsentGuard } from '../consent/guards/consent.guard';
import { RequireConsent } from '../consent/decorators/consent-scopes.decorator';
import { ConsentScope } from '../consent/dto/consent.dto';
import { DashboardService } from './dashboard.service';
import {
  DashboardOverviewResponseDto,
  QuickActionsResponseDto,
  NotificationsResponseDto,
  MarkNotificationReadDto,
  MarkNotificationReadResponseDto,
  DashboardStatsResponseDto,
} from './dto/dashboard.dto';

@ApiTags('Dashboard')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard, ConsentGuard)
@Controller('api/dashboard')
export class DashboardController {
  constructor(private readonly dashboardService: DashboardService) {}

  @Get('overview')
  @RequireConsent(ConsentScope.ACCOUNTS, ConsentScope.BALANCES)
  @ApiOperation({ summary: 'Get Dashboard Overview' })
  @ApiResponse({
    status: 200,
    description: 'Dashboard overview retrieved successfully',
    type: DashboardOverviewResponseDto,
  })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  @ApiResponse({ status: 403, description: 'Insufficient consent' })
  async getDashboardOverview(): Promise<DashboardOverviewResponseDto> {
    return this.dashboardService.getDashboardOverview();
  }

  @Get('quick-actions')
  @RequireConsent(ConsentScope.PROFILE)
  @ApiOperation({ summary: 'Get Quick Actions' })
  @ApiResponse({
    status: 200,
    description: 'Quick actions retrieved successfully',
    type: QuickActionsResponseDto,
  })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  @ApiResponse({ status: 403, description: 'Insufficient consent' })
  async getQuickActions(): Promise<QuickActionsResponseDto> {
    return this.dashboardService.getQuickActions();
  }

  @Get('notifications')
  @RequireConsent(ConsentScope.PROFILE)
  @ApiOperation({ summary: 'Get Notifications' })
  @ApiResponse({
    status: 200,
    description: 'Notifications retrieved successfully',
    type: NotificationsResponseDto,
  })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  @ApiResponse({ status: 403, description: 'Insufficient consent' })
  async getNotifications(): Promise<NotificationsResponseDto> {
    return this.dashboardService.getNotifications();
  }

  @Post('notifications/:notificationId/read')
  @RequireConsent(ConsentScope.PROFILE)
  @ApiOperation({ summary: 'Mark Notification as Read' })
  @ApiParam({ name: 'notificationId', description: 'Notification ID' })
  @ApiResponse({
    status: 200,
    description: 'Notification marked as read successfully',
    type: MarkNotificationReadResponseDto,
  })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  @ApiResponse({ status: 403, description: 'Insufficient consent' })
  @ApiResponse({ status: 404, description: 'Notification not found' })
  async markNotificationAsRead(
    @Param('notificationId') notificationId: string,
  ): Promise<MarkNotificationReadResponseDto> {
    return this.dashboardService.markNotificationAsRead(notificationId);
  }

  @Post('notifications/read-all')
  @RequireConsent(ConsentScope.PROFILE)
  @ApiOperation({ summary: 'Mark All Notifications as Read' })
  @ApiResponse({
    status: 200,
    description: 'All notifications marked as read successfully',
  })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  @ApiResponse({ status: 403, description: 'Insufficient consent' })
  async markAllNotificationsAsRead(): Promise<{ success: boolean; correlationId: string }> {
    return this.dashboardService.markAllNotificationsAsRead();
  }

  @Delete('notifications/:notificationId')
  @RequireConsent(ConsentScope.PROFILE)
  @ApiOperation({ summary: 'Delete Notification' })
  @ApiParam({ name: 'notificationId', description: 'Notification ID' })
  @ApiResponse({
    status: 200,
    description: 'Notification deleted successfully',
  })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  @ApiResponse({ status: 403, description: 'Insufficient consent' })
  @ApiResponse({ status: 404, description: 'Notification not found' })
  async deleteNotification(
    @Param('notificationId') notificationId: string,
  ): Promise<{ success: boolean; correlationId: string }> {
    return this.dashboardService.deleteNotification(notificationId);
  }

  @Get('stats')
  @RequireConsent(ConsentScope.ACCOUNTS, ConsentScope.TRANSACTIONS, ConsentScope.ANALYTICS)
  @ApiOperation({ summary: 'Get Dashboard Statistics' })
  @ApiResponse({
    status: 200,
    description: 'Dashboard statistics retrieved successfully',
    type: DashboardStatsResponseDto,
  })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  @ApiResponse({ status: 403, description: 'Insufficient consent' })
  async getDashboardStats(): Promise<DashboardStatsResponseDto> {
    return this.dashboardService.getDashboardStats();
  }

  @Get('notifications/counts')
  @RequireConsent(ConsentScope.PROFILE)
  @ApiOperation({ summary: 'Get Notification Counts' })
  @ApiResponse({
    status: 200,
    description: 'Notification counts retrieved successfully',
  })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  @ApiResponse({ status: 403, description: 'Insufficient consent' })
  async getNotificationCounts(): Promise<{
    total: number;
    unread: number;
    byType: Record<string, number>;
    correlationId: string;
  }> {
    return this.dashboardService.getNotificationCounts();
  }
}
