'use client';
import { useParams } from 'next/navigation';
import Navbar from '@/components/landing/Navbar';
import { Footer } from '@/components/landing/FooterArea';
import { motion } from 'framer-motion';

export default function ResourcesHub() {
  const params = useParams();
  const slug   = Array.isArray(params.slug) ? params.slug.join(' — ') : params.slug || 'RESOURCES';

  const isRegulations = slug.includes('regulations');
  const isNews = slug.includes('news');

  return (
    <div className="min-h-screen bg-vanda text-white selection:bg-saffron selection:text-vanda overflow-x-hidden">
      <Navbar />
      <div className="grain-overlay pointer-events-none opacity-[0.1]" />

      <main className="pt-32 pb-20 px-6 max-w-5xl mx-auto">
         <motion.div initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }}
           className="bg-saffron/10 inline-block px-6 py-2 rounded-full mb-10 border border-saffron/20 backdrop-blur-xl">
            <span className="text-gold text-[10px] font-black uppercase tracking-[0.4em]">OFFICIAL RESOURCES · {slug.toUpperCase()}</span>
         </motion.div>

         <h1 className="font-display font-black text-4xl md:text-7xl mb-8 text-white leading-tight uppercase tracking-tighter">
            {isRegulations ? 'REVISED WARD REGULATIONS' : isNews ? 'SANGATHAN NEWS & PR' : 'RESOURCE HUB'}
         </h1>

         <div className="glass p-10 md:p-16 rounded-[2.5rem] border border-white/5 relative group mb-12 text-center md:text-left">
            <h2 className="text-white font-display font-black text-2xl uppercase tracking-tighter mb-6 underline decoration-saffron decoration-4 underline-offset-8">
               {slug.replace('-', ' ').toUpperCase()} GUIDELINES 2026-27
            </h2>
            <div className="text-text-muted text-xs md:text-sm font-bold leading-relaxed opacity-60 uppercase tracking-widest max-w-2xl">
               <p className="mb-6">
                 THIS DOCUMENT IS CURRENTLY BEING FINALIZED BY THE STATE COMMITTEE. 
                 ACCESSIBILITY TO ALL KARYAKARTAS WILL BE GRANTED UPON REGIONAL DEPLOYMENT 
                 OF THE MISSION 2027 DIGITAL NODES.
               </p>
               <div className="flex gap-4">
                  <div className="w-1/2 h-2 bg-white/5 rounded-full overflow-hidden">
                     <motion.div className="h-full bg-saffron w-3/4" 
                       initial={{ x: '-100%' }} animate={{ x: 0 }} transition={{ duration: 1 }} />
                  </div>
                  <span className="text-[10px] text-gold">75% DEPLOYMENT COMPLETION</span>
               </div>
            </div>
         </div>

         <div className="flex flex-col sm:flex-row justify-center items-center gap-6">
            <button onClick={() => window.history.back()}
              className="w-full sm:w-auto btn-ghost text-[10px] px-8 py-4 uppercase font-black tracking-widest border-white/5 hover:border-gold/20">
               ← RETURN TO HUB
            </button>
            <a href="/dashboard"
              className="w-full sm:w-auto btn-manki text-[10px] px-8 py-4 uppercase font-black tracking-widest shadow-manki text-center">
               GOTO DASHBOARD →
            </a>
         </div>
      </main>

      <Footer />
    </div>
  );
}
