'use client';

import { useState, useEffect } from 'react';
import { CheckCircle, ArrowRight, Shield, DollarSign, Globe, Star, X, Lock, CreditCard, Activity, Instagram } from 'lucide-react';

// --- KÉPEK A SLIDERHEZ (IDE MAJD BEILLESZTHETED A SAJÁTJAIDAT) ---
// Most betettem olyanokat, amik hasonlítanak az általad kértekre (barna haj, iroda, cosplay vibe)
const HERO_IMAGES = [
  "https://images.unsplash.com/photo-1570700005389-221647cbc3ec?q=80&w=1000&auto=format&fit=crop", // Irodai / Elegáns
  "https://images.unsplash.com/photo-1595956553066-fe24a8c33395?q=80&w=1000&auto=format&fit=crop", // Cosplay / Kreatív vibe
  "https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?q=80&w=1000&auto=format&fit=crop"  // Divat / Mini ruha
];

export default function Home() {
  const [formStatus, setFormStatus] = useState('idle');
  const [currentImage, setCurrentImage] = useState(0);

  // KÉP VÁLTÓ ANIMÁCIÓ (4 másodpercenként)
  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentImage((prev) => (prev + 1) % HERO_IMAGES.length);
    }, 4000);
    return () => clearInterval(timer);
  }, []);

  const handleScrollToForm = () => {
    document.getElementById('apply-form').scrollIntoView({ behavior: 'smooth' });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setFormStatus('submitting');
    setTimeout(() => {
      setFormStatus('success');
      alert("Sikeres jelentkezés! Hamarosan keresünk.");
    }, 1500);
  };

  return (
    <div className="min-h-screen bg-[#050505] text-gray-200 font-sans selection:bg-[#00AFF0] selection:text-white overflow-x-hidden">
      
      {/* --- HEADER --- */}
      <nav className="fixed top-0 w-full z-50 bg-[#050505]/90 backdrop-blur-md border-b border-white/10 h-20 flex items-center transition-all duration-300">
        <div className="max-w-7xl mx-auto px-6 w-full flex justify-between items-center">
          <div className="flex items-center gap-3">
            <div className="h-8 w-1 bg-[#00AFF0] shadow-[0_0_15px_#00AFF0]"></div>
            <div className="flex flex-col">
              <span className="text-xl font-display font-bold tracking-[0.2em] uppercase text-white leading-none">
                PRIME<span className="text-[#00AFF0]">GLOBAL</span>
              </span>
              <span className="text-[8px] text-gray-500 tracking-[0.4em] uppercase">Talent Management</span>
            </div>
          </div>
          <button 
            onClick={handleScrollToForm}
            className="bg-white text-black px-5 py-2.5 text-xs font-bold tracking-widest hover:bg-[#00AFF0] hover:text-white transition duration-300 uppercase rounded-sm shadow-lg border border-transparent hover:border-white/20"
          >
            Jelentkezés
          </button>
        </div>
      </nav>

      {/* --- HERO SECTION (OSZTOTT KÉPERNYŐS) --- */}
      <section className="relative min-h-screen pt-20 flex flex-col md:flex-row">
        
        {/* BAL OLDAL: SZÖVEG (Mobilon ez kerül alulra) */}
        <div className="w-full md:w-1/2 flex items-center justify-center p-8 md:p-16 order-2 md:order-1 relative z-10 bg-[#050505]">
          <div className="max-w-xl animate-in fade-in slide-in-from-left-8 duration-1000">
            <div className="inline-flex items-center gap-2 px-3 py-1.5 border border-[#00AFF0]/30 rounded-full bg-[#00AFF0]/5 mb-8">
              <span className="w-2 h-2 bg-[#00AFF0] rounded-full animate-pulse"></span>
              <span className="text-[#00AFF0] text-[10px] font-bold tracking-[0.2em] uppercase">
                Hivatalos OnlyFans Partner
              </span>
            </div>

            <h1 className="text-4xl md:text-6xl font-display font-bold leading-tight mb-6 text-white">
              Nemzetközi Karrier.<br/>
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#00AFF0] to-white">Magyarországról.</span>
            </h1>
            
            <p className="text-gray-400 text-sm md:text-lg mb-10 leading-relaxed font-light border-l-2 border-[#00AFF0] pl-6">
              Mi nem csak posztolunk helyetted. Stratégiát építünk, védjük a tartalmaidat és 0-24-ben kezeljük a rajongóidat. 
              <span className="text-white font-bold block mt-2">Te csak a tartalmat gyártod. A dollárt mi hozzuk.</span>
            </p>
            
            <div className="flex flex-col sm:flex-row gap-4">
              <button 
                onClick={handleScrollToForm}
                className="bg-[#00AFF0] text-white px-8 py-4 text-sm font-bold tracking-[0.2em] hover:bg-white hover:text-black transition shadow-[0_0_30px_rgba(0,175,240,0.4)] uppercase flex items-center justify-center gap-3 rounded-sm group"
              >
                INGYENES AUDIT <ArrowRight size={18} className="group-hover:translate-x-1 transition" />
              </button>
              <div className="flex items-center justify-center gap-2 px-6 py-4 border border-white/10 text-xs font-bold uppercase tracking-widest text-gray-400">
                <CheckCircle size={16} className="text-green-500"/> 100% Diszkréció
              </div>
            </div>
          </div>
        </div>

        {/* JOBB OLDAL: KÉP SLIDER (Mobilon ez van felül!) */}
        <div className="w-full md:w-1/2 h-[50vh] md:h-auto order-1 md:order-2 relative overflow-hidden">
          {HERO_IMAGES.map((img, index) => (
            <div 
              key={index}
              className={`absolute inset-0 transition-opacity duration-1000 ease-in-out ${index === currentImage ? 'opacity-100' : 'opacity-0'}`}
            >
              <img 
                src={img} 
                alt="Prime Global Model" 
                className="w-full h-full object-cover object-top"
              />
              {/* Sötétítés alul, hogy a szövegbe olvadjon mobilon */}
              <div className="absolute inset-0 bg-gradient-to-t from-[#050505] via-transparent to-transparent md:hidden"></div>
              
              {/* "Prime Production" vízjel a képen */}
              <div className="absolute bottom-6 right-6 bg-black/60 backdrop-blur-md px-4 py-2 rounded border border-white/10 hidden md:block">
                <p className="text-[10px] font-bold text-white tracking-widest uppercase flex items-center gap-2">
                  <span className="w-2 h-2 bg-[#00AFF0] rounded-full"></span> Prime Production
                </p>
              </div>
            </div>
          ))}
        </div>

      </section>
{/* --- PARTNERS LOGO STRIP --- */}
      <div className="border-y border-white/5 bg-[#0a0a0a] py-8">
        <div className="max-w-7xl mx-auto px-6 flex flex-wrap justify-center md:justify-around items-center gap-8 opacity-50 grayscale hover:grayscale-0 transition duration-500">
           <div className="flex items-center gap-2 font-bold text-lg md:text-xl text-white"><Globe size={24} className="text-[#00AFF0]"/> ONLYFANS</div>
           <div className="flex items-center gap-2 font-bold text-lg md:text-xl text-white"><CreditCard size={24} className="text-[#00AFF0]"/> PAXUM</div>
           <div className="flex items-center gap-2 font-bold text-lg md:text-xl text-white"><Instagram size={24} className="text-[#00AFF0]"/> INSTAGRAM</div>
           <div className="flex items-center gap-2 font-bold text-lg md:text-xl text-white"><Shield size={24} className="text-[#00AFF0]"/> DMCA PROTECTED</div>
        </div>
      </div>

      {/* --- PROBLEM / SOLUTION --- */}
      <section className="py-24 px-6 bg-[#0a0a0a] relative overflow-hidden">
        {/* Dekoráció */}
        <div className="absolute top-0 right-0 w-[600px] h-[600px] bg-[#00AFF0] opacity-[0.03] blur-[150px] rounded-full pointer-events-none"></div>

        <div className="max-w-6xl mx-auto grid md:grid-cols-2 gap-20 items-center relative z-10">
          <div>
            <span className="text-[#00AFF0] text-xs font-bold tracking-widest uppercase mb-4 block">A Piac Valósága</span>
            <h2 className="text-3xl md:text-5xl font-display font-bold mb-8 text-white leading-tight">
              Miért bukik el a lányok <span className="text-[#00AFF0] border-b-4 border-[#00AFF0]">90%-a</span> egyedül?
            </h2>
            <p className="text-gray-400 mb-10 leading-relaxed text-sm md:text-base">
              Ha egyedül csinálod, te vagy a marketinges, a sales-es, a chat-operátor és a könyvelő is. Ez nem szabadság, ez rabszolgaság. A Prime Global leveszi ezt a terhet.
            </p>
            <ul className="space-y-6">
              {[
                "Nincs időd minőségi tartalmat gyártani a napi 12 óra chat miatt.",
                "Olcsón adod el magad ($5-10), mert nem ismered a 'High-Ticket' eladást.",
                "Félsz, hogy a képeid kiszivárognak Magyarországon.",
                "Nem éred el a gazdag amerikai/brit piacot."
              ].map((item, i) => (
                <li key={i} className="flex items-start gap-4 text-sm text-gray-300 border-l border-white/10 pl-4">
                  <X className="text-red-500 shrink-0" size={18} />
                  {item}
                </li>
              ))}
            </ul>
          </div>
          
          <div className="relative group">
            <div className="absolute -inset-1 bg-gradient-to-r from-[#00AFF0] to-[#00668f] rounded-2xl blur opacity-20 group-hover:opacity-40 transition duration-1000"></div>
            <div className="relative bg-[#050505] border border-white/10 p-10 rounded-xl shadow-2xl">
              <div className="flex items-center gap-4 mb-8 border-b border-white/10 pb-6">
                <div className="p-3 bg-[#00AFF0]/10 rounded-lg text-[#00AFF0]"><Star size={24}/></div>
                <div>
                  <h3 className="text-xl font-bold text-white uppercase tracking-wider">A Prime Megoldás</h3>
                  <p className="text-[10px] text-gray-500 uppercase">All-in-One Management</p>
                </div>
              </div>
              
              <ul className="space-y-8">
                <li className="flex gap-5">
                  <div className="bg-[#00AFF0]/10 p-3 rounded-lg text-[#00AFF0] h-fit"><DollarSign size={20}/></div>
                  <div>
                    <h4 className="font-bold text-white text-sm mb-1 uppercase tracking-wide">Fix Bevétel Stratégia</h4>
                    <p className="text-xs text-gray-400 leading-relaxed">Mi tudjuk, kinek mennyiért lehet eladni. Átlagosan 3-szoros bevételnövekedés az első hónapban.</p>
                  </div>
                </li>
                <li className="flex gap-5">
                  <div className="bg-[#00AFF0]/10 p-3 rounded-lg text-[#00AFF0] h-fit"><Shield size={20}/></div>
                  <div>
                    <h4 className="font-bold text-white text-sm mb-1 uppercase tracking-wide">Geoblokk & Biztonság</h4>
                    <p className="text-xs text-gray-400 leading-relaxed">Letiltjuk egész Magyarországot. Csak külföldi piacra dolgozunk. A titkod biztonságban van.</p>
                  </div>
                </li>
                <li className="flex gap-5">
                  <div className="bg-[#00AFF0]/10 p-3 rounded-lg text-[#00AFF0] h-fit"><Globe size={20}/></div>
                  <div>
                    <h4 className="font-bold text-white text-sm mb-1 uppercase tracking-wide">0-24 Chat Team</h4>
                    <p className="text-xs text-gray-400 leading-relaxed">Amíg te alszol vagy nyaralsz, a profi csapatunk dollárokat termel a privát üzenetekben.</p>
                  </div>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* --- FORM SECTION (CTA) --- */}
      <section id="apply-form" className="py-32 px-6 relative overflow-hidden">
        <div className="max-w-xl mx-auto relative z-10">
          <div className="text-center mb-12">
            <span className="text-[#00AFF0] text-[10px] font-bold tracking-[0.3em] uppercase mb-4 block">Limited Spots Available</span>
            <h2 className="text-4xl md:text-5xl font-display font-bold text-white mb-6">
              Jelentkezés <span className="text-[#00AFF0]">Auditra</span>
            </h2>
            <p className="text-gray-400 text-sm leading-relaxed">
              Nem veszünk fel mindenkit. Csak olyan lányokat keresünk, akikben látjuk a "Top 1%" potenciált. Töltsd ki, és ha megfelelsz, 24 órán belül keresünk.
            </p>
          </div>

          <div className="bg-[#0f0f0f] border border-white/10 p-8 md:p-10 rounded-2xl shadow-[0_0_50px_rgba(0,0,0,0.5)] relative group">
            <div className="absolute inset-0 bg-gradient-to-b from-[#00AFF0]/5 to-transparent rounded-2xl opacity-0 group-hover:opacity-100 transition duration-700 pointer-events-none"></div>
            
            <form onSubmit={handleSubmit} className="space-y-6 relative z-10">
              <div>
                <label className="block text-[10px] font-bold text-gray-500 uppercase tracking-wider mb-2 ml-1">Teljes Név / Művésznév</label>
                <input 
                  type="text" 
                  required
                  className="w-full bg-[#050505] border border-white/10 p-4 rounded text-white text-sm focus:border-[#00AFF0] focus:ring-1 focus:ring-[#00AFF0] outline-none transition placeholder-gray-700"
                  placeholder="Pl. Kovács Anna"
                />
              </div>

              <div>
                <label className="block text-[10px] font-bold text-gray-500 uppercase tracking-wider mb-2 ml-1">Instagram / OnlyFans Link</label>
                <input 
                  type="text" 
                  required
                  className="w-full bg-[#050505] border border-white/10 p-4 rounded text-white text-sm focus:border-[#00AFF0] focus:ring-1 focus:ring-[#00AFF0] outline-none transition placeholder-gray-700"
                  placeholder="instagram.com/..."
                />
              </div>

              <div>
                <label className="block text-[10px] font-bold text-gray-500 uppercase tracking-wider mb-2 ml-1">Email Cím (Privát)</label>
                <input 
                  type="email" 
                  required
                  className="w-full bg-[#050505] border border-white/10 p-4 rounded text-white text-sm focus:border-[#00AFF0] focus:ring-1 focus:ring-[#00AFF0] outline-none transition placeholder-gray-700"
                  placeholder="email@cim.hu"
                />
              </div>

              <div>
                <label className="block text-[10px] font-bold text-gray-500 uppercase tracking-wider mb-2 ml-1">Jelenlegi Havi Bevétel</label>
                <select className="w-full bg-[#050505] border border-white/10 p-4 rounded text-gray-300 text-sm focus:border-[#00AFF0] outline-none transition cursor-pointer">
                  <option>Még nem kezdtem el</option>
                  <option>$0 - $500</option>
                  <option>$500 - $2000</option>
                  <option>$2000 - $5000</option>
                  <option>$5000+</option>
                </select>
              </div>

              <button 
                type="submit"
                disabled={formStatus === 'submitting' || formStatus === 'success'}
                className={`w-full py-5 rounded font-bold uppercase tracking-[0.2em] text-sm transition transform hover:scale-[1.01] shadow-lg ${
                  formStatus === 'success' 
                  ? 'bg-green-600 text-white cursor-default' 
                  : 'bg-[#00AFF0] text-white hover:bg-white hover:text-black'
                }`}
              >
                {formStatus === 'idle' && 'Jelentkezés Elküldése'}
                {formStatus === 'submitting' && 'Feldolgozás...'}
                {formStatus === 'success' && 'Sikeresen Elküldve!'}
              </button>
              
              <div className="flex items-center justify-center gap-2 text-[9px] text-gray-600 mt-6 uppercase tracking-wider">
                <Lock size={10} /> 100% Titkosított adatkezelés.
              </div>
            </form>
          </div>
        </div>
      </section>

      {/* --- FOOTER --- */}
      <footer className="border-t border-white/5 bg-[#020202] py-16 text-center">
        <h2 className="text-2xl font-display font-bold text-white tracking-widest mb-6">
          PRIME<span className="text-[#00AFF0]">GLOBAL</span>
        </h2>
        <div className="flex justify-center gap-8 mb-10 text-gray-500 text-[10px] font-bold tracking-[0.2em] uppercase">
          <span className="cursor-pointer hover:text-white transition">Budapest</span>
          <span className="cursor-pointer hover:text-white transition">Miami</span>
          <span className="cursor-pointer hover:text-white transition">Dubai</span>
          <span className="cursor-pointer hover:text-white transition">Los Angeles</span>
        </div>
        <p className="text-[10px] text-gray-800 uppercase tracking-widest">
          © 2026 Prime Global Agency. All Rights Reserved.
        </p>
      </footer>
    </div>
  );
}