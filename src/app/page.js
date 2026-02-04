"use client";

import React, { useState, useEffect } from 'react';
import { 
  Menu, X, Zap, ShieldCheck, Cpu, 
  BarChart3, Mail, ChevronRight, Terminal, 
  AlertTriangle, ArrowRight, Lock, BookOpen 
} from 'lucide-react';

export default function UniverseApp() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [activePage, setActivePage] = useState('home'); // 'home', 'tech', 'guide', 'legal'

  // Csillagok generálása a háttérhez
  const [stars, setStars] = useState([]);
  useEffect(() => {
    const newStars = Array.from({ length: 50 }).map((_, i) => ({
      id: i,
      left: `${Math.random() * 100}%`,
      top: `${Math.random() * 100}%`,
      animDelay: `${Math.random() * 5}s`,
      size: `${Math.random() * 3}px`
    }));
    setStars(newStars);
  }, []);

  // Menü váltás logika
  const navigate = (page) => {
    setActivePage(page);
    setIsMenuOpen(false);
    window.scrollTo(0,0);
  };

  return (
    <div className="min-h-screen bg-black text-white font-sans relative overflow-hidden perspective-1000">
      
      {/* --- UNIVERZUM HÁTTÉR (3D Stars) --- */}
      <div className="fixed inset-0 z-0">
        <div className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-20 brightness-50"></div>
        {stars.map(star => (
          <div 
            key={star.id}
            className="absolute bg-white rounded-full animate-pulse"
            style={{
              left: star.left,
              top: star.top,
              width: star.size,
              height: star.size,
              opacity: Math.random(),
              boxShadow: `0 0 ${Math.random() * 10}px white`,
              transition: 'all 5s linear'
            }} 
          />
        ))}
        {/* Mélység effekt */}
        <div className="absolute inset-0 bg-gradient-to-b from-black via-transparent to-green-900/10"></div>
      </div>

      {/* --- NAVBAR --- */}
      <nav className="fixed top-0 w-full z-50 p-6 flex justify-between items-center bg-gradient-to-b from-black/90 to-transparent">
        <div onClick={() => navigate('home')} className="flex items-center gap-3 cursor-pointer z-50">
           <div className="w-10 h-10 rounded-full border border-green-500/50 bg-black flex items-center justify-center relative shadow-[0_0_20px_rgba(34,197,94,0.4)]">
              <div className="w-3 h-3 bg-green-500 rounded-full animate-ping absolute"></div>
              <div className="w-3 h-3 bg-green-500 rounded-full relative z-10"></div>
           </div>
           <span className="font-bold text-2xl tracking-tighter">ONYX<span className="text-green-500">.AI</span></span>
        </div>

        {/* HAMBURGER GOMB (Jobb oldalon) */}
        <button 
          onClick={() => setIsMenuOpen(true)} 
          className="z-50 p-2 rounded-full bg-white/5 border border-white/10 hover:bg-green-500 hover:text-black transition-all"
        >
          <Menu size={28} />
        </button>
      </nav>

      {/* --- SIDEBAR MENU (Sliding from Right) --- */}
      <div className={`fixed inset-0 z-[100] bg-black/95 backdrop-blur-xl transition-transform duration-500 ease-out ${isMenuOpen ? 'translate-x-0' : 'translate-x-full'}`}>
        <div className="flex justify-end p-6">
          <button onClick={() => setIsMenuOpen(false)} className="p-2 rounded-full bg-white/10 hover:bg-red-500 transition-colors">
            <X size={32} />
          </button>
        </div>
        <div className="flex flex-col items-center justify-center h-[80vh] space-y-8 text-center">
          <MenuPoint onClick={() => navigate('home')} text="Kezdőlap" icon={<Zap />} active={activePage === 'home'} />
          <MenuPoint onClick={() => navigate('tech')} text="Technológia & Sztori" icon={<Cpu />} active={activePage === 'tech'} />
          <MenuPoint onClick={() => navigate('guide')} text="Használati Útmutató" icon={<BookOpen />} active={activePage === 'guide'} />
          <MenuPoint onClick={() => navigate('legal')} text="Jogi & Feltételek" icon={<ShieldCheck />} active={activePage === 'legal'} />
          
          <a href="https://t.me/SHANNA444" target="_blank" className="mt-8 px-8 py-4 bg-green-500 text-black font-bold text-xl rounded-full shadow-[0_0_30px_rgba(34,197,94,0.6)] animate-pulse">
            CSATLAKOZÁS
          </a>
        </div>
      </div>

      {/* --- TARTALOM VÁLTÓ (Dynamic Page Content) --- */}
      <main className="relative z-10 pt-32 pb-20 px-6 min-h-screen flex flex-col items-center justify-center">
        
        {/* 1. HOME PAGE */}
        {activePage === 'home' && (
          <div className="text-center max-w-4xl animate-fade-in-up">
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-red-500/10 border border-red-500/40 text-red-400 text-xs font-bold mb-8 animate-pulse">
              <Lock size={12} />
              ZÁRT BÉTA: CSAK MEGHÍVÁSSAL
            </div>
            
            <h1 className="text-6xl md:text-8xl font-extrabold tracking-tight mb-6 leading-tight">
              A JÖVŐ <br/>
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-green-400 via-emerald-300 to-white drop-shadow-[0_0_30px_rgba(34,197,94,0.3)]">
                MEGÉRKEZETT.
              </span>
            </h1>
            
            <p className="text-xl text-gray-400 mb-10 max-w-2xl mx-auto font-light">
              Ez nem tippmix. Ez lottózó robbantás matematikával. <br/>
              Mesterséges Intelligencia, ami látja azt, amit te nem.
            </p>

            <div className="flex flex-col gap-4 max-w-md mx-auto">
              <a href="https://t.me/SHANNA444" target="_blank" className="bg-white text-black h-16 rounded-2xl font-bold text-lg flex items-center justify-center gap-3 hover:scale-105 transition-transform">
                <Terminal /> INGYENES TESZT START
              </a>
              <button onClick={() => navigate('tech')} className="bg-white/5 border border-white/10 h-16 rounded-2xl text-white font-medium hover:bg-white/10 transition-colors">
                Hogyan működik a gép?
              </button>
            </div>
            
            {/* Stats Bar */}
            <div className="mt-20 grid grid-cols-3 gap-4 border-t border-white/10 pt-8">
              <div><h3 className="text-2xl font-bold text-white">0.02s</h3><p className="text-xs text-gray-500">Elemzési idő</p></div>
              <div><h3 className="text-2xl font-bold text-green-400">98%</h3><p className="text-xs text-gray-500">Matematikai Pontosság</p></div>
              <div><h3 className="text-2xl font-bold text-white">24/7</h3><p className="text-xs text-gray-500">Üzemidő</p></div>
            </div>
          </div>
        )}

        {/* 2. TECH PAGE (Sztori) */}
        {activePage === 'tech' && (
          <div className="max-w-3xl animate-fade-in">
            <h2 className="text-4xl font-bold mb-8 border-l-4 border-green-500 pl-6">A Technológiáról</h2>
            <div className="space-y-6 text-gray-300 text-lg leading-relaxed bg-black/50 p-8 rounded-3xl border border-white/10 backdrop-blur-md">
              <p>
                2024-ben kezdtük a fejlesztést. A cél nem egy újabb tippadó csoport volt. A cél a <strong>Fogadóirodák Algoritmusának Megfejtése</strong> volt.
              </p>
              <p>
                Az Onyx Bot (V4.0) nem "érez". Nem szurkol a Real Madridnak. Az Onyx Bot nyers adatokat dolgoz fel másodpercenként 140 mérkőzésről.
              </p>
              <div className="my-8 p-6 bg-green-900/10 rounded-xl border border-green-500/20">
                <h3 className="text-green-400 font-bold mb-2">Hogyan "látja" a jövőt?</h3>
                <p className="text-sm">
                  Amikor a meccsen nő a nyomás (támadások száma, veszélyes akciók, szögletek), az oddsok még nem reagálnak azonnal. Van egy 30-60 másodperces ablak. <strong>Mi ebben az ablakban lövünk.</strong>
                </p>
              </div>
              <p>
                Ez az a technológiai fölény, ami miatt a tesztfázisban korlátozzuk a létszámot. Ha túl sokan használják, a bukmékerek rájönnek.
              </p>
            </div>
            <button onClick={() => navigate('home')} className="mt-8 text-gray-500 hover:text-white flex items-center gap-2">
              <ArrowRight className="rotate-180" /> Vissza a főoldalra
            </button>
          </div>
        )}

        {/* 3. GUIDE PAGE (Útmutató) */}
        {activePage === 'guide' && (
          <div className="max-w-3xl w-full animate-fade-in">
             <h2 className="text-4xl font-bold mb-8 text-center">Felhasználói Kézikönyv</h2>
             <div className="space-y-4">
                <GuideStep num="1" title="Értesítés" text="Ne nézd a telefont egész nap. Ha az Onyx talál valamit, a Telegramon pittyegni fog. (Hangos értesítést kapcsolj be!)" />
                <GuideStep num="2" title="Gyors Reakció" text="Azonnal nyisd meg a fogadóirodát (22Bet, Rocky, stb.). A jelzés pillanatában az odds még magas, de gyorsan zuhan." />
                <GuideStep num="3" title="Fix Tét" text="Sose térj el a stratégiától. Ha a gép azt mondja 'GÓL', akkor gólt raksz. Ne kombináld, ne okoskodj." />
                <GuideStep num="4" title="Profit Zárás" text="Este 23:00-kor küldjük az összesítést. Élvezd a profitot." />
             </div>
             
             <div className="mt-12 p-6 bg-black border border-white/20 rounded-2xl text-center">
                <h3 className="text-xl font-bold mb-2">Kérdésed van?</h3>
                <p className="text-gray-400 mb-4">A tesztelőknek 0-24 support jár.</p>
                <a href="https://t.me/SHANNA444" className="text-green-500 font-bold underline">Írj az Adminnak</a>
             </div>
          </div>
        )}

        {/* 4. LEGAL PAGE (Jogi) */}
        {activePage === 'legal' && (
          <div className="max-w-4xl animate-fade-in text-gray-400 text-sm">
            <h2 className="text-3xl font-bold text-white mb-8">Jogi Nyilatkozat & Feltételek</h2>
            
            <div className="space-y-6 bg-white/5 p-8 rounded-2xl border border-white/10 h-[60vh] overflow-y-auto custom-scroll">
              <section>
                <h3 className="text-white font-bold text-lg mb-2">1. Általános Tájékoztatás</h3>
                <p>
                  Az Onyx AI Systems (továbbiakban: Szolgáltató) egy statisztikai elemző szoftver. A weboldalon és a kapcsolódó Telegram csoportokban megjelenő információk kizárólag tájékoztató jellegűek, és nem minősülnek pénzügyi, befektetési vagy jogi tanácsadásnak.
                </p>
              </section>

              <section>
                <h3 className="text-white font-bold text-lg mb-2">2. Kockázati Figyelmeztetés</h3>
                <p className="text-red-400 font-medium">
                  A sportfogadás jelentős pénzügyi kockázattal jár. A múltbeli eredmények (beleértve az AI által generált teszteredményeket is) nem jelentenek garanciát a jövőbeni teljesítményre. A Felhasználó teljes mértékben saját felelősségére használja az információkat.
                </p>
              </section>

              <section>
                <h3 className="text-white font-bold text-lg mb-2">3. Felelősségkizárás</h3>
                <p>
                  A Szolgáltató nem vállal felelősséget semmilyen közvetlen vagy közvetett kárért, amely a szolgáltatás használatából ered. A szoftver technikai hibáiért, vagy a harmadik fél (fogadóirodák) általi korlátozásokért felelősséget nem vállalunk.
                </p>
              </section>

              <section>
                <h3 className="text-white font-bold text-lg mb-2">4. 18+ Korhatár</h3>
                <p>
                  Az oldal látogatása és a szolgáltatás használata kizárólag 18. életévüket betöltött személyek számára engedélyezett.
                </p>
              </section>
            </div>
            
            <div className="mt-4 flex items-center gap-2 text-xs text-gray-600 justify-center">
              <ShieldCheck size={14} />
              <span>Utolsó frissítés: 2026. Február 4.</span>
            </div>
          </div>
        )}

        {/* EMAIL SUBSCRIPTION (Minden oldalon alul) */}
        {activePage === 'home' && (
          <div className="mt-20 w-full max-w-xl text-center border-t border-white/10 pt-10">
            <p className="text-gray-400 mb-4 text-sm">
              Iratkozz fel a technológiai hírlevélre. Értesítünk, ha a rendszer szintet lép.
            </p>
            <div className="flex gap-2">
              <input type="email" placeholder="Email cím..." className="flex-1 bg-white/5 border border-white/10 rounded-lg px-4 py-3 text-white focus:outline-none focus:border-green-500 transition-colors" />
              <button className="bg-green-600 hover:bg-green-500 text-black font-bold px-6 rounded-lg transition-colors">
                <Mail size={20} />
              </button>
            </div>
          </div>
        )}

      </main>

      {/* --- CSS Animációk definiálása a komponensen belül --- */}
      <style jsx global>{`
        @keyframes fade-in-up {
          from { opacity: 0; transform: translateY(20px); }
          to { opacity: 1; transform: translateY(0); }
        }
        .animate-fade-in-up {
          animation: fade-in-up 0.8s ease-out forwards;
        }
        .custom-scroll::-webkit-scrollbar {
          width: 5px;
        }
        .custom-scroll::-webkit-scrollbar-thumb {
          background: #22c55e;
          border-radius: 10px;
        }
      `}</style>
    </div>
  );
}

// Menüpont Komponens
function MenuPoint({ text, icon, onClick, active }) {
  return (
    <div 
      onClick={onClick}
      className={`text-2xl font-medium cursor-pointer flex items-center gap-4 transition-all duration-300 ${active ? 'text-green-400 scale-110' : 'text-gray-400 hover:text-white'}`}
    >
      {icon}
      <span>{text}</span>
    </div>
  );
}

function GuideStep({ num, title, text }) {
  return (
    <div className="flex gap-6 items-start bg-white/5 p-6 rounded-xl border border-white/5 hover:border-green-500/30 transition-colors">
      <div className="text-4xl font-bold text-green-500/20">{num}</div>
      <div>
        <h3 className="text-xl font-bold text-white mb-2">{title}</h3>
        <p className="text-gray-400 text-sm leading-relaxed">{text}</p>
      </div>
    </div>
  );
}