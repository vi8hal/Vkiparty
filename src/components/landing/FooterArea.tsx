'use client';
import { motion, AnimatePresence } from 'framer-motion';
import { useState } from 'react';
import Link from 'next/link';

const FAQS = [
  { q: 'How do I join my local Ward committee?', a: 'Register via the "Join" button. Our system automatically detects your region and assigns you to the appropriate Ward node based on your territory verification.' },
  { q: 'Is the communication secure?', a: 'Yes. All committee chats and regional broadcasts are end-to-end encrypted with custom sovereign session keys, ensuring absolute privacy for internal coordination.' },
  { q: 'Can I see data outside my territory?',  a: 'Access is limited to your designated jurisdiction and the levels directly above/below you in the Sangathan hierarchy to maintain focus and security.' },
  { q: 'Is there a limit to member growth?', a: 'Zero limit. The Manki Party Digital Sangathan is horizontally scalable via Redis mesh, supporting over 21 crore concurrent users with sub-millisecond response.' },
];

export function SectionFAQ() {
  const [active, setActive] = useState<number | null>(null);

  return (
    <section id="faqs" className="py-24 px-6 max-w-4xl mx-auto overflow-hidden">
      <h2 className="font-display font-black text-3xl md:text-5xl mb-12 text-center text-white uppercase tracking-tighter">Support & FAQs</h2>
      <div className="space-y-4">
        {FAQS.map((faq, i) => (
          <div key={i} className="glass rounded-2xl border border-white/5 overflow-hidden">
            <button onClick={() => setActive(active === i ? null : i)}
              className="w-full px-6 py-5 flex items-center justify-between text-left group">
              <span className="text-sm font-bold text-white uppercase tracking-wider">{faq.q}</span>
              <span className="text-gold text-lg transition-transform" style={{ transform: active === i ? 'rotate(180deg)' : 'none' }}>▼</span>
            </button>
            <AnimatePresence>
              {active === i && (
                <motion.div initial={{ height: 0 }} animate={{ height: 'auto' }} exit={{ height: 0 }} className="px-6 pb-6">
                  <p className="text-text-muted text-xs font-bold leading-relaxed opacity-60 uppercase">{faq.a}</p>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        ))}
      </div>
    </section>
  );
}

export function Footer() {
  return (
    <footer className="pt-20 pb-10 px-6 border-t border-white/5 bg-[#0A0A0F]">
      <div className="max-w-7xl mx-auto grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-12 mb-20 text-center md:text-left">
        
        {/* Core Identity */}
        <div className="col-span-2">
          <div className="flex items-center gap-2 mb-6 justify-center md:justify-start">
             <div className="w-8 h-8 rounded-lg bg-saffron flex items-center justify-center text-lg">🇮🇳</div>
             <span className="font-display text-2xl font-black text-white tracking-tighter">MANKI PARTY</span>
          </div>
          <p className="text-text-muted text-xs font-bold uppercase tracking-widest leading-loose opacity-40 mb-8 max-w-xs">
            The world's most advanced political grassroots connect platform. 
            From Tola to State — we are one Digital Sangathan.
          </p>
        </div>

        {/* Links */}
        <div>
           <h4 className="text-gold text-[10px] font-black uppercase tracking-[0.3em] mb-6">SANGATHAN</h4>
           <div className="flex flex-col gap-3">
              {['Hierarchy', 'Committees', 'Missions', 'Voting Power'].map(l => (
                <Link key={l} href="#" className="text-[11px] font-bold text-text-muted hover:text-white uppercase transition-colors">{l}</Link>
              ))}
           </div>
        </div>

        <div>
           <h4 className="text-gold text-[10px] font-black uppercase tracking-[0.3em] mb-6">RESOURCES</h4>
           <div className="flex flex-col gap-3">
              {['News & PR', 'Regulations', 'Guidelines', 'Whitepaper'].map(l => (
                <Link key={l} href="#" className="text-[11px] font-bold text-text-muted hover:text-white uppercase transition-colors">{l}</Link>
              ))}
           </div>
        </div>

        <div>
           <h4 className="text-gold text-[10px] font-black uppercase tracking-[0.3em] mb-6">COMPLIANCE</h4>
           <div className="flex flex-col gap-3">
              {['Privacy', 'T&C', 'Data Rights', 'Cookie Policy'].map(l => (
                <Link key={l} href="#" className="text-[11px] font-bold text-text-muted hover:text-white uppercase transition-colors">{l}</Link>
              ))}
           </div>
        </div>
      </div>

      <div className="text-center pt-8 border-t border-white/5 opacity-30">
         <p className="text-[10px] font-black text-white uppercase tracking-[0.4em]">© 2026 MANKI PARTY · JAI HIND 🇮🇳 · BHARAT MATA KI JAI</p>
      </div>
    </footer>
  );
}
