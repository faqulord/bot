'use client';

import { useState, useEffect } from 'react';
import { CheckCircle, ArrowRight, Shield, DollarSign, Globe, Star, X, Lock, TrendingUp, CreditCard, Activity } from 'lucide-react';

export default function Home() {
  const [formStatus, setFormStatus] = useState('idle');
  const [activeUsers, setActiveUsers] = useState(142);

  // Élő számláló effekt
  useEffect(() => {
    const interval = setInterval(() => {
      setActiveUsers(prev => prev + (Math.random() > 0.5 ? 1 : -1));
    }, 3000);
    return () => clearInterval(interval);
  }, []);

  const handleScrollToForm = () => {
    document.getElementById('apply-form').scrollIntoView({ behavior: 'smooth' });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setFormStatus('submitting');
    setTimeout(() => {
      setFormStatus('success');
      // Itt később bekötheted az email küldést
    }, 1500);
  };

  return (
    <div className="min-h-screen bg-[#050505] text-gray-200 font-sans selection:bg-[#00AFF0] selection:text-white overflow-x-hidden">
      
      {/* --- LIVE TICKER (A PÖRGÉS ÉRZETE) --- */}
      <div className="bg-[#00AFF0] text-white text-[10px] font-bold py-1 px-4 flex justify-between items-center tracking-widest uppercase z-50 relative">
        <div className="flex items-center gap-2">
          <span className="w-2 h-2 bg-white rounded-full animate-pulse"></span>
          LIVE SYSTEM STATUS
        </div>
        <div className="hidden md:flex gap-6">
          <span>Aktív Modellek: {activeUsers}</span>
          <span>Mai Kifizetések: $12,450</span>
          <span>Szerver: LONDON_04</span>
        </div>
        <div>HU / EN</div>
      </div>

      {/* --- HEADER --- */}
      <nav className="fixed top-8 w-full z-40 bg-[#050505]/80 backdrop-blur-xl border-b border-white/5 h-20 flex items-center transition-all duration-300">
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
            className="bg-white text-black px-6 py-3 text-xs font-bold tracking-widest hover:bg-[#00AFF0] hover:text-white transition duration-300 uppercase rounded-sm shadow-lg"
          >
            Partner Jelentkezés
          </button>
        </div>
      </nav>

      {/* --- HERO SECTION (IMPRESSZÍV) --- */}
      <section className="relative h-screen flex items-center justify-center px-6 text-center overflow-hidden pt-20">
        {/* Háttér */}
        <div className="absolute top-0 left-0 w-full h-full bg-[url('https://images.unsplash.com/photo-1620641788421-7a1c342ea42e?w=1600&q=80')] bg-cover bg-center opacity-20 filter contrast-125"></div>
        <div className="absolute inset-0 bg-gradient-to-t from-[#050505] via-[#050505]/90 to-transparent"></div>
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-[#00AFF0] opacity-10 blur-[150px] rounded-full pointer-events-none"></div>
        
        <div className="relative z-10 max-w-5xl mx-auto animate-in fade-in duration-1000 slide-in-from-bottom-10">
          
          <div className="flex justify-center mb-8">
            <div className="flex items-center gap-2 px-4 py-2 border border-[#00AFF0]/30 rounded-full bg-[#00AFF0]/5 backdrop-blur-md">
              <CheckCircle size={14} className="text-[#00AFF0]" />
              <span className="text-[#00AFF0] text-[10px] font-bold tracking-[0.2em] uppercase">
                Verified OnlyFans Partner
              </span>
            </div>
          </div>

          <h1 className="text-5xl md:text-8xl font-display font-bold leading-tight mb-8 text-white drop-shadow-2xl">
            BUILD YOUR <br/>
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#00AFF0] to-white">DIGITAL EMPIRE.</span>
          </h1>
          
          <p className="text-gray-300 text-sm md:text-xl max-w-2xl mx-auto mb-12 font-light leading-relaxed border-l-2 border-[#00AFF0] pl-6 text-left md:text-center md:border-l-0 md:pl-0">
            Nemzetközi karrier Budapestről. Mi adjuk a stratégiát, a védelmet és a 24 órás chat csapatot. 
            <span className="text-white font-bold block mt-2">Te csak a tartalmat gyártod. A dollárt mi hozzuk.</span>
          </p>
          
          <div className="flex flex-col md:flex-row gap-6 justify-center items-center">
            <button 
              onClick={handleScrollToForm}
              className="w-full md:w-auto bg-[#00AFF0] text-white px-10 py-5 text-sm font-bold tracking-[0.2em] hover:bg-white hover:text-black transition shadow-[0_0_40px_rgba(0,175,240,0.3)] uppercase flex items-center justify-center gap-3 rounded-sm group"
            >
              START CAREER <ArrowRight size={18} className="group-hover:translate-x-1 transition" />
            </button>
            <div className="flex items-center gap-4 text-xs font-bold text-gray-500 uppercase tracking-widest">
              <span>Dubai</span> • <span>Miami</span> • <span>London</span>
            </div>
          </div>
        </div>
      </section>

      {/* --- PARTNERS LOGO STRIP (TRUST) --- */}
      <div className="border-y border-white/5 bg-[#0a0a0a] py-6 overflow-hidden">
        <div className="max-w-7xl mx-auto px-6 flex justify-around items-center opacity-40 grayscale hover:grayscale-0 transition duration-500">
           {/* Kamu logók helyett szöveges reprezentáció a profi hatásért */}
           <div className="flex items-center gap-2 font-bold text-xl"><Globe size={24}/> ONLYFANS</div>
           <div className="flex items-center gap-2 font-bold text-xl hidden md:flex"><CreditCard size={24}/> PAXUM</div>
           <div className="flex items-center gap-2 font-bold text-xl"><Activity size={24}/> INSTAGRAM</div>
           <div className="flex items-center gap-2 font-bold text-xl hidden md:flex"><Shield size={24}/> DMCA PROTECTED</div>
        </div>
      </div>

      {/* --- STATS SECTION (SOCIAL PROOF) --- */}
      <section className="py-20 px-6 border-b border-white/5">
        <div className="max-w-7xl mx-auto grid grid-cols-2 md:grid-cols-4 gap-12 text-center">
          {[
            { label: "Generált Bevétel 2025", value: "$2.4M+" },
            { label: "Aktív Modellek", value: "140+" },
            { label: "Átlagos Növekedés", value: "350%" },
            { label: "Partner Iroda", value: "3" },
          ].map((stat, i) => (
            <div key={i} className="group">
              <div className="text-4xl md:text-5xl font-display font-bold text-white mb-2 group-hover:text-[#00AFF0] transition duration-300">{stat.value}</div>
              <div className="text-[10px] text-gray-500 uppercase tracking-[0.2em] group-hover:text-white transition">{stat.label}</div>
            </div>
          ))}
        </div>
      </section>

      {/* --- PROBLEM / SOLUTION --- */}
      <section className="py-32 px-6 bg-[#0a0a0a] relative">
        <div className="max-w-6xl mx-auto grid md:grid-cols-2 gap-20 items-center">
          <div>
            <span className="text-[#00AFF0] text-xs font-bold tracking-widest uppercase mb-4 block">A Valóság</span>
            <h2 className="text-3xl md:text-5xl font-display font-bold mb-8 text-white leading-tight">
              Miért bukik el a lányok <span className="text-[#00AFF0] border-b-4 border-[#00AFF0]">90%-a</span> egyedül?
            </h2>
            <p className="text-gray-400 mb-10 leading-relaxed text-sm md:text-base">
              Az OnlyFans egy kőkemény üzlet. Ha egyedül csinálod, napi 14 órát kell a telefonodat nyomkodnod a "Whale" (gazdag) ügyfelek után kutatva. Ez nem szabadság, ez rabszolgaság.
            </p>
            <ul className="space-y-6">
              {[
                "Nincs időd minőségi tartalmat gyártani a sok chatelés miatt.",
                "Olcsón adod el magad, mert nem ismered a pszichológiát.",
                "Félsz, hogy a képeid kiszivárognak Magyarországon.",
                "Nem tudod, hogyan kell adózni a kripto vagy dollár után."
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
        {/* Dekoráció */}
        <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-[#00AFF0] opacity-[0.05] blur-[150px] rounded-full pointer-events-none"></div>
        
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

          <div className="bg-[#0f0f0f] border border-white/10 p-8 md:p-10 rounded-2xl shadow-[0_0_50px_rgba(0,0,0,0.5)]">
            <form onSubmit={handleSubmit} className="space-y-6">
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