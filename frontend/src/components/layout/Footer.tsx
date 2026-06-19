import Link from 'next/link';

export function Footer() {
  return (
    <footer className="mt-auto border-t border-neutral-200 bg-neutral-50 safe-x">
      <div className="max-w-[1400px] mx-auto px-0 sm:px-2 lg:px-4 py-4 sm:py-5 text-center text-xs text-muted space-y-2">
        <nav className="flex flex-wrap items-center justify-center gap-x-3 gap-y-2 px-2">
          <span>© 2026 elSaco</span>
          <span aria-hidden className="hidden sm:inline">·</span>
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

        <p className="text-foreground max-w-xl mx-auto px-4 leading-relaxed">
          CÔNG TY TNHH THƯƠNG MẠI &amp; DỊCH VỤ DOSU — Số 03, Ngách 72/59 Đường Tây Mỗ, Phường Tây
          Mỗ, TP Hà Nội
        </p>

        <p className="px-4">
          <a href="tel:0346437915" className="hover:underline hover:text-foreground">
            0346 437 915 (Lại Thế Ngọc)
          </a>
          <span className="hidden sm:inline">{' · '}</span>
          <span className="block sm:inline mt-1 sm:mt-0">
            <a href="mailto:support@dosutech.site" className="hover:underline hover:text-foreground">
              support@dosutech.site
            </a>
          </span>
        </p>
      </div>
    </footer>
  );
}
