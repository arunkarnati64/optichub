import type { Metadata } from 'next';
import { Geist } from 'next/font/google';
import './globals.css';
import Header from '@/components/layout/Header';

const geist = Geist({ subsets: ['latin'] });

export const metadata: Metadata = {
  title: 'DropShop',
  description: 'Your one-stop dropshipping store',
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className="h-full">
      <body className={`${geist.className} min-h-full flex flex-col bg-gray-50`}>
        <Header />
        <main className="flex-1">{children}</main>
      </body>
    </html>
  );
}
