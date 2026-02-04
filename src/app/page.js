"use client";

import React, { useState } from 'react';
import { 
  Zap, ArrowRight, Lock, Mail, 
  Terminal, ShieldCheck, CheckCircle2, 
  Clock, AlertTriangle, ChevronRight,
  MessageCircle, HelpCircle
} from 'lucide-react';

export default function OnyxGenZ_Final() {
  // --- EREDMÉNYEK SZERKESZTÉSE ITT! ---
  const LAST_UPDATE = "2026. Február 04. 23:00"; 
  const MATCHES = [
    { name: "Rukh Lviv vs Austria", time: "Ma 14:06", result: "WIN 1.85", type: "Sniper" },
    { name: "Yokohama FC vs Kawasaki", time: "Ma 11:30", result: "WIN 2.10", type: "Sniper" },
    { name: "Santos U20 vs Flamengo", time: "Tegnap 21:45", result: "WIN 1.95", type: "Sniper" },
    { name: "Bayern M. (Am) vs 1860", time: "Tegnap 19:15", result: "LOSS", type: "Sniper" },
  ];
  // ------------------------------------

  return (
    <div className="min-h-screen font-sans selection:bg-purple-500/30 relative text-slate-200">
      
      {/* Háttér elemek */}
      <div className="glow-bg"></div>
      <div className="grid-overlay"></div>

      {/* --- NAVBAR --- */}
      <nav className="fixed top-0 w-full z-50 border-b border-white/5 bg-[#000212]/80 backdrop-blur-xl transition-all">
        <div className="max-w-6xl mx-auto px-6 h-16 flex items-center justify-between">
          
          {/* LOGO */}
          <div className="flex items-center gap-3 cursor-pointer" onClick={() => window.scrollTo(0,0)}>
            <div className="relative w-8 h-8 flex items-center justify-center bg-gradient-to-tr from-purple-600 to-blue-500 rounded-lg shadow-[0_0_15px_rgba(124,58,237,0.5)]">
               <Zap className="text-white fill-white" size={16} />
            </div>
            <span className="text-xl font-bold tracking-tight text-white">ONYX<span className="text-purple-500">.AI</span></span>
          </div>

          <a href="https://t.me/SHANNA444" target="_blank" className="hidden md:flex items-center gap-2 text-xs font-bold text-gray-400 hover:text-white transition-colors border border-white/10 px-3 py-1.5 rounded-full hover:bg-white/5">
            <Terminal size={12} /> Support Kapcsolat
          </a>
        </div>
      </nav>

      <main className="relative z-10 pt-32 pb-20 px-6">
        
        {/* --- HERO SECTION --- */}
        <div className="max-w-4xl mx-auto text-center mb-24 animate-in fade-in zoom-in duration-700">
          
          {/* LIMITÁLT HELYEK (Narancs Badge) */}
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-orange-500/10 border border-orange-500/20 text-orange-400 text-xs font-bold mb-8 animate-pulse cursor-default">
            <AlertTriangle size={14} />
            FIGYELEM: A BÉTA TESZT ALATT MÉG INGYENES!
          </div>

          <h1 className="text-5xl md:text-7xl font-extrabold text-white mb-6 leading-tight tracking-tight">
            A Sportfogadás <br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-purple-400 via-fuchsia-400 to-blue-400 drop-shadow-[0_0_15px_rgba(168,85,247,0.4)]">
              Forradalma.
            </span>
          </h1>
          
          <p className="text-lg md:text-xl text-gray-400 mb-10 max-w-2xl mx-auto leading-relaxed">
            2 év fejlesztés. Python alapú neurális háló. <br className="hidden md:block"/>
            Az Onyx AI valós időben vadássza le a hibás oddsokat, mielőtt a fogadóiroda észbe kapna.
          </p>

          {/* LOCK INFO BOX (Ár nélkül) */}
          <div className="bg-white/5 border border-white/10 p-5 rounded-2xl max-w-lg mx-auto mb-10 text-sm text-left flex items-start gap-4 hover:border-purple-500/30 transition-colors">
             <div className="p-2.5 bg-purple-500/20 rounded-xl text-purple-300 shrink-0">
               <Lock size={18} />
             </div>
             <div>
               <p className="text-white font-bold mb-1 text-base">Siess! A limitált helyek fogynak.</p>
               <p className="text-gray-400 leading-relaxed">
                 Ha elérjük a felhasználói limitet, a szolgáltatás <span className="text-white font-bold">havi előfizetéses lesz</span>. Aki most csatlakozik, annak <span className="text-green-400 font-bold">örökre ingyenes marad.</span>
               </p>
             </div>
          </div>

          {/* FŐ GOMBOK */}
          <div className="flex flex-col sm:flex-row justify-center gap-4">
            <a href="https://t.me/SHANNA444" target="_blank" className="bg-white text-black px-8 py-4 rounded-full font-bold text-lg hover:bg-purple-50 transition-all flex items-center justify-center gap-2 shadow-[0_0_30px_rgba(255,255,255,0.15)] hover:shadow-[0_0_40px_rgba(168,85,247,0.4)] hover:scale-105 active:scale-95">
              Ingyenes Csatlakozás <ArrowRight size={20} />
            </a>
            
            <a href="#tech" className="bg-white/5 text-white border border-white/10 px-8 py-4 rounded-full font-bold text-lg hover:bg-white/10 transition-all flex items-center justify-center gap-2 backdrop-blur-sm">
              <HelpCircle size={20} /> Hogyan működik?
            </a>
          </div>
        </div>

        {/* --- EREDMÉNYEK (RESULTS TABLE) --- */}
        <div className="max-w-3xl mx-auto mb-32 relative">
          {/* Díszítő elem a háttérben */}
          <div className="absolute -inset-1 bg-gradient-to-r from-purple-600 to-blue-600 rounded-2xl opacity-20 blur-lg"></div>
          
          <div className="relative bg-[#05050A] border border-white/10 rounded-2xl overflow-hidden shadow-2xl">
             <div className="flex items-center justify-between p-4 border-b border-white/10 bg-white/[0.02]">
                <h2 className="font-bold flex items-center gap-2 text-white">
                  <Clock className="text-purple-500" size={18} />
                  Előző Napi Zárás
                </h2>
                <span className="text-[10px] font-mono text-purple-300 bg-purple-500/10 px-2 py-1 rounded border border-purple-500/20">
                  {LAST_UPDATE}
                </span>
             </div>

             <div className="grid grid-cols-12 bg-white/5 p-3 text-[10px] md:text-xs font-bold text-gray-500 uppercase tracking-wider">
                <div className="col-span-6">Esemény</div>
                <div className="col-span-3 text-center">Időpont</div>
                <div className="col-span-3 text-right">Eredmény</div>
             </div>
             
             {MATCHES.map((match, index) => (
               <div key={index} className="grid grid-cols-12 p-4 border-b border-white/5 items-center hover:bg-white/5 transition-colors group cursor-default">
                  <div className="col-span-6">
                     <div className="font-bold text-white group-hover:text-purple-300 transition-colors text-sm">{match.name}</div>
                     <div className="text-[10px] text-gray-500 mt-0.5">{match.type} v4.0</div>
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
             
             {/* Táblázat alatti gomb */}
             <div className="p-4 bg-white/[0.02] text-center">
                <a href="https://t.me/SHANNA444" target="_blank" className="text-xs text-gray-400 hover:text-white flex items-center justify-center gap-1 transition-colors">
                  Összes korábbi eredmény megtekintése a csoportban <ChevronRight size={12} />
                </a>
             </div>
          </div>
        </div>

        {/* --- TECHNOLÓGIA (TECH SECTION) --- */}
        <div id="tech" className="grid md:grid-cols-2 gap-16 max-w-5xl mx-auto items-center mb-32 scroll-mt-24">
          <div className="space-y-8">
            <h2 className="text-3xl md:text-4xl font-bold text-white">
              Nem Tippmix. <br/>
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-blue-400">
                Adatbányászat.
              </span>
            </h2>
            <div className="space-y-6 text-gray-400 leading-relaxed text-lg">
              <p>
                Az emberek 98%-a veszít, mert érzelemből játszik. Mi kivettük az embert a rendszerből. 
              </p>
              <p>
                Az Onyx szerverei Frankfurtban futnak, és milliszekundumok alatt elemzik a beérkező adatokat a pályáról. Csak akkor jeleznek, ha a <strong>matematikai valószínűség</strong> a mi oldalunkon áll.
              </p>
            </div>
            
            <div className="flex flex-col gap-4">
              <FeatureItem text="Arbitrázs és Value Betting technológia" />
              <FeatureItem text="Automatikus kockázatkezelés (Bankroll Management)" />
              <FeatureItem text="0-24 órás globális piacfigyelés" />
            </div>
          </div>

          {/* Vizualizáció */}
          <div className="bg-gradient-to-br from-[#0f0f16] to-[#05050a] border border-white/10 rounded-3xl p-8 shadow-2xl relative overflow-hidden group hover:border-purple-500/30 transition-all duration-500">
             <div className="absolute top-0 right-0 w-40 h-40 bg-purple-500/20 rounded-full blur-[60px] group-hover:bg-purple-500/30 transition-all"></div>
             
             <div className="font-mono text-xs md:text-sm space-y-4 relative z-10">
                <div className="flex items-center gap-2 text-gray-500 border-b border-white/5 pb-2">
                   <div className="w-2 h-2 rounded-full bg-red-500"></div>
                   <div className="w-2 h-2 rounded-full bg-yellow-500"></div>
                   <div className="w-2 h-2 rounded-full bg-green-500"></div>
                   <span className="ml-2">onyx_core_v4.py</span>
                </div>
                
                <div className="space-y-2">
                   <div className="text-gray-500">$ connecting to neural_network...</div>
                   <div className="text-green-500/80">$ connection_established (14ms)</div>
                   <div className="pl-4 border-l border-white/10 my-3 space-y-2">
                      <div className="flex justify-between">
                         <span className="text-purple-400">Scanning:</span>
                         <span className="text-gray-300">J-League Div 2</span>
                      </div>
                      <div className="flex justify-between">
                         <span className="text-blue-400">Analysis:</span>
                         <span className="text-gray-300">Pressure Index High</span>
                      </div>
                   </div>
                   <div className="bg-green-500/10 border border-green-500/20 p-3 rounded text-green-400 font-bold animate-pulse">
                      {'>'} OPPORTUNITY FOUND: ODDS 1.85
                   </div>
                </div>
             </div>
          </div>
        </div>

        {/* --- NEWSLETTER --- */}
        <div className="max-w-2xl mx-auto text-center bg-[#080810] border border-white/10 rounded-3xl p-8 md:p-12 relative overflow-hidden group">
           <div className="absolute inset-0 bg-gradient-to-r from-purple-500/10 to-blue-500/10 opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
           
           <div className="relative z-10">
              <div className="w-14 h-14 bg-white/5 rounded-2xl flex items-center justify-center mx-auto mb-6 text-white border border-white/10 shadow-lg">
                <Mail size={28} />
              </div>
              <h2 className="text-2xl md:text-3xl font-bold text-white mb-3">Technológiai Hírlevél</h2>
              <p className="text-gray-400 mb-8 text-sm md:text-base">
                Ne maradj le a "Lottózó Robbantó" frissítésekről. Értesítünk, ha az AI új mintázatot talál a piacon.
              </p>
              
              <div className="flex flex-col sm:flex-row gap-3">
                 <input 
                   type="email" 
                   placeholder="Írd be az email címed..." 
                   className="flex-1 bg-black border border-white/20 text-white px-5 py-3.5 rounded-xl focus:outline-none focus:border-purple-500 transition-colors placeholder:text-gray-600"
                 />
                 <button className="bg-purple-600 hover:bg-purple-500 text-white font-bold px-8 py-3.5 rounded-xl transition-all shadow-lg hover:shadow-purple-500/25">
                   FELIRATKOZÁS
                 </button>
              </div>
           </div>
        </div>

      </main>

      {/* --- FOOTER --- */}
      <footer className="border-t border-white/5 bg-[#000212] pt-16 pb-24 text-center relative z-10">
        <div className="flex items-center justify-center gap-2 mb-6 opacity-50">
           <Zap size={20} />
           <span className="font-bold text-xl">ONYX.AI</span>
        </div>
        <p className="text-gray-600 text-xs mb-6 max-w-md mx-auto leading-relaxed px-6">
          © 2026 Onyx AI Systems. Minden jog fenntartva. <br/>
          A rendszer fejlesztői nem vállalnak felelősséget a fogadási veszteségekért. A sportfogadás kockázatos üzem.
        </p>
        <div className="flex justify-center gap-6 text-xs font-bold text-gray-500">
           <a href="#" className="hover:text-white transition-colors">Felhasználási Feltételek</a>
           <a href="#" className="hover:text-white transition-colors">Adatvédelem</a>
           <a href="#" className="hover:text-white transition-colors">Felelősségkizárás</a>
        </div>
      </footer>

      {/* --- LEBEGŐ CHAT GOMB (FIXED) --- */}
      <a 
        href="https://t.me/SHANNA444" 
        target="_blank"
        className="fixed bottom-6 right-6 z-50 bg-blue-600 hover:bg-blue-500 text-white p-4 rounded-full shadow-[0_0_20px_rgba(37,99,235,0.5)] hover:scale-110 transition-all duration-300 group"
      >
        <MessageCircle size={24} className="group-hover:animate-bounce" />
        <span className="absolute -top-2 -right-2 w-4 h-4 bg-red-500 rounded-full border-2 border-[#000212]"></span>
      </a>

    </div>
  );
}

// Kisebb komponens a listához
function FeatureItem({ text }) {
  return (
    <div className="flex items-center gap-4 text-gray-300 p-3 rounded-xl hover:bg-white/5 transition-colors border border-transparent hover:border-white/5 cursor-default">
      <div className="bg-purple-500/20 p-2 rounded-lg text-purple-400">
        <CheckCircle2 size={18} />
      </div>
      <span className="text-sm font-medium">{text}</span>
    </div>
  );
}