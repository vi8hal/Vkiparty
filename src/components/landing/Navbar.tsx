'use client';
import { useState } from 'react';
import Link from 'next/link';
import { motion, AnimatePresence } from 'framer-motion';
import { useLang } from '@/context/LangContext';

const NAV_LINKS = [
  { name_en: 'About Us',    name_hi: 'हमारे बारे में',  href: '#about' },
  { name_en: 'Sangathan',   name_hi: 'संगठन',          href: '#sangathan', isDrawer: true, children: [
    { name_en: 'Ward Node',     name_hi: 'वार्ड इकाई',     icon: '🏘️', href: '/sangathan/ward' },
    { name_en: 'Village Unit',  name_hi: 'ग्राम इकाई',     icon: '🌾', href: '/sangathan/village' },
    { name_en: 'Block Level',   name_hi: 'ब्लॉक स्तर',     icon: '🏢', href: '/sangathan/block' },
    { name_en: 'District',      name_hi: 'जिला समिति',     icon: '🏙️', href: '/sangathan/district' },
    { name_en: 'State Body',    name_hi: 'प्रदेश कार्यकारिणी', icon: '🗺️', href: '/sangathan/state' },
  ]},
  { name_en: 'Regulations', name_hi: 'नियम व विनियम',  href: '#regulations', isDrawer: true, children: [
    { name_en: 'Mission 2027',  name_hi: 'मिशन 2027',     icon: '🚀', href: '/sangathan/missions' },
    { name_en: 'Sovereign ID',  name_hi: 'डिजिटल पहचान',   icon: '🛡️', href: '/compliance/privacy' },
    { name_en: 'Vox Populi',    name_hi: 'लोकमत',         icon: '🗳️', href: '/sangathan/voting' },
  ]},
  { name_en: 'Core Members', name_hi: 'प्रमुख सदस्य',   href: '#core-members' },
  { name_en: 'Vision',      name_hi: 'संकल्प',         href: '#vision' },
];

