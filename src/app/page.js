import React from 'react';
import { ArrowRight, Terminal, BarChart3, ShieldCheck, Cpu, AlertTriangle, CheckCircle2 } from 'lucide-react';

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-[#050505] text-gray-200 font-sans selection:bg-green-500/30 scroll-smooth">
      
      {/* --- NAVIGÁCIÓ --- */}
      <nav className="border-b border-white/10 backdrop-blur-md sticky top-0 z-50 bg-black/50">
        <div className="max-w-7xl mx-auto px-4 h-20 flex items-center justify-between">
          
          {/* 4D LOGO EFFECT */}
          <div className="flex items-center gap-3 group cursor-pointer">
            <div className="relative w-10 h-10 perspective-1000">
              <div className="absolute inset-0 bg-green-500 rounded-lg opacity-20 group-hover:rotate-12 transition-transform duration-500 blur-md"></div>
              <div className="relative w-full h-full border-2 border-green-500 rounded-lg flex items-center justify-center bg-black group-hover:scale-110 transition-transform duration-300 shadow-[0_0_15px_rgba(34,197,94,0.5)]">
                <span className="font-bold text-green-400 text-xl">O</span>
              </div>
            </div>
            <div className="flex flex-col">
              <span className="font-bold text-2xl tracking-tighter text-white leading-none">
                ONYX<span className="text-green-500">.AI</span>
              </span>
              <span className="text-[10px] text-gray-400 tracking-widest uppercase">Sniper Systems</span>
            </div>
          </div>

          {/* ASZTALI MENÜ */}
          <div className="hidden md:flex items-center gap-8 text-sm font-medium text-gray-400">
            <a href="#miert-mi" className="hover:text-green-400 transition-colors">Miért az Onyx?</a>
            <a href="#technologia" className="hover:text-green-400 transition-colors">Technológia</a>
            <a href="#felelosseg" className="hover:text-red-400 transition-colors flex items-center gap-1">
              <AlertTriangle className="w-3 h-3" /> Felelősség
            </a>
          </div>

          <a 
            href="https://t.me/SHANNA444" 
            target="_blank"
            className="hidden md:flex text-xs font-bold text-black bg-green-500 px-4 py-2 rounded-full hover:bg-green-400 transition-all hover:shadow-[0_0_20px_rgba(34,197,94,0.4)]"
          >
            CSATLAKOZÁS
          </a>
        </div>
      </nav>

      {/* --- HERO SZEKCIÓ --- */}
      <main className="max-w-6xl mx-auto px-4 pt-20 pb-32">
        <div className="text-center max-w-4xl mx-auto space-y-8">
          
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-green-900/20 border border-green-500/20 text-xs font-mono text-green-400 mb-4 animate-pulse">
            <span className="w-2 h-2 rounded-full bg-green-500"></span>
            SYSTEM STATUS: ONLINE | TESZT FÁZIS AKTÍV
          </div>

          <h1 className="text-5xl md:text-7xl font-extrabold tracking-tight text-white leading-tight">
            A Sportfogadás többé nem <br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-green-400 via-emerald-500 to-teal-500 drop-shadow-[0_0_10px_rgba(34,197,94,0.3)]">
              Szerencse kérdése.
            </span>
          </h1>
          
          <p className="text-lg md:text-xl text-gray-400 leading-relaxed max-w-2xl mx-auto">
            Kifejlesztettünk egy technológiát, ami ott kezdődik, ahol az emberi agy elfárad. 
            Valós idejű adatfeldolgozás, 0% érzelem, 100% matematika.
          </p>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 mt-8">
            <a 
              href="https://t.me/SHANNA444" 
              target="_blank"
              rel="noopener noreferrer"
              className="group w-full sm:w-auto px-8 py-5 bg-white text-black font-bold text-lg rounded-2xl hover:bg-green-400 transition-all duration-300 flex items-center justify-center gap-3 shadow-[0_0_30px_rgba(255,255,255,0.1)] hover:shadow-[0_0_40px_rgba(34,197,94,0.6)]"
            >
              <Terminal className="w-6 h-6" />
              INGYENES TESZT START
              <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
            </a>
          </div>
          <p className="text-xs text-gray-500">*Korlátozott férőhely a tesztidőszak alatt.</p>
        </div>

        {/* --- KIK VAGYUNK / MIÉRT MI (Storytelling) --- */}
        <section id="miert-mi" className="mt-32 border-t border-white/10 pt-20">
          <div className="grid md:grid-cols-2 gap-16 items-center">
            <div className="space-y-6">
              <h2 className="text-3xl md:text-4xl font-bold text-white">
                Az Emberi Agy korlátai <br />
                <span className="text-red-500">vs.</span> Onyx AI
              </h2>
              <div className="space-y-4 text-gray-400">
                <p>
                  Valljuk be: az emberi agy képtelen egyszerre figyelni a Japán 2. ligát, a Brazil bajnokságot és egy német edzőmeccset. Elfáradsz. Érzelmeket viszel bele. Vissza akarod nyerni, amit elvesztettél.
                </p>
                <p className="font-semibold text-white">
                  Ez a legnagyobb hiba.
                </p>
                <p>
                  A fejlesztésünk hónapokat vett igénybe. A cél egyetlen dolog volt: 
                  <span className="text-green-400"> Kizárni az emberi tényezőt.</span> Az ONYX nem szurkol. Nem reménykedik. Az ONYX csak a nyers adatokat látja, és akkor lő, amikor a statisztikai valószínűség a mi oldalunkon áll.
                </p>
              </div>
              
              <ul className="space-y-3 mt-4">
                {['0-24 Monitorozás', 'Érzelemmentes Döntések', 'Azonnali Reakcióidő'].map((item) => (
                  <li key={item} className="flex items-center gap-2 text-white">
                    <CheckCircle2 className="w-5 h-5 text-green-500" /> {item}
                  </li>
                ))}
              </ul>
            </div>

            {/* Vizualizáció (Terminal) */}
            <div className="bg-[#0c0c0c] rounded-2xl border border-gray-800 p-6 font-mono text-sm shadow-2xl relative overflow-hidden group hover:border-green-500/30 transition-colors">
              <div className="absolute top-0 right-0 p-4 opacity-20">
                <Cpu className="w-24 h-24 text-green-500 animate-spin-slow" />
              </div>
              <div className="flex gap-2 mb-6 border-b border-gray-800 pb-4">
                <div className="w-3 h-3 rounded-full bg-red-500"></div>
                <div className="w-3 h-3 rounded-full bg-yellow-500"></div>
                <div className="w-3 h-3 rounded-full bg-green-500"></div>
              </div>
              <div className="space-y-3 relative z-10">
                <div className="text-gray-500"># Elemzési folyamat indítása...</div>
                <div className="text-blue-400">Scanning Global Markets... [OK]</div>
                <div className="text-gray-400">Analysing: Possession, Attacks, Shots on Target</div>
                <div className="text-yellow-500 font-bold mt-4">{'>'} POTENTIAL MATCH FOUND</div>
                <div className="pl-4 border-l-2 border-green-500/50 my-2">
                   <div className="text-white">Match: Rukh Lviv vs A. Klagenfurt</div>
                   <div className="text-green-400">Probability: 87.4% (Over 0.5 Goal)</div>
                   <div className="text-gray-400">Time: 78:12 | Pressure Index: HIGH</div>
                </div>
                {/* ITT VOLT A HIBA: A >> jeleket kicseréltem {'>'}{'>'}-re */}
                <div className="text-green-400 font-bold blink">{'>'}{'>'} SIGNAL SENT.</div>
              </div>
            </div>
          </div>
        </section>

        {/* --- STATISZTIKA SZEKCIÓ --- */}
        <section id="technologia" className="mt-32">
          <div className="grid md:grid-cols-3 gap-6">
            <div className="p-8 rounded-2xl bg-gradient-to-br from-white/5 to-transparent border border-white/10 hover:border-green-500/30 transition-all hover:-translate-y-1">
              <BarChart3 className="w-12 h-12 text-green-500 mb-6" />
              <h3 className="text-xl font-bold text-white mb-3">Transzparens Könyvelés</h3>
              <p className="text-gray-400">
                Nem árulunk zsákbamacskát. A csoportban minden este 23:00-kor automata zárás van. Látod a nyerőt és a vesztőt is. Így épül a bizalom.
              </p>
            </div>

            <div className="p-8 rounded-2xl bg-gradient-to-br from-white/5 to-transparent border border-white/10 hover:border-green-500/30 transition-all hover:-translate-y-1">
              <Cpu className="w-12 h-12 text-green-500 mb-6" />
              <h3 className="text-xl font-bold text-white mb-3">AI + Matematika</h3>
              <p className="text-gray-400">
                Ez már nem csak játék. Ez befektetés. A rendszerünk az arbitrázs és a value betting elveit használja, felturbózva gépi tanulással.
              </p>
            </div>

            <div className="p-8 rounded-2xl bg-gradient-to-br from-white/5 to-transparent border border-white/10 hover:border-green-500/30 transition-all hover:-translate-y-1">
              <ShieldCheck className="w-12 h-12 text-green-500 mb-6" />
              <h3 className="text-xl font-bold text-white mb-3">Sniper Mód</h3>
              <p className="text-gray-400">
                A legtöbb fogadó a kezdő sípszó előtt tippel. Mi nem. Mi kivárjuk a 75. percet, amikor a piac a legsebezhetőbb.
              </p>
            </div>
          </div>
        </section>

      </main>

      {/* --- JOGI LÁBLÉC & FIGYELMEZTETÉS (FONTOS!) --- */}
      <footer id="felelosseg" className="bg-[#020202] border-t border-white/5 pt-16 pb-8">
        <div className="max-w-6xl mx-auto px-4">
          
          <div className="grid md:grid-cols-2 gap-12 mb-12">
            <div>
              <div className="flex items-center gap-2 mb-4">
                 <span className="font-bold text-xl text-white">ONYX<span className="text-green-500">.AI</span></span>
              </div>
              <p className="text-gray-500 text-sm leading-relaxed">
                Az Onyx rendszer egy statisztikai elemző szoftver, amely a sportfogadás világában nyújt matematikai valószínűségszámítást. A célunk, hogy a szerencsejátékot tudatos befektetéssé alakítsuk át a technológia segítségével.
              </p>
            </div>
            
            <div className="text-sm text-gray-500 space-y-4 border-l border-white/10 pl-6">
              <div className="flex items-center gap-3 text-red-500 font-bold">
                <div className="border border-red-500 rounded-full w-8 h-8 flex items-center justify-center">18+</div>
                <span>FELELŐSSÉGTELJES JÁTÉK</span>
              </div>
              <p>
                A sportfogadás kockázattal jár és függőséget okozhat. Csak akkora összeggel játssz, aminek az elvesztését megengedheted magadnak!
              </p>
              <p>
                Ha szerencsejáték problémákkal küzdesz, kérj segítséget: <br />
                <a href="http://www.szerencsejatek.hu" className="underline hover:text-white">Részvételi szabályzat és segítség</a>
              </p>
            </div>
          </div>

          <div className="border-t border-white/5 pt-8 text-center text-xs text-gray-600">
            <p className="mb-2">
              Jogi nyilatkozat: Az oldalon található információk nem minősülnek pénzügyi tanácsadásnak. 
              A tesztidőszak alatt a szolgáltatás ingyenes, a tippek felhasználása saját felelősségre történik.
            </p>
            <p>&copy; 2026 ONYX AI Systems. Minden jog fenntartva.</p>
          </div>

        </div>
      </footer>
    </div>
  );
}