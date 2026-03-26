'use client';
import { motion, AnimatePresence } from 'framer-motion';
import { useState } from 'react';
import Link from 'next/link';
import { useLang } from '@/context/LangContext';

// ─── DATA ARCHITECTURE ─────────────────────────────────────────

const SANGATHAN_LINKS = [
  { name_en: 'Hierarchy',     name_hi: 'पदानुक्रम',     href: '/sangathan/hierarchy',     desc_en: 'View our organizational tree', desc_hi: 'हमारा संगठनात्मक ढांचा देखें' },
  { name_en: 'Committees',    name_hi: 'समितियां',     href: '/sangathan/committees',    desc_en: 'Explore regional committee nodes', desc_hi: 'क्षेत्रीय समिति नोड्स देखें' },
  { name_en: 'Missions',      name_hi: 'मिशन',         href: '/sangathan/missions',      desc_en: 'Active digital campaigns', desc_hi: 'सक्रिय डिजिटल अभियान' },
  { name_en: 'Voting Power',  name_hi: 'मतदान शक्ति',   href: '/sangathan/voting',        desc_en: 'Democratic decentralization', desc_hi: 'लोकतांत्रिक विकेंद्रीकरण' },
];

const RESOURCE_LINKS = [
  { name_en: 'News & PR',     name_hi: 'समाचार एवं PR',  href: '/resources/news',          desc_en: 'Official party press releases', desc_hi: 'आधिकारिक पार्टी प्रेस विज्ञप्ति' },
  { name_en: 'Regulations',   name_hi: 'विनियम',       href: '/resources/regulations',   desc_en: 'Organizational bylaws', desc_hi: 'संगठनात्मक उपनियम' },
  { name_en: 'Guidelines',    name_hi: 'दिशानिर्देश',     href: '/resources/guidelines',    desc_en: 'Karyakarta conduct', desc_hi: 'कार्यकर्ता आचरण' },
  { name_en: 'Whitepaper',    name_hi: 'श्वेतपत्र',       href: '/resources/whitepaper',    desc_en: 'Our digital vision', desc_hi: 'हमारा डिजिटल दृष्टिकोण' },
];

const COMPLIANCE_LINKS = [
  { name_en: 'Privacy',      name_hi: 'गोपनीयता',      href: '/compliance/privacy',      desc_en: 'Data protection standards', desc_hi: 'डेटा सुरक्षा मानक' },
  { name_en: 'T&C',          name_hi: 'नियम व शर्तें',  href: '/compliance/terms',        desc_en: 'Sovereign platform terms', desc_hi: 'संप्रभु प्लेटफॉर्म शर्तें' },
  { name_en: 'Data Rights',  name_hi: 'डेटा अधिकार',    href: '/compliance/data-rights',  desc_en: 'Your digital sovereignty', desc_hi: 'आपकी डिजिटल संप्रभुता' },
  { name_en: 'Cookie Policy', name_hi: 'कुकी नीति',      href: '/compliance/cookies',      desc_en: 'Tracking transparency', desc_hi: 'ट्रैकिंग पारदर्शिता' },
];

const FAQS = [
  { 
    q_en: 'How do I join my local Ward committee?', 
    q_hi: 'मैं अपनी स्थानीय वार्ड समिति में कैसे शामिल होऊं?',
    a_en: 'Register via the "Join" button. Our system automatically detects your region and assigns you based on territory verification.',
    a_hi: '"जुड़ें" बटन के माध्यम से पंजीकरण करें। हमारा सिस्टम स्वचालित रूप से आपके क्षेत्र का पता लगाता है और आपको असाइन करता है।'
  },
  { 
    q_en: 'Is the communication secure?', 
    q_hi: 'क्या संचार सुरक्षित है?',
    a_en: 'Yes. All committee chats are end-to-end encrypted with custom sovereign session keys.',
    a_hi: 'हाँ। सभी समिति चैट एंड-टू-एंड एन्क्रिप्टेड हैं, जो संप्रभु सत्र कुंजियों से सुरक्षित हैं।'
  },
  { 
    q_en: 'Can I see data outside my territory?',  
    q_hi: 'क्या मैं अपने क्षेत्र के बाहर का डेटा देख सकता हूँ?',
    a_en: 'Access is limited to your designated jurisdiction and the levels directly above/below you.',
    a_hi: 'पहुंच आपके नामांकित क्षेत्राधिकार और आपके सीधे ऊपर/नीचे के स्तरों तक सीमित है।'
  },
  { 
    q_en: 'Is there a limit to member growth?', 
    q_hi: 'क्या सदस्य वृद्धि की कोई सीमा है?',
    a_en: 'Zero limit. The platform is horizontally scalable, supporting over 21 crore concurrent users.',
    a_hi: 'कोई सीमा नहीं। प्लेटफॉर्म क्षैतिज रूप से स्केलेबल है, जो 21 करोड़ से अधिक उपयोगकर्ताओं का समर्थन करता है।'
  },
];

// ─── COMPONENTS ────────────────────────────────────────────────

