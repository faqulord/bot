'use client';

import { useState, useEffect } from 'react';
import { 
  ArrowRight, 
  Shield, 
  TrendingUp, 
  Lock, 
  Check, 
  Instagram, 
  Mail,
  Clock,
  EyeOff,
  DollarSign
} from 'lucide-react';

// --- A FELTÖLTÖTT KÉPEID ---
const HERO_IMAGES = [
  "https://i.postimg.cc/q7TLcwQP/Gemini-Generated-Image-b5aq1fb5aq1fb5aq.png", // 1. Sexy/Elegant
  "https://i.postimg.cc/LhFYdCq8/Gemini-Generated-Image-z1mm12z1mm12z1mm.png", // 2. Studio/Profi
  "https://i.postimg.cc/2Sfvg6v9/Gemini-Generated-Image-urcusuurcusuurcu.png", // 3. Work/Ringlight
  "https://i.postimg.cc/hjGVM5m6/Gemini-Generated-Image-io149oio149oio14.png"  // 4. Community
];

export default function Home() {
  const [currentImage, setCurrentImage] = useState(0);
  const [formStatus, setFormStatus] = useState('idle');

  // Képváltó automatika
  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentImage((prev) => (prev + 1) % HERO_IMAGES.length);
    }, 4000);
    return () => clearInterval(timer);
  }, []);

  const scrollToForm = () => {
    document.getElementById('application-section').scrollIntoView({ behavior: 'smooth' });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setFormStatus('submitting');
    setTimeout(() => {
      setFormStatus('success');
    }, 1500);
  };

  return (
    <div className="min-h-screen bg-[#020202] text-gray-200 font-sans selection:bg-white selection:text-black overflow-x-hidden">
      
      {/* --- NAVIGATION --- */}
      <nav className="fixed top-0 w-full z-50 bg-[#020202]/90 backdrop-blur-md border-b border-white/5 h-20 transition-all">
        <div className="max-w-7xl mx-auto px-6 h-full flex items-center justify-between">
          <div className="flex flex-col cursor-pointer" onClick={() => window.scrollTo(0,0)}>
            <span className="text-xl font-medium tracking-[0.3em] uppercase text-white leading-none font-serif">
              PRIME<span className="text-[#00AFF0] font-bold font-sans">GLOBAL</span>
            </span>
            <span className="text-[8px] text-gray-500 tracking-[0.4em] uppercase mt-1">Management Group</span>
          </div>
          <button 
            onClick={scrollToForm}
            className="text-[10px] font-bold uppercase tracking-widest text-white border border-white/20 px-6 py-3 hover:bg-white hover:text-black transition duration-500 ease-out"
          >
            Jelentkezés
          </button>
        </div>
      </nav>

      {/* --- HERO SECTION (A KONKRÉT ÜZENET) --- */}
      <section className="relative h-screen w-full flex flex-col justify-center items-center overflow-hidden">
        
        {/* Háttér Slider */}
        {HERO_IMAGES.map((img, index) => (
          <div 
            key={index}
            className={`absolute inset-0 transition-all duration-[2000ms] ease-in-out transform ${index === currentImage ? 'opacity-100 scale-105' : 'opacity-0 scale-100'}`}
          >
            {/* Erős sötétítés az olvashatóságért */}
            <div className="absolute inset-0 bg-black/70 z-10"></div> 
            <div className="absolute inset-0 bg-gradient-to-t from-black via-transparent to-black/40 z-10"></div>
            <img src={img} alt="Prime Talent" className="w-full h-full object-cover object-top" />
          </div>
        ))}

        {/* Content */}
        <div className="relative z-20 text-center max-w-5xl px-4 animate-in fade-in duration-1000 slide-in-from-bottom-8 mt-10">
          <p className="text-[#00AFF0] text-[10px] md:text-[11px] font-bold tracking-[0.4em] uppercase mb-6 md:mb-8 drop-shadow-md border border-[#00AFF0]/30 inline-block px-4 py-2 rounded-full bg-black/50 backdrop-blur-sm">
            Hivatalos OnlyFans Partner
          </p>
          
          {/* CÍMSOR - EGYÉRTELMŰ ÉS NAGY */}
          <h1 className="text-3xl md:text-6xl text-white mb-8 leading-tight tracking-wide font-serif drop-shadow-2xl">
            <span className="font-light block mb-2">ONLYFANS MENEDZSMENT.</span>
            <span className="font-bold text-transparent bg-clip-text bg-gradient-to-r from-white via-gray-200 to-gray-400">
              PROFITRA TERVEZVE.
            </span>
          </h1>

          {/* ALCÍM - A FÁJDALOMPONTRA HAT */}
          <p className="text-gray-200 text-xs md:text-base font-light tracking-wide leading-relaxed max-w-2xl mx-auto mb-12 border-l-2 border-[#00AFF0] pl-4 md:border-none md:pl-0 text-left md:text-center drop-shadow-lg bg-black/30 md:bg-transparent p-4 md:p-0 rounded-r-lg">
            Kezdő vagy és nem tudod, hogyan indulj el? Vagy már csinálod, de kevés a bevételed? Mi levesszük a terhet a válladról: <strong>profi chat-csapat, marketing stratégia és teljes technikai háttér.</strong> Te csak a tartalmat gyártod, a többit mi intézzük.
          </p>

          <div className="flex flex-col md:flex-row gap-6 justify-center items-center">
            <button 
              onClick={scrollToForm}
              className="w-full md:w-auto bg-[#00AFF0] text-white px-12 py-5 text-xs font-bold tracking-[0.2em] uppercase hover:bg-white hover:text-black transition duration-500 shadow-[0_0_30px_rgba(0,175,240,0.5)] rounded-sm"
            >
              Karrier Indítása
            </button>
            
            <div className="flex items-center gap-3 text-[10px] text-gray-300 uppercase tracking-widest bg-black/60 px-5 py-3 rounded-full backdrop-blur-md border border-white/10">
               <span className="relative flex h-2 w-2">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75"></span>
                  <span className="relative inline-flex rounded-full h-2 w-2 bg-green-500"></span>
                </span>
              Jelenleg felvétel: Nyitva
            </div>
          </div>
        </div>

        {/* Scroll Indicator */}
        <div className="absolute bottom-6 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2 opacity-50 animate-bounce z-20">
          <div className="w-[1px] h-12 bg-gradient-to-b from-transparent via-white to-transparent"></div>
        </div>
      </section>

      {/* --- MIÉRT MI (A LÉNYEG) --- */}
      <section className="py-24 px-6 bg-[#020202] border-t border-white/5 relative">
        <div className="max-w-7xl mx-auto">
          
          <div className="text-center mb-16">
            <h2 className="text-2xl md:text-4xl font-light text-white mb-4 font-serif">
              Miért bukik el a lányok <span className="font-bold text-[#00AFF0] border-b border-[#00AFF0]">90%-a</span> egyedül?
            </h2>
            <p className="text-gray-400 text-sm max-w-2xl mx-auto">
              Mert az OnlyFans nem csak képek feltöltése. Ez egy 24 órás kőkemény üzlet. Ha egyedül csinálod, rabszolga leszel. Ha velünk, akkor szabad.
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            
            {/* Kártya 1: BEVÉTEL */}
            <div className="bg-[#080808] p-8 border border-white/5 hover:border-[#00AFF0]/40 transition duration-500 group rounded-sm relative overflow-hidden">
              <div className="absolute top-0 right-0 p-4 opacity-5 group-hover:opacity-10 transition"><DollarSign size={80}/></div>
              <TrendingUp size={32} className="text-[#00AFF0] mb-6"/>
              <h3 className="text-white font-bold uppercase tracking-widest text-sm mb-4">Magasabb Bevételek</h3>
              <p className="text-gray-400 text-xs leading-relaxed text-justify">
                Nem $10-os feliratkozókra hajtunk. A mi csapatunk tudja, hogyan kell eladni a tartalmaidat "VIP" bálna ügyfeleknek drágán. A tapasztalatunkkal megsokszorozhatjuk a jelenlegi bevételedet.
              </p>
            </div>

            {/* Kártya 2: CHAT */}
            <div className="bg-[#080808] p-8 border border-white/5 hover:border-[#00AFF0]/40 transition duration-500 group rounded-sm relative overflow-hidden">
              <div className="absolute top-0 right-0 p-4 opacity-5 group-hover:opacity-10 transition"><Clock size={80}/></div>
              <Clock size={32} className="text-[#00AFF0] mb-6"/>
              <h3 className="text-white font-bold uppercase tracking-widest text-sm mb-4">0-24 Chat Team</h3>
              <p className="text-gray-400 text-xs leading-relaxed text-justify">
                Utálsz egész nap a telefonon lógni és irogatni? Mi átvesszük. Profi chat-operátoraink válaszolnak helyetted éjjel-nappal, így neked van időd élni, edzeni és utazni.
              </p>
            </div>

            {/* Kártya 3: BIZTONSÁG */}
            <div className="bg-[#080808] p-8 border border-white/5 hover:border-[#00AFF0]/40 transition duration-500 group rounded-sm relative overflow-hidden">
              <div className="absolute top-0 right-0 p-4 opacity-5 group-hover:opacity-10 transition"><EyeOff size={80}/></div>
              <EyeOff size={32} className="text-[#00AFF0] mb-6"/>
              <h3 className="text-white font-bold uppercase tracking-widest text-sm mb-4">Láthatatlanság Itthon</h3>
              <p className="text-gray-400 text-xs leading-relaxed text-justify">
                Félsz, hogy meglátja a családod vagy a főnököd? "Geo-Blocking" technológiával letiltjuk egész Magyarországot. Csak külföldiek látják a profilodat. Teljes diszkréció.
              </p>
            </div>

          </div>

          {/* Trust Indicators */}
          <div className="mt-16 flex flex-wrap justify-center gap-8 border-t border-white/5 pt-10 opacity-70">
             <div className="flex items-center gap-3 text-xs uppercase tracking-widest text-white"><Check size={16} className="text-green-500"/> Hivatalos Szerződés</div>
             <div className="flex items-center gap-3 text-xs uppercase tracking-widest text-white"><Check size={16} className="text-green-500"/> Dollár Kifizetés</div>
             <div className="flex items-center gap-3 text-xs uppercase tracking-widest text-white"><Check size={16} className="text-green-500"/> Brand Építés</div>
          </div>

        </div>
      </section>

      {/* --- FORM SECTION --- */}
      <section id="application-section" className="py-24 px-6 bg-[#050505] relative overflow-hidden">
        <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-[#00AFF0] opacity-[0.03] blur-[150px] rounded-full pointer-events-none"></div>
        
        <div className="max-w-3xl mx-auto relative z-10 text-center">
          <span className="text-[#00AFF0] text-[10px] font-bold tracking-[0.3em] uppercase block mb-4">
            Csatlakozz a csapathoz
          </span>
          <h2 className="text-3xl md:text-4xl font-light text-white mb-6 font-serif">
            Jelentkezés <span className="font-bold">Menedzsmentre</span>
          </h2>
          <p className="text-gray-400 text-xs max-w-lg mx-auto mb-12">
            Nem számít, hogy teljesen kezdő vagy, vagy már van tapasztalatod. Töltsd ki az űrlapot, és ha látjuk benned a potenciált, 24 órán belül felvesszük veled a kapcsolatot.
          </p>

          <div className="bg-[#0a0a0a] border border-white/5 p-8 md:p-12 text-left shadow-[0_0_50px_rgba(0,0,0,0.5)] rounded-sm">
            {formStatus === 'success' ? (
              <div className="text-center py-12 animate-in fade-in">
                <div className="inline-flex p-4 rounded-full bg-green-500/10 text-green-500 mb-6 border border-green-500/20">
                  <Check size={32} />
                </div>
                <h3 className="text-xl text-white font-serif mb-3">Jelentkezés Elküldve!</h3>
                <p className="text-gray-500 text-sm">Köszönjük. Munkatársunk hamarosan keresni fog a megadott elérhetőségen (általában Instagramon vagy Emailben).</p>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-8">
                <div className="grid md:grid-cols-2 gap-8">
                  <div className="group">
                    <label className="block text-[9px] font-bold text-gray-500 uppercase tracking-widest mb-3 group-focus-within:text-[#00AFF0] transition">Teljes Név / Művésznév</label>
                    <input type="text" required
                      className="w-full bg-transparent border-b border-white/10 py-3 text-white text-sm focus:border-[#00AFF0] outline-none transition placeholder-gray-800" placeholder="Írd be a neved..." />
                  </div>
                  <div className="group">
                    <label className="block text-[9px] font-bold text-gray-500 uppercase tracking-widest mb-3 group-focus-within:text-[#00AFF0] transition">Instagram Link (Fontos!)</label>
                    <input type="text" required
                      className="w-full bg-transparent border-b border-white/10 py-3 text-white text-sm focus:border-[#00AFF0] outline-none transition placeholder-gray-800" placeholder="instagram.com/..." />
                  </div>
                </div>

                <div className="group">
                  <label className="block text-[9px] font-bold text-gray-500 uppercase tracking-widest mb-3 group-focus-within:text-[#00AFF0] transition">Email Cím</label>
                  <input type="email" required
                    className="w-full bg-transparent border-b border-white/10 py-3 text-white text-sm focus:border-[#00AFF0] outline-none transition placeholder-gray-800" placeholder="email@cim.hu" />
                </div>

                <div className="group">
                  <label className="block text-[9px] font-bold text-gray-500 uppercase tracking-widest mb-3 group-focus-within:text-[#00AFF0] transition">Jelenlegi Tapasztalat</label>
                  <select className="w-full bg-[#0a0a0a] border-b border-white/10 py-3 text-gray-300 text-sm focus:border-[#00AFF0] outline-none transition cursor-pointer">
                    <option>Teljesen Kezdő vagyok</option>
                    <option>Kezdő ($0 - $500 / hó)</option>
                    <option>Haladó ($500 - $2000 / hó)</option>
                    <option>Profi ($2000+ / hó)</option>
                  </select>
                </div>

                <div className="pt-8">
                  <button 
                    type="submit"
                    className="w-full bg-white text-black py-4 text-xs font-bold uppercase tracking-[0.2em] hover:bg-[#00AFF0] hover:text-white transition duration-500 shadow-lg"
                  >
                    {formStatus === 'submitting' ? 'Feldolgozás...' : 'Jelentkezés Elküldése'}
                  </button>
                  <p className="text-center text-[9px] text-gray-600 mt-6 uppercase tracking-widest flex justify-center items-center gap-2">
                    <Lock size={10} /> Az adataidat 100% bizalmasan kezeljük.
                  </p>
                </div>
              </form>
            )}
          </div>
        </div>
      </section>

      {/* --- FOOTER --- */}
      <footer className="py-16 text-center bg-[#020202] border-t border-white/5">
         <span className="text-xl font-medium tracking-[0.3em] uppercase text-white leading-none block mb-8 font-serif">
            PRIME<span className="text-[#00AFF0] font-bold font-sans">GLOBAL</span>
         </span>
         
         <div className="flex justify-center gap-8 mb-10">
            <a href="#" className="flex items-center gap-2 text-[10px] text-gray-500 uppercase tracking-widest hover:text-white transition"><Instagram size={14}/> Instagram</a>
            <a href="#" className="flex items-center gap-2 text-[10px] text-gray-500 uppercase tracking-widest hover:text-white transition"><Mail size={14}/> Kapcsolat</a>
         </div>

          <p className="text-[9px] text-gray-700 uppercase tracking-wider leading-relaxed">
            Budapest • Dubai • Los Angeles<br/>
            © 2026 Prime Global Management. All Rights Reserved.
          </p>
      </footer>
    </div>
  );
}