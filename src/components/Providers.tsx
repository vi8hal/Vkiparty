'use client';
import { LangProvider } from '@/context/LangContext';
import { Toaster } from 'react-hot-toast';

export function Providers({ children }: { children: React.ReactNode }) {
  return (
    <LangProvider>
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
    </LangProvider>
  );
}
