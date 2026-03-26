'use client';
import { motion } from 'framer-motion';
import Image from 'next/image';

import { useLang } from '@/context/LangContext';

const MEMBERS = [
  { 
    name_en: 'Dr. Amitabh Sharma', 
    name_hi: 'डॉ. अमिताभ शर्मा',
    role_en: 'Apex Mission Strategist', 
    role_hi: 'मुख्य मिशन रणनीतिकार',
    img: '/images/members/leader1.png',
    bio_en: 'Pioneering the 2027 Vision for a unified digital Bharat.',
    bio_hi: 'एकीकृत डिजिटल भारत के लिए विजन 2027 का नेतृत्व।'
  },
  { 
    name_en: 'Mrs. Rekha Varma', 
    name_hi: 'श्रीमती रेखा वर्मा',
    role_en: 'Grassroots Engagement Lead', 
    role_hi: 'जमीनी जुड़ाव प्रमुख',
    img: '/images/members/leader2.png',
    bio_en: 'Driving connection at the Ward and Tola levels.',
    bio_hi: 'वार्ड और टोला स्तर पर जुड़ाव को बढ़ावा देना।'
  },
  { 
    name_en: 'Mr. Rajesh Mehra', 
    name_hi: 'श्री राजेश मेहरा',
    role_en: 'Regional Node Coordinator', 
    role_hi: 'क्षेत्रीय नोड समन्वयक',
    img: '/images/members/leader3.png',
    bio_en: 'Ensuring seamless multi-state Sangathan mobilization.',
    bio_hi: 'निर्बाध बहु-राज्य संगठन लामबंदी सुनिश्चित करना।'
  },
];

export default function CoreMembers() {
  const { t } = useLang();

  return (
    <section id="core-members" className="py-20 px-6 max-w-7xl mx-auto scroll-mt-32">
      <div className="text-center mb-16">
        <motion.div initial={{ opacity: 0, y: 10 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}
          className="text-[#fbbf24] text-[10px] font-black uppercase tracking-[0.4em] mb-4">
           {t('Leadership Council', 'नेतृत्व परिषद')}
        </motion.div>
        <h2 className="font-display font-black text-4xl md:text-7xl mb-6 tracking-tighter text-white uppercase leading-none">
           {t('MEET OUR ', 'हमारे ')}<span className="text-[#fbbf24]">{t('CORE MEMBERS.', 'प्रमुख सदस्य।')}</span>
        </h2>
        <p className="text-white/40 text-sm font-bold uppercase tracking-widest max-w-2xl mx-auto">
           {t('The visionaries leading the Digital Sangathan mission towards 21-crore empowerment.', 
              '21 करोड़ सशक्तिकरण की ओर डिजिटल संगठन मिशन का नेतृत्व करने वाले विचारक।')}
        </p>
      </div>

      <div className="grid md:grid-cols-3 gap-8 lg:gap-12">
        {MEMBERS.map((m, i) => (
          <motion.div key={i} whileHover={{ y: -10 }} 
            className="group relative glass rounded-[2.5rem] border border-white/5 overflow-hidden p-6 text-center">
            
            <div className="relative w-40 h-40 mx-auto mb-8 rounded-full border-2 border-[#fbbf24]/20 p-2 overflow-hidden bg-black/40 group-hover:border-[#fbbf24]/60 transition-colors">
               <div className="relative w-full h-full rounded-full overflow-hidden">
                  <Image src={m.img} alt={m.name_en} fill className="object-cover transition-transform group-hover:scale-110 duration-500" />
               </div>
            </div>

            <h3 className="text-white font-display font-black text-2xl uppercase tracking-tighter mb-2">
               {t(m.name_en, m.name_hi)}
            </h3>
            <div className="text-[#fbbf24] text-[10px] font-black uppercase tracking-[0.25em] mb-6">
               {t(m.role_en, m.role_hi)}
            </div>
            
            <p className="text-white/40 text-[10px] font-bold uppercase tracking-widest leading-relaxed mb-6 opacity-0 group-hover:opacity-100 transition-opacity">
               {t(m.bio_en, m.bio_hi)}
            </p>

            <div className="h-0.5 w-1/4 bg-[#fbbf24] mx-auto opacity-40" />
          </motion.div>
        ))}
      </div>
    </section>
  );
}
