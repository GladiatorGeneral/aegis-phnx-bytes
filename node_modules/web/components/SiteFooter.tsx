import Link from 'next/link';

export default function SiteFooter() {
  return (
    <footer className='border-t border-white/10'>
      <div className='mx-auto w-full max-w-6xl px-4 py-8 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 text-sm'>
        <div className='text-white/50'>
          <span className='text-white/70'>PhnxByte</span> — type-safe OpenAPI tooling.
        </div>
        <div className='flex items-center gap-3 text-white/50'>
          <Link className='hover:text-white transition-colors' href='/docs'>
            Docs
          </Link>
          <Link className='hover:text-white transition-colors' href='/chat'>
            Chat
          </Link>
        </div>
      </div>
    </footer>
  );
}
