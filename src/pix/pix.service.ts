import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { v4 as uuidv4 } from 'uuid';
import {
  CreatePixPaymentDto,
  PixPaymentResponseDto,
  PaymentStatusResponseDto,
  GenerateQrCodeDto,
  QrCodeResponseDto,
  ScanQrCodeDto,
  QrCodeScanResponseDto,
  PixContactDto,
  PixContactResponseDto,
  PixContactsResponseDto,
  PixLimitsResponseDto,
  PaymentStatus,
  PixKeyType,
  PaymentCategory,
} from './dto/pix.dto';

interface PixPayment {
  paymentId: string;
  status: PaymentStatus;
  amount: number;
  recipientName: string;
  pixKey: string;
  pixKeyType: PixKeyType;
  description: string;
  category: PaymentCategory;
  initiatedAt: string;
  processedAt?: string;
  completedAt?: string;
  fee: number;
  accountId: string;
  bank: string;
  scheduledDate?: string;
}

interface PixContact {
  id: string;
  type: PixKeyType;
  value: string;
  name: string;
  bank: string;
  createdAt: string;
}

@Injectable()
export class PixService {
  private payments: Map<string, PixPayment> = new Map();
  private contacts: Map<string, PixContact> = new Map();
  private dailyUsage = 0;
  private monthlyUsage = 0;

  constructor() {
    this.initializeSampleData();
  }

  private initializeSampleData() {
    // Sample contacts
    const sampleContacts: PixContact[] = [
      {
        id: 'contact-1',
        type: PixKeyType.PHONE,
        value: '+55 11 99999-9999',
        name: 'João Silva',
        bank: 'Banco do Brasil',
        createdAt: new Date().toISOString(),
      },
      {
        id: 'contact-2',
        type: PixKeyType.EMAIL,
        value: 'maria@email.com',
        name: 'Maria Santos',
        bank: 'Itaú',
        createdAt: new Date().toISOString(),
      },
      {
        id: 'contact-3',
        type: PixKeyType.CPF,
        value: '123.456.789-00',
        name: 'Pedro Costa',
        bank: 'Bradesco',
        createdAt: new Date().toISOString(),
      },
    ];

    sampleContacts.forEach(contact => {
      this.contacts.set(contact.id, contact);
    });

    // Sample payments
    const samplePayments: PixPayment[] = [
      {
        paymentId: 'PIX123456789',
        status: PaymentStatus.COMPLETED,
        amount: 150.00,
        recipientName: 'João Silva',
        pixKey: '+55 11 99999-9999',
        pixKeyType: PixKeyType.PHONE,
        description: 'Pagamento para João Silva',
        category: PaymentCategory.TRANSFERENCIA,
        initiatedAt: '2024-01-15T14:30:00Z',
        processedAt: '2024-01-15T14:30:15Z',
        completedAt: '2024-01-15T14:30:30Z',
        fee: 0.00,
        accountId: 'account-1',
        bank: 'Banco do Brasil',
      },
      {
        paymentId: 'PIX987654321',
        status: PaymentStatus.PENDING,
        amount: 75.50,
        recipientName: 'Maria Santos',
        pixKey: 'maria@email.com',
        pixKeyType: PixKeyType.EMAIL,
        description: 'Pagamento para Maria Santos',
        category: PaymentCategory.PIX,
        initiatedAt: new Date().toISOString(),
        fee: 0.00,
        accountId: 'account-1',
        bank: 'Itaú',
      },
    ];

    samplePayments.forEach(payment => {
      this.payments.set(payment.paymentId, payment);
    });
  }

  async createPixPayment(createPixPaymentDto: CreatePixPaymentDto): Promise<PixPaymentResponseDto> {
    const paymentId = `PIX${uuidv4().replace(/-/g, '').substring(0, 9).toUpperCase()}`;
    const correlationId = uuidv4();
    const initiatedAt = new Date().toISOString();
    const estimatedCompletion = new Date(Date.now() + 30 * 1000).toISOString(); // 30 seconds

    // Validate account exists (in a real app, this would check against account service)
    if (!['account-1', 'account-2', 'account-3'].includes(createPixPaymentDto.accountId)) {
      throw new BadRequestException('Invalid account ID');
    }

    // Validate PIX key format based on type
    this.validatePixKey(createPixPaymentDto.pixKey, createPixPaymentDto.pixKeyType);

    // Check limits
    this.checkLimits(createPixPaymentDto.amount);

    const payment: PixPayment = {
      paymentId,
      status: PaymentStatus.PENDING,
      amount: createPixPaymentDto.amount,
      recipientName: createPixPaymentDto.recipientName,
      pixKey: createPixPaymentDto.pixKey,
      pixKeyType: createPixPaymentDto.pixKeyType,
      description: createPixPaymentDto.description,
      category: createPixPaymentDto.category,
      initiatedAt,
      fee: 0.00,
      accountId: createPixPaymentDto.accountId,
      bank: this.getBankByPixKey(createPixPaymentDto.pixKey),
      scheduledDate: createPixPaymentDto.scheduledDate,
    };

    this.payments.set(paymentId, payment);

    // Update usage
    this.dailyUsage += createPixPaymentDto.amount;
    this.monthlyUsage += createPixPaymentDto.amount;

    // Simulate payment processing
    setTimeout(() => {
      this.processPayment(paymentId);
    }, 5000);

    return {
      success: true,
      paymentId,
      status: PaymentStatus.PENDING,
      amount: createPixPaymentDto.amount,
      fee: 0.00,
      estimatedCompletion,
      correlationId,
    };
  }

