import {
  Injectable,
  UnauthorizedException,
  Logger,
} from '@nestjs/common';
import { PaymentStatus, OrderStatus } from '@prisma/client';
import { PrismaService } from '../prisma/prisma.service';
import { SettingsService } from '../settings/settings.service';

interface SepayWebhookPayload {
  id: number;
  gateway?: string;
  accountNumber?: string;
  code?: string | null;
  content?: string;
  transferType?: string;
  description?: string;
  transferAmount?: number;
}

@Injectable()
export class SepayService {
  private readonly logger = new Logger(SepayService.name);

  constructor(
    private prisma: PrismaService,
    private settingsService: SettingsService,
  ) {}

  validateApiKey(authHeader: string | undefined, expectedKey: string) {
    if (!authHeader) throw new UnauthorizedException('Missing authorization');
    const expected = `Apikey ${expectedKey}`;
    if (authHeader !== expected) {
      throw new UnauthorizedException('Invalid API key');
    }
  }

  async processWebhook(payload: SepayWebhookPayload) {
    if (payload.transferType && payload.transferType !== 'in') {
      return { success: true, skipped: true };
    }

    const existing = await this.prisma.sepayTransaction.findUnique({
      where: { sepayId: payload.id },
    });
    if (existing) {
      return { success: true, duplicate: true };
    }

    const amount = payload.transferAmount || 0;
    const haystack = [
      payload.content,
      payload.code,
      payload.description,
    ]
      .filter(Boolean)
      .join(' ')
      .toUpperCase();

    const pendingOrders = await this.prisma.order.findMany({
      where: { paymentStatus: PaymentStatus.PENDING },
      orderBy: { createdAt: 'desc' },
      take: 100,
    });

    const order = pendingOrders.find(
      (o) =>
        haystack.includes(o.transferContent.toUpperCase()) &&
        o.total === amount,
    );

    await this.prisma.sepayTransaction.create({
      data: {
        sepayId: payload.id,
        orderId: order?.id,
        amount,
        content: payload.content || '',
      },
    });

    if (order) {
      await this.prisma.order.update({
        where: { id: order.id },
        data: {
          paymentStatus: PaymentStatus.PAID,
          status: OrderStatus.CONFIRMED,
          paidAt: new Date(),
        },
      });
      this.logger.log(`Order ${order.orderNumber} marked as paid`);
    }

    return { success: true, matched: !!order };
  }
}
