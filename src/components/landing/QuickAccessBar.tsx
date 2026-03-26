'use client';
import Link from 'next/link';
import { useLang } from '@/context/LangContext';

const QUICK_LINKS = [
  { name_en: 'Ward Node',     name_hi: 'वार्ड इकाई',     icon: '🏘️', href: '/sangathan/ward' },
  { name_en: 'Village Unit',  name_hi: 'ग्राम इकाई',     icon: '🌾', href: '/sangathan/village' },
  { name_en: 'Block Level',   name_hi: 'ब्लॉक स्तर',     icon: '🏢', href: '/sangathan/block' },
  { name_en: 'District',      name_hi: 'जिला समिति',     icon: '🏙️', href: '/sangathan/district' },
  { name_en: 'State Body',    name_hi: 'प्रदेश कार्यकारिणी', icon: '🗺️', href: '/sangathan/state' },
  { name_en: 'Mission 2027',  name_hi: 'मिशन 2027',     icon: '🚀', href: '/sangathan/missions' },
  { name_en: 'Sovereign ID',  name_hi: 'डिजिटल पहचान',   icon: '🛡️', href: '/compliance/privacy' },
  { name_en: 'Vox Populi',    name_hi: 'लोकमत',         icon: '🗳️', href: '/sangathan/voting' },
];

export default function QuickAccessBar() {
  const { t } = useLang();

  return (
    <div className="fixed top-[104px] left-0 right-0 z-40 bg-[#0A0A0F]/80 backdrop-blur-2xl border-b border-white/5 py-2.5 overflow-x-auto no-scrollbar scroll-smooth">
      <div className="max-w-7xl mx-auto px-6">
        <div className="flex items-center gap-2 md:gap-4 min-w-max">
           {QUICK_LINKS.map((link, i) => (
             <Link key={link.name_en} href={link.href} 
               className="group flex items-center gap-3 px-6 py-3 rounded-2xl border border-white/5 bg-white/[0.04] hover:bg-[#fbbf24]/10 hover:border-[#fbbf24]/40 hover:-translate-y-0.5 transition-all shadow-xl">
                
                <span className="text-base grayscale group-hover:grayscale-0 transition-transform group-hover:scale-110 duration-300">
                  {link.icon}
                </span>
                <span className="text-[10px] font-black text-white/40 group-hover:text-[#fbbf24] uppercase tracking-[0.2em] transition-colors">
                  {t(link.name_en, link.name_hi)}
                </span>

                <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-0 h-0.5 bg-[#fbbf24] transition-all group-hover:w-1/3" />
             </Link>
           ))}
        </div>
      </div>
    </div>
  );
}
