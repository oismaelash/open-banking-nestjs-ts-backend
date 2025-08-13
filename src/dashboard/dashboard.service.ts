import { Injectable, NotFoundException } from '@nestjs/common';
import { v4 as uuidv4 } from 'uuid';
import {
  DashboardOverviewResponseDto,
  QuickActionsResponseDto,
  NotificationsResponseDto,
  MarkNotificationReadResponseDto,
  DashboardStatsResponseDto,
  QuickActionDto,
  NotificationDto,
  NotificationType,
  QuickActionType,
} from './dto/dashboard.dto';

interface Notification {
  id: string;
  type: NotificationType;
  title: string;
  message: string;
  timestamp: string;
  read: boolean;
  priority?: 'low' | 'medium' | 'high';
  actionUrl?: string;
  actionText?: string;
}

@Injectable()
export class DashboardService {
  private notifications: Map<string, Notification> = new Map();

  constructor() {
    this.initializeSampleData();
  }

  private initializeSampleData() {
    // Sample notifications
    const sampleNotifications: Notification[] = [
      {
        id: 'notif-1',
        type: NotificationType.PAYMENT,
        title: 'Payment Completed',
        message: 'Your PIX payment to João Silva was completed',
        timestamp: new Date(Date.now() - 30 * 60 * 1000).toISOString(), // 30 minutes ago
        read: false,
        priority: 'medium',
        actionUrl: '/dashboard/payments',
        actionText: 'View Details',
      },
      {
        id: 'notif-2',
        type: NotificationType.TRANSACTION,
        title: 'Large Transaction Detected',
        message: 'A transaction of R$ 1,500.00 was made from your account',
        timestamp: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString(), // 2 hours ago
        read: false,
        priority: 'high',
        actionUrl: '/dashboard/transactions',
        actionText: 'Review Transaction',
      },
      {
        id: 'notif-3',
        type: NotificationType.SECURITY,
        title: 'Login from New Device',
        message: 'Your account was accessed from a new device in São Paulo',
        timestamp: new Date(Date.now() - 4 * 60 * 60 * 1000).toISOString(), // 4 hours ago
        read: true,
        priority: 'high',
        actionUrl: '/dashboard/security',
        actionText: 'Review Activity',
      },
      {
        id: 'notif-4',
        type: NotificationType.SYSTEM,
        title: 'System Maintenance',
        message: 'Scheduled maintenance will occur tonight from 2:00 AM to 4:00 AM',
        timestamp: new Date(Date.now() - 6 * 60 * 60 * 1000).toISOString(), // 6 hours ago
        read: true,
        priority: 'low',
      },
      {
        id: 'notif-5',
        type: NotificationType.PROMOTION,
        title: 'Special Offer',
        message: 'Get 50% off on your next investment with code INVEST50',
        timestamp: new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString(), // 1 day ago
        read: false,
        priority: 'low',
        actionUrl: '/dashboard/investments',
        actionText: 'Learn More',
      },
    ];

    sampleNotifications.forEach(notification => {
      this.notifications.set(notification.id, notification);
    });
  }

  async getDashboardOverview(): Promise<DashboardOverviewResponseDto> {
    // In a real app, this would aggregate data from multiple services
    const totalBalance = 115420.50;
    const totalAvailable = 115200.00;
    const activeAccounts = 3;
    const transactionsToday = 5;

    return {
      totalBalance,
      totalAvailable,
      activeAccounts,
      transactionsToday,
      lastUpdated: new Date().toISOString(),
      correlationId: uuidv4(),
    };
  }

