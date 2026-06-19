-- AlterTable
CREATE TYPE "PaymentStatus" AS ENUM ('PENDING', 'PAID', 'FAILED');

CREATE TABLE "SiteSettings" (
    "id" TEXT NOT NULL DEFAULT 'default',
    "bankAccountName" TEXT NOT NULL DEFAULT 'Lai The Ngoc',
    "bankAccountNumber" TEXT NOT NULL DEFAULT '1468651509999',
    "bankName" TEXT NOT NULL DEFAULT 'MBBank',
    "storeName" TEXT NOT NULL DEFAULT 'elSaco',
    "sepayWebhookKey" TEXT NOT NULL,
    "shippingFee" INTEGER NOT NULL DEFAULT 30000,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "SiteSettings_pkey" PRIMARY KEY ("id")
);

CREATE TABLE "SepayTransaction" (
    "sepayId" INTEGER NOT NULL,
    "orderId" TEXT,
    "amount" INTEGER NOT NULL,
    "content" TEXT NOT NULL,
    "processedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "SepayTransaction_pkey" PRIMARY KEY ("sepayId")
);

ALTER TABLE "Order" ADD COLUMN "paymentStatus" "PaymentStatus" NOT NULL DEFAULT 'PENDING';
ALTER TABLE "Order" ADD COLUMN "paymentMethod" TEXT NOT NULL DEFAULT 'bank_transfer';
ALTER TABLE "Order" ADD COLUMN "transferContent" TEXT;
ALTER TABLE "Order" ADD COLUMN "paidAt" TIMESTAMP(3);

UPDATE "Order" SET "transferContent" = "orderNumber" WHERE "transferContent" IS NULL;

ALTER TABLE "Order" ALTER COLUMN "transferContent" SET NOT NULL;
CREATE UNIQUE INDEX "Order_transferContent_key" ON "Order"("transferContent");
