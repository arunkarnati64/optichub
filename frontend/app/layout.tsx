import type { Metadata } from 'next';
import { Suspense } from 'react';
import { Geist } from 'next/font/google';
import './globals.css';
import Header from '@/components/layout/Header';

const geist = Geist({ subsets: ['latin'] });

export const metadata: Metadata = {
  title: 'OpticHub',
  description: 'Premium eyewear store',
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className="h-full">
      <body className={`${geist.className} min-h-full flex flex-col bg-gray-50`}>
        <Suspense fallback={null}>
          <Header />
        </Suspense>
        <main className="flex-1">{children}</main>
      </body>
    </html>
  );
}
