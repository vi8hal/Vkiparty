'use client';
// ============================================================
// src/app/page.tsx — Public Landing Page
// Stunning 3D animated hero for Manki Party
// ============================================================

import { useEffect, useRef, useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { motion, useScroll, useTransform, AnimatePresence } from 'framer-motion';

const HIERARCHY = [
  { level: 'Ward / Tola',       color: '#FF6B00', icon: '🏘️', desc: 'Grassroots unit' },
  { level: 'Village',           color: '#FF8C38', icon: '🌾', desc: 'Village network' },
  { level: 'Panchayat',         color: '#FFB800', icon: '🏛️', desc: 'Panchayat body' },
  { level: 'Gram Panchayat',    color: '#FFD700', icon: '⚖️', desc: 'Local governance' },
  { level: 'Block / Samiti',    color: '#E5B800', icon: '🏢', desc: 'Block committee' },
  { level: 'Zila Parishad',     color: '#CC9900', icon: '🏙️', desc: 'District level' },
  { level: 'State Committee',   color: '#FF6B00', icon: '🗺️', desc: 'State leadership' },
];

const FEATURES = [
  { icon: '💬', title: 'Committee Chats',   desc: 'Auto-created chat rooms for every committee level' },
  { icon: '🗳️', title: 'Polls & Surveys',   desc: 'Quick decision-making within your committee' },
  { icon: '📋', title: 'Campaigns & Tasks', desc: 'Assign and track work from block to booth level' },
  { icon: '🔔', title: 'Smart Alerts',      desc: 'Real-time notifications across the hierarchy' },
  { icon: '🌐', title: 'Location Aware',    desc: 'Only see and connect with your jurisdiction' },
  { icon: '🔒', title: 'Secure & Private',  desc: 'Encrypted sessions, no third-party auth' },
];

// ─── IMMERSIVE BACKGROUND CAROUSEL ───────────────────────────
const IMAGES = [
  { src: 'https://images.unsplash.com/photo-1541872703-74c5e44368f9?q=80&w=2670&auto=format&fit=crop', alt: 'Crowd gathering showcasing massive grassroots movement' },
  { src: 'https://images.unsplash.com/photo-1529156069898-49953eb1b5ea?q=80&w=2670&auto=format&fit=crop', alt: 'Community networking and political organizing across regions' },
  { src: 'https://images.unsplash.com/photo-1555861496-0666c8981751?q=80&w=2670&auto=format&fit=crop', alt: 'Illuminated massive rally representing digital connections' }
];

function BackgroundCarousel() {
  const [index, setIndex] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      setIndex((prev) => (prev + 1) % IMAGES.length);
    }, 5000); // 5 second intervals
    return () => clearInterval(timer);
  }, []);

  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none z-0">
      <AnimatePresence mode="wait">
        <motion.div
          key={index}
          initial={{ opacity: 0, scale: 1.05 }}
          animate={{ opacity: 0.6, scale: 1 }} // Ken Burns zoom-in effect
          exit={{ opacity: 0 }}
          transition={{ opacity: { duration: 1.5, ease: 'easeInOut' }, scale: { duration: 10, ease: 'linear' } }}
          className="absolute inset-0"
        >
          <Image 
            src={IMAGES[index].src} 
            alt={IMAGES[index].alt}
            fill
            quality={90}
            priority={index === 0} // SEO optimization: Preload LCP image
            className="object-cover"
            sizes="100vw"
          />
        </motion.div>
      </AnimatePresence>
      {/* Immersive dark gradient overlays for modern contrast */}
      <div className="absolute inset-0 bg-gradient-to-b from-vanda via-[rgba(10,10,18,0.7)] to-vanda mix-blend-multiply" />
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,_rgba(255,107,0,0.15)_0%,_transparent_70%)]" />
    </div>
  );
}

// ─── THREE.JS PARTICLE FIELD ─────────────────────────────────
function ParticleCanvas() {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx    = canvas.getContext('2d')!;
    let raf:     number;
    let W = canvas.width  = window.innerWidth;
    let H = canvas.height = window.innerHeight;

    const PARTICLE_COUNT = 80;
    const particles = Array.from({ length: PARTICLE_COUNT }, () => ({
      x:    Math.random() * W,
      y:    Math.random() * H,
      r:    Math.random() * 1.8 + 0.4,
      vx:   (Math.random() - 0.5) * 0.3,
      vy:   (Math.random() - 0.5) * 0.3,
      opacity: Math.random() * 0.5 + 0.1,
      color: Math.random() > 0.5 ? '#FFD700' : '#FF6B00',
    }));

    const draw = () => {
      ctx.clearRect(0, 0, W, H);

      // Draw connections
      for (let i = 0; i < particles.length; i++) {
        for (let j = i + 1; j < particles.length; j++) {
          const dx   = particles[i].x - particles[j].x;
          const dy   = particles[i].y - particles[j].y;
          const dist = Math.sqrt(dx * dx + dy * dy);
          if (dist < 120) {
            ctx.beginPath();
            ctx.strokeStyle = `rgba(255,107,0,${0.08 * (1 - dist / 120)})`;
            ctx.lineWidth   = 0.5;
            ctx.moveTo(particles[i].x, particles[i].y);
            ctx.lineTo(particles[j].x, particles[j].y);
            ctx.stroke();
          }
        }
      }

      // Draw particles
      particles.forEach(p => {
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
        ctx.fillStyle = p.color + Math.round(p.opacity * 255).toString(16).padStart(2, '0');
        ctx.fill();

        p.x += p.vx;
        p.y += p.vy;
        if (p.x < 0 || p.x > W) p.vx *= -1;
        if (p.y < 0 || p.y > H) p.vy *= -1;
      });

      raf = requestAnimationFrame(draw);
    };

    draw();

    const handleResize = () => {
      W = canvas.width  = window.innerWidth;
      H = canvas.height = window.innerHeight;
    };
    window.addEventListener('resize', handleResize);
    return () => { cancelAnimationFrame(raf); window.removeEventListener('resize', handleResize); };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      className="absolute inset-0 pointer-events-none"
      style={{ opacity: 0.6 }}
    />
  );
}

