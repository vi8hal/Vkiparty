'use client';
import { motion } from 'framer-motion';
import Link from 'next/link';

const NOTICES = [
  { text: '📢 New Regulations for Ward Committees — Revised Guidelines 2026', href: '/resources/regulations' },
  { text: '🗳️ Sangathan Election Cycle Begins March 30 — Register at Block Level', href: '/sangathan/missions' },
  { text: '🚀 Mission 2027: Digital Grassroots Connect Program — Join your local node', href: '/sangathan/hierarchy' },
  { text: '🛡️ Update: End-to-End Encryption verified for all Committee Room Chats', href: '/compliance/privacy' },
  { text: '🇮🇳 Jai Hind: New Digital Sangathan Portal deployed across 18 states', href: '/resources/news' },
];

export default function NoticeTicker() {
  return (
    <div className="fixed top-16 left-0 right-0 z-50 bg-[#FF6B00]/10 backdrop-blur-md border-b border-[#FF6B00]/20 py-1.5 overflow-hidden shadow-[0_4px_12px_rgba(255,107,0,0.1)]">
      <div className="max-w-7xl mx-auto px-4 flex items-center gap-4">
        {/* Fixed Title */}
        <div className="bg-saffron text-vanda text-[8px] font-black uppercase px-2.5 py-0.5 rounded tracking-tighter shrink-0 animate-glow-pulse shadow-manki">
          NOTICE ALERT
        </div>
        
        {/* Scrolling Ticker */}
        <div className="relative flex-1 overflow-hidden">
          <motion.div 
            animate={{ x: [0, -1200] }}
            transition={{ repeat: Infinity, duration: 45, ease: 'linear' }}
            className="flex gap-16 whitespace-nowrap"
          >
            {[...NOTICES, ...NOTICES].map((notice, i) => (
              <Link key={i} href={notice.href} className="text-[10px] font-bold text-gold/80 hover:text-white transition-colors tracking-wide">
                {notice.text}
              </Link>
            ))}
          </motion.div>
        </div>
      </div>
    </div>
  );
}
