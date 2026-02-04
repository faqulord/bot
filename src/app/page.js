"use client";

import React, { useState } from 'react';
import { 
  Home, BookOpen, ShieldCheck, Zap, 
  Terminal, ArrowRight, Lock, Activity, 
  BarChart3, CheckCircle2 
} from 'lucide-react';

export default function OnyxObsidian() {
  const [activeTab, setActiveTab] = useState('home');

  return (
    <div className="min-h-screen bg-[#050505] text-white font-sans relative selection:bg-emerald-500/30">
      
      {/* --- BACKGROUND (Folyékony Fények) --- */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        {/* Felső zöldes köd */}
        <div className="orb w-[500px] h-[500px] bg-emerald-900/20 top-[-10%] left-[-10%]"></div>
        {/* Alsó kékes köd */}
        <div className="orb w-[400px] h-[400px] bg-teal-900/10 bottom-[-10%] right-[-10%] animation-delay-2000"></div>
        {/* Zaj textúra a prémium hatáshoz */}
        <div className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-10 mix-blend-overlay"></div>
      </div>

      {/* --- TARTALOM KONTÉNER --- */}
      <main className="relative z-10 pb-32 pt-10 px-6 max-w-2xl mx-auto min-h-screen flex flex-col">
        
        {/* --- FEJLÉC & LOGÓ --- */}
        <div className="flex items-center justify-between mb-12">
          <div className="flex items-center gap-4">
            {/* AZ ÚJ LOGÓ: DIGITAL EYE (CSS) */}
            <div className="relative w-12 h-12 flex items-center justify-center">
              {/* Külső gyűrű */}
              <div className="absolute inset-0 border border-white/10 rounded-full"></div>
              {/* Forgó effekt */}
              <div className="absolute inset-1 border-t-2 border-emerald-500 rounded-full animate-spin-slow"></div>
              {/* Írisz */}
              <div className="absolute w-6 h-6 bg-gradient-to-br from-emerald-400 to-teal-600 rounded-full shadow-[0_0_15px_rgba(16,185,129,0.5)] flex items-center justify-center">
                 {/* Pupilla */}
                 <div className="w-2 h-2 bg-black rounded-full"></div>
              </div>
            </div>
            <div>
              <h1 className="text-xl font-bold tracking-widest text-white">ONYX</h1>
              <p className="text-[10px] text-emerald-500 uppercase tracking-[0.2em]">Intelligence</p>
            </div>
          </div>
          
          <div className="text-xs font-mono text-gray-500 border border-white/5 px-2 py-1 rounded">
            v4.0 STABLE
          </div>
        </div>

        {/* --- DINAMIKUS TARTALOM --- */}
        <div className="flex-1 animate-in fade-in zoom-in duration-500">
          
          {/* 1. KEZDŐLAP (HOME) */}
          {activeTab === 'home' && (
            <div className="space-y-8">
              {/* Hero Kártya */}
              <div className="relative overflow-hidden rounded-3xl bg-gradient-to-b from-white/10 to-black border border-white/10 p-8 shadow-2xl">
                <div className="absolute top-0 right-0 p-4 opacity-50">
                   <div className="w-2 h-2 rounded-full bg-red-500 animate-ping"></div>
                </div>
                <h2 className="text-4xl font-extrabold leading-tight mb-4">
                  A Szerencse <br />
                  <span className="text-transparent bg-clip-text bg-gradient-to-r from-emerald-400 to-teal-200">
                    Már Nem Tényező.
                  </span>
                </h2>
                <p className="text-gray-400 text-sm leading-relaxed mb-8">
                  Az Onyx AI egy zárt rendszerű algoritmus, ami a valószínűségszámítás erejével teszi a sportfogadást befektetéssé.
                </p>
                <a href="https://t.me/SHANNA444" target="_blank" className="w-full py-4 bg-white text-black font-bold rounded-xl flex items-center justify-center gap-2 hover:bg-emerald-50 transition-colors">
                  Csatlakozás a Teszthez <ArrowRight size={18} />
                </a>
                <p className="text-center text-xs text-gray-500 mt-4">
                  <Lock size={10} className="inline mr-1" />
                  Korlátozott férőhely. Ingyenes próbaidőszak.
                </p>
              </div>

              {/* Statisztika Grid */}
              <div className="grid grid-cols-2 gap-4">
                <div className="bg-[#0A0A0A] p-5 rounded-2xl border border-white/5">
                  <Activity className="text-emerald-500 mb-2" size={20} />
                  <div className="text-2xl font-bold text-white">0.4s</div>
                  <div className="text-xs text-gray-500">Reakcióidő</div>
                </div>
                <div className="bg-[#0A0A0A] p-5 rounded-2xl border border-white/5">
                  <BarChart3 className="text-teal-500 mb-2" size={20} />
                  <div className="text-2xl font-bold text-white">Transzparens</div>
                  <div className="text-xs text-gray-500">Napi könyvelés</div>
                </div>
              </div>
            </div>
          )}

          {/* 2. TECHNOLÓGIA (TECH) */}
          {activeTab === 'tech' && (
            <div className="space-y-6">
              <h2 className="text-2xl font-bold">A Gép Lelke</h2>
              <div className="bg-[#0A0A0A] border border-white/10 p-6 rounded-3xl space-y-4">
                 <p className="text-gray-400 leading-relaxed text-sm">
                   Az emberi agy elfárad. Érzelmeket visz bele. Vissza akarja nyerni a veszteséget. <br/><br/>
                   <span className="text-white font-bold">Az Onyx nem ilyen.</span>
                 </p>
                 <div className="h-px w-full bg-white/5"></div>
                 <ul className="space-y-3">
                   <li className="flex gap-3 text-sm text-gray-300">
                     <CheckCircle2 className="text-emerald-500 shrink-0" size={18} />
                     <span>142 bajnokság egyidejű figyelése</span>
                   </li>
                   <li className="flex gap-3 text-sm text-gray-300">
                     <CheckCircle2 className="text-emerald-500 shrink-0" size={18} />
                     <span>Élő odds-mozgás analízis (API)</span>
                   </li>
                   <li className="flex gap-3 text-sm text-gray-300">
                     <CheckCircle2 className="text-emerald-500 shrink-0" size={18} />
                     <span>Sniper mód: Csak a 75. perc után lép be</span>
                   </li>
                 </ul>
              </div>
              
              <div className="p-4 bg-emerald-900/10 border border-emerald-500/20 rounded-2xl">
                 <div className="text-emerald-400 font-mono text-xs mb-2">{'>'} SYSTEM_LOG</div>
                 <div className="text-gray-500 font-mono text-xs">Scanning Japan J2... No signal.</div>
                 <div className="text-gray-500 font-mono text-xs">Scanning Brazil Serie B... No signal.</div>
                 <div className="text-white font-mono text-xs mt-1">Found: Rukh Lviv (Odds: 2.10) -{'>'} Signal Sent.</div>
              </div>
            </div>
          )}

          {/* 3. JOGI (LEGAL) */}
          {activeTab === 'legal' && (
            <div className="space-y-6">
              <h2 className="text-2xl font-bold">Jogi Nyilatkozat</h2>
              <div className="bg-[#0A0A0A] border border-white/10 p-6 rounded-3xl h-[60vh] overflow-y-auto custom-scroll text-sm text-gray-400 space-y-6">
                
                <div>
                   <h3 className="text-white font-bold mb-2">1. Szolgáltatás jellege</h3>
                   <p>Az Onyx AI egy statisztikai elemző szoftver. Nem nyújtunk pénzügyi tanácsadást. A közölt adatok csak információs célt szolgálnak.</p>
                </div>

                <div>
                   <h3 className="text-white font-bold mb-2">2. Kockázat</h3>
                   <p className="p-3 bg-red-900/10 border border-red-900/30 rounded-lg text-red-200">
                     A sportfogadás kockázatos. A múltbeli eredmények nem garantálják a jövőbeni sikert. Csak annyit kockáztass, amennyit nem félsz elveszíteni.
                   </p>
                </div>

                <div>
                   <h3 className="text-white font-bold mb-2">3. Korhatár</h3>
                   <p>Az oldal használata kizárólag 18 éven felülieknek engedélyezett.</p>
                </div>

                <div className="pt-4 border-t border-white/5 text-xs text-gray-600">
                  © 2026 Onyx AI Systems. Minden jog fenntartva.
                </div>
              </div>
            </div>
          )}

        </div>

      </main>

      {/* --- LEBEGŐ MENÜ (FLOATING DOCK) --- */}
      <div className="fixed bottom-8 left-1/2 transform -translate-x-1/2 z-50">
        <div className="flex items-center gap-1 bg-white/10 backdrop-blur-xl border border-white/10 p-2 rounded-full shadow-2xl">
          
          <NavButton 
            active={activeTab === 'home'} 
            onClick={() => setActiveTab('home')} 
            icon={<Home size={20} />} 
            label="Home"
          />
          
          <NavButton 
            active={activeTab === 'tech'} 
            onClick={() => setActiveTab('tech')} 
            icon={<Zap size={20} />} 
            label="Tech"
          />
          
          <NavButton 
            active={activeTab === 'legal'} 
            onClick={() => setActiveTab('legal')} 
            icon={<ShieldCheck size={20} />} 
            label="Jogi"
          />

        </div>
      </div>

      <style jsx global>{`
        .animate-spin-slow {
          animation: spin 8s linear infinite;
        }
        @keyframes spin {
          from { transform: rotate(0deg); }
          to { transform: rotate(360deg); }
        }
      `}</style>
    </div>
  );
}

// Menü Gomb Komponens
function NavButton({ active, onClick, icon, label }) {
  return (
    <button 
      onClick={onClick}
      className={`relative p-4 rounded-full transition-all duration-300 ${active ? 'bg-white text-black shadow-lg scale-110' : 'text-gray-400 hover:text-white hover:bg-white/5'}`}
    >
      {icon}
      {/* Aktív jelző pötty */}
      {active && <div className="absolute -bottom-1 left-1/2 transform -translate-x-1/2 w-1 h-1 bg-white rounded-full"></div>}
    </button>
  );
}