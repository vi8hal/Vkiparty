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
    <nav className="fixed top-0 left-0 right-0 z-[60] glass border-b border-white/10">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 h-16 flex items-center justify-between">
        
        {/* Logo */}
        <Link href="/" className="flex items-center gap-2 group">
          <div className="w-8 h-8 rounded-lg flex items-center justify-center text-base shadow-manki transition-transform group-hover:scale-110"
            style={{ background: 'linear-gradient(135deg,#FFD700,#FF6B00)' }}>
            🇮🇳
          </div>
          <span className="font-display font-black text-lg tracking-tighter text-white">
            MANKI<span className="text-saffron">PARTY</span>
          </span>
        </Link>

        {/* Desktop Links */}
        <div className="hidden lg:flex items-center gap-6">
          {NAV_LINKS.map((link) => (
            <Link key={link.name} href={link.href} 
              className="text-[11px] uppercase tracking-[0.2em] font-bold text-text-muted hover:text-gold transition-colors">
              {link.name}
            </Link>
          ))}
        </div>

        {/* CTAs */}
        <div className="flex items-center gap-3">
          <Link href="/auth/login" className="hidden sm:block btn-ghost text-[10px] px-4 py-2 uppercase font-bold tracking-widest">
            Sign In
          </Link>
          <Link href="/auth/register" className="btn-manki text-[10px] px-4 py-2 uppercase font-bold tracking-widest shadow-manki">
            Join
          </Link>
          
          {/* Mobile Toggle */}
          <button onClick={() => setIsOpen(!isOpen)} className="lg:hidden p-2 text-white">
            {isOpen ? '✕' : '☰'}
          </button>
        </div>
      </div>

      {/* Mobile Menu */}
      <AnimatePresence>
        {isOpen && (
          <motion.div 
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="lg:hidden bg-[#0D0D1A] border-b border-white/5 overflow-hidden"
          >
            <div className="px-6 py-8 flex flex-col gap-6">
              {NAV_LINKS.map((link) => (
                <Link key={link.name} href={link.href} onClick={() => setIsOpen(false)}
                  className="text-sm font-bold text-text-muted hover:text-gold tracking-widest uppercase">
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
