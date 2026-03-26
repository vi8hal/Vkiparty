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

export default function Hero() {
  return (
    <section className="relative min-h-screen flex items-center justify-center pt-24 overflow-hidden">
      <BackgroundCarousel />
      <ParticleCanvas />
      
      <div className="relative z-10 text-center px-6 max-w-6xl mx-auto">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}
          className="inline-flex items-center gap-2 px-4 py-2 rounded-full mb-8 bg-gold/10 border border-gold/20 backdrop-blur-md">
          <span className="text-[10px] sm:text-xs text-gold font-black uppercase tracking-[0.3em]">JAI HIND — DIGITAL SANGATHAN</span>
        </motion.div>

        <motion.h1 initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}
          className="font-display font-black text-6xl md:text-9xl leading-[0.9] mb-6 tracking-tighter">
          <span className="block text-white">MANKI</span>
          <span className="block" style={{ background: 'linear-gradient(135deg, #FFD700, #FF6B00)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>PARTY</span>
        </motion.h1>

        <motion.p initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }}
          className="text-text-muted text-base md:text-lg max-w-2xl mx-auto mb-10 leading-relaxed font-medium uppercase tracking-[0.1em]">
          Empowering 21-Crore Karyakartas from <span className="text-gold">Ward</span> to <span className="text-saffron">State</span> via the most advanced Digital Hierarchy.
        </motion.p>

        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.35 }}
          className="flex flex-col sm:flex-row gap-4 justify-center">
          <Link href="/auth/register" className="btn-manki text-xs px-10 py-5 rounded-xl uppercase font-black tracking-widest shadow-manki transition-transform active:scale-95">
             🚀 Join Digital Mission
          </Link>
          <Link href="/auth/login" className="btn-ghost text-xs px-10 py-5 rounded-xl uppercase font-black tracking-widest border-white/10 hover:border-gold/30">
             Karyakarta Login
          </Link>
        </motion.div>
      </div>
    </section>
  );
}