export default function Navbar() {
  const [isOpen, setIsOpen]           = useState(false);
  const { lang, setLang, t }          = useLang();
  const [activeDrawer, setActiveDrawer] = useState<string | null>(null);

  return (
    <nav className="fixed top-12 left-1/2 -translate-x-1/2 z-[60] w-[95%] max-w-7xl"
         onMouseLeave={() => setActiveDrawer(null)}>
      <div className="relative rounded-full border border-white/20 px-6 md:px-10 h-16 flex items-center justify-between overflow-hidden shadow-2xl backdrop-blur-3xl bg-black/60">
        
        {/* Metallic Gloss Reflection */}
        <div className="absolute inset-0 bg-gradient-to-tr from-transparent via-white/10 to-transparent pointer-events-none" />

        {/* Left: Logo & Lang */}
        <div className="flex items-center gap-6">
          <Link href="/" className="flex items-center gap-3 group shrink-0">
            <div className="w-9 h-9 rounded-full flex items-center justify-center text-lg shadow-manki transition-transform group-hover:scale-110 bg-[#fbbf24]">
              🇮🇳
            </div>
            <span className="font-display font-black text-sm md:text-lg tracking-tighter text-white uppercase">
              MANKI<span className="text-[#fbbf24]">PARTY</span>
            </span>
          </Link>
          
          <button onClick={() => setLang(lang === 'EN' ? 'HI' : 'EN')}
            className="hidden md:flex items-center justify-center w-10 h-10 rounded-full border border-white/10 text-[10px] font-black text-white hover:bg-[#fbbf24] hover:text-black transition-all">
            {lang}
          </button>
        </div>

        {/* Center: Desktop Links (Jan Suraaj inspired spacing) */}
        <div className="hidden lg:flex items-center gap-8">
          {NAV_LINKS.map((link) => (
            <div key={link.name_en} className="relative py-6"
                 onMouseEnter={() => setActiveDrawer(link.isDrawer ? link.name_en : null)}>
              <Link href={link.href} 
                className="text-[11px] uppercase tracking-[0.25em] font-black text-white/60 hover:text-[#fbbf24] transition-colors flex items-center gap-1.5 translate-y-px">
                {t(link.name_en, link.name_hi)}
                {link.isDrawer && <span className="text-[10px] opacity-40">▼</span>}
              </Link>
            </div>
          ))}
        </div>

        {/* Right: CTAs */}
        <div className="flex items-center gap-3 md:gap-5 shrink-0">
          <Link href="/compliance/support" 
            className="hidden sm:block text-[10px] px-6 py-2.5 rounded-full uppercase font-black tracking-widest bg-[#fbbf24] text-black hover:bg-white transition-all shadow-xl">
            {t('CONTRIBUTE', 'सहयोग करें')}
          </Link>
          
          <Link href="/auth/login" className="text-[10px] font-black text-white/50 hover:text-white uppercase tracking-widest hidden sm:block">
            {t('LOGIN', 'लॉगिन')}
          </Link>

          <Link href="/auth/register" 
            className="text-[10px] px-6 py-2.5 rounded-full uppercase font-black tracking-widest border border-[#fbbf24] text-[#fbbf24] hover:bg-[#fbbf24] hover:text-black transition-all">
            {t('JOIN', 'जुड़ें')}
          </Link>
          
          {/* Mobile Toggle */}
          <button onClick={() => setIsOpen(!isOpen)} className="lg:hidden p-2 text-white/60 hover:text-white">
             {isOpen ? '✕' : '☰'}
          </button>
        </div>
      </div>

      {/* Mega-Menu Drawer Area (Desktop) */}
      <AnimatePresence>
        {activeDrawer && (
          <motion.div 
            initial={{ opacity: 0, y: -10, scale: 0.98 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -10, scale: 0.98 }}
            className="absolute top-18 left-0 right-0 glass rounded-[2.5rem] border border-white/10 p-8 shadow-2xl bg-black/80 backdrop-blur-3xl overflow-hidden"
          >
             <div className="grid grid-cols-4 lg:grid-cols-5 gap-4">
                {NAV_LINKS.find(n => n.name_en === activeDrawer)?.children?.map(child => (
                   <Link key={child.name_en} href={child.href}
                     className="group flex flex-col items-center gap-3 p-4 rounded-2xl bg-white/[0.04] border border-white/5 hover:border-[#fbbf24]/40 hover:bg-[#fbbf24]/10 transition-all text-center">
                      <span className="text-2xl group-hover:scale-110 transition-transform">{child.icon}</span>
                      <span className="text-[9px] font-black uppercase tracking-widest text-white/40 group-hover:text-[#fbbf24]">
                         {t(child.name_en, child.name_hi)}
                      </span>
                   </Link>
                ))}
             </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Mobile Menu */}
      <AnimatePresence>
        {isOpen && (
          <motion.div 
            initial={{ opacity: 0, x: 50 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: 50 }}
            className="absolute top-14 right-0 w-64 glass rounded-3xl border border-white/10 overflow-hidden shadow-2xl"
          >
            <div className="px-8 py-10 flex flex-col gap-6 bg-black/90">
               <div className="flex justify-between items-center mb-4">
                  <span className="text-[10px] font-black text-[#fbbf24] tracking-widest uppercase">{t('NAVIGATION', 'नेविगेशन')}</span>
                  <button onClick={() => setLang(lang === 'EN' ? 'HI' : 'EN')} className="text-[10px] font-black underline">{lang}</button>
               </div>
              {NAV_LINKS.map((link) => (
                <Link key={link.name_en} href={link.href} onClick={() => setIsOpen(false)}
                  className="text-xs font-black text-white/60 hover:text-[#fbbf24] tracking-widest uppercase">
                  {t(link.name_en, link.name_hi)}
                </Link>
              ))}
              <div className="h-px bg-white/5 my-4" />
              <Link href="/compliance/support" className="text-xs font-black text-[#fbbf24] uppercase">
                 {t('CONTRIBUTE (SAHYOG)', 'सहयोग करें')}
              </Link>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </nav>
  );
}
