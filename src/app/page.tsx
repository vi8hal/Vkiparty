'use client';
import { motion, useScroll, useSpring } from 'framer-motion';

// ─── CHILD COMPONENTS ───────────────────────────────────────────
import Navbar from '@/components/landing/Navbar';
import NoticeTicker from '@/components/landing/NoticeTicker';
import Hero from '@/components/landing/Hero';
import InstaCarousel from '@/components/landing/InstaCarousel';
import HierarchyTree from '@/components/landing/HierarchyTree';
import SectionAbout from '@/components/landing/SectionAbout';
import SectionVision from '@/components/landing/SectionVision';
import { SectionFAQ, Footer } from '@/components/landing/FooterArea';

export default function LandingPage() {
  const { scrollYProgress } = useScroll();
  const scaleX          = useSpring(scrollYProgress, {
    stiffness: 100, damping: 30, restDelta: 0.001
  });

  return (
    <div className="min-h-screen bg-vanda text-white selection:bg-saffron selection:text-vanda overflow-x-hidden">
      
      {/* Immersive Scroll Progress */}
      <motion.div className="fixed top-0 left-0 right-0 h-[3px] bg-saffron z-[100] origin-left" style={{ scaleX }} />
      
      {/* ── SHARED OVERLAYS ───────────────────────────────────── */}
      <div className="grain-overlay pointer-events-none opacity-[0.12]" />
      <div className="fixed inset-0 pointer-events-none" style={{
        background: 'radial-gradient(ellipse 80% 60% at 50% -10%, rgba(255,107,0,0.08) 0%, transparent 70%)',
      }} />

      {/* ── NAVIGATION & ALERTS ───────────────────────────────── */}
      <Navbar />
      <NoticeTicker />

      {/* ── MAIN CONTENT LAYOUT ───────────────────────────────── */}
      <main className="relative pt-16">
        
        {/* Dynamic Visual Segments */}
        <Hero />
        
        <div className="relative z-10 space-y-20">
          {/* Insta-Style Carousel Section */}
          <InstaCarousel />
          
          <div className="max-w-7xl mx-auto h-px bg-gradient-to-r from-transparent via-white/5 to-transparent opacity-40" />
          
          {/* Geopolitical Hierarchy Visualization */}
          <HierarchyTree />
          
          <div className="max-w-7xl mx-auto h-px bg-gradient-to-r from-transparent via-white/5 to-transparent opacity-40" />

          {/* Mission & Sangathan Building */}
          <SectionAbout />
          
          {/* Unified Vision Statement */}
          <SectionVision />
          
          {/* Engagement: Support & Help */}
          <SectionFAQ />
        </div>
      </main>

      {/* ── FOOTER ECOSYSTEM ──────────────────────────────────── */}
      <Footer />

    </div>
  );
}