  async getPaymentStatus(paymentId: string): Promise<PaymentStatusResponseDto> {
    const payment = this.payments.get(paymentId);
    if (!payment) {
      throw new NotFoundException('Payment not found');
    }

    return {
      paymentId: payment.paymentId,
      status: payment.status,
      amount: payment.amount,
      recipientName: payment.recipientName,
      pixKey: payment.pixKey,
      pixKeyType: payment.pixKeyType,
      description: payment.description,
      category: payment.category,
      initiatedAt: payment.initiatedAt,
      processedAt: payment.processedAt,
      completedAt: payment.completedAt,
      fee: payment.fee,
      accountId: payment.accountId,
      bank: payment.bank,
      correlationId: uuidv4(),
    };
  }

  async getPaymentReceipt(paymentId: string, format: 'pdf' | 'json' = 'json'): Promise<any> {
    const payment = this.payments.get(paymentId);
    if (!payment) {
      throw new NotFoundException('Payment not found');
    }

    if (payment.status !== PaymentStatus.COMPLETED) {
      throw new BadRequestException('Payment is not completed');
    }

    const receipt = {
      receiptId: `RECEIPT-${paymentId}`,
      paymentId: payment.paymentId,
      amount: payment.amount,
      recipientName: payment.recipientName,
      pixKey: payment.pixKey,
      pixKeyType: payment.pixKeyType,
      description: payment.description,
      category: payment.category,
      initiatedAt: payment.initiatedAt,
      completedAt: payment.completedAt,
      fee: payment.fee,
      accountId: payment.accountId,
      bank: payment.bank,
      correlationId: uuidv4(),
    };

    if (format === 'pdf') {
      // In a real app, this would generate a PDF
      return {
        success: true,
        message: 'PDF receipt generated successfully',
        downloadUrl: `/api/pix/payment/${paymentId}/receipt.pdf`,
        correlationId: receipt.correlationId,
      };
    }

    return receipt;
  }

  async generateQrCode(generateQrCodeDto: GenerateQrCodeDto): Promise<QrCodeResponseDto> {
    // Validate PIX key format
    this.validatePixKey(generateQrCodeDto.pixKey, generateQrCodeDto.pixKeyType);

    // Generate QR code text (PIX format)
    const qrCodeText = this.generatePixQrCodeText(generateQrCodeDto);

    // Generate base64 QR code image (in a real app, this would use a QR code library)
    const qrCode = Buffer.from(qrCodeText).toString('base64');

    return {
      qrCode,
      qrCodeText,
      correlationId: uuidv4(),
    };
  }

  async scanQrCode(scanQrCodeDto: ScanQrCodeDto): Promise<QrCodeScanResponseDto> {
    // In a real app, this would decode the QR code image
    // For now, we'll simulate by decoding the base64 and parsing the PIX text
    try {
      const qrCodeText = Buffer.from(scanQrCodeDto.qrCodeImage, 'base64').toString();
      
      // Simulate parsing PIX QR code text
      const parsedData = this.parsePixQrCodeText(qrCodeText);

      return {
        pixKey: parsedData.pixKey,
        pixKeyType: parsedData.pixKeyType,
        recipientName: parsedData.recipientName,
        amount: parsedData.amount,
        description: parsedData.description,
        correlationId: uuidv4(),
      };
    } catch (error) {
      throw new BadRequestException('Invalid QR code image');
    }
  }

  async getContacts(): Promise<PixContactsResponseDto> {
    const contacts = Array.from(this.contacts.values());
    
    return {
      contacts,
      correlationId: uuidv4(),
    };
  }

