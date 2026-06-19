import Link from 'next/link';

const policies: Record<string, { title: string; content: string }> = {
  privacy: {
    title: 'Privacy Policy',
    content: `At elSaco, we respect your privacy and are committed to protecting your personal data.

We collect information you provide when creating an account, placing an order, or contacting us. This may include your name, email address, phone number, and shipping address.

We use this information to process orders, communicate with you, and improve our services. We do not sell your personal information to third parties.

For any privacy-related inquiries, please contact us at hotline 0938328604.`,
  },
  shipping: {
    title: 'Shipping Policy',
    content: `We ship nationwide across Vietnam.

Standard shipping: 3-5 business days within Ho Chi Minh City, 5-7 business days for other provinces.

Shipping fee: 30,000₫ per order.

Orders are processed within 1-2 business days. You will receive a confirmation email once your order has been shipped.

For express shipping options, please contact us at 0938328604.`,
  },
  refund: {
    title: 'Refund Policy',
    content: `We accept returns within 7 days of delivery for unused items in original condition with tags attached.

To initiate a return, please contact us at 0938328604 with your order number.

Refunds will be processed within 5-7 business days after we receive the returned item.

Sale items and accessories are final sale unless defective.`,
  },
  contact: {
    title: 'Contact Information',
    content: `CÔNG TY TNHH THƯƠNG MẠI & DỊCH VỤ DOSU
Đối tác công nghệ tin cậy, xây dựng giải pháp toàn diện từ ý tưởng đến sản phẩm hoàn thiện.

Số 03, Ngách 72/59 Đường Tây Mỗ, Phường Tây Mỗ, TP Hà Nội
0346 437 915 (Lại Thế Ngọc)
support@dosutech.site`,
  },
};

export default async function PolicyPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const policy = policies[slug];

  if (!policy) {
    return (
      <div className="max-w-3xl mx-auto px-4 py-16 text-center">
        <h1 className="text-2xl font-medium mb-4">Page not found</h1>
        <Link href="/" className="text-sm underline">
          Back to home
        </Link>
      </div>
    );
  }

  return (
    <div className="max-w-3xl mx-auto px-4 lg:px-8 py-16 lg:py-24">
      <h1 className="text-2xl lg:text-3xl font-medium mb-8">{policy.title}</h1>
      <div className="text-sm text-muted leading-relaxed whitespace-pre-line">
        {policy.content}
      </div>
    </div>
  );
}
