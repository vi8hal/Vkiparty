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

  return (
    <nav className="fixed top-3 left-1/2 -translate-x-1/2 z-[60] w-[95%] max-w-7xl">
      <div className="relative rounded-full border border-white/20 px-8 h-12 flex items-center justify-between overflow-hidden shadow-2xl backdrop-blur-2xl"
        style={{ background: 'linear-gradient(100deg, rgba(229, 228, 226, 0.15) 0%, rgba(255, 215, 0, 0.1) 50%, rgba(192, 192, 192, 0.15) 100%)' }}>
        
        {/* Metallic Gloss Reflection */}
        <div className="absolute inset-0 bg-gradient-to-tr from-transparent via-white/10 to-transparent pointer-events-none" />

        {/* Logo */}
        <Link href="/" className="flex items-center gap-2 group shrink-0">
          <div className="w-7 h-7 rounded-lg flex items-center justify-center text-sm shadow-manki transition-transform group-hover:scale-110"
            style={{ background: 'linear-gradient(135deg, #FFD700, #C0C0C0)' }}>
            🇮🇳
          </div>
          <span className="font-display font-black text-sm tracking-tighter text-white">
            MANKI<span className="text-gold">PARTY</span>
          </span>
        </Link>

        {/* Desktop Links */}
        <div className="hidden lg:flex items-center gap-5">
          {NAV_LINKS.map((link) => (
            <Link key={link.name} href={link.href} 
              className="text-[9px] uppercase tracking-[0.2em] font-black text-white/60 hover:text-gold transition-colors">
              {link.name}
            </Link>
          ))}
        </div>

        {/* CTAs */}
        <div className="flex items-center gap-3 shrink-0">
          <Link href="/auth/login" className="hidden sm:block text-[9px] px-3 py-1.5 uppercase font-black tracking-widest text-white/50 hover:text-white transition-colors">
            LOGIN
          </Link>
          <Link href="/auth/register" 
            className="text-[9px] px-5 py-2 rounded-full uppercase font-black tracking-widest shadow-manki transition-all hover:scale-105 active:scale-95"
            style={{ background: 'linear-gradient(135deg, #FFD700, #B8860B)', color: '#000' }}>
            JOIN
          </Link>
          
          {/* Mobile Toggle */}
          <button onClick={() => setIsOpen(!isOpen)} className="lg:hidden p-1.5 text-white/60 hover:text-white">
             {isOpen ? '✕' : '☰'}
          </button>
        </div>
      </div>

      {/* Mobile Menu (Floating) */}
      <AnimatePresence>
        {isOpen && (
          <motion.div 
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="absolute top-14 left-0 right-0 glass rounded-3xl border border-white/10 overflow-hidden shadow-manki"
          >
            <div className="px-8 py-10 flex flex-col gap-6">
              {NAV_LINKS.map((link) => (
                <Link key={link.name} href={link.href} onClick={() => setIsOpen(false)}
                  className="text-xs font-black text-white/60 hover:text-gold tracking-widest uppercase">
                  {link.name}
                </Link>
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </nav>
  );
}
