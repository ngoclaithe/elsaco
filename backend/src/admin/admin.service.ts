import { Injectable, NotFoundException, ConflictException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { PrismaService } from '../prisma/prisma.service';
import { SettingsService } from '../settings/settings.service';
import { OrderStatus, PaymentStatus } from '@prisma/client';

interface CreateProductDto {
  name: string;
  slug: string;
  description: string;
  details?: string;
  price: number;
  comparePrice?: number;
  images: string[];
  sizes: string[];
  stock: number;
  featured?: boolean;
  categoryId: string;
}

interface UpdateProductDto extends Partial<CreateProductDto> {}

interface CategoryDto {
  name: string;
  slug: string;
}

@Injectable()
export class AdminService {
  constructor(
    private prisma: PrismaService,
    private settingsService: SettingsService,
    private config: ConfigService,
  ) {}

  private apiBaseUrl() {
    const explicit = this.config.get<string>('API_PUBLIC_URL');
    if (explicit) return explicit.replace(/\/$/, '');
    const port = this.config.get('PORT') || 4021;
    return `http://localhost:${port}/api`;
  }

  private buildLast7DaysChart(
    orders: { createdAt: Date; total: number; paymentStatus: PaymentStatus }[],
  ) {
    const days = 7;
    const start = new Date();
    start.setHours(0, 0, 0, 0);
    start.setDate(start.getDate() - (days - 1));

    const dateKey = (d: Date) => d.toISOString().slice(0, 10);

    return Array.from({ length: days }, (_, i) => {
      const day = new Date(start);
      day.setDate(start.getDate() + i);
      const key = dateKey(day);
      const dayOrders = orders.filter((o) => dateKey(o.createdAt) === key);

      return {
        date: key,
        label: day.toLocaleDateString('vi-VN', { weekday: 'short', day: 'numeric' }),
        orders: dayOrders.length,
        revenue: dayOrders
          .filter((o) => o.paymentStatus === PaymentStatus.PAID)
          .reduce((sum, o) => sum + o.total, 0),
      };
    });
  }

  async getDashboardStats() {
    const chartStart = new Date();
    chartStart.setHours(0, 0, 0, 0);
    chartStart.setDate(chartStart.getDate() - 6);

    const [
      totalProducts,
      totalOrders,
      totalUsers,
      revenue,
      pendingPayments,
      recentOrders,
      chartOrders,
      ordersByStatus,
      productsByCategory,
    ] = await Promise.all([
      this.prisma.product.count(),
      this.prisma.order.count(),
      this.prisma.user.count({ where: { role: 'USER' } }),
      this.prisma.order.aggregate({
        _sum: { total: true },
        where: { paymentStatus: PaymentStatus.PAID },
      }),
      this.prisma.order.count({ where: { paymentStatus: PaymentStatus.PENDING } }),
      this.prisma.order.findMany({
        take: 5,
        orderBy: { createdAt: 'desc' },
        include: {
          user: { select: { name: true, email: true } },
        },
      }),
      this.prisma.order.findMany({
        where: { createdAt: { gte: chartStart } },
        select: { createdAt: true, total: true, paymentStatus: true },
      }),
      this.prisma.order.groupBy({
        by: ['status'],
        _count: { status: true },
      }),
      this.prisma.category.findMany({
        select: { name: true, _count: { select: { products: true } } },
        orderBy: { name: 'asc' },
      }),
    ]);

    return {
      totalProducts,
      totalOrders,
      totalUsers,
      totalRevenue: revenue._sum.total || 0,
      pendingPayments,
      recentOrders,
      salesChart: this.buildLast7DaysChart(chartOrders),
      ordersByStatus: ordersByStatus.map((row) => ({
        status: row.status,
        count: row._count.status,
      })),
      productsByCategory: productsByCategory.map((cat) => ({
        name: cat.name,
        count: cat._count.products,
      })),
    };
  }

  getSettings() {
    return this.settingsService.getAdminSettings(this.apiBaseUrl());
  }

  async updateSettings(data: {
    bankAccountName?: string;
    bankAccountNumber?: string;
    bankName?: string;
    storeName?: string;
    shippingFee?: number;
    sepayWebhookKey?: string;
  }) {
    await this.settingsService.updateSettings(data);
    return this.getSettings();
  }

  async getAllCategories() {
    return this.prisma.category.findMany({
      include: { _count: { select: { products: true } } },
      orderBy: { name: 'asc' },
    });
  }

  async createCategory(dto: CategoryDto) {
    const exists = await this.prisma.category.findUnique({
      where: { slug: dto.slug },
    });
    if (exists) throw new ConflictException('Slug already exists');
    return this.prisma.category.create({ data: dto });
  }

  async updateCategory(id: string, dto: Partial<CategoryDto>) {
    const cat = await this.prisma.category.findUnique({ where: { id } });
    if (!cat) throw new NotFoundException('Category not found');
    return this.prisma.category.update({ where: { id }, data: dto });
  }

  async deleteCategory(id: string) {
    const cat = await this.prisma.category.findUnique({
      where: { id },
      include: { _count: { select: { products: true } } },
    });
    if (!cat) throw new NotFoundException('Category not found');
    if (cat._count.products > 0) {
      throw new ConflictException('Category has products');
    }
    await this.prisma.category.delete({ where: { id } });
    return { success: true };
  }

  async getAllProducts() {
    return this.prisma.product.findMany({
      include: { category: true },
      orderBy: { createdAt: 'desc' },
    });
  }

  async createProduct(dto: CreateProductDto) {
    return this.prisma.product.create({
      data: dto,
      include: { category: true },
    });
  }

  async updateProduct(id: string, dto: UpdateProductDto) {
    const product = await this.prisma.product.findUnique({ where: { id } });
    if (!product) throw new NotFoundException('Product not found');

    return this.prisma.product.update({
      where: { id },
      data: dto,
      include: { category: true },
    });
  }

  async deleteProduct(id: string) {
    const product = await this.prisma.product.findUnique({ where: { id } });
    if (!product) throw new NotFoundException('Product not found');

    await this.prisma.product.delete({ where: { id } });
    return { success: true };
  }

  async getAllOrders() {
    return this.prisma.order.findMany({
      include: {
        user: { select: { id: true, name: true, email: true } },
        items: true,
      },
      orderBy: { createdAt: 'desc' },
    });
  }

  async updateOrderStatus(orderId: string, status: OrderStatus) {
    const order = await this.prisma.order.findUnique({
      where: { id: orderId },
    });
    if (!order) throw new NotFoundException('Order not found');

    return this.prisma.order.update({
      where: { id: orderId },
      data: { status },
      include: { items: true, user: { select: { name: true, email: true } } },
    });
  }

  async getAllUsers() {
    return this.prisma.user.findMany({
      select: {
        id: true,
        email: true,
        name: true,
        phone: true,
        role: true,
        createdAt: true,
        _count: { select: { orders: true } },
      },
      orderBy: { createdAt: 'desc' },
    });
  }
}
