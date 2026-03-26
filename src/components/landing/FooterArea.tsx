'use client';
import { motion, AnimatePresence } from 'framer-motion';
import { useState } from 'react';
import Link from 'next/link';

// ─── DATA ARCHITECTURE ─────────────────────────────────────────

const SANGATHAN_LINKS = [
  { name: 'Hierarchy',     href: '/sangathan/hierarchy',     desc: 'View our organizational tree' },
  { name: 'Committees',    href: '/sangathan/committees',    desc: 'Explore regional committee nodes' },
  { name: 'Missions',      href: '/sangathan/missions',      desc: 'Active digital campaigns' },
  { name: 'Voting Power',  href: '/sangathan/voting',        desc: 'Democratic decentralization' },
];

const RESOURCE_LINKS = [
  { name: 'News & PR',     href: '/resources/news',          desc: 'Official party press releases' },
  { name: 'Regulations',   href: '/resources/regulations',   desc: 'Organizational bylaws' },
  { name: 'Guidelines',    href: '/resources/guidelines',    desc: 'Karyakarta conduct' },
  { name: 'Whitepaper',    href: '/resources/whitepaper',    desc: 'Our digital vision' },
];

const COMPLIANCE_LINKS = [
  { name: 'Privacy',      href: '/compliance/privacy',      desc: 'Data protection standards' },
  { name: 'T&C',          href: '/compliance/terms',        desc: 'Sovereign platform terms' },
  { name: 'Data Rights',  href: '/compliance/data-rights',  desc: 'Your digital sovereignty' },
  { name: 'Cookie Policy', href: '/compliance/cookies',      desc: 'Tracking transparency' },
];

const FAQS = [
  { q: 'How do I join my local Ward committee?', a: 'Register via the "Join" button. Our system automatically detects your region and assigns you to the appropriate Ward node based on your territory verification.' },
  { q: 'Is the communication secure?', a: 'Yes. All committee chats and regional broadcasts are end-to-end encrypted with custom sovereign session keys, ensuring absolute privacy for internal coordination.' },
  { q: 'Can I see data outside my territory?',  a: 'Access is limited to your designated jurisdiction and the levels directly above/below you in the Sangathan hierarchy to maintain focus and security.' },
  { q: 'Is there a limit to member growth?', a: 'Zero limit. The Manki Party Digital Sangathan is horizontally scalable via Redis mesh, supporting over 21 crore concurrent users.' },
];

// ─── COMPONENTS ────────────────────────────────────────────────

