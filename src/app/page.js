import React from 'react';
import { 
  LayoutDashboard, 
  Terminal, 
  ShieldCheck, 
  BarChart3, 
  ArrowRight, 
  Menu,
  Cpu,
  Globe,
  Zap
} from 'lucide-react';

export default function DashboardPage() {
  return (
    <div className="min-h-screen bg-[#050505] text-white font-sans selection:bg-green-500/30 overflow-x-hidden">
      
      {/* --- HÁTTÉR EFFEKT (AURORA) --- */}
      <div className="fixed inset-0 pointer-events-none z-0">
        <div className="absolute top-[-10%] left-[-10%] w-[500px] h-[500px] bg-green-600/20 rounded-full blur-[120px] animate-pulse"></div>
        <div className="absolute bottom-[10%] right-[-5%] w-[400px] h-[400px] bg-emerald-900/20 rounded-full blur-[100px]"></div>
      </div>

      {/* --- SIDEBAR (BAL OLDALI MENÜ) --- */}
      <aside className="fixed left-0 top-0 h-full w-20 md:w-64 bg-black/40 backdrop-blur-xl border-r border-white/5 z-50 flex flex-col hidden md:flex">
        {/* Logo */}
        <div className="h-20 flex items-center justify-center md:justify-start md:px-8 border-b border-white/5">
          <div className="w-8 h-8 bg-green-500 rounded-lg flex items-center justify-center shadow-[0_0_15px_rgba(34,197,94,0.6)]">
            <span className="font-bold text-black">O</span>
          </div>
          <span className="ml-3 font-bold text-xl tracking-wider hidden md:block">ONYX<span className="text-green-500">.AI</span></span>
        </div>

        {/* Menüpontok */}
        <nav className="flex-1 py-8 space-y-2 px-4">
          <MenuLink icon={<LayoutDashboard size={20} />} text="Vezérlőpult" active />
          <MenuLink icon={<Terminal size={20} />} text="Élő Terminál" />
          <MenuLink icon={<BarChart3 size={20} />} text="Statisztika" />
          <MenuLink icon={<ShieldCheck size={20} />} text="Technológia" />
        </nav>

        {/* Statusz */}
        <div className="p-4 border-t border-white/5">
          <div className="bg-white/5 rounded-xl p-4 flex items-center gap-3">
            <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse"></div>
            <div className="hidden md:block">
              <p className="text-xs text-gray-400">Rendszer állapota</p>
              <p className="text-sm font-bold text-green-400">ONLINE v4.0</p>
            </div>
          </div>
        </div>
      </aside>

      {/* --- MOBIL NAVIGÁCIÓ (CSAK TELEFONON) --- */}
      <div className="md:hidden fixed top-0 w-full h-16 bg-black/80 backdrop-blur-md border-b border-white/10 z-50 flex items-center justify-between px-4">
         <div className="flex items-center gap-2">
            <div className="w-6 h-6 bg-green-500 rounded flex items-center justify-center text-black font-bold text-xs">O</div>
            <span className="font-bold text-lg">ONYX</span>
         </div>
         <div className="text-xs bg-green-500/10 text-green-400 px-2 py-1 rounded border border-green-500/20">BÉTA</div>
      </div>

      {/* --- FŐ TARTALOM (JOBB OLDAL) --- */}
      <main className="md:ml-64 p-4 md:p-8 pt-24 md:pt-8 z-10 relative max-w-7xl mx-auto">
        
        {/* FEJLÉC ÜDVÖZLÉS */}
        <header className="mb-12 flex flex-col md:flex-row md:items-end justify-between gap-6">
          <div>
            <div className="inline-block px-3 py-1 rounded-full bg-green-500/10 border border-green-500/20 text-green-400 text-xs font-mono mb-2">
              BÉTA TESZT IDŐSZAK: <span className="text-white">NAPOKON BELÜL VÉGE</span>
            </div>
            <h1 className="text-4xl md:text-5xl font-bold text-white mb-2">
              Üdvözöl a <span className="text-transparent bg-clip-text bg-gradient-to-r from-green-400 to-emerald-600">Jövőben.</span>
            </h1>
            <p className="text-gray-400 max-w-xl">
              Az Onyx AI nem tippel. Az Onyx AI számol. Csatlakozz a rendszerhez, ami valós időben elemzi a világ sportfogadási piacát.
            </p>
          </div>
          
          <a href="https://t.me/SHANNA444" target="_blank" className="group flex items-center justify-center gap-2 bg-white text-black px-6 py-3 rounded-xl font-bold hover:bg-green-400 transition-all shadow-[0_0_20px_rgba(255,255,255,0.1)] hover:shadow-[0_0_30px_rgba(34,197,94,0.5)]">
            <Zap size={18} className="fill-black" />
            Ingyenes Csatlakozás
            <ArrowRight size={18} className="group-hover:translate-x-1 transition-transform" />
          </a>
        </header>

        {/* --- BENTO GRID (WIDGETEK) --- */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          
          {/* KÁRTYA 1: ÉLŐ TERMINÁL (Nagy kártya) */}
          <div className="md:col-span-2 bg-[#0A0A0A]/80 backdrop-blur-md border border-white/10 rounded-3xl p-6 relative overflow-hidden group hover:border-green-500/30 transition-all">
            <div className="flex items-center justify-between mb-4 border-b border-white/5 pb-2">
              <div className="flex items-center gap-2 text-gray-400">
                <Terminal size={16} />
                <span className="text-sm font-mono">LIVE_LOG_V4.py</span>
              </div>
              <div className="flex gap-1.5">
                <div className="w-2 h-2 rounded-full bg-red-500/50"></div>
                <div className="w-2 h-2 rounded-full bg-yellow-500/50"></div>
                <div className="w-2 h-2 rounded-full bg-green-500"></div>
              </div>
            </div>
            <div className="font-mono text-sm space-y-3 h-48 overflow-hidden relative">
               <div className="absolute inset-0 bg-gradient-to-b from-transparent via-transparent to-[#0A0A0A] z-10"></div>
               <p className="text-gray-500">$ init onyx_core_system...</p>
               <p className="text-green-500/80">{'>'} Global Connection Established (Ping: 14ms)</p>
               <p className="text-gray-400">Scanning: Premier League, La Liga, J1 League...</p>
               <div className="pl-4 border-l border-white/10 my-2">
                  <p className="text-blue-400 text-xs">Scanning Match: Yokohama vs Kawasaki</p>
                  <p className="text-gray-600 text-xs">... No value found.</p>
               </div>
               <p className="text-yellow-500 font-bold animate-pulse">{'>'} OPPORTUNITY DETECTED: Rukh Lviv</p>
               <p className="text-white pl-4">Stats: 78. min | High Pressure | Odds: 1.95</p>
               <p className="text-green-400 font-bold">{'>'}{'>'} SIGNAL SENT TO TELEGRAM.</p>
            </div>
          </div>

          {/* KÁRTYA 2: STATISZTIKA */}
          <div className="bg-[#0A0A0A]/80 backdrop-blur-md border border-white/10 rounded-3xl p-6 flex flex-col justify-between group hover:border-green-500/30 transition-all">
            <div>
              <div className="w-10 h-10 rounded-full bg-green-500/10 flex items-center justify-center mb-4">
                <BarChart3 className="text-green-500" size={20} />
              </div>
              <h3 className="text-xl font-bold text-white">Transzparencia</h3>
              <p className="text-sm text-gray-400 mt-2">
                Minden este 23:00-kor nyilvános zárás. Nincs titkolózás, csak a nyers számok.
              </p>
            </div>
            <div className="mt-4 p-3 bg-white/5 rounded-xl border border-white/5">
              <div className="flex justify-between text-sm mb-1">
                <span className="text-gray-400">Pontosság (V4)</span>
                <span className="text-green-400">Magas</span>
              </div>
              <div className="w-full h-1 bg-gray-700 rounded-full overflow-hidden">
                <div className="w-[85%] h-full bg-green-500"></div>
              </div>
            </div>
          </div>

          {/* KÁRTYA 3: VILÁGLEFEDETTSÉG */}
          <div className="bg-[#0A0A0A]/80 backdrop-blur-md border border-white/10 rounded-3xl p-6 group hover:border-green-500/30 transition-all">
             <div className="w-10 h-10 rounded-full bg-blue-500/10 flex items-center justify-center mb-4">
                <Globe className="text-blue-500" size={20} />
              </div>
              <h3 className="text-lg font-bold text-white">Global Scanner</h3>
              <p className="text-sm text-gray-400 mt-2 mb-4">
                Amíg te alszol, a gép dolgozik. Japán reggel, Brazília este. 0-24 lefedettség.
              </p>
              <div className="flex gap-2 text-xs">
                <span className="px-2 py-1 rounded bg-white/5 text-gray-300">🇪🇺 EU</span>
                <span className="px-2 py-1 rounded bg-white/5 text-gray-300">🇯🇵 JP</span>
                <span className="px-2 py-1 rounded bg-white/5 text-gray-300">🇧🇷 BR</span>
              </div>
          </div>

          {/* KÁRTYA 4: MIÉRT MI? (Széles) */}
          <div className="md:col-span-2 bg-gradient-to-br from-[#0F0F0F] to-[#050505] border border-white/10 rounded-3xl p-6 md:p-8 relative">
             <div className="absolute top-0 right-0 p-6 opacity-10">
               <Cpu size={100} />
             </div>
             <h3 className="text-2xl font-bold text-white mb-4">Ember vs. Mesterséges Intelligencia</h3>
             <div className="grid md:grid-cols-2 gap-8">
               <div className="space-y-2">
                 <h4 className="text-red-400 font-bold text-sm uppercase">Emberi Fogadó</h4>
                 <ul className="text-sm text-gray-400 space-y-1">
                   <li>❌ Érzelmi döntések (bosszúfogadás)</li>
                   <li>❌ Elfárad, nem tud mindent figyelni</li>
                   <li>❌ Csak a kedvenc csapatait ismeri</li>
                 </ul>
               </div>
               <div className="space-y-2">
                 <h4 className="text-green-400 font-bold text-sm uppercase">Onyx AI Bot</h4>
                 <ul className="text-sm text-gray-400 space-y-1">
                   <li>✅ 100% Matematika, 0% Érzelem</li>
                   <li>✅ Másodpercenként 100+ meccs elemzése</li>
                   <li>✅ Csak a "Value" (érték) érdekli</li>
                 </ul>
               </div>
             </div>
          </div>

        </div>

        {/* LÁBLÉC */}
        <footer className="mt-16 border-t border-white/5 pt-8 text-center text-gray-500 text-xs pb-24 md:pb-8">
          <p className="mb-2">18+ | A sportfogadás kockázattal jár. Játssz felelősséggel.</p>
          <p>&copy; 2026 ONYX AI Systems. Minden jog fenntartva.</p>
        </footer>

      </main>
    </div>
  );
}

// Kisebb komponens a menühöz (hogy tiszta legyen a kód)
function MenuLink({ icon, text, active }) {
  return (
    <div className={`flex items-center gap-3 px-4 py-3 rounded-xl cursor-pointer transition-all ${active ? 'bg-green-500/10 text-green-400 border border-green-500/20' : 'text-gray-400 hover:bg-white/5 hover:text-white'}`}>
      {icon}
      <span className="font-medium text-sm">{text}</span>
    </div>
  );
}