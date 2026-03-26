'use client';
import { motion } from 'framer-motion';

const NOTICES = [
  '📢 New Regulations for Ward Committees — Revised Guidelines 2026',
  '🗳️ Sangathan Election Cycle Begins March 30 — Register at Block Level',
  '🚀 Mission 2027: Digital Grassroots Connect Program — Join your local node',
  '🛡️ Update: End-to-End Encryption verified for all Committee Room Chats',
  '🇮🇳 Jai Hind: New Digital Sangathan Portal deployed across 18 states',
];

export default function NoticeTicker() {
  return (
    <div className="fixed top-16 left-0 right-0 z-50 bg-[#FF6B00]/10 backdrop-blur-md border-b border-[#FF6B00]/20 py-2 overflow-hidden shadow-[0_4px_12px_rgba(255,107,0,0.1)]">
      <div className="max-w-7xl mx-auto px-4 flex items-center gap-4">
        {/* Fixed Title */}
        <div className="bg-saffron text-vanda text-[9px] font-black uppercase px-3 py-1 rounded tracking-tighter shrink-0 animate-glow-pulse shadow-manki">
          NOTICE ALERT
        </div>
        
        {/* Scrolling Ticker */}
        <div className="relative flex-1 overflow-hidden pointer-events-none">
          <motion.div 
            animate={{ x: [0, -1000] }}
            transition={{ repeat: Infinity, duration: 30, ease: 'linear' }}
            className="flex gap-12 whitespace-nowrap"
          >
            {[...NOTICES, ...NOTICES].map((notice, i) => (
              <span key={i} className="text-[11px] font-bold text-gold/80 tracking-wide">
                {notice}
              </span>
            ))}
          </motion.div>
        </div>
      </div>
    </div>
  );
}
