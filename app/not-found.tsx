import Link from 'next/link';

export default function NotFound() {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-[hsl(0_0%_4%)] px-6 text-center">
      <p className="font-mono-label text-[11px] uppercase tracking-[0.4em] text-gold">
        Error 404
      </p>
      <h1 className="mt-4 font-serif-display text-5xl font-light text-champagne sm:text-7xl">
        Timepiece Not Found
      </h1>
      <p className="mt-5 max-w-md text-sm leading-relaxed text-steel sm:text-base">
        The page you seek has slipped through the gears. Let us guide you back to
        the collection.
      </p>
      <Link href="/" className="btn-luxe-gold mt-8">
        Return Home
      </Link>
    </div>
  );
}
