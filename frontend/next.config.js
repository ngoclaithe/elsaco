/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    remotePatterns: [
      { protocol: 'https', hostname: 'cdn.shopify.com' },
      { protocol: 'https', hostname: 'qr.sepay.vn' },
      { protocol: 'https', hostname: 'picsum.photos' },
      { protocol: 'https', hostname: 'fastly.picsum.photos' },
      { protocol: 'https', hostname: 'images.unsplash.com' },
    ],
  },
  async redirects() {
    return [
      {
        source: '/shop',
        destination: '/collections/all-products',
        permanent: true,
      },
      {
        source: '/shop/:category',
        destination: '/collections/:category',
        permanent: true,
      },
      {
        source: '/admin',
        destination: '/portal',
        permanent: true,
      },
      {
        source: '/admin/:path*',
        destination: '/portal/:path*',
        permanent: true,
      },
    ];
  },
  async rewrites() {
    const apiInternal = process.env.API_INTERNAL_URL || 'http://localhost:4021';
    return [
      {
        source: '/api/:path*',
        destination: `${apiInternal}/api/:path*`,
      },
    ];
  },
};

module.exports = nextConfig;
