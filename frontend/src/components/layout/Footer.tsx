import Link from 'next/link';

export function Footer() {
  return (
    <footer className="mt-auto border-t border-neutral-200">
      <div className="max-w-[1400px] mx-auto px-4 lg:px-8 py-10 text-center">
        <p className="text-sm">© 2026 elSaco</p>

        <nav className="mt-4 flex flex-wrap items-center justify-center gap-x-6 gap-y-2 text-sm">
          <Link href="/policies/privacy" className="hover:underline">
            Privacy policy
          </Link>
          <Link href="/policies/shipping" className="hover:underline">
            Shipping policy
          </Link>
          <Link href="/policies/refund" className="hover:underline">
            Refund policy
          </Link>
          <Link href="/policies/contact" className="hover:underline">
            Contact information
          </Link>
        </nav>

        <a
          href="https://instagram.com"
          target="_blank"
          rel="noopener noreferrer"
          className="inline-block mt-4 text-sm hover:underline"
        >
          Instagram
        </a>
      </div>

      <div className="border-t border-neutral-200 bg-neutral-50">
        <div className="max-w-[1400px] mx-auto px-4 lg:px-8 py-8 text-center text-xs text-muted leading-relaxed space-y-1">
          <p className="font-medium text-foreground">
            CÔNG TY TNHH THƯƠNG MẠI &amp; DỊCH VỤ DOSU
          </p>
          <p>
            Đối tác công nghệ tin cậy, xây dựng giải pháp toàn diện từ ý tưởng đến sản phẩm hoàn thiện.
          </p>
          <p>Số 03, Ngách 72/59 Đường Tây Mỗ, Phường Tây Mỗ, TP Hà Nội</p>
          <p>
            <a href="tel:0346437915" className="hover:underline">
              0346 437 915 (Lại Thế Ngọc)
            </a>
          </p>
          <p>
            <a href="mailto:support@dosutech.site" className="hover:underline">
              support@dosutech.site
            </a>
          </p>
        </div>
      </div>
    </footer>
  );
}
