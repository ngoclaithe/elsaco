'use client';

import { useEffect, useState, Suspense } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import Image from 'next/image';
import { ordersApi } from '@/lib/api';
import { formatPrice, PAYMENT_STATUS_LABELS } from '@/lib/utils/format';
import type { OrderPaymentResponse } from '@/lib/types';
import { useAuth } from '@/hooks/useAuth';

function PaymentContent() {
  const params = useParams();
  const router = useRouter();
  const orderId = params.orderId as string;
  const { user, requireAuth } = useAuth();
  const [data, setData] = useState<OrderPaymentResponse | null>(null);
  const [loading, setLoading] = useState(true);
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    if (!requireAuth('/checkout')) return;
  }, [requireAuth]);

  useEffect(() => {
    if (!user || !orderId) return;

    const load = async () => {
      try {
        const res = await ordersApi.getPayment(orderId);
        setData(res);
        if (res.order.paymentStatus === 'PAID') {
          router.replace(`/account/orders/${orderId}?success=1`);
        }
      } catch {
        setData(null);
      }
      setLoading(false);
    };

    load();
    const interval = setInterval(async () => {
      try {
        const res = await ordersApi.getPayment(orderId);
        setData(res);
        if (res.order.paymentStatus === 'PAID') {
          router.replace(`/account/orders/${orderId}?success=1`);
        }
      } catch {
        /* ignore poll errors */
      }
    }, 5000);

    return () => clearInterval(interval);
  }, [user, orderId, router]);

  const copyContent = async () => {
    if (!data) return;
    await navigator.clipboard.writeText(data.payment.transferContent);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  if (loading) {
    return <div className="max-w-lg mx-auto px-4 py-16 text-center text-muted">Loading...</div>;
  }

  if (!data) {
    return (
      <div className="max-w-lg mx-auto px-4 py-16 text-center">
        <p className="mb-4">Order not found</p>
        <Link href="/account/orders" className="btn-primary">View orders</Link>
      </div>
    );
  }

  const { order, payment } = data;

  return (
    <div className="max-w-lg mx-auto px-4 sm:px-6 py-8 sm:py-12 lg:py-16">
      <h1 className="text-xl sm:text-2xl font-medium mb-2">Bank transfer</h1>
      <p className="text-sm text-muted mb-6 sm:mb-8 break-words">
        Order #{order.orderNumber} · {PAYMENT_STATUS_LABELS[order.paymentStatus || 'PENDING']}
      </p>

      <div className="border border-neutral-200 p-4 sm:p-6 space-y-6">
        <div className="text-center">
          <div className="relative w-full max-w-64 aspect-square mx-auto bg-white border border-neutral-200">
            <Image
              src={payment.qrUrl}
              alt="Payment QR"
              fill
              unoptimized
              className="object-contain p-2"
            />
          </div>
          <p className="text-xs text-muted mt-3">Scan QR to pay via banking app</p>
        </div>

        <div className="space-y-3 text-sm">
          <div className="flex justify-between gap-4">
            <span className="text-muted shrink-0">Bank</span>
            <span className="font-medium text-right">{payment.bankName}</span>
          </div>
          <div className="flex justify-between gap-4">
            <span className="text-muted shrink-0">Account</span>
            <span className="font-medium text-right break-all">{payment.bankAccountNumber}</span>
          </div>
          <div className="flex justify-between gap-4">
            <span className="text-muted shrink-0">Account name</span>
            <span className="font-medium text-right">{payment.bankAccountName}</span>
          </div>
          <div className="flex justify-between gap-4">
            <span className="text-muted shrink-0">Amount</span>
            <span className="font-medium text-base">{formatPrice(payment.amount)}</span>
          </div>
          <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-2 sm:gap-4">
            <span className="text-muted shrink-0">Transfer content</span>
            <button
              type="button"
              onClick={copyContent}
              className="font-medium underline hover:no-underline text-left sm:text-right break-all"
            >
              {payment.transferContent}
              {copied ? ' ✓' : ''}
            </button>
          </div>
        </div>

        <p className="text-xs text-muted leading-relaxed">
          Enter the exact transfer content and amount. Payment will be confirmed automatically
          within a few minutes after SePay receives the transaction.
        </p>

        <Link href={`/account/orders/${order.id}`} className="btn-secondary w-full text-center block">
          View order
        </Link>
      </div>
    </div>
  );
}

export default function PaymentPage() {
  return (
    <Suspense fallback={<div className="p-8 text-center">Loading...</div>}>
      <PaymentContent />
    </Suspense>
  );
}
