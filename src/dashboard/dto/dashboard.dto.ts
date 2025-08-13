import { IsString, IsEnum, IsBoolean, IsDateString, IsOptional } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export enum NotificationType {
  PAYMENT = 'payment',
  TRANSACTION = 'transaction',
  SECURITY = 'security',
  SYSTEM = 'system',
  PROMOTION = 'promotion',
}

export enum QuickActionType {
  PIX_PAYMENT = 'pix-payment',
  TRANSFER = 'transfer',
  BILL_PAYMENT = 'bill-payment',
  INVESTMENT = 'investment',
  LOAN = 'loan',
  INSURANCE = 'insurance',
  CARD_MANAGEMENT = 'card-management',
  STATEMENT = 'statement',
  CONTACTS = 'contacts',
  SETTINGS = 'settings',
}

// Dashboard Overview Response DTO
export class DashboardOverviewResponseDto {
  @ApiProperty({ description: 'Total balance across all accounts' })
  totalBalance: number;

  @ApiProperty({ description: 'Total available balance across all accounts' })
  totalAvailable: number;

  @ApiProperty({ description: 'Number of active accounts' })
  activeAccounts: number;

  @ApiProperty({ description: 'Number of transactions today' })
  transactionsToday: number;

  @ApiProperty({ description: 'Last update timestamp' })
  lastUpdated: string;

  @ApiProperty({ description: 'Correlation ID for tracking' })
  correlationId: string;
}

// Quick Action DTO
export class QuickActionDto {
  @ApiProperty({ enum: QuickActionType, description: 'Action identifier' })
  id: QuickActionType;

  @ApiProperty({ description: 'Action title' })
  title: string;

  @ApiProperty({ description: 'Action description' })
  description: string;

  @ApiProperty({ description: 'Action icon' })
  icon: string;

  @ApiProperty({ description: 'Action URL' })
  url: string;

  @ApiProperty({ description: 'Whether action is available', required: false })
  @IsOptional()
  @IsBoolean()
  available?: boolean;

  @ApiProperty({ description: 'Action badge count', required: false })
  @IsOptional()
  badgeCount?: number;
}

// Quick Actions Response DTO
export class QuickActionsResponseDto {
  @ApiProperty({ type: [QuickActionDto], description: 'Available quick actions' })
  actions: QuickActionDto[];

  @ApiProperty({ description: 'Correlation ID for tracking' })
  correlationId: string;
}

// Notification DTO
export class NotificationDto {
  @ApiProperty({ description: 'Notification ID' })
  id: string;

  @ApiProperty({ enum: NotificationType, description: 'Notification type' })
  type: NotificationType;

  @ApiProperty({ description: 'Notification title' })
  title: string;

  @ApiProperty({ description: 'Notification message' })
  message: string;

  @ApiProperty({ description: 'Notification timestamp' })
  timestamp: string;

  @ApiProperty({ description: 'Whether notification has been read' })
  read: boolean;

  @ApiProperty({ description: 'Notification priority', required: false })
  @IsOptional()
  priority?: 'low' | 'medium' | 'high';

  @ApiProperty({ description: 'Action URL', required: false })
  @IsOptional()
  @IsString()
  actionUrl?: string;

  @ApiProperty({ description: 'Action text', required: false })
  @IsOptional()
  @IsString()
  actionText?: string;
}

// Notifications Response DTO
export class NotificationsResponseDto {
  @ApiProperty({ type: [NotificationDto], description: 'User notifications' })
  notifications: NotificationDto[];

  @ApiProperty({ description: 'Total unread notifications' })
  unreadCount: number;

  @ApiProperty({ description: 'Correlation ID for tracking' })
  correlationId: string;
}

// Mark Notification as Read DTO
export class MarkNotificationReadDto {
  @ApiProperty({ description: 'Notification ID' })
  @IsString()
  notificationId: string;
}

// Mark Notification as Read Response DTO
export class MarkNotificationReadResponseDto {
  @ApiProperty({ description: 'Success status' })
  success: boolean;

  @ApiProperty({ description: 'Updated notification' })
  notification: NotificationDto;

  @ApiProperty({ description: 'Correlation ID for tracking' })
  correlationId: string;
}

// Dashboard Stats DTO
export class DashboardStatsDto {
  @ApiProperty({ description: 'Total income this month' })
  monthlyIncome: number;

  @ApiProperty({ description: 'Total expenses this month' })
  monthlyExpenses: number;

  @ApiProperty({ description: 'Monthly savings rate' })
  savingsRate: number;

  @ApiProperty({ description: 'Number of transactions this month' })
  monthlyTransactions: number;

  @ApiProperty({ description: 'Average transaction amount' })
  averageTransaction: number;

  @ApiProperty({ description: 'Most used category' })
  topCategory: string;

  @ApiProperty({ description: 'Most frequent merchant' })
  topMerchant: string;
}

// Dashboard Stats Response DTO
export class DashboardStatsResponseDto {
  @ApiProperty({ description: 'Dashboard statistics' })
  stats: DashboardStatsDto;

  @ApiProperty({ description: 'Correlation ID for tracking' })
  correlationId: string;
}
