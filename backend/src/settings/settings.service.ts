import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { randomBytes } from 'crypto';

export interface PaymentSettings {
  bankAccountName: string;
  bankAccountNumber: string;
  bankName: string;
  storeName: string;
  shippingFee: number;
}

export interface SiteSettingsAdmin extends PaymentSettings {
  sepayWebhookKey: string;
  webhookUrl: string;
}

@Injectable()
export class SettingsService {
  constructor(private prisma: PrismaService) {}

  async ensureSettings() {
    const existing = await this.prisma.siteSettings.findUnique({
      where: { id: 'default' },
    });
    if (existing) return existing;

    return this.prisma.siteSettings.create({
      data: {
        id: 'default',
        sepayWebhookKey: randomBytes(32).toString('hex'),
      },
    });
  }

  async getPaymentSettings(): Promise<PaymentSettings> {
    const s = await this.ensureSettings();
    return {
      bankAccountName: s.bankAccountName,
      bankAccountNumber: s.bankAccountNumber,
      bankName: s.bankName,
      storeName: s.storeName,
      shippingFee: s.shippingFee,
    };
  }

  async getAdminSettings(apiBaseUrl: string): Promise<SiteSettingsAdmin> {
    const s = await this.ensureSettings();
    return {
      bankAccountName: s.bankAccountName,
      bankAccountNumber: s.bankAccountNumber,
      bankName: s.bankName,
      storeName: s.storeName,
      shippingFee: s.shippingFee,
      sepayWebhookKey: s.sepayWebhookKey,
      webhookUrl: `${apiBaseUrl}/webhooks/sepay`,
    };
  }

  async updateSettings(data: Partial<PaymentSettings & { sepayWebhookKey?: string }>) {
    await this.ensureSettings();
    return this.prisma.siteSettings.update({
      where: { id: 'default' },
      data,
    });
  }

  buildQrUrl(settings: PaymentSettings, amount: number, transferContent: string) {
    const params = new URLSearchParams({
      acc: settings.bankAccountNumber,
      bank: settings.bankName,
      amount: String(amount),
      des: transferContent,
      template: 'compact',
      store: settings.storeName,
      holder: settings.bankAccountName,
    });
    return `https://qr.sepay.vn/img?${params.toString()}`;
  }
}
