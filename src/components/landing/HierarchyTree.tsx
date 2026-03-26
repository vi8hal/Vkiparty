'use client';
import { motion } from 'framer-motion';

const HIERARCHY = [
  { level: 'Ward / Tola',       color: '#FF6B00', icon: '🏘️', desc: 'Grassroots unit' },
  { level: 'Village',           color: '#FF8C38', icon: '🌾', desc: 'Village network' },
  { level: 'Panchayat',         color: '#FFB800', icon: '🏛️', desc: 'Panchayat body' },
  { level: 'Gram Panchayat',    color: '#FFD700', icon: '⚖️', desc: 'Local governance' },
  { level: 'Block / Samiti',    color: '#E5B800', icon: '🏢', desc: 'Block committee' },
  { level: 'Zila Parishad',     color: '#CC9900', icon: '🏙️', desc: 'District level' },
  { level: 'State Committee',   color: '#FF6B00', icon: '🗺️', desc: 'State leadership' },
];

export default function HierarchyTree() {
  return (
    <section className="py-24 px-6 relative max-w-6xl mx-auto overflow-hidden">
      <div className="text-center mb-16">
        <h2 className="font-display font-black text-4xl md:text-6xl mb-4 tracking-tighter text-white uppercase">WARD से STATE तक</h2>
        <p className="text-text-muted text-sm md:text-base font-bold tracking-[0.1em] uppercase">India's first completely digital political hierarchy</p>
      </div>

      <div className="flex flex-col items-center gap-2">
        {HIERARCHY.map((h, i) => (
          <motion.div 
            key={i} 
            initial={{ opacity: 0, x: i % 2 === 0 ? -30 : 30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ delay: i * 0.05 }}
            className="w-full max-w-xl group"
          >
            <div className="card-3d flex items-center gap-4 px-6 py-4 rounded-2xl w-full mb-1 border transition-all hover:scale-[1.02]"
              style={{ background: `linear-gradient(135deg, ${h.color}15, ${h.color}05)`, border: `1px solid ${h.color}30` }}>
              <div className="text-3xl grayscale group-hover:grayscale-0 transition-all">{h.icon}</div>
              <div className="flex-1 min-w-0">
                <div className="font-display font-black text-sm md:text-base truncate uppercase tracking-widest" style={{ color: h.color }}>{h.level}</div>
                <div className="text-text-muted text-[10px] md:text-xs truncate font-bold uppercase opacity-60">{h.desc}</div>
              </div>
              <div className="w-8 h-8 rounded-full border border-white/10 flex items-center justify-center text-[10px] font-black text-white/40">
                 {`0${i + 1}`}
              </div>
            </div>
          </motion.div>
        ))}
      </div>
    </section>
  );
}
