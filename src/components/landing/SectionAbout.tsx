'use client';
import { motion } from 'framer-motion';
import Image from 'next/image';

const FEATURES = [
  { icon: '🗺️', title: 'Territory Bound', desc: 'Securely restricted to your designated region and committee level.' },
  { icon: '💬', title: 'Dynamic Chats',     desc: 'Automated communication clusters for every organizational node.' },
  { icon: '📊', title: 'Mission Data',    desc: 'Real-time campaign analytics from Booth to State.' },
  { icon: '🔒', title: 'Sovereign ID',    desc: 'Proprietary biometric and session-based authentication for total security.' },
];

export default function SectionAbout() {
  return (
    <section id="about" className="py-32 px-6 max-w-7xl mx-auto relative">
      <div className="grid lg:grid-cols-2 gap-16 items-center">
        
        {/* Left: Interactive Visual */}
        <motion.div initial={{ opacity: 0, x: -30 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true }}
          className="relative aspect-square rounded-[3rem] overflow-hidden glass border border-white/5 shadow-manki group">
           <Image 
             src="https://images.unsplash.com/photo-1541872703-74c5e44368f9?q=80&w=1200&auto=format&fit=crop" 
             alt="Sangathan Building" fill className="object-cover transition-transform group-hover:scale-110" />
           <div className="absolute inset-0 bg-gradient-to-t from-vanda via-transparent to-transparent opacity-60" />
           <div className="absolute bottom-8 left-8 right-8">
              <div className="text-[10px] text-saffron font-black uppercase mb-2 tracking-[0.2em]">MISSION: SANGATHAN BUILDING</div>
              <h3 className="text-white font-display font-black text-2xl leading-tight">Digital empowerment for the grassroots citizen.</h3>
           </div>
        </motion.div>

        {/* Right: Content */}
        <div>
           <h2 className="font-display font-black text-4xl md:text-6xl mb-8 tracking-tighter text-white uppercase">ONE Sangathan.<br/><span className="text-gold">ONE Bharat.</span></h2>
           <p className="text-text-muted text-base md:text-lg mb-10 leading-relaxed font-medium uppercase tracking-[0.05em]">
             MANKI PARTY is the world's most advanced digital sangathan engine. 
             We connect every ward and every Tola into a single, unified digital pulse. 
             Coordinate massive missions with surgical precision from any corner of India.
           </p>

           <div className="grid sm:grid-cols-2 gap-8">
              {FEATURES.map((f, i) => (
                <motion.div key={i} whileHover={{ y: -5 }} className="flex gap-4">
                   <div className="w-12 h-12 rounded-2xl bg-white/5 border border-white/10 flex items-center justify-center text-2xl shrink-0">
                      {f.icon}
                   </div>
                   <div>
                      <h4 className="text-white font-bold text-sm uppercase tracking-wider mb-1">{f.title}</h4>
                      <p className="text-text-muted text-[11px] leading-relaxed font-bold uppercase opacity-50">{f.desc}</p>
                   </div>
                </motion.div>
              ))}
           </div>
        </div>
      </div>
    </section>
  );
}
