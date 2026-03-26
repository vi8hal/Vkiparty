'use client';
import { motion, useScroll, useTransform } from 'framer-motion';
import Image from 'next/image';
import { useRef } from 'react';

const STORIES = [
  { name: 'Ward Node',     icon: '🏘️' },
  { name: 'Village Unit',  icon: '🌾' },
  { name: 'Block Level',   icon: '🏢' },
  { name: 'District',      icon: '🏙️' },
  { name: 'State Body',    icon: '🗺️' },
  { name: 'Mission 2027',  icon: '🚀' },
  { name: 'Sovereign ID',  icon: '🛡️' },
  { name: 'Vox Populi',    icon: '🗳️' },
];

const FEED_IMAGES = [
  { src: 'https://images.unsplash.com/photo-1541872703-74c5e44368f9?q=80&w=1200&auto=format&fit=crop', title: 'Massive Grassroots Mobilization', date: 'March 2026' },
  { src: 'https://images.unsplash.com/photo-1529156069898-49953eb1b5ea?q=80&w=1200&auto=format&fit=crop', title: 'Digital Empowerment for Every Karyakarta', date: 'Feb 2026' },
  { src: 'https://images.unsplash.com/photo-1555861496-0666c8981751?q=80&w=1200&auto=format&fit=crop', title: 'Connect — Organize — Grow', date: 'Jan 2026' },
];

export default function InstaCarousel() {
  const scrollRef = useRef<HTMLDivElement>(null);
  
  return (
    <section className="py-4 px-4 max-w-6xl mx-auto overflow-hidden">
      {/* Stories Row */}
      <div className="flex items-center gap-6 overflow-x-auto pb-4 px-2 custom-scrollbar no-scrollbar">
        {STORIES.map((s, i) => (
          <motion.div 
            key={i} 
            whileHover={{ scale: 1.1 }}
            className="flex flex-col items-center gap-2 shrink-0 cursor-pointer"
          >
            <div className="w-16 h-16 rounded-full p-0.5" 
              style={{ background: 'linear-gradient(45deg, #FF6B00, #FFD700)' }}>
              <div className="w-full h-full rounded-full bg-vanda border-2 border-vanda flex items-center justify-center text-2xl">
                {s.icon}
              </div>
            </div>
            <span className="text-[10px] font-bold text-text-muted uppercase tracking-tighter">{s.name}</span>
          </motion.div>
        ))}
      </div>

      {/* Main Feed Carousel (Insta-Style Stack) */}
      <div className="relative group">
        <h3 className="font-display font-bold text-lg mb-4 ml-2 flex items-center gap-2">
           <span className="w-2 h-2 rounded-full bg-saffron" />
           LATEST MISSION UPDATES
        </h3>
        
        <div 
          ref={scrollRef}
          className="flex gap-4 overflow-x-auto snap-x snap-mandatory pb-10 scrollbar-hide no-scrollbar"
        >
          {FEED_IMAGES.map((img, i) => (
            <motion.div 
              key={i} 
              className="w-[300px] md:w-[400px] shrink-0 snap-center rounded-2xl overflow-hidden glass border border-white/5 relative aspect-[4/5]"
            >
              <Image src={img.src} alt={img.title} fill className="object-cover transition-transform group-hover:scale-105" />
              <div className="absolute inset-x-0 bottom-0 p-6 bg-gradient-to-t from-black/80 to-transparent">
                 <div className="text-[10px] text-saffron font-black uppercase mb-1 tracking-widest">{img.date}</div>
                 <h4 className="text-white font-display font-bold text-base leading-tight">{img.title}</h4>
              </div>
            </motion.div>
          ))}
        </div>

        {/* Shadow Indicators for scroll */}
        <div className="absolute right-0 top-0 bottom-10 w-20 bg-gradient-to-l from-vanda/60 to-transparent pointer-events-none" />
      </div>
    </section>
  );
}
