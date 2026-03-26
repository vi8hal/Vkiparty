'use client';
import { useParams } from 'next/navigation';
import Navbar from '@/components/landing/Navbar';
import { Footer } from '@/components/landing/FooterArea';
import { motion } from 'framer-motion';

export default function SangathanHub() {
  const params = useParams();
  const slug   = Array.isArray(params.slug) ? params.slug.join(' — ') : params.slug || 'HUB';

  return (
    <div className="min-h-screen bg-vanda text-white selection:bg-saffron selection:text-vanda overflow-x-hidden">
      <Navbar />
      <div className="grain-overlay pointer-events-none opacity-[0.1]" />

      <main className="pt-32 pb-20 px-6 max-w-5xl mx-auto text-center">
         <motion.div initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }}
           className="bg-saffron/10 inline-block px-6 py-2 rounded-full mb-10 border border-saffron/20 backdrop-blur-xl">
            <span className="text-gold text-[10px] font-black uppercase tracking-[0.4em]">DIGITAL SANGATHAN · {slug.toUpperCase()}</span>
         </motion.div>

         <h1 className="font-display font-black text-5xl md:text-8xl mb-12 text-white leading-tight uppercase tracking-tighter">
            THE PULSE OF <span className="text-gold">SANGATHAN.</span>
         </h1>

         <div className="glass p-12 rounded-[2.5rem] border border-white/5 relative group mb-12">
            <h2 className="text-white font-display font-black text-3xl uppercase tracking-tighter mb-6 underline decoration-saffron decoration-4 underline-offset-8">
               MISSION: {slug.replace('-', ' ').toUpperCase()}
            </h2>
            <p className="text-text-muted text-lg font-bold leading-relaxed opacity-60 uppercase tracking-widest max-w-2xl mx-auto">
               THIS PORTION OF THE DIGITAL SANGATHAN IS CURRENTLY UNDER DEPLOYMENT 
               FOR THE 2027 MISSION CYCLE. SECURE CONNECTIVITY TO YOUR LOCAL WARD 
               COMMITTEE REMAINS ACTIVE VIA THE DASHBOARD.
            </p>
         </div>

         <div className="flex justify-center gap-6">
            <button onClick={() => window.history.back()}
              className="btn-ghost text-[10px] px-8 py-4 uppercase font-black tracking-widest border-white/5 hover:border-gold/20">
               ← RETURN TO NODE
            </button>
            <a href="/dashboard"
              className="btn-manki text-[10px] px-8 py-4 uppercase font-black tracking-widest shadow-manki">
               GOTO DASHBOARD →
            </a>
         </div>
      </main>

      <Footer />
    </div>
  );
}