export function SectionFAQ() {
  const [active, setActive] = useState<number | null>(null);

  return (
    <section id="faqs" className="py-24 px-6 max-w-4xl mx-auto overflow-hidden">
      <h2 className="font-display font-black text-3xl md:text-5xl mb-12 text-center text-white uppercase tracking-tighter">Support & FAQs</h2>
      <div className="space-y-4">
        {FAQS.map((faq, i) => (
          <div key={i} className="glass rounded-2xl border border-white/5 overflow-hidden transition-all hover:bg-white/[0.02]">
            <button onClick={() => setActive(active === i ? null : i)}
              className="w-full px-6 py-6 flex items-center justify-between text-left group">
              <span className="text-sm md:text-base font-bold text-white uppercase tracking-wider">{faq.q}</span>
              <span className="text-gold text-lg transition-transform duration-300" 
                style={{ transform: active === i ? 'rotate(180deg)' : 'none' }}>▼</span>
            </button>
            <AnimatePresence>
              {active === i && (
                <motion.div initial={{ height: 0, opacity: 0 }} animate={{ height: 'auto', opacity: 1 }} exit={{ height: 0, opacity: 0 }} 
                  className="px-6 pb-6 lg:pb-8">
                  <div className="h-px bg-white/5 mb-6" />
                  <p className="text-text-muted text-xs md:text-sm font-bold leading-relaxed opacity-60 uppercase">{faq.a}</p>
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
  const scrollToTop = () => window.scrollTo({ top: 0, behavior: 'smooth' });

  return (
    <footer className="pt-24 pb-12 px-6 border-t border-white/5 bg-[#0A0A0F] relative overflow-hidden">
      
      {/* Decorative gradient */}
      <div className="absolute bottom-0 left-0 right-0 h-[500px] pointer-events-none"
        style={{ background: 'radial-gradient(circle at 50% 100%, rgba(255,107,0,0.05) 0%, transparent 70%)' }} />

      <div className="max-w-7xl mx-auto relative z-10">
        
        {/* Top Header Layer */}
        <div className="flex flex-col md:flex-row items-center justify-between gap-8 mb-20">
          <div className="flex items-center gap-3 group cursor-pointer" onClick={scrollToTop}>
             <div className="w-10 h-10 rounded-xl bg-saffron flex items-center justify-center text-xl shadow-manki transition-transform group-hover:scale-110">🇮🇳</div>
             <div>
                <span className="font-display text-2xl font-black text-white tracking-tighter block leading-none">MANKI PARTY</span>
                <span className="text-gold text-[10px] font-black uppercase tracking-[0.4em] mt-1 block">Digital Sangathan</span>
             </div>
          </div>
          
          {/* Newsletter / CTA */}
          <div className="w-full max-w-sm">
             <div className="relative group">
                <input type="email" placeholder="JOIN SANGATHAN CONNECT (EMAIL)" 
                  className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-4 text-[10px] font-black text-white uppercase tracking-widest focus:outline-none focus:border-saffron transition-all" />
                <button className="absolute right-2 top-2 bottom-2 bg-saffron text-vanda px-4 rounded-lg text-[10px] font-black uppercase tracking-widest hover:bg-gold transition-colors">SUBMIT</button>
             </div>
          </div>
        </div>

        {/* Navigation Grid */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-12 lg:gap-24 mb-20">
           
           {/* Section: Sangathan */}
           <div>
              <h4 className="text-white text-[11px] font-black uppercase tracking-[0.35em] mb-8 relative inline-block">
                SANGATHAN
                <div className="absolute -bottom-2 left-0 w-1/2 h-[2px] bg-saffron" />
              </h4>
              <div className="flex flex-col gap-5">
                 {SANGATHAN_LINKS.map(l => (
                   <Link key={l.name} href={l.href} className="group flex flex-col gap-1">
                      <span className="text-[11px] font-black text-text-muted hover:text-gold uppercase transition-colors tracking-widest">{l.name}</span>
                      <span className="text-[8px] font-bold text-text-dim/40 uppercase tracking-tighter opacity-0 group-hover:opacity-100 transition-opacity">{l.desc}</span>
                   </Link>
                 ))}
              </div>
           </div>

           {/* Section: Resources */}
           <div>
              <h4 className="text-white text-[11px] font-black uppercase tracking-[0.35em] mb-8 relative inline-block">
                RESOURCES
                <div className="absolute -bottom-2 left-0 w-1/2 h-[2px] bg-saffron" />
              </h4>
              <div className="flex flex-col gap-5">
                 {RESOURCE_LINKS.map(l => (
                   <Link key={l.name} href={l.href} className="group flex flex-col gap-1">
                      <span className="text-[11px] font-black text-text-muted hover:text-gold uppercase transition-colors tracking-widest">{l.name}</span>
                      <span className="text-[8px] font-bold text-text-dim/40 uppercase tracking-tighter opacity-0 group-hover:opacity-100 transition-opacity">{l.desc}</span>
                   </Link>
                 ))}
              </div>
           </div>

           {/* Section: Compliance */}
           <div>
              <h4 className="text-white text-[11px] font-black uppercase tracking-[0.35em] mb-8 relative inline-block">
                COMPLIANCE
                <div className="absolute -bottom-2 left-0 w-1/2 h-[2px] bg-saffron" />
              </h4>
              <div className="flex flex-col gap-5">
                 {COMPLIANCE_LINKS.map(l => (
                   <Link key={l.name} href={l.href} className="group flex flex-col gap-1">
                      <span className="text-[11px] font-black text-text-muted hover:text-gold uppercase transition-colors tracking-widest">{l.name}</span>
                      <span className="text-[8px] font-bold text-text-dim/40 uppercase tracking-tighter opacity-0 group-hover:opacity-100 transition-opacity">{l.desc}</span>
                   </Link>
                 ))}
              </div>
           </div>

           {/* Section: Connect & Social */}
           <div>
              <h4 className="text-white text-[11px] font-black uppercase tracking-[0.35em] mb-8 relative inline-block">
                CONNECT
                <div className="absolute -bottom-2 left-0 w-1/2 h-[2px] bg-saffron" />
              </h4>
              <div className="flex flex-wrap gap-4">
                 {['X', 'INSTA', 'YOUTUBE', 'KHAND'].map((soc, i) => (
                   <Link key={soc} href="#" 
                     className="w-10 h-10 rounded-xl bg-white/5 border border-white/10 flex items-center justify-center text-[9px] font-black hover:border-saffron hover:text-gold transition-all">
                     {soc}
                   </Link>
                 ))}
              </div>
              <p className="mt-8 text-[10px] font-bold text-text-dim/40 uppercase leading-relaxed tracking-widest">
                 DIGITAL HEADQUARTERS:<br/>
                 NEW DELHI, BHARAT
              </p>
           </div>

        </div>

        {/* Bottom Bar */}
        <div className="pt-10 border-t border-white/5 flex flex-col md:flex-row items-center justify-between gap-6 opacity-60">
           <p className="text-[9px] font-black text-white uppercase tracking-[0.3em]">
             © 2026 MANKI PARTY CORE · JAI HIND 🇮🇳 · ALL RIGHTS RESERVED
           </p>
           <button onClick={scrollToTop} 
             className="text-[10px] font-black text-gold hover:text-white uppercase tracking-[0.5em] transition-colors">
             SCROLL TO TOP ⇧
           </button>
        </div>

      </div>
    </footer>
  );
}
