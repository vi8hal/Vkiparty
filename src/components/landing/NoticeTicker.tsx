'use client';
import { motion } from 'framer-motion';
import Link from 'next/link';
import { useLang } from '@/context/LangContext';

const NOTICES = [
  { 
    text_en: '📢 New Regulations for Ward Committees — Revised Guidelines 2026', 
    text_hi: '📢 वार्ड समितियों के लिए नए नियम — संशोधित दिशानिर्देश 2026',
    href: '/resources/regulations' 
  },
  { 
    text_en: '🗳️ Sangathan Election Cycle Begins March 30 — Register at Block Level', 
    text_hi: '🗳️ संगठन चुनाव चक्र 30 मार्च से शुरू — ब्लॉक स्तर पर पंजीकरण करें',
    href: '/sangathan/missions' 
  },
  { 
    text_en: '🚀 Mission 2027: Digital Grassroots Connect Program — Join your local node', 
    text_hi: '🚀 मिशन 2027: डिजिटल जमीनी जुड़ाव कार्यक्रम — अपनी स्थानीय इकाई से जुड़ें',
    href: '/sangathan/hierarchy' 
  },
];

export default function NoticeTicker() {
  const { t } = useLang();

  return (
    <div className="fixed top-0 left-0 right-0 z-[70] bg-[#fbbf24] text-black py-2.5 overflow-hidden shadow-2xl font-black border-b border-black/10">
      <div className="max-w-7xl mx-auto px-6 flex items-center gap-6">
        {/* Fixed Title */}
        <div className="bg-black text-[#fbbf24] text-[9px] font-black uppercase px-3 py-1 rounded-full tracking-[0.2em] shrink-0 shadow-lg whitespace-nowrap">
           {t('NOTICE ALERT', 'सूचना अलर्ट')}
        </div>
        
        {/* Scrolling Ticker */}
        <div className="relative flex-1 overflow-hidden">
          <motion.div 
            animate={{ x: [0, -1000] }}
            transition={{ repeat: Infinity, duration: 40, ease: 'linear' }}
            className="flex gap-20 whitespace-nowrap"
          >
            {[...NOTICES, ...NOTICES, ...NOTICES].map((notice, i) => (
              <Link key={i} href={notice.href} 
                className="text-[10px] uppercase tracking-widest hover:underline decoration-2 transition-all">
                {t(notice.text_en, notice.text_hi)}
              </Link>
            ))}
          </motion.div>
        </div>
      </div>
    </div>
  );
}
