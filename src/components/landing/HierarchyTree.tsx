'use client';
import { motion } from 'framer-motion';

import { useLang } from '@/context/LangContext';

const HIERARCHY = [
  { level_en: 'Ward / Tola',       level_hi: 'वार्ड / टोला',     color: '#fbbf24', icon: '🏘️', desc_en: 'Grassroots unit', desc_hi: 'बुनियादी इकाई' },
  { level_en: 'Village',           level_hi: 'ग्राम',            color: '#fbbf24', icon: '🌾', desc_en: 'Village network', desc_hi: 'ग्राम नेटवर्क' },
  { level_en: 'Panchayat',         level_hi: 'पंचायत',          color: '#fbbf24', icon: '🏛️', desc_en: 'Panchayat body', desc_hi: 'पंचायत समिति' },
  { level_en: 'Gram Panchayat',    level_hi: 'ग्राम पंचायत',     color: '#fbbf24', icon: '⚖️', desc_en: 'Local administration', desc_hi: 'स्थानीय प्रशासन' },
  { level_en: 'Block / Samiti',    level_hi: 'ब्लॉक / समिति',     color: '#fbbf24', icon: '🏢', desc_en: 'Block committee', desc_hi: 'प्रखंड समिति' },
  { level_en: 'Zila Parishad',     level_hi: 'ज़िला परिषद',       color: '#fbbf24', icon: '🏙️', desc_en: 'District level', desc_hi: 'ज़िला स्तर' },
  { level_en: 'State Committee',   level_hi: 'प्रदेश कार्यकारिणी', color: '#fbbf24', icon: '🗺️', desc_en: 'State leadership', desc_hi: 'राज्य नेतृत्व' },
];

export default function HierarchyTree() {
  const { t } = useLang();

  return (
    <section className="py-20 bg-[#F6F4E8] relative overflow-hidden">
      
      {/* Decorative Brand Elements */}
      <div className="absolute top-0 right-0 w-64 h-64 bg-[#fbbf24]/5 rounded-full -mr-32 -mt-32 blur-3xl pointer-events-none" />
      <div className="absolute bottom-0 left-0 w-64 h-64 bg-[#fbbf24]/5 rounded-full -ml-32 -mb-32 blur-3xl pointer-events-none" />

      <div className="max-w-6xl mx-auto px-6 relative z-10">
        <div className="text-center mb-16">
          <motion.div initial={{ opacity: 0, y: 10 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}
            className="text-[#fbbf24] text-[10px] font-black uppercase tracking-[0.4em] mb-4">
             {t('Digital Sangathan Infrastructure', 'डिजिटल संगठन अवसंरचना')}
          </motion.div>
          <h2 className="font-display font-black text-4xl md:text-7xl mb-6 tracking-tighter text-black uppercase leading-[0.9]">
             {t('WARD TO ', 'वार्ड से ')}<span className="text-[#fbbf24]">{t('STATE', 'प्रदेश')}</span> तक.
          </h2>
          <p className="text-black/40 text-sm md:text-base font-bold tracking-[0.05em] uppercase max-w-2xl mx-auto leading-relaxed">
             {t('India\'s first completely decentralized political hierarchy, digitally connected for 21-crore karyakartas.', 
                'भारत का पहला पूर्णतः विकेंद्रीकृत राजनीतिक संगठन, 21 करोड़ कार्यकर्ताओं के लिए डिजिटल रूप से जुड़ा हुआ।')}
          </p>
        </div>

        {/* Hierarchy Grid (Centered Flow) */}
        <div className="flex flex-col items-center gap-2">
            {HIERARCHY.map((h, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.05 }}
                className="w-full max-w-2xl"
              >
                <div
                  className="flex items-center gap-4 px-6 py-5 rounded-3xl w-full mb-1 cursor-pointer transition-all border border-black/5 bg-white shadow-sm hover:shadow-xl hover:border-[#fbbf24]/30 hover:-translate-y-1"
                >
                  <div className="w-12 h-12 rounded-2xl bg-[#F6F4E8] flex items-center justify-center text-2xl shadow-inner shrink-0 transition-transform hover:scale-110">
                    {h.icon}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="font-display font-black text-black text-sm md:text-lg uppercase tracking-tight">
                      {t(h.level_en, h.level_hi)}
                    </div>
                    <div className="text-black/40 text-[9px] md:text-[10px] font-bold uppercase tracking-widest truncate">
                      {t(h.desc_en, h.desc_hi)}
                    </div>
                  </div>
                  {i === 0 && (
                    <span className="text-[8px] md:text-[9px] px-3 py-1 rounded-full font-black text-white bg-black shrink-0 tracking-widest">
                      CORE
                    </span>
                  )}
                </div>
                {i < HIERARCHY.length - 1 && (
                  <div className="w-px h-4 bg-black/5 mx-auto my-1" />
                )}
              </motion.div>
            ))}
          </div>
      </div>
    </section>
  );
}