  async getQuickActions(): Promise<QuickActionsResponseDto> {
    const actions: QuickActionDto[] = [
      {
        id: QuickActionType.PIX_PAYMENT,
        title: 'PIX Payment',
        description: 'Send PIX payment',
        icon: 'pix-icon',
        url: '/dashboard/pix',
        available: true,
      },
      {
        id: QuickActionType.TRANSFER,
        title: 'Transfer',
        description: 'Transfer between accounts',
        icon: 'transfer-icon',
        url: '/dashboard/transfer',
        available: true,
      },
      {
        id: QuickActionType.BILL_PAYMENT,
        title: 'Bill Payment',
        description: 'Pay bills and utilities',
        icon: 'bill-icon',
        url: '/dashboard/bills',
        available: true,
      },
      {
        id: QuickActionType.INVESTMENT,
        title: 'Investment',
        description: 'Manage investments',
        icon: 'investment-icon',
        url: '/dashboard/investments',
        available: true,
      },
      {
        id: QuickActionType.LOAN,
        title: 'Loan',
        description: 'Apply for loans',
        icon: 'loan-icon',
        url: '/dashboard/loans',
        available: false,
      },
      {
        id: QuickActionType.INSURANCE,
        title: 'Insurance',
        description: 'Insurance products',
        icon: 'insurance-icon',
        url: '/dashboard/insurance',
        available: true,
      },
      {
        id: QuickActionType.CARD_MANAGEMENT,
        title: 'Cards',
        description: 'Manage credit cards',
        icon: 'card-icon',
        url: '/dashboard/cards',
        available: true,
        badgeCount: 2, // Pending transactions
      },
      {
        id: QuickActionType.STATEMENT,
        title: 'Statements',
        description: 'Download statements',
        icon: 'statement-icon',
        url: '/dashboard/statements',
        available: true,
      },
      {
        id: QuickActionType.CONTACTS,
        title: 'Contacts',
        description: 'Manage contacts',
        icon: 'contacts-icon',
        url: '/dashboard/contacts',
        available: true,
      },
      {
        id: QuickActionType.SETTINGS,
        title: 'Settings',
        description: 'Account settings',
        icon: 'settings-icon',
        url: '/dashboard/settings',
        available: true,
      },
    ];

    return {
      actions,
      correlationId: uuidv4(),
    };
  }

  async getNotifications(): Promise<NotificationsResponseDto> {
    const notifications = Array.from(this.notifications.values());
    const unreadCount = notifications.filter(n => !n.read).length;

    return {
      notifications,
      unreadCount,
      correlationId: uuidv4(),
    };
  }

  async markNotificationAsRead(notificationId: string): Promise<MarkNotificationReadResponseDto> {
    const notification = this.notifications.get(notificationId);
    if (!notification) {
      throw new NotFoundException('Notification not found');
    }

    notification.read = true;
    this.notifications.set(notificationId, notification);

    return {
      success: true,
      notification,
      correlationId: uuidv4(),
    };
  }

  async markAllNotificationsAsRead(): Promise<{ success: boolean; correlationId: string }> {
    const notifications = Array.from(this.notifications.values());
    
    notifications.forEach(notification => {
      notification.read = true;
      this.notifications.set(notification.id, notification);
    });

    return {
      success: true,
      correlationId: uuidv4(),
    };
  }

  async deleteNotification(notificationId: string): Promise<{ success: boolean; correlationId: string }> {
    const notification = this.notifications.get(notificationId);
    if (!notification) {
      throw new NotFoundException('Notification not found');
    }

    this.notifications.delete(notificationId);

    return {
      success: true,
      correlationId: uuidv4(),
    };
  }

  async getDashboardStats(): Promise<DashboardStatsResponseDto> {
    // In a real app, this would calculate from transaction data
    const stats = {
      monthlyIncome: 8500.00,
      monthlyExpenses: 3200.00,
      savingsRate: 62.4, // Percentage
      monthlyTransactions: 45,
      averageTransaction: 256.67,
      topCategory: 'Transferência',
      topMerchant: 'Supermercado ABC',
    };

    return {
      stats,
      correlationId: uuidv4(),
    };
  }

  async createNotification(
    type: NotificationType,
    title: string,
    message: string,
    priority: 'low' | 'medium' | 'high' = 'medium',
    actionUrl?: string,
    actionText?: string,
  ): Promise<NotificationDto> {
    const notification: Notification = {
      id: uuidv4(),
      type,
      title,
      message,
      timestamp: new Date().toISOString(),
      read: false,
      priority,
      actionUrl,
      actionText,
    };

    this.notifications.set(notification.id, notification);

    return notification;
  }

  async getNotificationCounts(): Promise<{
    total: number;
    unread: number;
    byType: Record<NotificationType, number>;
    correlationId: string;
  }> {
    const notifications = Array.from(this.notifications.values());
    const total = notifications.length;
    const unread = notifications.filter(n => !n.read).length;

    const byType = {
      [NotificationType.PAYMENT]: notifications.filter(n => n.type === NotificationType.PAYMENT).length,
      [NotificationType.TRANSACTION]: notifications.filter(n => n.type === NotificationType.TRANSACTION).length,
      [NotificationType.SECURITY]: notifications.filter(n => n.type === NotificationType.SECURITY).length,
      [NotificationType.SYSTEM]: notifications.filter(n => n.type === NotificationType.SYSTEM).length,
      [NotificationType.PROMOTION]: notifications.filter(n => n.type === NotificationType.PROMOTION).length,
    };

    return {
      total,
      unread,
      byType,
      correlationId: uuidv4(),
    };
  }
}
