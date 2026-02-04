"use client";

import React, { useState } from 'react';
import { 
  Zap, ArrowRight, Lock, Mail, 
  Terminal, ShieldCheck, CheckCircle2, 
  Clock, AlertTriangle, ChevronRight 
} from 'lucide-react';

export default function OnyxGenZ() {
  // --- EREDMÉNYEK SZERKESZTÉSE ITT! ---
  // Minden este 23:00-kor írd át ezeket az adatokat:
  const LAST_UPDATE = "2026. Február 04. 23:00"; // Mai dátum
  const MATCHES = [
    { name: "Rukh Lviv vs Austria", time: "Ma 14:06", result: "WIN 1.85", type: "Sniper" },
    { name: "Yokohama FC vs Kawasaki", time: "Ma 11:30", result: "WIN 2.10", type: "Sniper" },
    { name: "Santos U20 vs Flamengo", time: "Tegnap 21:45", result: "WIN 1.95", type: "Sniper" },
    { name: "Bayern M. (Am) vs 1860", time: "Tegnap 19:15", result: "LOSS", type: "Sniper" },
  ];
  // ------------------------------------

  return (
    <div className="min-h-screen font-sans selection:bg-purple-500/30 relative">
      
      {/* Háttér elemek */}
      <div className="glow-bg"></div>
      <div className="grid-overlay"></div>

      {/* --- NAVBAR --- */}
      <nav className="fixed top-0 w-full z-50 border-b border-white/5 bg-[#000212]/70 backdrop-blur-xl">
        <div className="max-w-6xl mx-auto px-6 h-16 flex items-center justify-between">
          
          {/* ÚJ LOGO: Minimalista, Futurisztikus */}
          <div className="flex items-center gap-3">
            <div className="relative w-8 h-8 flex items-center justify-center bg-gradient-to-tr from-purple-600 to-blue-500 rounded-lg shadow-[0_0_15px_rgba(124,58,237,0.5)]">
               <Zap className="text-white fill-white" size={16} />
            </div>
            <span className="text-xl font-bold tracking-tight text-white">ONYX<span className="text-purple-500">.AI</span></span>
          </div>

          <a href="https://t.me/SHANNA444" target="_blank" className="hidden md:flex items-center gap-2 text-sm font-bold text-gray-300 hover:text-white transition-colors">
            <Terminal size={14} /> Fejlesztői Kapcsolat
          </a>
        </div>
      </nav>

      <main className="relative z-10 pt-32 pb-20 px-6">
        
        {/* --- HERO SECTION --- */}
        <div className="max-w-4xl mx-auto text-center mb-20">
          
          {/* LIMITÁLT HELYEK FIGYELMEZTETÉS (Piros/Narancs) */}
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-orange-500/10 border border-orange-500/20 text-orange-400 text-xs font-bold mb-8 animate-pulse">
            <AlertTriangle size={14} />
            FIGYELEM: A BÉTA TESZT ALATT MÉG INGYENES!
          </div>

          <h1 className="text-5xl md:text-7xl font-extrabold text-white mb-6 leading-tight">
            A Sportfogadás <br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-purple-400 via-fuchsia-400 to-blue-400">
              Forradalma.
            </span>
          </h1>
          
          <p className="text-lg md:text-xl text-gray-400 mb-8 max-w-2xl mx-auto leading-relaxed">
            2 év fejlesztés. Python alapú neurális háló. <br className="hidden md:block"/>
            Az Onyx AI valós időben vadássza le a hibás oddsokat, mielőtt a fogadóiroda észbe kapna.
          </p>

          <div className="bg-white/5 border border-white/10 p-4 rounded-xl max-w-lg mx-auto mb-8 text-sm text-left flex items-start gap-3">
             <div className="p-2 bg-red-500/20 rounded-lg text-red-400 shrink-0">
               <Lock size={16} />
             </div>
             <div>
               <p className="text-white font-bold mb-1">Siess! A limitált helyek fogynak.</p>
               <p className="text-gray-400">Ha elérjük a felhasználói limitet, a szolgáltatás havi előfizetéses lesz (99 EUR/hó). Aki most csatlakozik, annak örökre ingyenes marad.</p>
             </div>
          </div>

          <div className="flex flex-col sm:flex-row justify-center gap-4">
            <a href="https://t.me/SHANNA444" target="_blank" className="bg-white text-black px-8 py-4 rounded-full font-bold text-lg hover:bg-purple-50 transition-all flex items-center justify-center gap-2 shadow-[0_0_20px_rgba(255,255,255,0.2)]">
              Ingyenes Csatlakozás <ArrowRight size={20} />
            </a>
          </div>
        </div>

        {/* --- EREDMÉNYEK (RESULTS TABLE) --- */}
        <div className="max-w-3xl mx-auto mb-24">
          <div className="flex items-center justify-between mb-4 px-2">
            <h2 className="text-xl font-bold flex items-center gap-2">
              <Clock className="text-purple-500" size={20} />
              Onyx Előző Napi Eredmények
            </h2>
            <span className="text-xs font-mono text-purple-400 bg-purple-500/10 px-2 py-1 rounded border border-purple-500/20">
              ZÁRÁS: {LAST_UPDATE}
            </span>
          </div>

          <div className="bg-[#05050A] border border-white/10 rounded-2xl overflow-hidden shadow-2xl">
             <div className="grid grid-cols-12 bg-white/5 p-3 text-xs font-bold text-gray-500 uppercase">
                <div className="col-span-6">Mérkőzés / Esemény</div>
                <div className="col-span-3 text-center">Időpont</div>
                <div className="col-span-3 text-right">Eredmény</div>
             </div>
             
             {/* Eredmény sorok generálása */}
             {MATCHES.map((match, index) => (
               <div key={index} className="grid grid-cols-12 p-4 border-b border-white/5 items-center hover:bg-white/5 transition-colors group">
                  <div className="col-span-6">
                     <div className="font-bold text-white group-hover:text-purple-300 transition-colors">{match.name}</div>
                     <div className="text-[10px] text-gray-500">{match.type} Algorithm v4.0</div>
                  </div>
                  <div className="col-span-3 text-center text-xs text-gray-400 font-mono">
                     {match.time}
                  </div>
                  <div className="col-span-3 text-right">
                     <span className={`px-2 py-1 rounded text-xs font-bold ${match.result.includes('WIN') ? 'bg-green-500/20 text-green-400 border border-green-500/30' : 'bg-red-500/20 text-red-400 border border-red-500/30'}`}>
                        {match.result}
                     </span>
                  </div>
               </div>
             ))}
             
             <div className="p-3 text-center text-xs text-gray-600 bg-white/[0.02]">
                Adatok forrása: Onyx Manager Module (Verified)
             </div>
          </div>
        </div>

        {/* --- TECHNOLÓGIA (Rövid leírás) --- */}
        <div className="grid md:grid-cols-2 gap-12 max-w-5xl mx-auto items-center mb-24">
          <div className="space-y-6">
            <h2 className="text-3xl font-bold">Nem Tippmix. <br/><span className="text-purple-500">Adatbányászat.</span></h2>
            <p className="text-gray-400 leading-relaxed">
              Az emberek 98%-a veszít, mert érzelemből játszik. Mi kivettük az embert a rendszerből. 
              Az Onyx szerverei Frankfurtban futnak, és milliszekundumok alatt elemzik a beérkező adatokat a pályáról.
            </p>
            <ul className="space-y-3">
              <li className="flex items-center gap-3 text-gray-300">
                <CheckCircle2 className="text-purple-500" size={18} />
                <span>Arbitrázs és Value Betting technológia</span>
              </li>
              <li className="flex items-center gap-3 text-gray-300">
                <CheckCircle2 className="text-purple-500" size={18} />
                <span>Automatikus kockázatkezelés</span>
              </li>
            </ul>
          </div>
          {/* Glass Card Visual */}
          <div className="bg-gradient-to-br from-purple-900/20 to-blue-900/20 border border-white/10 rounded-3xl p-8 backdrop-blur-md relative overflow-hidden">
             <div className="absolute top-0 right-0 w-32 h-32 bg-purple-500/30 rounded-full blur-[50px]"></div>
             <div className="font-mono text-sm space-y-4 relative z-10">
                <div className="text-gray-500"># Connecting to Neural Network...</div>
                <div className="flex justify-between items-center bg-black/40 p-3 rounded-lg border border-white/5">
                   <span className="text-purple-300">Analyzing:</span>
                   <span className="text-white">J-League Div 2</span>
                </div>
                <div className="flex justify-between items-center bg-green-900/20 p-3 rounded-lg border border-green-500/30">
                   <span className="text-green-400 flex items-center gap-2"><Zap size={12}/> OPPORTUNITY</span>
                   <span className="text-white font-bold">Odds: 1.85</span>
                </div>
             </div>
          </div>
        </div>

        {/* --- EMAIL HÍRLEVÉL (Lottózó Robbantás) --- */}
        <div className="max-w-2xl mx-auto text-center bg-[#0A0A10] border border-white/10 rounded-3xl p-8 md:p-12 relative overflow-hidden">
           <div className="absolute inset-0 bg-gradient-to-r from-purple-500/5 to-blue-500/5"></div>
           <div className="relative z-10">
              <div className="w-12 h-12 bg-white/5 rounded-full flex items-center justify-center mx-auto mb-6 text-white">
                <Mail size={24} />
              </div>
              <h2 className="text-2xl font-bold text-white mb-2">Technológiai Hírlevél</h2>
              <p className="text-gray-400 mb-8 text-sm">
                Ne maradj le a "Lottózó Robbantó" frissítésekről. Értesítünk, ha az AI új mintázatot talál a piacon.
              </p>
              
              <div className="flex flex-col sm:flex-row gap-2">
                 <input 
                   type="email" 
                   placeholder="Írd be az email címed..." 
                   className="flex-1 bg-black border border-white/20 text-white px-5 py-3 rounded-xl focus:outline-none focus:border-purple-500 transition-colors placeholder:text-gray-600"
                 />
                 <button className="bg-purple-600 hover:bg-purple-500 text-white font-bold px-6 py-3 rounded-xl transition-colors">
                   FELIRATKOZÁS
                 </button>
              </div>
           </div>
        </div>

      </main>

      {/* --- FOOTER --- */}
      <footer className="border-t border-white/5 bg-[#000212] pt-12 pb-8 text-center">
        <p className="text-gray-600 text-xs mb-4">
          © 2026 Onyx AI Systems. Minden jog fenntartva. <br/>
          A rendszer fejlesztői nem vállalnak felelősséget a fogadási veszteségekért.
        </p>
        <div className="flex justify-center gap-4 text-xs font-bold text-gray-500">
           <a href="#" className="hover:text-white">ÁSZF</a>
           <span>•</span>
           <a href="#" className="hover:text-white">Adatvédelem</a>
        </div>
      </footer>

    </div>
  );
}