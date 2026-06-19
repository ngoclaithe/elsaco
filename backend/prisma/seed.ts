import { PrismaClient, Role } from '@prisma/client';
import * as bcrypt from 'bcryptjs';
import * as fs from 'fs';
import * as path from 'path';
import { randomBytes } from 'crypto';

const prisma = new PrismaClient();

const dataPath = path.join(__dirname, 'acp-data.json');
const acpData = JSON.parse(fs.readFileSync(dataPath, 'utf-8')) as {
  collections: { name: string; slug: string }[];
  products: Array<{
    name: string;
    slug: string;
    description: string;
    details: string;
    price: number;
    comparePrice: number | null;
    images: string[];
    sizes: string[];
    stock: number;
    featured: boolean;
    categorySlug: string;
  }>;
};

const SHOP_COLLECTIONS = ['tops', 'bottoms', 'accessories'];

async function main() {
  const hashedPassword = await bcrypt.hash('admin123', 10);
  const userPassword = await bcrypt.hash('user123', 10);

  await prisma.user.upsert({
    where: { email: 'admin@elsaco.com' },
    update: { password: hashedPassword, role: Role.ADMIN },
    create: {
      email: 'admin@elsaco.com',
      password: hashedPassword,
      name: 'Admin elSaco',
      role: Role.ADMIN,
      phone: '0938328604',
    },
  });

  await prisma.user.upsert({
    where: { email: 'user@elsaco.com' },
    update: {},
    create: {
      email: 'user@elsaco.com',
      password: userPassword,
      name: 'Demo User',
      role: Role.USER,
      phone: '0901234567',
      cart: { create: {} },
    },
  });

  for (const cat of acpData.collections.filter((c) =>
    SHOP_COLLECTIONS.includes(c.slug),
  )) {
    await prisma.category.upsert({
      where: { slug: cat.slug },
      update: { name: cat.name },
      create: { name: cat.name, slug: cat.slug },
    });
  }

  for (const p of acpData.products) {
    const category = await prisma.category.findUnique({
      where: { slug: p.categorySlug },
    });
    if (!category) continue;

    await prisma.product.upsert({
      where: { slug: p.slug },
      update: {
        name: p.name,
        description: p.description,
        details: p.details,
        price: p.price,
        comparePrice: p.comparePrice,
        images: p.images,
        sizes: p.sizes,
        stock: p.stock,
        featured: p.featured,
        categoryId: category.id,
      },
      create: {
        name: p.name,
        slug: p.slug,
        description: p.description,
        details: p.details,
        price: p.price,
        comparePrice: p.comparePrice,
        images: p.images,
        sizes: p.sizes,
        stock: p.stock,
        featured: p.featured,
        categoryId: category.id,
      },
    });
  }

  console.log(`Seed completed: ${acpData.products.length} products`);

  await prisma.siteSettings.upsert({
    where: { id: 'default' },
    update: {},
    create: {
      id: 'default',
      bankAccountName: 'Lai The Ngoc',
      bankAccountNumber: '1468651509999',
      bankName: 'MBBank',
      storeName: 'elSaco',
      sepayWebhookKey: randomBytes(32).toString('hex'),
      shippingFee: 30000,
    },
  });
}

main()
  .catch(console.error)
  .finally(() => prisma.$disconnect());
