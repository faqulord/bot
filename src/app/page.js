'use client';

import { useState } from 'react';
import { CheckCircle, ArrowRight, Shield, DollarSign, Globe, Star, Instagram } from 'lucide-react';

export default function Home() {
  const [formStatus, setFormStatus] = useState('idle'); // idle, submitting, success

  const handleScrollToForm = () => {
    document.getElementById('apply-form').scrollIntoView({ behavior: 'smooth' });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setFormStatus('submitting');
    // Szimulált küldés
    setTimeout(() => {
      setFormStatus('success');
      alert("Jelentkezés sikeresen elküldve! Hamarosan keresünk.");
    }, 1500);
  };

  return (
    <div className="min-h-screen bg-darkbg text-white font-sans selection:bg-ofblue selection:text-white">
      
      {/* --- HEADER (Minimalista) --- */}
      <nav className="fixed top-0 w-full z-50 bg-darkbg/90 backdrop-blur-md border-b border-white/5 h-20 flex items-center">
        <div className="max-w-7xl mx-auto px-6 w-full flex justify-between items-center">
          <div className="text-2xl font-display font-bold tracking-widest uppercase">
            PRIME<span className="text-ofblue">GLOBAL</span>
          </div>
          <button 
            onClick={handleScrollToForm}
            className="bg-white text-black px-6 py-2 text-xs font-bold tracking-widest hover:bg-ofblue hover:text-white transition duration-300 uppercase"
          >
            Jelentkezés
          </button>
        </div>
      </nav>

      {/* --- HERO SECTION (Azonnali hatás) --- */}
      <section className="relative h-screen flex items-center justify-center px-6 text-center overflow-hidden">
        {/* Háttér effekt */}
        <div className="absolute top-0 left-0 w-full h-full bg-[url('https://images.unsplash.com/photo-1496440738382-6551b80e5a78?w=1600&q=80')] bg-cover bg-center opacity-40"></div>
        <div className="absolute inset-0 bg-gradient-to-t from-darkbg via-darkbg/80 to-transparent"></div>
        
        <div className="relative z-10 max-w-4xl mx-auto animate-in fade-in duration-1000">
          <span className="text-ofblue text-xs font-bold tracking-[0.3em] uppercase border border-ofblue/30 px-4 py-1 rounded-full bg-ofblue/10 mb-6 inline-block">
            Elite OnlyFans Management
          </span>
          <h1 className="text-5xl md:text-7xl font-display font-bold leading-tight mb-6">
            Nem te dolgozol a pénzért.<br/>
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-ofblue to-white">A szépséged dolgozik érted.</span>
          </h1>
          <p className="text-gray-300 text-sm md:text-lg max-w-2xl mx-auto mb-10 font-light leading-relaxed">
            Mások napi 10 órát chatelnek fillérekért. A mi modelljeink utaznak, tartalmat gyártanak, és a <span className="text-white font-bold">Top 1%</span> bevételét keresik meg. Mi építjük a birodalmat, te csak ragyogsz.
          </p>
          <div className="flex flex-col md:flex-row gap-4 justify-center">
            <button 
              onClick={handleScrollToForm}
              className="bg-ofblue text-white px-8 py-4 text-sm font-bold tracking-widest hover:bg-white hover:text-black transition shadow-[0_0_30px_rgba(0,175,240,0.4)] uppercase flex items-center justify-center gap-2"
            >
              Karrier indítása <ArrowRight size={16} />
            </button>
            <button className="border border-white/20 text-white px-8 py-4 text-sm font-bold tracking-widest hover:bg-white/10 transition uppercase">
              Hogyan Működik?
            </button>
          </div>
        </div>
      </section>

      {/* --- SOCIAL PROOF (Számok) --- */}
      <div className="border-y border-white/10 bg-black/50 py-8">
        <div className="max-w-7xl mx-auto px-6 grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
          <div>
            <div className="text-3xl font-bold text-white mb-1">$450k+</div>
            <div className="text-xs text-gray-500 uppercase tracking-widest">Generált Bevétel</div>
          </div>
          <div>
            <div className="text-3xl font-bold text-white mb-1">Top 0.1%</div>
            <div className="text-xs text-gray-500 uppercase tracking-widest">Creator Ranking</div>
          </div>
          <div>
            <div className="text-3xl font-bold text-white mb-1">24/7</div>
            <div className="text-xs text-gray-500 uppercase tracking-widest">Chat Support</div>
          </div>
          <div>
            <div className="text-3xl font-bold text-white mb-1">100%</div>
            <div className="text-xs text-gray-500 uppercase tracking-widest">Diszkréció</div>
          </div>
        </div>
      </div>

      {/* --- PROBLEM / SOLUTION (Miért mi?) --- */}
      <section className="py-24 px-6 bg-[#0a0a0a]">
        <div className="max-w-6xl mx-auto grid md:grid-cols-2 gap-16 items-center">
          <div>
            <h2 className="text-3xl md:text-5xl font-display font-bold mb-6">
              Miért bukik el a lányok <span className="text-ofblue">90%-a</span> egyedül?
            </h2>
            <p className="text-gray-400 mb-8 leading-relaxed">
              Az OnlyFans már nem csak arról szól, hogy feltöltesz egy képet. Ez egy kőkemény üzlet. Ha egyedül csinálod, te vagy a marketinges, a sales-es, a chat-operátor és a könyvelő is. Ez kiégéshez vezet.
            </p>
            <ul className="space-y-4">
              {[
                "Nincs időd tartalmat gyártani a sok chatelés miatt.",
                "Nem tudod, hogyan szerezz fizetőképes külföldi követőket.",
                "Olcsón adod el magad, mert nem ismered a 'Bálna' pszichológiát.",
                "Félsz, hogy kiderül a környezetedben."
              ].map((item, i) => (
                <li key={i} className="flex items-start gap-3 text-sm text-gray-300">
                  <X className="text-red-500 shrink-0" size={18} />
                  {item}
                </li>
              ))}
            </ul>
          </div>
          <div className="relative">
            <div className="absolute -inset-4 bg-ofblue/20 blur-3xl rounded-full"></div>
            <div className="relative bg-darkbg border border-white/10 p-8 rounded-2xl shadow-2xl">
              <h3 className="text-xl font-bold text-white mb-6 uppercase tracking-widest border-b border-white/10 pb-4">
                A PRIME GLOBAL MEGOLDÁS
              </h3>
              <ul className="space-y-6">
                <li className="flex gap-4">
                  <div className="bg-ofblue/10 p-3 rounded-lg text-ofblue h-fit"><DollarSign size={24}/></div>
                  <div>
                    <h4 className="font-bold text-white">Profit Optimalizálás</h4>
                    <p className="text-xs text-gray-400 mt-1">Mi tudjuk, kinek mennyiért lehet eladni. Átlagosan 3-szoros bevételnövekedés az első hónapban.</p>
                  </div>
                </li>
                <li className="flex gap-4">
                  <div className="bg-ofblue/10 p-3 rounded-lg text-ofblue h-fit"><Shield size={24}/></div>
                  <div>
                    <h4 className="font-bold text-white">Geoblokk & Védelem</h4>
                    <p className="text-xs text-gray-400 mt-1">Letiltjuk Magyarországot. Csak külföldi, gazdag piacra dolgozunk. A titkod biztonságban van.</p>
                  </div>
                </li>
                <li className="flex gap-4">
                  <div className="bg-ofblue/10 p-3 rounded-lg text-ofblue h-fit"><Globe size={24}/></div>
                  <div>
                    <h4 className="font-bold text-white">0-24 Chat Team</h4>
                    <p className="text-xs text-gray-400 mt-1">Amíg te alszol vagy nyaralsz, a profi csapatunk dollárokat termel a privát üzenetekben.</p>
                  </div>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* --- SERVICES (Szolgáltatások) --- */}
      <section className="py-24 px-6 text-center">
        <span className="text-ofblue text-xs font-bold tracking-widest uppercase mb-2 block">Our Expertise</span>
        <h2 className="text-4xl font-display font-bold text-white mb-16">
          Teljeskörű Menedzsment
        </h2>
        
        <div className="max-w-6xl mx-auto grid md:grid-cols-3 gap-8">
          <div className="group p-8 bg-[#0a0a0a] border border-white/5 hover:border-ofblue/50 transition duration-500 rounded-xl cursor-default">
            <div className="w-16 h-16 bg-white/5 rounded-full flex items-center justify-center mx-auto mb-6 group-hover:bg-ofblue group-hover:text-white transition text-gray-400">
              <Star size={32} />
            </div>
            <h3 className="text-xl font-bold text-white mb-4">Márkaépítés</h3>
            <p className="text-sm text-gray-400 leading-relaxed">
              Nem csak OnlyFans. Instagram, Twitter, TikTok stratégiát építünk köréd, hogy valódi influenszer legyél, ne csak egy modell.
            </p>
          </div>

          <div className="group p-8 bg-[#0a0a0a] border border-white/5 hover:border-ofblue/50 transition duration-500 rounded-xl cursor-default">
            <div className="w-16 h-16 bg-white/5 rounded-full flex items-center justify-center mx-auto mb-6 group-hover:bg-ofblue group-hover:text-white transition text-gray-400">
              <Target size={32} />
            </div>
            <h3 className="text-xl font-bold text-white mb-4">Faceless Karrier</h3>
            <p className="text-sm text-gray-400 leading-relaxed">
              Nem akarod mutatni az arcod? Semmi gond. A "Mystery Brand" stratégiánk kifejezetten erre épül. Az anonimitás luxus.
            </p>
          </div>

          <div className="group p-8 bg-[#0a0a0a] border border-white/5 hover:border-ofblue/50 transition duration-500 rounded-xl cursor-default">
            <div className="w-16 h-16 bg-white/5 rounded-full flex items-center justify-center mx-auto mb-6 group-hover:bg-ofblue group-hover:text-white transition text-gray-400">
              <Globe size={32} />
            </div>
            <h3 className="text-xl font-bold text-white mb-4">Utaztatás</h3>
            <p className="text-sm text-gray-400 leading-relaxed">
              A legjobb modelljeinknek Dubai és Miami content túrákat szervezünk. Ingyen repjegy, hotel és profi fotós stáb.
            </p>
          </div>
        </div>
      </section>

      {/* --- FORM SECTION (CTA) --- */}
      <section id="apply-form" className="py-24 px-6 relative">
        <div className="absolute inset-0 bg-gradient-to-b from-darkbg to-[#081218]"></div>
        
        <div className="max-w-2xl mx-auto relative z-10 bg-[#0f0f0f] border border-white/10 p-8 md:p-12 rounded-2xl shadow-2xl">
          <div className="text-center mb-10">
            <h2 className="text-3xl md:text-4xl font-display font-bold text-white mb-4">
              Jelentkezés <span className="text-ofblue">Auditra</span>
            </h2>
            <p className="text-gray-400 text-sm">
              Töltsd ki az űrlapot. Ha látunk benned potenciált, 24 órán belül felvesszük veled a kapcsolatot egy privát konzultációra.
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-2">Teljes Név / Művésznév</label>
              <input 
                type="text" 
                required
                className="w-full bg-black border border-white/10 p-4 rounded text-white focus:border-ofblue focus:ring-1 focus:ring-ofblue outline-none transition"
                placeholder="Pl. Kovács Anna"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-2">Instagram / OnlyFans Link</label>
              <input 
                type="text" 
                required
                className="w-full bg-black border border-white/10 p-4 rounded text-white focus:border-ofblue focus:ring-1 focus:ring-ofblue outline-none transition"
                placeholder="instagram.com/..."
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-2">Email Cím (Privát)</label>
              <input 
                type="email" 
                required
                className="w-full bg-black border border-white/10 p-4 rounded text-white focus:border-ofblue focus:ring-1 focus:ring-ofblue outline-none transition"
                placeholder="email@cim.hu"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-2">Jelenlegi Havi Bevétel (Becslés)</label>
              <select className="w-full bg-black border border-white/10 p-4 rounded text-gray-300 focus:border-ofblue outline-none transition">
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
              className={`w-full py-5 rounded font-bold uppercase tracking-[0.2em] text-sm transition transform hover:scale-[1.01] ${
                formStatus === 'success' 
                ? 'bg-green-600 text-white cursor-default' 
                : 'bg-ofblue text-white hover:bg-white hover:text-ofblue'
              }`}
            >
              {formStatus === 'idle' && 'Jelentkezés Elküldése'}
              {formStatus === 'submitting' && 'Küldés folyamatban...'}
              {formStatus === 'success' && 'Sikeresen Elküldve!'}
            </button>
            
            <div className="flex items-center justify-center gap-2 text-[10px] text-gray-600 mt-4">
              <Lock size={12} /> 100% Titkosított adatkezelés. Senki nem tudja meg.
            </div>
          </form>
        </div>
      </section>

      {/* --- FOOTER --- */}
      <footer className="border-t border-white/5 bg-black py-12 text-center">
        <h2 className="text-xl font-display font-bold text-white tracking-widest mb-4">
          PRIME<span className="text-ofblue">GLOBAL</span>
        </h2>
        <div className="flex justify-center gap-6 mb-8 text-gray-500">
          <span className="cursor-pointer hover:text-white transition">Budapest</span>
          <span className="cursor-pointer hover:text-white transition">Miami</span>
          <span className="cursor-pointer hover:text-white transition">Dubai</span>
        </div>
        <p className="text-[10px] text-gray-700 uppercase tracking-widest">
          © 2026 Prime Global Agency. All Rights Reserved.
        </p>
      </footer>
    </div>
  );
}