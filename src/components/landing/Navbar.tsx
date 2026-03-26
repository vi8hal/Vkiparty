'use client';
import { useState } from 'react';
import Link from 'next/link';
import { motion, AnimatePresence } from 'framer-motion';

const NAV_LINKS = [
  { name: 'About Us', href: '#about' },
  { name: 'Regulations', href: '#regulations' },
  { name: 'Sangathan', href: '#sangathan' },
  { name: 'Core Members', href: '#members' },
  { name: 'Vision', href: '#vision' },
  { name: 'Support', href: '#support' },
  { name: 'FAQs', href: '#faqs' },
];

export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false);
  const [lang, setLang] = useState('EN');

  return (
    <nav className="fixed top-3 left-1/2 -translate-x-1/2 z-[60] w-[95%] max-w-7xl">
      <div className="relative rounded-full border border-white/20 px-4 md:px-8 h-12 flex items-center justify-between overflow-hidden shadow-2xl backdrop-blur-2xl bg-black/40">
        
        {/* Metallic Gloss Reflection */}
        <div className="absolute inset-0 bg-gradient-to-tr from-transparent via-white/5 to-transparent pointer-events-none" />

        {/* Left: Logo & Lang */}
        <div className="flex items-center gap-4">
          <Link href="/" className="flex items-center gap-2 group shrink-0">
            <div className="w-7 h-7 rounded-full flex items-center justify-center text-sm shadow-manki transition-transform group-hover:scale-110 bg-[#fbbf24]">
              🇮🇳
            </div>
            <span className="font-display font-black text-xs md:text-sm tracking-tighter text-white">
              MANKI<span className="text-[#fbbf24]">PARTY</span>
            </span>
          </Link>
          
          <button onClick={() => setLang(lang === 'EN' ? 'HI' : 'EN')}
            className="hidden md:flex items-center justify-center w-8 h-8 rounded-full border border-white/10 text-[9px] font-black text-white hover:bg-white/10 transition-all">
            {lang}
          </button>
        </div>

        {/* Center: Desktop Links (Jan Suraaj inspired spacing) */}
        <div className="hidden lg:flex items-center gap-6">
          {NAV_LINKS.map((link) => (
            <Link key={link.name} href={link.href} 
              className="text-[9px] uppercase tracking-[0.2em] font-black text-white/50 hover:text-[#fbbf24] transition-colors">
              {link.name}
            </Link>
          ))}
        </div>

        {/* Right: CTAs */}
        <div className="flex items-center gap-2 md:gap-4 shrink-0">
          <Link href="/compliance/support" 
            className="hidden sm:block text-[9px] px-4 py-2 rounded-full uppercase font-black tracking-widest bg-[#fbbf24] text-black hover:bg-white transition-all">
            सहयोग करें
          </Link>
          
          <Link href="/auth/login" className="text-[9px] font-black text-white/50 hover:text-white uppercase tracking-widest hidden sm:block">
            LOGIN
          </Link>

          <Link href="/auth/register" 
            className="text-[9px] px-5 py-2 rounded-full uppercase font-black tracking-widest border border-[#fbbf24] text-[#fbbf24] hover:bg-[#fbbf24] hover:text-black transition-all">
            JOIN
          </Link>
          
          {/* Mobile Toggle */}
          <button onClick={() => setIsOpen(!isOpen)} className="lg:hidden p-1.5 text-white/60 hover:text-white">
             {isOpen ? '✕' : '☰'}
          </button>
        </div>
      </div>

      {/* Mobile Menu (Floating Drawer style) */}
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
                  <span className="text-[10px] font-black text-[#fbbf24] tracking-widest uppercase">NAVIGATION</span>
                  <button onClick={() => setLang(lang === 'EN' ? 'HI' : 'EN')} className="text-[10px] font-black underline">{lang}</button>
               </div>
              {NAV_LINKS.map((link) => (
                <Link key={link.name} href={link.href} onClick={() => setIsOpen(false)}
                  className="text-xs font-black text-white/60 hover:text-[#fbbf24] tracking-widest uppercase">
                  {link.name}
                </Link>
              ))}
              <div className="h-px bg-white/5 my-4" />
              <Link href="/compliance/support" className="text-xs font-black text-[#fbbf24] uppercase">सहयोग करें (CONTRIBUTE)</Link>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </nav>
  );
}
