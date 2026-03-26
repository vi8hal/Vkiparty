'use client';
import { motion } from 'framer-motion';
import Image from 'next/image';
import { useRef } from 'react';
import { useLang } from '@/context/LangContext';

const FEED_IMAGES = [
  { 
    src: 'https://images.unsplash.com/photo-1541872703-74c5e44368f9?q=80&w=1200&auto=format&fit=crop', 
    title_en: 'Massive Grassroots Mobilization', 
    title_hi: 'व्यापक जमीनी स्तर की लामबंदी',
    date_en: 'March 2026',
    date_hi: 'मार्च 2026'
  },
  { 
    src: 'https://images.unsplash.com/photo-1529156069898-49953eb1b5ea?q=80&w=1200&auto=format&fit=crop', 
    title_en: 'Digital Empowerment for Every Karyakarta', 
    title_hi: 'हर कार्यकर्ता के लिए डिजिटल सशक्तिकरण',
    date_en: 'Feb 2026',
    date_hi: 'फरवरी 2026'
  },
  { 
    src: 'https://images.unsplash.com/photo-1555861496-0666c8981751?q=80&w=1200&auto=format&fit=crop', 
    title_en: 'Connect — Organize — Grow', 
    title_hi: 'जुड़ें — संगठित हों — बढ़ें',
    date_en: 'Jan 2026',
    date_hi: 'जनवरी 2026'
  },
];

export default function InstaCarousel() {
  const scrollRef = useRef<HTMLDivElement>(null);
  const { t } = useLang();
  
  return (
    <section className="py-4 px-4 max-w-6xl mx-auto overflow-hidden">
      {/* Main Feed Carousel (Insta-Style Stack) */}
      <div className="relative group">
        <h3 className="font-display font-bold text-lg mb-4 ml-2 flex items-center gap-2 text-white">
           <span className="w-2 h-2 rounded-full bg-[#fbbf24]" />
           {t('LATEST MISSION UPDATES', 'नवीनतम मिशन अपडेट')}
        </h3>
        
        <div 
          ref={scrollRef}
          className="flex gap-4 overflow-x-auto snap-x snap-mandatory pb-10 scrollbar-hide no-scrollbar"
        >
          {FEED_IMAGES.map((img, i) => (
            <motion.div 
              key={i} 
              className="w-[300px] md:w-[400px] shrink-0 snap-center rounded-3xl overflow-hidden glass border border-white/5 relative aspect-[4/5]"
            >
              <Image src={img.src} alt={t(img.title_en, img.title_hi)} fill className="object-cover transition-transform group-hover:scale-105" />
              <div className="absolute inset-x-0 bottom-0 p-6 bg-gradient-to-t from-black/80 to-transparent">
                 <div className="text-[10px] text-[#fbbf24] font-black uppercase mb-1 tracking-widest">
                    {t(img.date_en, img.date_hi)}
                 </div>
                 <h4 className="text-white font-display font-bold text-base leading-tight">
                    {t(img.title_en, img.title_hi)}
                 </h4>
              </div>
            </motion.div>
          ))}
        </div>

        {/* Shadow Indicators for scroll */}
        <div className="absolute right-0 top-0 bottom-10 w-20 bg-gradient-to-l from-black/60 to-transparent pointer-events-none" />
      </div>
    </section>
  );
}
