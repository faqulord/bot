"use client"; // Fontos a gombok működéséhez!

import React, { useState, useEffect } from 'react';
import { 
  Menu, X, Zap, ShieldAlert, Cpu, 
  BarChart3, Mail, ChevronRight, Terminal, 
  CheckCircle2, AlertTriangle, ArrowRight 
} from 'lucide-react';

export default function StartupPage() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  // Görgetés érzékelése a navbar áttetszőségéhez
  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 50);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <div className="min-h-screen bg-[#02040a] text-white font-sans selection:bg-green-500/30 overflow-x-hidden">
      
      {/* --- HÁTTÉR EFFEKT (Digitális Eső / Hó) --- */}
      <div className="fixed inset-0 z-0 pointer-events-none opacity-20">
         {/* Generálunk 50 "részecskét" CSS-sel */}
         {[...Array(20)].map((_, i) => (
            <div 
              key={i}
              className="absolute bg-green-500 rounded-full animate-float"
              style={{
                width: Math.random() * 3 + 'px',
                height: Math.random() * 3 + 'px',
                top: Math.random() * 100 + '%',
                left: Math.random() * 100 + '%',
                animationDuration: (Math.random() * 10 + 10) + 's',
                opacity: Math.random()
              }}
            ></div>
         ))}
         <div className="absolute top-0 left-0 w-full h-full bg-gradient-to-b from-transparent via-[#02040a]/50 to-[#02040a]"></div>
      </div>

      {/* --- NAVBAR (Mobilra optimalizálva) --- */}
      <nav className={`fixed top-0 w-full z-50 transition-all duration-300 ${scrolled ? 'bg-black/80 backdrop-blur-lg border-b border-white/5 py-4' : 'bg-transparent py-6'}`}>
        <div className="max-w-7xl mx-auto px-6 flex items-center justify-between">
          
          {/* LOGO: ONYX AI EYE */}
          <div className="flex items-center gap-3 cursor-pointer group">
            <div className="relative w-10 h-10 flex items-center justify-center">
              <div className="absolute inset-0 bg-green-500/20 rounded-full blur-md group-hover:bg-green-500/40 transition-all animate-pulse"></div>
              <div className="relative w-full h-full border border-green-500/50 rounded-full flex items-center justify-center bg-black">
                <div className="w-3 h-3 bg-green-400 rounded-full shadow-[0_0_10px_#4ade80]"></div>
              </div>
            </div>
            <span className="font-bold text-2xl tracking-tighter">ONYX<span className="text-green-500">.AI</span></span>
          </div>

          {/* DESKTOP MENU */}
          <div className="hidden md:flex items-center gap-8 text-sm font-medium text-gray-400">
            <a href="#sztori" className="hover:text-white transition-colors">A Technológiáról</a>
            <a href="#utmutato" className="hover:text-white transition-colors">Használati Útmutató</a>
            <a href="#biztonsag" className="hover:text-white transition-colors">Biztonság</a>
            <a 
              href="https://t.me/SHANNA444" 
              target="_blank"
              className="bg-white text-black px-5 py-2.5 rounded-full font-bold hover:bg-green-400 transition-all hover:shadow-[0_0_20px_rgba(34,197,94,0.4)]"
            >
              Csatlakozás
            </a>
          </div>

          {/* MOBILE MENU TOGGLE */}
          <button onClick={() => setIsMenuOpen(!isMenuOpen)} className="md:hidden text-white">
            {isMenuOpen ? <X /> : <Menu />}
          </button>
        </div>

        {/* MOBILE DROPDOWN */}
        {isMenuOpen && (
          <div className="md:hidden absolute top-full left-0 w-full bg-[#0a0a0a] border-b border-white/10 p-6 flex flex-col gap-4 shadow-2xl animate-fade-in-down">
            <a href="#sztori" onClick={() => setIsMenuOpen(false)} className="text-lg text-gray-300">A Technológiáról</a>
            <a href="#utmutato" onClick={() => setIsMenuOpen(false)} className="text-lg text-gray-300">Használati Útmutató</a>
            <a href="#biztonsag" onClick={() => setIsMenuOpen(false)} className="text-lg text-gray-300">Biztonság</a>
            <a href="https://t.me/SHANNA444" onClick={() => setIsMenuOpen(false)} className="bg-green-500 text-black text-center py-3 rounded-xl font-bold">
              INGYENES TESZT START
            </a>
          </div>
        )}
      </nav>

      {/* --- HERO SECTION --- */}
      <main className="relative pt-32 pb-20 px-6 z-10">
        <div className="max-w-4xl mx-auto text-center space-y-8">
          
          {/* ALERT BADGE */}
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-red-500/10 border border-red-500/30 text-red-400 text-xs font-bold tracking-wide animate-pulse">
            <ShieldAlert size={14} />
            LIMITÁLT HELYEK: A TESZT IDŐSZAK HAMAROSAN LEZÁRUL
          </div>

          <h1 className="text-5xl md:text-7xl font-extrabold tracking-tight leading-tight">
            Ez már nem szerencsejáték. <br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-green-400 via-emerald-500 to-cyan-500">
              Ez Matematika.
            </span>
          </h1>

          <p className="text-xl text-gray-400 max-w-2xl mx-auto leading-relaxed">
            2026 Technológiai áttörése. Egy MI, ami valós időben elemzi a globális sportpiacot, és ott csap le, ahol az emberi szem már nem látja az esélyt.
          </p>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-4">
            <a 
              href="https://t.me/SHANNA444" 
              target="_blank"
              className="group relative w-full sm:w-auto px-8 py-4 bg-white text-black font-bold text-lg rounded-full hover:bg-green-400 transition-all flex items-center justify-center gap-2 shadow-[0_0_40px_rgba(255,255,255,0.1)]"
            >
              <Terminal size={20} />
              CSATLAKOZOM A TESZTHEZ
              <ArrowRight size={20} className="group-hover:translate-x-1 transition-transform" />
            </a>
          </div>
          <p className="text-xs text-gray-500">*Az első hónap ingyenes. Nincs bankkártya adat.</p>
        </div>
      </main>

      {/* --- SZTORI / TECH --- */}
      <section id="sztori" className="py-20 border-t border-white/5 bg-gradient-to-b from-[#02040a] to-[#050a10]">
        <div className="max-w-6xl mx-auto px-6 grid md:grid-cols-2 gap-16 items-center">
          <div className="space-y-6">
            <h2 className="text-3xl font-bold mb-4">A Fejlesztés Története</h2>
            <div className="space-y-4 text-gray-400 leading-relaxed">
              <p>
                Több mint 2 év fejlesztés, 14.000 sor kód és rengeteg álmatlan éjszaka. Ez az ONYX.
              </p>
              <p>
                Rájöttünk, hogy a fogadóirodák profitja az emberi hibákból származik: az érzelmekből, a fáradtságból és a kapzsiságból. Mi kivettük az egyenletből az embert.
              </p>
              <p className="text-white font-medium border-l-4 border-green-500 pl-4">
                "Olyan technológiát akartunk, ami hideg fejjel, 0-24 órában szkenneli Japánt, Brazíliát és Európát egyszerre. Ez emberileg lehetetlen. Az ONYX-nak ez csak egy átlagos kedd."
              </p>
            </div>
            <div className="flex gap-4 pt-4">
               <Badge text="Python Engine" />
               <Badge text="Real-Time API" />
               <Badge text="Machine Learning" />
            </div>
          </div>
          
          {/* GRAFIKUS ELEM */}
          <div className="relative rounded-2xl bg-black border border-white/10 p-8 shadow-2xl">
            <div className="absolute -top-10 -right-10 w-32 h-32 bg-green-500/20 rounded-full blur-[50px]"></div>
            <div className="flex items-center gap-4 mb-6">
               <Cpu size={40} className="text-green-500" />
               <div>
                  <h3 className="font-bold text-xl">ONYX CORE V4.0</h3>
                  <p className="text-xs text-green-400">SYSTEM STATUS: STABLE</p>
               </div>
            </div>
            <div className="space-y-3 font-mono text-sm text-gray-400">
               <div className="flex justify-between"><span>Scanning Matches:</span> <span className="text-white">142 Active</span></div>
               <div className="flex justify-between"><span>Market Analysis:</span> <span className="text-white">Processing...</span></div>
               <div className="flex justify-between"><span>Probabilities:</span> <span className="text-green-400">Calculating</span></div>
               <div className="h-2 w-full bg-gray-800 rounded-full mt-2 overflow-hidden">
                  <div className="h-full bg-green-500 w-[85%] animate-pulse"></div>
               </div>
            </div>
          </div>
        </div>
      </section>

      {/* --- HASZNÁLATI ÚTMUTATÓ (USER GUIDE) --- */}
      <section id="utmutato" className="py-20 px-6">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">Hogyan Működik?</h2>
            <p className="text-gray-400">A rendszer bonyolult. A te feladatod egyszerű.</p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            <StepCard 
               number="01" 
               title="Csatlakozz" 
               desc="Lépj be a zárt Telegram csatornára. Most még ingyenes a tesztfázis." 
            />
            <StepCard 
               number="02" 
               title="Várd a Jelzést" 
               desc="Ne nézd a meccset. Éld az életed. A telefonod jelezni fog: 'ONYX SNIPER TALÁLAT'." 
            />
            <StepCard 
               number="03" 
               title="Profitálj" 
               desc="Nyisd meg az appot, rakd meg a tippet, és dőlj hátra. A munka nehezét a gép végezte." 
            />
          </div>
        </div>
      </section>

      {/* --- NEWSLETTER / EMAIL --- */}
      <section className="py-20 bg-green-900/10 border-y border-green-500/10">
        <div className="max-w-2xl mx-auto px-6 text-center">
          <div className="inline-block p-3 bg-green-500/20 rounded-full mb-6">
            <Mail className="text-green-400" size={32} />
          </div>
          <h2 className="text-3xl font-bold mb-4">Ne maradj le a Frissítésekről</h2>
          <p className="text-gray-400 mb-8">
            A technológia napról napra fejlődik. Ha tudni akarod, mikor érkezik a következő "Lottózó Robbantó" frissítés, add meg az email címed.
          </p>
          <div className="flex flex-col sm:flex-row gap-3">
            <input 
              type="email" 
              placeholder="Az email címed..." 
              className="flex-1 bg-black border border-white/20 rounded-lg px-6 py-4 focus:outline-none focus:border-green-500 text-white placeholder:text-gray-600"
            />
            <button className="bg-white text-black font-bold px-8 py-4 rounded-lg hover:bg-green-400 transition-colors">
              KÜLDÉS
            </button>
          </div>
        </div>
      </section>

      {/* --- FOOTER / LEGAL --- */}
      <footer id="biztonsag" className="bg-[#010101] pt-16 pb-8 border-t border-white/5 text-sm text-gray-500">
        <div className="max-w-6xl mx-auto px-6 grid md:grid-cols-4 gap-12 mb-12">
          <div className="col-span-2">
            <div className="flex items-center gap-2 mb-4 text-white">
              <div className="w-6 h-6 bg-green-900 rounded-full flex items-center justify-center border border-green-500/30">
                <div className="w-2 h-2 bg-green-500 rounded-full"></div>
              </div>
              <span className="font-bold text-lg">ONYX AI</span>
            </div>
            <p className="max-w-sm">
              Szoftveres megoldások a sportanalitikában. A mesterséges intelligencia erejével csökkentjük a kockázatot és növeljük a hatékonyságot.
            </p>
          </div>
          
          <div>
            <h4 className="text-white font-bold mb-4">Jogi Nyilatkozat</h4>
            <ul className="space-y-2">
              <li><a href="#" className="hover:text-green-400">Felhasználási Feltételek</a></li>
              <li><a href="#" className="hover:text-green-400">Adatvédelem</a></li>
              <li><a href="#" className="hover:text-green-400">Felelősségkizárás</a></li>
            </ul>
          </div>

          <div>
            <h4 className="text-white font-bold mb-4">Figyelmeztetés</h4>
            <div className="flex items-center gap-2 text-red-500 font-bold mb-2">
              <AlertTriangle size={16} /> 18+
            </div>
            <p className="text-xs leading-relaxed">
              A sportfogadás kockázattal jár és függőséget okozhat. Az oldalon található információk nem minősülnek pénzügyi tanácsadásnak. Csak saját felelősségre játssz.
            </p>
          </div>
        </div>
        
        <div className="border-t border-white/5 pt-8 text-center text-xs">
          &copy; 2026 Onyx AI Systems. Minden jog fenntartva. Developed for the Future.
        </div>
      </footer>

      {/* Animációk stílusa (Style tag a JSX-ben a gyors megoldásért) */}
      <style jsx global>{`
        @keyframes float {
          0% { transform: translateY(-100vh); opacity: 0; }
          50% { opacity: 0.5; }
          100% { transform: translateY(100vh); opacity: 0; }
        }
        .animate-float {
          animation: float linear infinite;
        }
        @keyframes fade-in-down {
          from { opacity: 0; transform: translateY(-10px); }
          to { opacity: 1; transform: translateY(0); }
        }
        .animate-fade-in-down {
          animation: fade-in-down 0.3s ease-out;
        }
      `}</style>
    </div>
  );
}

// Kisebb segédkomponensek
function Badge({ text }) {
  return (
    <span className="px-3 py-1 rounded-full bg-white/5 border border-white/10 text-xs font-mono text-gray-300">
      {text}
    </span>
  );
}

function StepCard({ number, title, desc }) {
  return (
    <div className="bg-[#0a0a0a] border border-white/10 p-6 rounded-2xl hover:border-green-500/30 transition-all group">
      <div className="text-4xl font-bold text-white/10 mb-4 group-hover:text-green-500/20 transition-colors">{number}</div>
      <h3 className="text-xl font-bold text-white mb-2">{title}</h3>
      <p className="text-gray-400 text-sm leading-relaxed">{desc}</p>
    </div>
  );
}