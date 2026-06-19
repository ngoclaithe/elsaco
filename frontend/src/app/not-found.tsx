import Link from 'next/link';

export default function NotFound() {
  return (
    <div className="max-w-lg mx-auto px-4 py-24 text-center">
      <h1 className="text-4xl font-medium mb-4">404</h1>
      <p className="text-muted mb-8">Page not found</p>
      <Link href="/" className="btn-primary">
        Back to home
      </Link>
    </div>
  );
}
