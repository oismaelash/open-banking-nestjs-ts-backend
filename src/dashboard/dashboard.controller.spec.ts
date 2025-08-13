import { Test, TestingModule } from '@nestjs/testing';
import { DashboardController } from './dashboard.controller';
import { DashboardService } from './dashboard.service';

describe('DashboardController', () => {
  let controller: DashboardController;
  let service: DashboardService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [DashboardController],
      providers: [DashboardService],
    }).compile();

    controller = module.get<DashboardController>(DashboardController);
    service = module.get<DashboardService>(DashboardService);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  describe('getDashboardOverview', () => {
    it('should get dashboard overview', async () => {
      const result = await controller.getDashboardOverview();
      expect(result.totalBalance).toBeDefined();
      expect(result.totalAvailable).toBeDefined();
      expect(result.activeAccounts).toBeDefined();
      expect(result.transactionsToday).toBeDefined();
      expect(result.lastUpdated).toBeDefined();
      expect(result.correlationId).toBeDefined();
    });
  });

  describe('getQuickActions', () => {
    it('should get quick actions', async () => {
      const result = await controller.getQuickActions();
      expect(result.actions).toBeDefined();
      expect(Array.isArray(result.actions)).toBe(true);
      expect(result.correlationId).toBeDefined();
    });
  });

  describe('getNotifications', () => {
    it('should get notifications', async () => {
      const result = await controller.getNotifications();
      expect(result.notifications).toBeDefined();
      expect(Array.isArray(result.notifications)).toBe(true);
      expect(result.unreadCount).toBeDefined();
      expect(result.correlationId).toBeDefined();
    });
  });

  describe('markNotificationAsRead', () => {
    it('should mark notification as read', async () => {
      const notificationId = 'notif-1';
      const result = await controller.markNotificationAsRead(notificationId);
      expect(result.success).toBe(true);
      expect(result.notification).toBeDefined();
      expect(result.notification.read).toBe(true);
      expect(result.correlationId).toBeDefined();
    });
  });

  describe('markAllNotificationsAsRead', () => {
    it('should mark all notifications as read', async () => {
      const result = await controller.markAllNotificationsAsRead();
      expect(result.success).toBe(true);
      expect(result.correlationId).toBeDefined();
    });
  });

  describe('deleteNotification', () => {
    it('should delete notification', async () => {
      const notificationId = 'notif-1';
      const result = await controller.deleteNotification(notificationId);
      expect(result.success).toBe(true);
      expect(result.correlationId).toBeDefined();
    });
  });

  describe('getDashboardStats', () => {
    it('should get dashboard statistics', async () => {
      const result = await controller.getDashboardStats();
      expect(result.stats).toBeDefined();
      expect(result.stats.monthlyIncome).toBeDefined();
      expect(result.stats.monthlyExpenses).toBeDefined();
      expect(result.stats.savingsRate).toBeDefined();
      expect(result.correlationId).toBeDefined();
    });
  });

  describe('getNotificationCounts', () => {
    it('should get notification counts', async () => {
      const result = await controller.getNotificationCounts();
      expect(result.total).toBeDefined();
      expect(result.unread).toBeDefined();
      expect(result.byType).toBeDefined();
      expect(result.correlationId).toBeDefined();
    });
  });
});
