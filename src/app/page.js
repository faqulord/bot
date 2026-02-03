'use client';

import { useState, useEffect } from 'react';
import { 
  ArrowRight, 
  Shield, 
  TrendingUp, 
  Lock, 
  Check, 
  Instagram, 
  Mail 
} from 'lucide-react';

// --- KÉPEK LISTÁJA ---
const HERO_IMAGES = [
  "https://i.postimg.cc/q7TLcwQP/Gemini-Generated-Image-b5aq1fb5aq1fb5aq.png", // 1. Main Hero
  "https://i.postimg.cc/LhFYdCq8/Gemini-Generated-Image-z1mm12z1mm12z1mm.png", // 2. Professional Studio
  "https://i.postimg.cc/2Sfvg6v9/Gemini-Generated-Image-urcusuurcusuurcu.png", // 3. Content Creation
  "https://i.postimg.cc/hjGVM5m6/Gemini-Generated-Image-io149oio149oio14.png"  // 4. Community
];

export default function Home() {
  const [currentImage, setCurrentImage] = useState(0);
  const [formStatus, setFormStatus] = useState('idle');

  // Képváltó időzítő (4 másodperc)
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

      {/* --- HERO SECTION (JAVÍTOTT OLVASHATÓSÁG) --- */}
      <section className="relative h-screen w-full flex flex-col justify-center items-center overflow-hidden">
        
        {/* Háttér Slider */}
        {HERO_IMAGES.map((img, index) => (
          <div 
            key={index}
            className={`absolute inset-0 transition-all duration-[2000ms] ease-in-out transform ${index === currentImage ? 'opacity-100 scale-105' : 'opacity-0 scale-100'}`}
          >
            {/* Sötétítés növelve 70%-ra az olvashatóságért */}
            <div className="absolute inset-0 bg-black/70 z-10"></div> 
            {/* Alsó gradiens a gombok olvashatóságáért */}
            <div className="absolute inset-0 bg-gradient-to-t from-black via-transparent to-black/40 z-10"></div>
            <img src={img} alt="Prime Talent" className="w-full h-full object-cover object-top" />
          </div>
        ))}

        {/* Content */}
        <div className="relative z-20 text-center max-w-5xl px-4 animate-in fade-in duration-1000 slide-in-from-bottom-8 mt-10">
          <p className="text-[#00AFF0] text-[9px] md:text-[11px] font-bold tracking-[0.4em] uppercase mb-6 md:mb-8 drop-shadow-md">
            Exclusive Talent Management
          </p>
          
          {/* Cím - Mobilon kisebb (text-4xl), Gépen nagy (text-7xl) + Serif Font */}
          <h1 className="text-4xl md:text-7xl text-white mb-8 leading-tight tracking-wide font-serif drop-shadow-2xl">
            <span className="font-light block mb-2">A TARTALOMGYÁRTÁS</span>
            <span className="font-bold text-transparent bg-clip-text bg-gradient-to-r from-white via-gray-200 to-gray-400">
              MŰVÉSZETE.
            </span>
          </h1>

          <p className="text-gray-200 text-xs md:text-base font-light tracking-wide leading-relaxed max-w-xl mx-auto mb-12 border-l-2 border-[#00AFF0] pl-4 md:border-none md:pl-0 text-left md:text-center drop-shadow-lg">
            Nemzetközi karrier menedzsment válogatott tehetségeknek. Levesszük a válladról az üzleti terheket, hogy Te kizárólag a lényegre fókuszálhass: az alkotásra.
          </p>

          <div className="flex flex-col md:flex-row gap-6 justify-center items-center">
            <button 
              onClick={scrollToForm}
              className="w-full md:w-auto bg-[#00AFF0] text-white px-10 py-4 text-xs font-bold tracking-[0.2em] uppercase hover:bg-white hover:text-black transition duration-500 shadow-[0_0_30px_rgba(0,175,240,0.5)] rounded-sm"
            >
              Karrier Konzultáció
            </button>
            
            <div className="flex items-center gap-3 text-[10px] text-gray-300 uppercase tracking-widest bg-black/40 px-4 py-2 rounded-full backdrop-blur-sm border border-white/10">
               <span className="relative flex h-2 w-2">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75"></span>
                  <span className="relative inline-flex rounded-full h-2 w-2 bg-green-500"></span>
                </span>
              Felvétel: Nyitva
            </div>
          </div>
        </div>

        {/* Scroll Indicator */}
        <div className="absolute bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2 opacity-50 animate-bounce z-20">
          <div className="w-[1px] h-10 bg-gradient-to-b from-transparent via-white to-transparent"></div>
        </div>
      </section>

      {/* --- PHILOSOPHY SECTION --- */}
      <section className="py-24 px-6 bg-[#020202] border-t border-white/5">
        <div className="max-w-7xl mx-auto">
          <div className="grid md:grid-cols-2 gap-16 items-center">
            <div>
              <h2 className="text-3xl md:text-4xl font-light text-white mb-8 leading-snug font-serif">
                Nem követőket gyűjtünk.<br/>
                <span className="font-bold text-[#00AFF0]">Márkát építünk.</span>
              </h2>
              <div className="w-12 h-[1px] bg-[#00AFF0] mb-8"></div>
              <p className="text-gray-400 text-sm leading-7 font-light mb-8 text-justify">
                Az OnlyFans piac megváltozott. A "töltsünk fel képeket" stratégia ma már nem működik a legmagasabb szinten. Mi adatvezérelt marketinggel, pszichológiai profilozással és prémium márkaépítéssel dolgozunk.
              </p>
              <ul className="space-y-5">
                {[
                  "Dedikált Brand Manager minden partnerünknek",
                  "Teljes körű jogi védelem és DMCA takedown",
                  "Exkluzív hozzáférés a High-Ticket piacokhoz (USA/UK)"
                ].map((item, i) => (
                  <li key={i} className="flex items-start gap-4 text-xs font-bold uppercase tracking-wider text-white/90">
                    <Check size={16} className="text-[#00AFF0] shrink-0" /> {item}
                  </li>
                ))}
              </ul>
            </div>
            
            {/* Service Cards */}
            <div className="grid gap-6">
              <div className="bg-[#080808] p-8 border border-white/5 hover:border-[#00AFF0]/30 transition duration-500 group rounded-sm">
                <TrendingUp size={24} className="text-gray-600 group-hover:text-[#00AFF0] transition mb-4"/>
                <h3 className="text-white font-medium uppercase tracking-widest text-xs mb-2">Bevétel Optimalizálás</h3>
                <p className="text-gray-500 text-xs leading-relaxed">Dinamikus árazási stratégiák és "Bálna" ügyfélkezelés a maximális profit eléréséhez.</p>
              </div>
              <div className="bg-[#080808] p-8 border border-white/5 hover:border-[#00AFF0]/30 transition duration-500 group rounded-sm">
                <Shield size={24} className="text-gray-600 group-hover:text-[#00AFF0] transition mb-4"/>
                <h3 className="text-white font-medium uppercase tracking-widest text-xs mb-2">Digitális Biztonság</h3>
                <p className="text-gray-500 text-xs leading-relaxed">Szigorú Geo-Blocking (Magyarország tiltása) és privát szféra védelem.</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* --- APPLICATION FORM --- */}
      <section id="application-section" className="py-32 px-6 bg-[#050505] relative overflow-hidden">
        {/* Subtle decorative background */}
        <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-[#00AFF0] opacity-[0.02] blur-[150px] rounded-full pointer-events-none"></div>
        
        <div className="max-w-3xl mx-auto relative z-10 text-center">
          <span className="text-[#00AFF0] text-[10px] font-bold tracking-[0.3em] uppercase block mb-4">
            Csatlakozás a Portfólióhoz
          </span>
          <h2 className="text-3xl md:text-4xl font-light text-white mb-12 font-serif">
            Készen állsz a <span className="font-bold">következő szintre?</span>
          </h2>

          <div className="bg-[#0a0a0a] border border-white/5 p-8 md:p-12 text-left shadow-[0_0_50px_rgba(0,0,0,0.5)]">
            {formStatus === 'success' ? (
              <div className="text-center py-12 animate-in fade-in">
                <div className="inline-flex p-4 rounded-full bg-green-500/10 text-green-500 mb-6 border border-green-500/20">
                  <Check size={32} />
                </div>
                <h3 className="text-xl text-white font-serif mb-3">Jelentkezés Sikeres</h3>
                <p className="text-gray-500 text-sm">Köszönjük a bizalmat. Munkatársunk hamarosan felveszi veled a kapcsolatot.</p>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-8">
                <div className="grid md:grid-cols-2 gap-8">
                  <div className="group">
                    <label className="block text-[9px] font-bold text-gray-500 uppercase tracking-widest mb-3 group-focus-within:text-[#00AFF0] transition">Teljes Név</label>
                    <input type="text" required
                      className="w-full bg-transparent border-b border-white/10 py-3 text-white text-sm focus:border-[#00AFF0] outline-none transition placeholder-transparent" />
                  </div>
                  <div className="group">
                    <label className="block text-[9px] font-bold text-gray-500 uppercase tracking-widest mb-3 group-focus-within:text-[#00AFF0] transition">Instagram / Social Link</label>
                    <input type="text" required
                      className="w-full bg-transparent border-b border-white/10 py-3 text-white text-sm focus:border-[#00AFF0] outline-none transition placeholder-transparent" />
                  </div>
                </div>

                <div className="group">
                  <label className="block text-[9px] font-bold text-gray-500 uppercase tracking-widest mb-3 group-focus-within:text-[#00AFF0] transition">Email Cím</label>
                  <input type="email" required
                    className="w-full bg-transparent border-b border-white/10 py-3 text-white text-sm focus:border-[#00AFF0] outline-none transition placeholder-transparent" />
                </div>

                <div className="group">
                  <label className="block text-[9px] font-bold text-gray-500 uppercase tracking-widest mb-3 group-focus-within:text-[#00AFF0] transition">Jelenlegi Tapasztalat</label>
                  <select className="w-full bg-[#0a0a0a] border-b border-white/10 py-3 text-gray-300 text-sm focus:border-[#00AFF0] outline-none transition cursor-pointer">
                    <option>Kezdő / Nincs tapasztalat</option>
                    <option>Középhaladó ($500 - $2000)</option>
                    <option>Profi ($2000 - $10,000+)</option>
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
                    <Lock size={10} /> 100% Diszkrét Adatkezelés
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