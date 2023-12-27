import './globals.css';
import { Analytics } from '@vercel/analytics/react';
import Toast from './toast';
import { Suspense } from 'react';
import Nav from './nav';
import { Toaster } from 'react-hot-toast';
import { NextAuthProvider } from '@components/provider';

export const metadata = {
  title: 'Daily Report',
  description:
    '日報ツール'
};

export default function RootLayout({ children }: { children: React.ReactNode; }) {
  return (
    <html lang="ja" className="h-full bg-gray-50 font-mono">
      <body className="h-full">
      <NextAuthProvider>
        <Nav/>
        <Toaster/>
        <Suspense>
        </Suspense>
        <NextAuthProvider>{children}</NextAuthProvider>
        <Analytics />
        <Toast />
      </NextAuthProvider>
      </body>
    </html>
  );
}