  async addContact(pixContactDto: PixContactDto): Promise<PixContactResponseDto> {
    // Validate PIX key format
    this.validatePixKey(pixContactDto.value, pixContactDto.type);

    // Check if contact already exists
    const existingContact = Array.from(this.contacts.values()).find(
      contact => contact.value === pixContactDto.value && contact.type === pixContactDto.type
    );

    if (existingContact) {
      throw new BadRequestException('Contact already exists');
    }

    const contact: PixContact = {
      id: uuidv4(),
      type: pixContactDto.type,
      value: pixContactDto.value,
      name: pixContactDto.name,
      bank: pixContactDto.bank,
      createdAt: new Date().toISOString(),
    };

    this.contacts.set(contact.id, contact);

    return contact;
  }

  async removeContact(contactId: string): Promise<{ success: boolean; correlationId: string }> {
    const contact = this.contacts.get(contactId);
    if (!contact) {
      throw new NotFoundException('Contact not found');
    }

    this.contacts.delete(contactId);

    return {
      success: true,
      correlationId: uuidv4(),
    };
  }

  async getLimits(): Promise<PixLimitsResponseDto> {
    const dailyLimit = 10000;
    const monthlyLimit = 50000;

    return {
      dailyLimit,
      monthlyLimit,
      usedToday: this.dailyUsage,
      usedThisMonth: this.monthlyUsage,
      remainingToday: Math.max(0, dailyLimit - this.dailyUsage),
      remainingThisMonth: Math.max(0, monthlyLimit - this.monthlyUsage),
      correlationId: uuidv4(),
    };
  }

  private validatePixKey(pixKey: string, type: PixKeyType): void {
    switch (type) {
      case PixKeyType.CPF:
        if (!/^\d{3}\.\d{3}\.\d{3}-\d{2}$/.test(pixKey)) {
          throw new BadRequestException('Invalid CPF format');
        }
        break;
      case PixKeyType.CNPJ:
        if (!/^\d{2}\.\d{3}\.\d{3}\/\d{4}-\d{2}$/.test(pixKey)) {
          throw new BadRequestException('Invalid CNPJ format');
        }
        break;
      case PixKeyType.EMAIL:
        if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(pixKey)) {
          throw new BadRequestException('Invalid email format');
        }
        break;
      case PixKeyType.PHONE:
        if (!/^\+55 \d{2} \d{4,5}-\d{4}$/.test(pixKey)) {
          throw new BadRequestException('Invalid phone format');
        }
        break;
      case PixKeyType.RANDOM:
        if (pixKey.length < 32 || pixKey.length > 77) {
          throw new BadRequestException('Invalid random key length');
        }
        break;
    }
  }

  private checkLimits(amount: number): void {
    const limits = {
      dailyLimit: 10000,
      monthlyLimit: 50000,
    };

    if (this.dailyUsage + amount > limits.dailyLimit) {
      throw new BadRequestException('Daily limit exceeded');
    }

    if (this.monthlyUsage + amount > limits.monthlyLimit) {
      throw new BadRequestException('Monthly limit exceeded');
    }
  }

  private getBankByPixKey(pixKey: string): string {
    // In a real app, this would query a database or external service
    const banks = ['Banco do Brasil', 'Itaú', 'Bradesco', 'Santander', 'Caixa'];
    return banks[Math.floor(Math.random() * banks.length)];
  }

  private processPayment(paymentId: string): void {
    const payment = this.payments.get(paymentId);
    if (!payment) return;

    // Update to processing
    payment.status = PaymentStatus.PROCESSING;
    payment.processedAt = new Date().toISOString();

    // Simulate completion after 10 seconds
    setTimeout(() => {
      const updatedPayment = this.payments.get(paymentId);
      if (updatedPayment) {
        updatedPayment.status = PaymentStatus.COMPLETED;
        updatedPayment.completedAt = new Date().toISOString();
      }
    }, 10000);
  }

  private generatePixQrCodeText(data: GenerateQrCodeDto): string {
    // Simplified PIX QR code text format
    return `00020126580014br.gov.bcb.pix0136${data.pixKey}520400005303986540${data.amount.toFixed(2)}5802BR5913${data.recipientName}6008${data.description}6304`;
  }

  private parsePixQrCodeText(qrCodeText: string): any {
    // Simplified PIX QR code text parsing
    // In a real app, this would properly parse the PIX format
    return {
      pixKey: '+55 11 99999-9999',
      pixKeyType: PixKeyType.PHONE,
      recipientName: 'João Silva',
      amount: 150.00,
      description: 'Pagamento PIX',
    };
  }
}