// ─── MAIN PAGE ───────────────────────────────────────────────
export default function LandingPage() {
  const { scrollY } = useScroll();
  const heroY       = useTransform(scrollY, [0, 400], [0, -80]);
  const heroOpacity = useTransform(scrollY, [0, 300], [1, 0]);

  return (
    <div className="min-h-screen bg-vanda overflow-x-hidden">
      {/* Grain overlay */}
      <div className="grain-overlay" />

      {/* Ambient glow */}
      <div className="fixed inset-0 pointer-events-none" style={{
        background: 'radial-gradient(ellipse 80% 60% at 50% -10%, rgba(255,107,0,0.12) 0%, transparent 70%)',
      }} />

      {/* ── NAVBAR ─────────────────────────────────────────── */}
      <nav className="fixed top-0 left-0 right-0 z-50 glass border-b border-[rgba(255,107,0,0.12)]">
        <div className="max-w-7xl mx-auto px-6 h-16 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl flex items-center justify-center text-lg"
              style={{ background: 'linear-gradient(135deg,#FFD700,#FF6B00)' }}>
              🇮🇳
            </div>
            <span className="font-display font-800 text-xl tracking-wide">
              <span className="text-gold">MANKI</span>
              <span className="text-saffron">PARTY</span>
            </span>
          </div>
          <div className="flex items-center gap-3">
            <Link href="/auth/login"
              className="btn-ghost text-sm px-5 py-2">
              Sign In
            </Link>
            <Link href="/auth/register"
              className="btn-manki text-sm px-5 py-2">
              Join Now
            </Link>
          </div>
        </div>
      </nav>

      {/* ── HERO ───────────────────────────────────────────── */}
      <section className="relative min-h-screen flex items-center justify-center overflow-hidden pt-16">
        <BackgroundCarousel />
        {/* Subtle particle canvas over the images perfectly layered */}
        <ParticleCanvas />

        <motion.div
          style={{ y: heroY, opacity: heroOpacity }}
          className="relative z-10 text-center px-6 max-w-5xl mx-auto"
        >
          {/* Badge */}
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.5 }}
            className="inline-flex items-center gap-2 px-4 py-2 rounded-full mb-8"
            style={{
              background: 'rgba(255,215,0,0.1)',
              border: '1px solid rgba(255,215,0,0.3)',
            }}
          >
            <span className="text-sm">🇮🇳</span>
            <span className="text-gold text-sm font-semibold tracking-wider">
              JAI HIND — DIGITAL SANGATHAN
            </span>
          </motion.div>

          {/* Title */}
          <motion.h1
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.1 }}
            className="font-display font-extrabold text-6xl md:text-8xl leading-none mb-6"
          >
            <span className="block text-white">MANKI</span>
            <span className="block" style={{
              background: 'linear-gradient(135deg, #FFD700, #FF6B00)',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
            }}>
              PARTY
            </span>
            <span className="block text-white text-4xl md:text-5xl mt-2 font-semibold tracking-wide">
              Grassroots Connect
            </span>
          </motion.h1>

          {/* Subtitle */}
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3, duration: 0.6 }}
            className="text-text-dim text-lg md:text-xl max-w-2xl mx-auto mb-10 leading-relaxed"
          >
            Ward से State तक — India&apos;s most powerful political grassroots network.
            Connect every karyakarta, every committee, every campaign.
          </motion.p>

          {/* CTA */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.45 }}
            className="flex flex-col sm:flex-row gap-4 justify-center"
          >
            <Link href="/auth/register" className="btn-manki text-base px-8 py-4 animate-glow-pulse">
              🚀 Join the Movement
            </Link>
            <Link href="/auth/login" className="btn-ghost text-base px-8 py-4">
              Already a member? Sign In
            </Link>
          </motion.div>

          {/* Stats */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.7 }}
            className="flex flex-wrap justify-center gap-8 mt-16"
          >
            {[
              { label: 'Hierarchy Levels', value: '7' },
              { label: 'Committee Types', value: '5+' },
              { label: 'Real-time Chats', value: '∞' },
            ].map((s, i) => (
              <div key={i} className="text-center">
                <div className="font-display font-bold text-4xl text-gold">{s.value}</div>
                <div className="text-text-muted text-sm mt-1">{s.label}</div>
              </div>
            ))}
          </motion.div>
        </motion.div>

        {/* Scroll indicator */}
        <motion.div
          animate={{ y: [0, 10, 0] }}
          transition={{ repeat: Infinity, duration: 1.5 }}
          className="absolute bottom-8 left-1/2 -translate-x-1/2 text-text-muted"
        >
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="M12 5v14M5 12l7 7 7-7" />
          </svg>
        </motion.div>
      </section>

      {/* ── HIERARCHY SECTION ──────────────────────────────── */}
      <section className="py-24 px-6 relative">
        <div className="max-w-6xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <h2 className="font-display font-bold text-4xl md:text-5xl mb-4">
              <span className="seo-strip">Ward से State तक</span>
            </h2>
            <p className="text-text-dim text-lg">India&apos;s complete political hierarchy — digitally connected</p>
          </motion.div>

          {/* Hierarchy tree */}
          <div className="flex flex-col items-center gap-2">
            {HIERARCHY.map((h, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, x: i % 2 === 0 ? -20 : 20 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.05 }}
                className="w-full max-w-xl"
                style={{ 
                  paddingLeft: typeof window !== 'undefined' && window.innerWidth > 640 ? `${i * 24}px` : '0px' 
                }}
              >
                <div
                  className="card-3d flex items-center gap-3 md:gap-4 px-4 md:px-5 py-3 md:py-4 rounded-2xl w-full mb-1 cursor-pointer transition-transform hover:scale-[1.02]"
                  style={{
                    background: `linear-gradient(135deg, ${h.color}15, ${h.color}05)`,
                    border: `1px solid ${h.color}30`,
                  }}
                >
                  <div className="text-xl md:text-2xl">{h.icon}</div>
                  <div className="flex-1 min-w-0">
                    <div className="font-display font-bold text-sm md:text-base truncate" style={{ color: h.color }}>
                      {h.level}
                    </div>
                    <div className="text-text-muted text-[10px] md:text-xs truncate">{h.desc}</div>
                  </div>
                  {i === 0 && (
                    <span className="text-[8px] md:text-[10px] px-2 py-0.5 rounded-full font-bold text-vanda shrink-0"
                      style={{ background: h.color }}>
                      CORE
                    </span>
                  )}
                  {i === HIERARCHY.length - 1 && (
                    <span className="text-[8px] md:text-[10px] px-2 py-0.5 rounded-full font-bold text-vanda shrink-0"
                      style={{ background: h.color }}>
                      APEX
                    </span>
                  )}
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ── FEATURES ───────────────────────────────────────── */}
      <section className="py-24 px-6"
        style={{ background: 'linear-gradient(180deg, transparent, rgba(255,107,0,0.04), transparent)' }}>
        <div className="max-w-6xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <h2 className="font-display font-bold text-4xl mb-4">
              <span className="seo-strip">Everything Your Party Needs</span>
            </h2>
            <p className="text-text-dim text-lg">Industry-grade tools for grassroots organising</p>
          </motion.div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {FEATURES.map((f, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.07 }}
                className="card-3d glass rounded-2xl p-6"
              >
                <div className="text-4xl mb-4">{f.icon}</div>
                <h3 className="font-display font-bold text-lg text-gold mb-2">
                  <span className="seo-strip-thin">{f.title}</span>
                </h3>
                <p className="text-text-dim text-sm leading-relaxed">{f.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ── CTA FOOTER ─────────────────────────────────────── */}
      <section className="py-24 px-6 text-center relative overflow-hidden">
        <div className="absolute inset-0 pointer-events-none"
          style={{ background: 'radial-gradient(ellipse 60% 80% at 50% 100%, rgba(255,107,0,0.1) 0%, transparent 70%)' }} />
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="relative z-10 max-w-2xl mx-auto"
        >
          <h2 className="font-display font-extrabold text-5xl mb-6">
            <span className="seo-strip">Ready to Connect?</span>
          </h2>
          <p className="text-text-dim text-lg mb-8">
            Join thousands of Manki Party karyakartas across India. 
            From Tola to State — we are one.
          </p>
          <Link href="/auth/register" className="btn-manki text-lg px-10 py-4 inline-block">
            🇮🇳 Register Now — It&apos;s Free
          </Link>
        </motion.div>
      </section>

      {/* Footer */}
      <footer className="border-t border-[rgba(255,107,0,0.1)] py-8 px-6 text-center text-text-muted text-sm">
        <p>© {new Date().getFullYear()} Manki Party · Grassroots Connect · Jai Hind 🇮🇳</p>
      </footer>
    </div>
  );
}
