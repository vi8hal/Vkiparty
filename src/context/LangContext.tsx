'use client';
import React, { createContext, useContext, useState, ReactNode } from 'react';

type Language = 'EN' | 'HI';

interface LangContextType {
  lang: Language;
  setLang: (lang: Language) => void;
  t: (en: string, hi: string) => string;
}

const LangContext = createContext<LangContextType | undefined>(undefined);

export function LangProvider({ children }: { children: ReactNode }) {
  const [lang, setLang] = useState<Language>('EN');

  const t = (en: string, hi: string) => (lang === 'HI' ? hi : en);

  return (
    <LangContext.Provider value={{ lang, setLang, t }}>
      {children}
    </LangContext.Provider>
  );
}

export function useLang() {
  const context = useContext(LangContext);
  if (!context) throw new Error('useLang must be used within a LangProvider');
  return context;
}
