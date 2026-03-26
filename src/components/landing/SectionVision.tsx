'use client';
import { motion } from 'framer-motion';

const PILLARS = [
  { t: 'Integrity', d: 'Absolute blockchain-backed authentication.' },
  { t: 'Connectivity', d: 'Zero-latency regional mesh networking.' },
  { t: 'Grassroots', d: 'Dedicated focus on the Ward and Tola.' },
];

export default function SectionVision() {
  return (
    <section id="vision" className="py-6 px-6 relative overflow-hidden bg-vanda">
      {/* Background Glow */}
      <div className="absolute inset-0 pointer-events-none opacity-20"
        style={{ background: 'radial-gradient(circle at 70% 30%, #FF6B00 0%, transparent 70%)' }} />
      
      <div className="max-w-6xl mx-auto relative z-10 text-center">
         <motion.div initial={{ opacity: 0, scale: 0.9 }} whileInView={{ opacity: 1, scale: 1 }} viewport={{ once: true }}
           className="bg-saffron/10 inline-block px-5 py-2 rounded-full mb-6 border border-saffron/20 backdrop-blur-xl">
            <span className="text-gold text-[9px] font-black uppercase tracking-[0.4em]">VISION 2027: DIGITAL BHARAT SANGATHAN</span>
         </motion.div>

         <h2 className="font-display font-black text-4xl md:text-7xl mb-6 text-white leading-tight uppercase tracking-tighter">
            THE PULSE OF <span className="text-gold">SANGATHAN.</span><br/>
            THE SPEED OF <span className="text-saffron">LIGHT.</span>
         </h2>

         <p className="max-w-3xl mx-auto text-text-muted text-base md:text-xl font-bold uppercase tracking-widest leading-relaxed mb-10 opacity-80">
            WE ARE BUILDING THE MOST SOPHISTICATED INFRASTRUCTURE 
            TO CONNECT <span className="text-white">EVERY CITIZEN</span> TO THE COMMITTEE ROOMS.
            FROM THE GROUND UP. NO BARRIERS. NO DELAYS.
         </p>

         <div className="grid md:grid-cols-3 gap-6">
            {PILLARS.map((p, i) => (
              <motion.div key={i} whileHover={{ y: -5 }} 
                className="glass p-8 rounded-[2rem] border border-white/5 relative group">
                <div className="absolute inset-0 bg-gradient-to-br from-saffron/10 to-transparent rounded-[2.5rem] opacity-40" />
                <h4 className="text-white font-display font-black text-xl uppercase tracking-tighter mb-2">{p.t}</h4>
                <p className="text-text-muted text-[10px] font-black uppercase tracking-widest opacity-40">{p.d}</p>
              </motion.div>
            ))}
         </div>
      </div>
    </section>
  );
}
