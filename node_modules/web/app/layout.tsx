import './globals.css';
import type { Metadata } from 'next';
import { Inter } from 'next/font/google';

import SiteFooter from '@/components/SiteFooter';
import SiteHeader from '@/components/SiteHeader';

const inter = Inter({ subsets: ['latin'] });

export const metadata: Metadata = {
  title: 'PhnxByte',
  description: 'Next-Gen TypeScript Interface & Client Generator',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang='en'>
      <body className={inter.className}>
        <div className='min-h-screen flex flex-col'>
          <SiteHeader />
          <div className='flex-1'>{children}</div>
          <SiteFooter />
        </div>
      </body>
    </html>
  );
}
