'use client';
import { motion } from 'framer-motion';
import { useLang } from '@/context/LangContext';

const PILLARS = [
  { t_en: 'Integrity', t_hi: 'सत्यनिष्ठा', d_en: 'Blockchain-backed auth.', d_hi: 'ब्लॉकचेन-आधारित प्रमाणीकरण।' },
  { t_en: 'Connectivity', t_hi: 'जुड़ाव', d_en: 'Zero-latency networking.', d_hi: 'जीरो-लेटेंसी नेटवर्किंग।' },
  { t_en: 'Grassroots', t_hi: 'जमीनी स्तर', d_en: 'Focus on Ward and Tola.', d_hi: 'वार्ड और टोले पर ध्यान।' },
];

export default function SectionVision() {
  const { t } = useLang();

  return (
    <section id="vision" className="py-6 px-6 relative overflow-hidden bg-vanda">
      {/* Background Glow */}
      <div className="absolute inset-0 pointer-events-none opacity-20"
        style={{ background: 'radial-gradient(circle at 70% 30%, #FF6B00 0%, transparent 70%)' }} />
      
      <div className="max-w-6xl mx-auto relative z-10 text-center">
         <motion.div initial={{ opacity: 0, scale: 0.9 }} whileInView={{ opacity: 1, scale: 1 }} viewport={{ once: true }}
           className="bg-saffron/10 inline-block px-5 py-2 rounded-full mb-6 border border-saffron/20 backdrop-blur-xl">
            <span className="text-gold text-[9px] font-black uppercase tracking-[0.4em]">
               {t('VISION 2027: DIGITAL BHARAT SANGATHAN', 'विजन 2027: डिजिटल भारत संगठन')}
            </span>
         </motion.div>

         <h2 className="font-display font-black text-4xl md:text-7xl mb-6 text-white leading-tight uppercase tracking-tighter">
            {t('THE PULSE OF ', 'संगठन की ')}<span className="text-gold">{t('SANGATHAN.', 'धड़कन।')}</span><br/>
            {t('THE SPEED OF ', 'प्रकाश की ')}<span className="text-saffron">{t('LIGHT.', 'गति।')}</span>
         </h2>

         <p className="max-w-3xl mx-auto text-text-muted text-base md:text-xl font-bold uppercase tracking-widest leading-relaxed mb-10 opacity-80">
            {t('WE ARE BUILDING THE MOST SOPHISTICATED INFRASTRUCTURE TO CONNECT EVERY CITIZEN TO THE COMMITTEE ROOMS.', 
               'हम हर नागरिक को समिति कक्षों से जोड़ने के लिए सबसे परिष्कृत बुनियादी ढांचा तैयार कर रहे हैं।')}
         </p>

         <div className="grid md:grid-cols-3 gap-6">
            {PILLARS.map((p, i) => (
              <motion.div key={i} whileHover={{ y: -5 }} 
                className="glass p-8 rounded-[2rem] border border-white/5 relative group">
                <div className="absolute inset-0 bg-gradient-to-br from-saffron/10 to-transparent rounded-[2.5rem] opacity-40" />
                <h4 className="text-white font-display font-black text-xl uppercase tracking-tighter mb-2">
                   {t(p.t_en, p.t_hi)}
                </h4>
                <p className="text-text-muted text-[10px] font-black uppercase tracking-widest opacity-40">
                   {t(p.d_en, p.d_hi)}
                </p>
              </motion.div>
            ))}
         </div>
      </div>
    </section>
  );
}
