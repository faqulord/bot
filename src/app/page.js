import React from 'react';
import { ArrowRight, Terminal, BarChart3, ShieldCheck, Cpu } from 'lucide-react';

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-[#050505] text-gray-200 font-sans selection:bg-green-500/30">
      
      {/* --- NAVIGÁCIÓ --- */}
      <nav className="border-b border-white/10 backdrop-blur-md sticky top-0 z-50">
        <div className="max-w-6xl mx-auto px-4 h-16 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 rounded-full bg-green-500 animate-pulse"></div>
            <span className="font-bold text-xl tracking-tighter text-white">ONYX<span className="text-green-500">.AI</span></span>
          </div>
          <div className="hidden md:flex text-xs font-mono text-green-400 bg-green-500/10 px-3 py-1 rounded-full border border-green-500/20">
            SYSTEM STATUS: ONLINE v4.0
          </div>
        </div>
      </nav>

      {/* --- HERO SZEKCIÓ --- */}
      <main className="max-w-6xl mx-auto px-4 pt-20 pb-32">
        <div className="text-center max-w-3xl mx-auto space-y-8">
          
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/5 border border-white/10 text-sm text-green-400 mb-4">
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-green-500"></span>
            </span>
            BÉTA TESZT FÁZIS: Csatlakozás Ingyenes
          </div>

          <h1 className="text-5xl md:text-7xl font-bold tracking-tight text-white leading-tight">
            A Sportfogadás <br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-green-400 to-emerald-700">Tudomány lett.</span>
          </h1>
          
          <p className="text-lg md:text-xl text-gray-400 leading-relaxed">
            Felejtsd el a megérzéseket. Az ONYX AI másodpercenként elemzi a világ összes mérkőzését. 
            Japántól Brazíliáig, mi ott vagyunk a 75. percben.
          </p>

          {/* CTA GOMBOK */}
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 mt-8">
            <a 
              href="https://t.me/SHANNA444" 
              target="_blank"
              rel="noopener noreferrer"
              className="group relative w-full sm:w-auto px-8 py-4 bg-white text-black font-bold text-lg rounded-xl hover:bg-green-400 transition-all duration-300 flex items-center justify-center gap-2"
            >
              <Terminal className="w-5 h-5" />
              CSATLAKOZÁS A TESZTHEZ
              <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </a>
            <p className="text-xs text-gray-500 mt-2 sm:mt-0">
              *Az első hónap ingyenes. <br className="sm:hidden"/> Csak komoly érdeklődőknek.
            </p>
          </div>
        </div>

        {/* --- STATISZTIKA GRID --- */}
        <div className="grid md:grid-cols-3 gap-6 mt-24">
          <div className="p-6 rounded-2xl bg-white/5 border border-white/10 hover:border-green-500/30 transition-colors">
            <BarChart3 className="w-10 h-10 text-green-500 mb-4" />
            <h3 className="text-xl font-bold text-white mb-2">Transzparens Zárás</h3>
            <p className="text-gray-400">
              Nincs titkolózás. A csoportban minden este 23:00-kor közzétesszük a hivatalos napi és havi statisztikát. Látod, hogyan teljesít a technológia.
            </p>
          </div>

          <div className="p-6 rounded-2xl bg-white/5 border border-white/10 hover:border-green-500/30 transition-colors">
            <Cpu className="w-10 h-10 text-green-500 mb-4" />
            <h3 className="text-xl font-bold text-white mb-2">Valós Idejű Elemzés</h3>
            <p className="text-gray-400">
              A Python alapú algoritmus 0-24-ben fut. Amíg te alszol, az ONYX akkor is keresi a matematikai eltéréseket az oddsokban.
            </p>
          </div>

          <div className="p-6 rounded-2xl bg-white/5 border border-white/10 hover:border-green-500/30 transition-colors">
            <ShieldCheck className="w-10 h-10 text-green-500 mb-4" />
            <h3 className="text-xl font-bold text-white mb-2">Sniper Stratégia</h3>
            <p className="text-gray-400">
              Nem lövöldözünk vaktában. Csak akkor küldünk jelzést, ha a meccs a végjátékban van, és a statisztika gólveszélyt mutat.
            </p>
          </div>
        </div>

        {/* --- TERMINAL DEMO --- */}
        <div className="mt-24 max-w-2xl mx-auto">
          <div className="bg-[#0c0c0c] rounded-lg border border-gray-800 p-4 font-mono text-sm shadow-2xl">
            <div className="flex gap-2 mb-4 border-b border-gray-800 pb-2">
              <div className="w-3 h-3 rounded-full bg-red-500"></div>
              <div className="w-3 h-3 rounded-full bg-yellow-500"></div>
              <div className="w-3 h-3 rounded-full bg-green-500"></div>
            </div>
            <div className="space-y-2">
              <div className="text-green-500">$ connecting to onyx_server...</div>
              <div className="text-gray-400">Success. Monitoring 142 live matches.</div>
              <div className="text-blue-400">Scanning: Japan J2 League... [NO SIGNAL]</div>
              <div className="text-blue-400">Scanning: Brazil Serie B... [NO SIGNAL]</div>
              <div className="text-yellow-500 font-bold">> ALERT FOUND: Rukh Lviv vs Austria Klagenfurt</div>
              <div className="pl-4 text-gray-300">Condition: 82. min | High Pressure | Odds: 2.40</div>
              <div className="pl-4 text-green-400">>> Sending Signal to Telegram Group... [SENT]</div>
              <div className="text-gray-500 animate-pulse">_</div>
            </div>
          </div>
        </div>

      </main>

      {/* --- FOOTER --- */}
      <footer className="border-t border-white/10 py-8 text-center text-gray-500 text-sm">
        <p>&copy; 2026 ONYX AI Systems. Minden jog fenntartva.</p>
        <p className="mt-2">A sportfogadás kockázattal jár. Csak saját felelősségre.</p>
      </footer>
    </div>
  );
}