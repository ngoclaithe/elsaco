import type { Metadata } from 'next';
import './globals.css';
import { Header } from '@/components/layout/Header';
import { Footer } from '@/components/layout/Footer';
import { CartDrawer } from '@/components/cart/CartDrawer';
import { CartRouteSync } from '@/components/cart/CartRouteSync';
import { AuthProvider } from '@/components/providers/AuthProvider';
import { StoreOnly } from '@/components/layout/StoreOnly';

export const metadata: Metadata = {
  title: 'elSaco',
  description: 'elSaco - Streetwear Fashion',
};

export const viewport = {
  width: 'device-width',
  initialScale: 1,
  viewportFit: 'cover' as const,
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="vi">
      <body className="min-h-screen flex flex-col overflow-x-hidden">
        <AuthProvider>
          <CartRouteSync />
          <StoreOnly>
            <Header />
          </StoreOnly>
          <main className="flex-1">{children}</main>
          <StoreOnly>
            <Footer />
            <CartDrawer />
          </StoreOnly>
        </AuthProvider>
      </body>
    </html>
  );
}
