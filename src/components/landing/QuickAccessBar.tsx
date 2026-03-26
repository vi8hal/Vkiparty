'use client';
import { motion } from 'framer-motion';
import Link from 'next/link';

const QUICK_LINKS = [
  { name: 'Ward Node',     icon: '🏘️', href: '/sangathan/ward' },
  { name: 'Village Unit',  icon: '🌾', href: '/sangathan/village' },
  { name: 'Block Level',   icon: '🏢', href: '/sangathan/block' },
  { name: 'District',      icon: '🏙️', href: '/sangathan/district' },
  { name: 'State Body',    icon: '🗺️', href: '/sangathan/state' },
  { name: 'Mission 2027',  icon: '🚀', href: '/sangathan/missions' },
  { name: 'Sovereign ID',  icon: '🛡️', href: '/compliance/privacy' },
  { name: 'Vox Populi',    icon: '🗳️', href: '/sangathan/voting' },
];

export default function QuickAccessBar() {
  return (
    <div className="fixed top-[104px] left-0 right-0 z-40 bg-[#1A1A2E]/60 backdrop-blur-xl border-b border-white/5 py-3 overflow-hidden shadow-lg hidden md:block">
      <div className="max-w-7xl mx-auto px-6">
        <div className="flex items-center justify-between gap-4">
           {QUICK_LINKS.map((link, i) => (
             <Link key={link.name} href={link.href} className="group relative">
                <motion.div 
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: i * 0.05 }}
                  className="flex items-center gap-2 px-3 py-1.5 rounded-lg border border-transparent hover:border-gold/30 hover:bg-gold/5 transition-all"
                >
                   <span className="text-base grayscale group-hover:grayscale-0 transition-all">{link.icon}</span>
                   <span className="text-[10px] font-black text-text-muted group-hover:text-gold uppercase tracking-widest transition-colors">
                      {link.name}
                   </span>
                </motion.div>
                {/* Subtle active indicator */}
                <div className="absolute -bottom-3 left-1/2 -translate-x-1/2 w-0 h-[2px] bg-saffron transition-all group-hover:w-1/2" />
             </Link>
           ))}
        </div>
      </div>
    </div>
  );
}