export function SectionFAQ() {
  const [active, setActive] = useState<number | null>(null);
  const { t } = useLang();

  return (
    <section id="faqs" className="py-24 px-6 max-w-4xl mx-auto overflow-hidden">
      <h2 className="font-display font-black text-3xl md:text-5xl mb-12 text-center text-white uppercase tracking-tighter">
         {t('Support & FAQs', 'सहायता और अक्सर पूछे जाने वाले प्रश्न')}
      </h2>
      <div className="space-y-4">
        {FAQS.map((faq, i) => (
          <div key={i} className="glass rounded-2xl border border-white/5 overflow-hidden transition-all hover:bg-white/[0.02]">
            <button onClick={() => setActive(active === i ? null : i)}
              className="w-full px-6 py-6 flex items-center justify-between text-left group">
              <span className="text-sm md:text-base font-bold text-white uppercase tracking-wider">
                 {t(faq.q_en, faq.q_hi)}
              </span>
              <span className="text-[#fbbf24] text-lg transition-transform duration-300" 
                style={{ transform: active === i ? 'rotate(180deg)' : 'none' }}>▼</span>
            </button>
            <AnimatePresence>
              {active === i && (
                <motion.div initial={{ height: 0, opacity: 0 }} animate={{ height: 'auto', opacity: 1 }} exit={{ height: 0, opacity: 0 }} 
                  className="px-6 pb-6 lg:pb-8">
                  <div className="h-px bg-white/5 mb-6" />
                  <p className="text-white/40 text-xs md:text-sm font-bold leading-relaxed opacity-60 uppercase">
                     {t(faq.a_en, faq.a_hi)}
                  </p>
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
  const { t } = useLang();
  const scrollToTop = () => window.scrollTo({ top: 0, behavior: 'smooth' });

  return (
    <footer className="pt-24 pb-12 px-6 border-t border-white/5 bg-[#0A0A0F] relative overflow-hidden">
      
      {/* Decorative gradient */}
      <div className="absolute bottom-0 left-0 right-0 h-[500px] pointer-events-none"
        style={{ background: 'radial-gradient(circle at 50% 100%, rgba(251,191,36,0.05) 0%, transparent 70%)' }} />

      <div className="max-w-7xl mx-auto relative z-10">
        
        {/* Top Header Layer */}
        <div className="flex flex-col md:flex-row items-center justify-between gap-8 mb-20">
          <div className="flex items-center gap-3 group cursor-pointer" onClick={scrollToTop}>
             <div className="w-10 h-10 rounded-xl bg-[#fbbf24] flex items-center justify-center text-xl shadow-manki transition-transform group-hover:scale-110">🇮🇳</div>
             <div>
                <span className="font-display text-2xl font-black text-white tracking-tighter block leading-none">MANKI PARTY</span>
                <span className="text-[#fbbf24] text-[10px] font-black uppercase tracking-[0.4em] mt-1 block">
                   {t('Digital Sangathan', 'डिजिटल संगठन')}
                </span>
             </div>
          </div>
          
          {/* Newsletter / CTA */}
          <div className="w-full max-w-2xl">
             <div className="flex flex-col sm:flex-row items-center gap-4">
                <div className="relative group flex-1 w-full">
                   <input type="email" placeholder={t('EMAIL ADDRESS', 'ईमेल पता')} 
                     className="w-full bg-white/5 border border-white/10 rounded-2xl px-5 py-4 text-[10px] font-black text-white uppercase tracking-widest focus:outline-none focus:border-[#fbbf24] transition-all" />
                </div>
                
                <div className="text-[8px] font-black text-white/30 uppercase tracking-widest px-2">{t('OR', 'या')}</div>

                <div className="relative group flex-1 w-full">
                   <div className="absolute left-4 top-1/2 -translate-y-1/2 text-[10px] font-black text-[#fbbf24] opacity-40">📱</div>
                   <input type="tel" placeholder={t('MOBILE (GLOBAL)', 'मोबाइल (ग्लोबल)')} 
                     className="w-full bg-white/5 border border-white/10 rounded-2xl pl-10 pr-5 py-4 text-[10px] font-black text-white uppercase tracking-widest focus:outline-none focus:border-[#fbbf24] transition-all" />
                </div>
                <button className="bg-[#fbbf24] text-black px-8 py-4 rounded-2xl text-[10px] font-black uppercase tracking-widest hover:bg-white transition-colors shadow-2xl shrink-0 w-full sm:w-auto">
                   {t('JOIN CONNECT', 'कनेक्ट से जुड़ें')}
                </button>
             </div>
             <p className="mt-4 text-[8px] font-bold text-white/20 uppercase tracking-[0.2em] text-center sm:text-left">
                * {t('SUBMIT ANY ONE FIELD TO JOIN THE DIGITAL SANGATHAN', 'डिजिटल संगठन में शामिल होने के लिए किसी भी एक क्षेत्र को जमा करें')}
             </p>
          </div>
        </div>

        {/* Navigation Grid */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-12 lg:gap-24 mb-20">
           
           {/* Section: Sangathan */}
           <div>
              <h4 className="text-white text-[11px] font-black uppercase tracking-[0.35em] mb-8 relative inline-block">
                {t('SANGATHAN', 'संगठन')}
                <div className="absolute -bottom-2 left-0 w-1/2 h-[2px] bg-[#fbbf24]" />
              </h4>
              <div className="flex flex-col gap-5">
                 {SANGATHAN_LINKS.map(l => (
                   <Link key={l.name_en} href={l.href} className="group flex flex-col gap-1">
                      <span className="text-[11px] font-black text-white/60 hover:text-[#fbbf24] uppercase transition-colors tracking-widest">
                         {t(l.name_en, l.name_hi)}
                      </span>
                      <span className="text-[8px] font-bold text-white/20 uppercase tracking-tighter opacity-0 group-hover:opacity-100 transition-opacity">
                         {t(l.desc_en, l.desc_hi)}
                      </span>
                   </Link>
                 ))}
              </div>
           </div>

           {/* Section: Resources */}
           <div>
              <h4 className="text-white text-[11px] font-black uppercase tracking-[0.35em] mb-8 relative inline-block">
                {t('RESOURCES', 'संसाधन')}
                <div className="absolute -bottom-2 left-0 w-1/2 h-[2px] bg-[#fbbf24]" />
              </h4>
              <div className="flex flex-col gap-5">
                 {RESOURCE_LINKS.map(l => (
                   <Link key={l.name_en} href={l.href} className="group flex flex-col gap-1">
                      <span className="text-[11px] font-black text-white/60 hover:text-[#fbbf24] uppercase transition-colors tracking-widest">
                         {t(l.name_en, l.name_hi)}
                      </span>
                      <span className="text-[8px] font-bold text-white/20 uppercase tracking-tighter opacity-0 group-hover:opacity-100 transition-opacity">
                         {t(l.desc_en, l.desc_hi)}
                      </span>
                   </Link>
                 ))}
              </div>
           </div>

           {/* Section: Compliance */}
           <div>
              <h4 className="text-white text-[11px] font-black uppercase tracking-[0.35em] mb-8 relative inline-block">
                {t('COMPLIANCE', 'अनुपालन')}
                <div className="absolute -bottom-2 left-0 w-1/2 h-[2px] bg-[#fbbf24]" />
              </h4>
              <div className="flex flex-col gap-5">
                 {COMPLIANCE_LINKS.map(l => (
                   <Link key={l.name_en} href={l.href} className="group flex flex-col gap-1">
                      <span className="text-[11px] font-black text-white/60 hover:text-[#fbbf24] uppercase transition-colors tracking-widest">
                         {t(l.name_en, l.name_hi)}
                      </span>
                      <span className="text-[8px] font-bold text-white/20 uppercase tracking-tighter opacity-0 group-hover:opacity-100 transition-opacity">
                         {t(l.desc_en, l.desc_hi)}
                      </span>
                   </Link>
                 ))}
              </div>
           </div>

           {/* Section: Connect & Social */}
           <div>
              <h4 className="text-white text-[11px] font-black uppercase tracking-[0.35em] mb-8 relative inline-block">
                {t('CONNECT', 'जुड़ें')}
                <div className="absolute -bottom-2 left-0 w-1/2 h-[2px] bg-[#fbbf24]" />
              </h4>
              <div className="flex flex-wrap gap-4">
                 {['X', 'INSTA', 'YOUTUBE', 'KHAND'].map((soc, i) => (
                   <Link key={soc} href="#" 
                     className="w-10 h-10 rounded-xl bg-white/5 border border-white/10 flex items-center justify-center text-[9px] font-black hover:border-[#fbbf24] hover:text-[#fbbf24] transition-all text-white/60">
                     {soc}
                   </Link>
                 ))}
              </div>
              <p className="mt-8 text-[10px] font-bold text-white/20 uppercase leading-relaxed tracking-widest">
                 {t('DIGITAL HEADQUARTERS:', 'डिजिटल मुख्यालय:')}<br/>
                 {t('NEW DELHI, BHARAT', 'नई दिल्ली, भारत')}
              </p>
           </div>

        </div>

        {/* Bottom Bar */}
        <div className="pt-10 border-t border-white/5 flex flex-col md:flex-row items-center justify-between gap-6 opacity-60">
           <p className="text-[9px] font-black text-white uppercase tracking-[0.3em]">
             © 2026 MANKI PARTY CORE · {t('JAI HIND 🇮🇳 · ALL RIGHTS RESERVED', 'जय हिंद 🇮🇳 · सर्वाधिकार सुरक्षित')}
           </p>
           <button onClick={scrollToTop} 
             className="text-[10px] font-black text-[#fbbf24] hover:text-white uppercase tracking-[0.5em] transition-colors">
             {t('SCROLL TO TOP ⇧', 'ऊपर जाएं ⇧')}
           </button>
        </div>

      </div>
    </footer>
  );
}
