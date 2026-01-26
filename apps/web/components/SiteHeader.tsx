import Link from 'next/link';
import { Suspense } from 'react';

function NavLinks() {
  const linkBase =
    'text-sm text-white/70 hover:text-white transition-colors px-3 py-2 rounded-lg hover:bg-white/5';

  return (
    <nav className='flex items-center gap-1'>
      <Link className={linkBase} href='/'>
        Home
      </Link>
      <Link className={linkBase} href='/generate'>
        Generate
      </Link>
      <Link className={linkBase} href='/docs'>
        Docs
      </Link>
      <Link className={linkBase} href='/chat'>
        Chat
      </Link>
      <Link className={linkBase} href='/vscode'>
        VS Code
      </Link>
      <Link className={linkBase} href='/phnxaura'>
        PhnxAura
      </Link>
    </nav>
  );
}

export default function SiteHeader() {
  return (
    <header className='sticky top-0 z-50 border-b border-white/10 bg-black/10 backdrop-blur-xl'>
      <div className='mx-auto w-full max-w-6xl px-4 py-3 flex items-center justify-between'>
        <Link href='/' className='flex items-center gap-2'>
          <span className='inline-flex h-8 w-8 items-center justify-center rounded-lg bg-white/10 border border-white/10'>
            P
          </span>
          <span className='font-semibold tracking-tight text-white'>PhnxByte</span>
          <span className='text-xs text-white/40'>v0.1</span>
        </Link>

        <div className='flex items-center gap-3'>
          <Suspense>
            <NavLinks />
          </Suspense>
          <Link
            href='/docs'
            className='hidden sm:inline-flex items-center justify-center px-4 py-2 rounded-xl bg-white text-black font-semibold hover:bg-gray-200 transition-colors'
          >
            Get Started
          </Link>
        </div>
      </div>
    </header>
  );
}
