import { PrismaClient, Role } from '@prisma/client';
import * as bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

const img = (seed: number) => `https://picsum.photos/seed/elsaco${seed}/800/1000`;

const categories = [
  { name: 'Tops', slug: 'tops' },
  { name: 'Bottoms', slug: 'bottoms' },
  { name: 'Accessories', slug: 'accessories' },
];

const products = [
  {
    name: 'elSaco "A CHAOTIC PRESENCE" WHITE BOXY T-SHIRT',
    slug: 'elsaco-a-chaotic-presence-white-boxy-t-shirt',
    description: 'BOXY FIT',
    details: `Materials: 100% Cotton - 230GSM
Color: White
Inside-out seaming
Custom metal tag on the chest
Back graphic features laser-cut detailing on premium nylon fabric, finished with hand-pressed metal studs
Reversible

Size and Fit
Model is 175cm, wearing top size L, bottom size L`,
    price: 539000,
    comparePrice: 569000,
    images: [img(1)],
    sizes: ['M', 'L', 'XL'],
    stock: 15,
    featured: true,
    categorySlug: 'tops',
  },
  {
    name: 'elSaco "A COVER PIECE" DIRT WHITE BOXY T-SHIRT',
    slug: 'elsaco-a-cover-piece-dirt-white-boxy-t-shirt',
    description: 'BOXY FIT',
    details: 'Materials: 100% Cotton - 230GSM\nColor: Dirt White\nInside-out seaming\nCustom metal tag',
    price: 639000,
    comparePrice: 569000,
    images: [img(2)],
    sizes: ['M', 'L', 'XL'],
    stock: 10,
    featured: true,
    categorySlug: 'tops',
  },
  {
    name: 'elSaco "CYCLONE" WHITE BOXY T-SHIRT',
    slug: 'elsaco-cyclone-white-boxy-t-shirt',
    description: 'BOXY FIT',
    details: 'Materials: 100% Cotton - 230GSM\nColor: White\nGraphic print front and back',
    price: 370000,
    comparePrice: 569000,
    images: [img(3)],
    sizes: ['M', 'L', 'XL'],
    stock: 20,
    featured: true,
    categorySlug: 'tops',
  },
  {
    name: 'elSaco "P*RN ST4R" WHITE BOXY T-SHIRT',
    slug: 'elsaco-porn-st4r-white-boxy-t-shirt',
    description: 'BOXY FIT',
    details: 'Materials: 100% Cotton - 230GSM\nColor: White\nBold graphic design',
    price: 370000,
    comparePrice: 569000,
    images: [img(4)],
    sizes: ['M', 'L', 'XL'],
    stock: 8,
    featured: true,
    categorySlug: 'tops',
  },
  {
    name: 'elSaco BASIC LOGO BLACK BOXY T-SHIRT',
    slug: 'elsaco-basic-logo-black-boxy-t-shirt',
    description: 'BOXY FIT',
    details: 'Materials: 100% Cotton - 230GSM\nColor: Black\nMinimal logo chest print',
    price: 324000,
    comparePrice: 539000,
    images: [img(5)],
    sizes: ['M', 'L', 'XL'],
    stock: 25,
    featured: false,
    categorySlug: 'tops',
  },
  {
    name: 'elSaco ASH GREY DESTROYED BAGGY CAPRI',
    slug: 'elsaco-ash-grey-destroyed-baggy-capri',
    description: 'BAGGY FIT',
    details: 'Materials: Cotton blend\nColor: Ash Grey\nDestroyed detailing\nWide leg capri cut',
    price: 679000,
    comparePrice: 769000,
    images: [img(6)],
    sizes: ['M', 'L', 'XL'],
    stock: 12,
    featured: false,
    categorySlug: 'bottoms',
  },
  {
    name: 'elSaco BLACK NOIR RAW BAGGY JEANS',
    slug: 'elsaco-black-noir-raw-baggy-jeans',
    description: 'BAGGY FIT',
    details: 'Materials: 100% Cotton denim\nColor: Black Noir\nRaw hem\nWide leg silhouette',
    price: 969000,
    comparePrice: null,
    images: [img(7)],
    sizes: ['M', 'L', 'XL'],
    stock: 6,
    featured: false,
    categorySlug: 'bottoms',
  },
  {
    name: 'elSaco ASH GREY TOWEL HEADWEAR',
    slug: 'elsaco-ash-grey-towel-headwear',
    description: 'HEADWEAR',
    details: 'Materials: Terry cotton towel fabric\nColor: Ash Grey\nSelf-tie design',
    price: 469000,
    comparePrice: null,
    images: [img(8)],
    sizes: ['ONE SIZE'],
    stock: 30,
    featured: false,
    categorySlug: 'accessories',
  },
  {
    name: 'elSaco BLACK DENIM MODULAR TOTEBAG',
    slug: 'elsaco-black-denim-modular-totebag',
    description: 'BAG',
    details: 'Materials: Denim\nColor: Black\nModular compartments\nAdjustable straps',
    price: 439000,
    comparePrice: 539000,
    images: [img(9)],
    sizes: ['ONE SIZE'],
    stock: 18,
    featured: false,
    categorySlug: 'accessories',
  },
  {
    name: 'elSaco BLACK MORSE PARACOD KEYCHAIN',
    slug: 'elsaco-black-morse-paracod-keychain',
    description: 'ACCESSORY',
    details: 'Materials: Paracord and metal\nColor: Black\nMorse code pattern',
    price: 199000,
    comparePrice: null,
    images: [img(10)],
    sizes: ['ONE SIZE'],
    stock: 50,
    featured: false,
    categorySlug: 'accessories',
  },
  {
    name: 'elSaco CAMO DUAL TOTE BAG',
    slug: 'elsaco-camo-dual-tote-bag',
    description: 'BAG',
    details: 'Materials: Canvas\nColor: Camo\nDual compartment design',
    price: 399000,
    comparePrice: 489000,
    images: [img(11)],
    sizes: ['ONE SIZE'],
    stock: 14,
    featured: false,
    categorySlug: 'accessories',
  },
  {
    name: 'elSaco RUSTED CENTER NECKLACE',
    slug: 'elsaco-rusted-center-necklace',
    description: 'JEWELRY',
    details: 'Materials: Metal alloy\nColor: Rusted finish\nCenter pendant design',
    price: 239000,
    comparePrice: null,
    images: [img(12)],
    sizes: ['ONE SIZE'],
    stock: 22,
    featured: false,
    categorySlug: 'accessories',
  },
];

async function main() {
  const hashedPassword = await bcrypt.hash('admin123', 10);
  const userPassword = await bcrypt.hash('user123', 10);

  await prisma.user.upsert({
    where: { email: 'admin@elsaco.com' },
    update: {},
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

  for (const cat of categories) {
    await prisma.category.upsert({
      where: { slug: cat.slug },
      update: {},
      create: cat,
    });
  }

  for (const p of products) {
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

  console.log('Seed completed!');
}

main()
  .catch(console.error)
  .finally(() => prisma.$disconnect());
