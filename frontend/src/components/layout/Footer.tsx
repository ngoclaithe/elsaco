import Link from 'next/link';

export function Footer() {
  return (
    <footer className="border-t border-neutral-200 mt-auto store-footer">
      <div className="max-w-[1400px] mx-auto px-4 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-12">
          <div>
            <h3 className="text-sm font-semibold tracking-widest uppercase mb-4">
              elSaco
            </h3>
            <p className="text-sm text-muted leading-relaxed">
              Streetwear fashion brand. Bold designs, premium quality.
            </p>
          </div>

          <div>
            <h4 className="text-xs font-medium uppercase tracking-wider text-muted mb-4">
              Terms and Policies
            </h4>
            <ul className="space-y-2">
              <li>
                <Link href="/policies/privacy" className="text-sm link-underline">
                  Privacy policy
                </Link>
              </li>
              <li>
                <Link href="/policies/shipping" className="text-sm link-underline">
                  Shipping policy
                </Link>
              </li>
              <li>
                <Link href="/policies/refund" className="text-sm link-underline">
                  Refund policy
                </Link>
              </li>
              <li>
                <Link href="/policies/contact" className="text-sm link-underline">
                  Contact information
                </Link>
              </li>
            </ul>
          </div>

          <div>
            <h4 className="text-xs font-medium uppercase tracking-wider text-muted mb-4">
              Follow us
            </h4>
            <a
              href="https://instagram.com"
              target="_blank"
              rel="noopener noreferrer"
              className="text-sm link-underline"
            >
              Instagram
            </a>
          </div>
        </div>

        <div className="border-t border-neutral-200 pt-8">
          <p className="text-xs text-muted text-center mb-4">
            © 2026 elSaco, Powered by elSaco
          </p>
          <div className="text-xs text-muted text-center leading-relaxed">
            <p>HỘ KINH DOANH elSaco</p>
            <p>MST: 079096007477 do Chi cục Thuế cấp ngày 25/05/2026</p>
            <p>ĐC: C38, Ấp 50, Xuân Thới Sơn, Thành phố Hồ Chí Minh, Việt Nam</p>
            <p>Hotline: 0938328604</p>
          </div>
        </div>
      </div>
    </footer>
  );
}
