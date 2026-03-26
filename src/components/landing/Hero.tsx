'use client';
import { motion, useScroll, useTransform, AnimatePresence } from 'framer-motion';
import Image from 'next/image';
import Link from 'next/link';
import { useState, useEffect, useRef } from 'react';

const IMAGES = [
  { src: 'https://images.unsplash.com/photo-1541872703-74c5e44368f9?q=80&w=1200&auto=format&fit=crop', alt: 'Crowd gathering' },
  { src: 'https://images.unsplash.com/photo-1529156069898-49953eb1b5ea?q=80&w=1200&auto=format&fit=crop', alt: 'Community networking' },
  { src: 'https://images.unsplash.com/photo-1555861496-0666c8981751?q=80&w=1200&auto=format&fit=crop', alt: 'Illuminated rally' }
];

function BackgroundCarousel() {
  const [index, setIndex] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => setIndex((prev) => (prev + 1) % IMAGES.length), 5000);
    return () => clearInterval(timer);
  }, []);

  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none z-0">
      <AnimatePresence mode="wait">
        <motion.div
          key={index}
          initial={{ opacity: 0, scale: 1.1 }}
          animate={{ opacity: 0.5, scale: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 2, ease: 'easeInOut' }}
          className="absolute inset-0"
        >
          <Image src={IMAGES[index].src} alt={IMAGES[index].alt} fill className="object-cover" priority={index === 0} />
        </motion.div>
      </AnimatePresence>
      <div className="absolute inset-0 bg-gradient-to-b from-vanda via-[rgba(10,10,18,0.7)] to-vanda" />
    </div>
  );
}

function ParticleCanvas() {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d')!;
    let W = canvas.width = window.innerWidth;
    let H = canvas.height = window.innerHeight;
    const particles = Array.from({ length: 60 }, () => ({
      x: Math.random() * W, y: Math.random() * H, r: Math.random() * 1.5,
      vx: (Math.random() - 0.5) * 0.4, vy: (Math.random() - 0.5) * 0.4, 
      color: Math.random() > 0.5 ? '#FFD700' : '#FF6B00'
    }));

    const draw = () => {
      ctx.clearRect(0,0,W,H);
      particles.forEach(p => {
        ctx.beginPath(); ctx.arc(p.x, p.y, p.r, 0, Math.PI*2);
        ctx.fillStyle = p.color + '40'; ctx.fill();
        p.x += p.vx; p.y += p.vy;
        if(p.x < 0 || p.x > W) p.vx *= -1; if(p.y < 0 || p.y > H) p.vy *= -1;
      });
      requestAnimationFrame(draw);
    };
    draw();
  }, []);
  return <canvas ref={canvasRef} className="absolute inset-0 pointer-events-none opacity-40 max-w-full" />;
}

import { useLang } from '@/context/LangContext';

export default function Hero() {
  const { t } = useLang();

  return (
    <section className="relative min-h-[75vh] flex items-center justify-center pt-8 overflow-hidden bg-[#0A0A0F]">
      <BackgroundCarousel />
      <ParticleCanvas />
      
      <div className="relative z-10 text-center px-6 max-w-6xl mx-auto mt-4">
        {/* Jan Suraaj Style Badge */}
        <motion.div initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }}
          className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full mb-6 bg-[#fbbf24]/10 border border-[#fbbf24]/20 backdrop-blur-md">
          <div className="w-2 h-2 rounded-full bg-[#fbbf24] animate-pulse" />
          <span className="text-[9px] sm:text-[10px] text-[#fbbf24] font-black uppercase tracking-[0.3em]">
             {t('LIVE: MISSION 2027 DIGITAL SANGATHAN', 'लाइव: मिशन 2027 डिजिटल संगठन')}
          </span>
        </motion.div>

        {/* Impact Typography */}
        <motion.h1 initial={{ opacity: 0, y: 25 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}
          className="font-display font-black text-6xl md:text-9xl leading-[0.85] mb-6 tracking-tighter">
          <span className="block text-white">MANKI</span>
          <span className="block text-[#fbbf24]">PARTY</span>
        </motion.h1>

        <motion.p initial={{ opacity: 0, y: 15 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }}
           className="text-white/80 text-xs md:text-sm max-w-2xl mx-auto mb-10 leading-relaxed font-bold uppercase tracking-[0.1em]">
           {t('BIHAR TO BHARAT — ', 'बिहार से भारत तक — ')}
           <span className="text-[#fbbf24]">DIGITAL SANGATHAN</span> 
           {t(' IS EMPOWERING 21-CRORE KARYAKARTAS VIA BHARAT\'S MOST ADVANCED HIERARCHY.', ' भारत के सबसे उन्नत संगठन के माध्यम से 21 करोड़ कार्यकर्ताओं को सशक्त बना रहा है।')}
        </motion.p>

        {/* Counter Bar (Jan Suraaj Style) */}
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }}
          className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-12 max-w-4xl mx-auto">
          {[
            { label: t('KARYAKARTAS', 'कार्यकर्ता'), val: '21Cr+' },
            { label: t('COMMITTEES', 'समितियां'), val: '1.2M+' },
            { label: t('DISTRICTS', 'जिले'), val: '766' },
            { label: t('VERIFIED', 'सत्यापित'), val: '100%' }
          ].map((stat, i) => (
            <div key={i} className="glass p-4 rounded-2xl border border-white/5 bg-white/[0.02]">
               <div className="text-xl md:text-2xl font-black text-[#fbbf24] tracking-tighter">{stat.val}</div>
               <div className="text-[8px] font-black text-white/40 uppercase tracking-widest mt-1">{stat.label}</div>
            </div>
          ))}
        </motion.div>

        {/* Dynamic CTAs */}
        <motion.div initial={{ opacity: 0, y: 15 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.4 }}
          className="flex flex-col sm:flex-row gap-4 justify-center">
          <Link href="/auth/register" className="px-10 py-5 rounded-full bg-[#fbbf24] text-black text-[10px] font-black uppercase tracking-[0.2em] shadow-2xl hover:bg-white transition-all transform hover:scale-105 active:scale-95">
             🚀 {t('JOIN THE MOVEMENT', 'अभियान से जुड़ें')}
          </Link>
          <Link href="/compliance/support" className="px-10 py-5 rounded-full border border-white/20 text-white text-[10px] font-black uppercase tracking-[0.2em] hover:bg-white/5 transition-all">
             {t('CONTRIBUTE (SAHYOG)', 'सहयोग करें')}
          </Link>
        </motion.div>
      </div>
    </section>
  );
}
