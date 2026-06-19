import Link from 'next/link';

export function Footer() {
  return (
    <footer className="mt-auto border-t border-neutral-200 bg-neutral-50">
      <div className="max-w-[1400px] mx-auto px-4 lg:px-8 py-4 text-center text-xs text-muted space-y-2">
        <nav className="flex flex-wrap items-center justify-center gap-x-3 gap-y-1">
          <span>© 2026 elSaco</span>
          <span aria-hidden>·</span>
          <Link href="/policies/privacy" className="hover:underline hover:text-foreground">
            Privacy
          </Link>
          <span aria-hidden>·</span>
          <Link href="/policies/shipping" className="hover:underline hover:text-foreground">
            Shipping
          </Link>
          <span aria-hidden>·</span>
          <Link href="/policies/refund" className="hover:underline hover:text-foreground">
            Refund
          </Link>
          <span aria-hidden>·</span>
          <Link href="/policies/contact" className="hover:underline hover:text-foreground">
            Contact
          </Link>
          <span aria-hidden>·</span>
          <a
            href="https://instagram.com"
            target="_blank"
            rel="noopener noreferrer"
            className="hover:underline hover:text-foreground"
          >
            Instagram
          </a>
        </nav>

        <p className="text-foreground">
          CÔNG TY TNHH THƯƠNG MẠI &amp; DỊCH VỤ DOSU — Số 03, Ngách 72/59 Đường Tây Mỗ, Phường Tây
          Mỗ, TP Hà Nội
        </p>

        <p>
          <a href="tel:0346437915" className="hover:underline hover:text-foreground">
            0346 437 915 (Lại Thế Ngọc)
          </a>
          {' · '}
          <a href="mailto:support@dosutech.site" className="hover:underline hover:text-foreground">
            support@dosutech.site
          </a>
        </p>
      </div>
    </footer>
  );
}
