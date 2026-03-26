'use client';
import { useLang } from '@/context/LangContext';
import { motion } from 'framer-motion';
import Image from 'next/image';

const FEATURES = [
  { icon: '🗺️', title_en: 'Territory Bound', title_hi: 'क्षेत्रीय सीमाबद्ध', desc_en: 'Securely restricted to your level.', desc_hi: 'आपके स्तर तक सुरक्षित सीमित।' },
  { icon: '💬', title_en: 'Dynamic Chats',     title_hi: 'डायनेमिक चैट',     desc_en: 'Automated cluster comms.', desc_hi: 'स्वचालित क्लस्टर संचार।' },
  { icon: '📊', title_en: 'Mission Data',    title_hi: 'मिशन डेटा',    desc_en: 'Real-time campaign analytics.', desc_hi: 'रियल-टाइम अभियान विश्लेषण।' },
  { icon: '🔒', title_en: 'Sovereign ID',    desc_en: 'Biometric security.', title_hi: 'डिजिटल पहचान', desc_hi: 'बायोमेट्रिक सुरक्षा।' },
];

export default function SectionAbout() {
  const { t } = useLang();

  return (
    <section id="about" className="py-8 px-6 max-w-7xl mx-auto relative scroll-mt-32">
      <div className="grid lg:grid-cols-2 gap-8 items-center">
        
        {/* Left: Interactive Visual */}
        <motion.div initial={{ opacity: 0, x: -30 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true }}
          className="relative aspect-square rounded-[3rem] overflow-hidden glass border border-white/5 shadow-manki group">
           <Image 
             src="https://images.unsplash.com/photo-1541872703-74c5e44368f9?q=80&w=1200&auto=format&fit=crop" 
             alt="Sangathan Building" fill className="object-cover transition-transform group-hover:scale-110" />
           <div className="absolute inset-0 bg-gradient-to-t from-vanda via-transparent to-transparent opacity-60" />
           <div className="absolute bottom-8 left-8 right-8">
              <div className="text-[10px] text-saffron font-black uppercase mb-2 tracking-[0.2em]">
                 {t('MISSION: SANGATHAN BUILDING', 'मिशन: संगठन निर्माण')}
              </div>
              <h3 className="text-white font-display font-black text-2xl leading-tight">
                 {t('Digital empowerment for the grassroots citizen.', 'जमीनी स्तर के नागरिकों के लिए डिजिटल सशक्तिकरण।')}
              </h3>
           </div>
        </motion.div>

        {/* Right: Content */}
        <div>
           <h2 className="font-display font-black text-4xl md:text-6xl mb-8 tracking-tighter text-white uppercase">
              {t('ONE Sangathan.', 'एक संगठन।')}<br/><span className="text-gold">{t('ONE Bharat.', 'एक भारत।')}</span>
           </h2>
           <p className="text-text-muted text-base md:text-lg mb-10 leading-relaxed font-medium uppercase tracking-[0.05em]">
              {t('MANKI PARTY is the world\'s most advanced digital sangathan engine. We connect every ward and every Tola into a single, unified digital pulse.', 
                 'मानकी पार्टी दुनिया का सबसे उन्नत डिजिटल संगठन इंजन है। हम हर वार्ड और हर टोले को एक एकल, एकीकृत डिजिटल पल्स से जोड़ते हैं।')}
           </p>

           <div className="grid sm:grid-cols-2 gap-8">
              {FEATURES.map((f, i) => (
                <motion.div key={i} whileHover={{ y: -5 }} className="flex gap-4">
                   <div className="w-12 h-12 rounded-2xl bg-white/5 border border-white/10 flex items-center justify-center text-2xl shrink-0">
                      {f.icon}
                   </div>
                   <div>
                      <h4 className="text-white font-bold text-sm uppercase tracking-wider mb-1">
                         {t(f.title_en, f.title_hi)}
                      </h4>
                      <p className="text-text-muted text-[11px] leading-relaxed font-bold uppercase opacity-50">
                         {t(f.desc_en, f.desc_hi)}
                      </p>
                   </div>
                </motion.div>
              ))}
           </div>
        </div>
      </div>
    </section>
  );
}
