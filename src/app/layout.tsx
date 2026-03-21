// ============================================================
// src/app/layout.tsx — Root layout
// ============================================================

import type { Metadata, Viewport } from 'next';
import { Baloo_2, Outfit } from 'next/font/google';
import './globals.css';
import { Toaster } from 'react-hot-toast';

const baloo = Baloo_2({
  subsets:  ['latin', 'devanagari'],
  variable: '--font-baloo',
  weight:   ['400', '500', '600', '700', '800'],
  display:  'swap',
});

const outfit = Outfit({
  subsets:  ['latin'],
  variable: '--font-outfit',
  weight:   ['300', '400', '500', '600', '700'],
  display:  'swap',
});

export const metadata: Metadata = {
  title:       { default: 'Manki Party — Grassroots Connect', template: '%s | Manki Party' },
  description: 'The official digital network of Manki Party — connecting karyakartas from ward to state across India.',
  keywords:    ['Manki Party', 'grassroots', 'India politics', 'karyakarta', 'panchayat'],
  authors:     [{ name: 'Manki Party' }],
  openGraph: {
    type:        'website',
    locale:      'en_IN',
    url:         process.env.NEXT_PUBLIC_APP_URL,
    siteName:    'Manki Party',
    title:       'Manki Party — Grassroots Connect',
    description: 'Digital network for Manki Party workers across India.',
  },
  twitter: {
    card:  'summary_large_image',
    title: 'Manki Party — Grassroots Connect',
  },
  manifest:    '/manifest.json',
  icons: {
    icon:  '/icons/favicon.ico',
    apple: '/icons/apple-touch-icon.png',
  },
};

export const viewport: Viewport = {
  themeColor:           '#FF6B00',
  width:                'device-width',
  initialScale:         1,
  maximumScale:         1,
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={`${baloo.variable} ${outfit.variable}`}>
      <body className="bg-vanda font-body antialiased selection:bg-saffron/30 selection:text-gold">
        {children}
        <Toaster
          position="top-right"
          toastOptions={{
            style: {
              background:  '#1A1A28',
              color:       '#F5F5F0',
              border:      '1px solid rgba(255,107,0,0.3)',
              borderRadius:'12px',
              fontFamily:  'var(--font-outfit)',
              fontSize:    '14px',
            },
            success: { iconTheme: { primary: '#FFD700', secondary: '#0A0A0F' } },
            error:   { iconTheme: { primary: '#EF4444', secondary: '#0A0A0F' } },
          }}
        />
      </body>
    </html>
  );
}
