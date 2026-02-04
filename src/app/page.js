"use client";

import React, { useState } from 'react';
import { 
  TrendingUp, Shield, Activity, 
  ArrowRight, Check, X, Calendar, 
  ChevronRight, Lock 
} from 'lucide-react';

export default function OnyxFinance() {
  return (
    <div className="min-h-screen font-sans text-slate-100">
      
      {/* --- TOP TICKER (Tőzsdei Csík) --- */}
      <div className="bg-slate-900 border-b border-white/5 h-10 flex items-center overflow-hidden relative">
        <div className="animate-ticker flex gap-8 text-xs font-mono text-gray-400">
          <span className="text-green-400">Rukh Lviv vs Austria (WIN 1.85)</span>
          <span>•</span>
          <span className="text-green-400">Yokohama FC vs Kawasaki (WIN 2.10)</span>
          <span>•</span>
          <span className="text-red-400">Real Madrid vs Barca (LOSS)</span>
          <span>•</span>
          <span className="text-green-400">Santos vs Flamengo (WIN 1.95)</span>
          <span>•</span>
          <span className="text-green-400">NAPI ZÁRÁS: +12.500 Ft PROFIT</span>
        </div>
      </div>

      {/* --- NAVBAR --- */}
      <nav className="border-b border-white/5 bg-[#0f172a]/80 backdrop-blur-md sticky top-0 z-50">
        <div className="max-w-6xl mx-auto px-6 h-20 flex items-center justify-between">
          
          {/* LOGO: Tiszta, Geometrikus */}
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 bg-blue-600 rounded-sm transform rotate-45 flex items-center justify-center shadow-lg">
              <div className="w-3 h-3 bg-white transform -rotate-45"></div>
            </div>
            <span className="text-xl font-bold tracking-tight text-white">ONYX <span className="text-blue-500">FINANCIAL</span></span>
          </div>

          {/* MENÜ */}
          <div className="hidden md:flex gap-8 text-sm font-medium text-slate-400">
            <a href="#results" className="hover:text-white transition-colors">Eredmények</a>
            <a href="#technology" className="hover:text-white transition-colors">Technológia</a>
            <a href="#about" className="hover:text-white transition-colors">Rólunk</a>
          </div>

          <a href="https://t.me/SHANNA444" target="_blank" className="bg-white text-slate-900 px-5 py-2 rounded font-bold text-sm hover:bg-blue-50 transition-colors">
            Csatlakozás
          </a>
        </div>
      </nav>

      {/* --- HERO SECTION --- */}
      <header className="py-24 px-6 text-center max-w-4xl mx-auto">
        <div className="inline-block px-3 py-1 bg-blue-500/10 text-blue-400 rounded-full text-xs font-bold mb-6 border border-blue-500/20">
          ALGORITMIKUS SPORT-KERESKEDÉS v4.0
        </div>
        <h1 className="text-5xl md:text-6xl font-bold text-white mb-6 leading-tight">
          Adat alapú döntések. <br />
          <span className="text-blue-500">Mérhető eredmények.</span>
        </h1>
        <p className="text-xl text-slate-400 mb-10 max-w-2xl mx-auto">
          Az Onyx nem tippmix. Ez egy kockázatkezelő szoftver, amely valós idejű piaci anomáliákat keres a sportfogadás világában.
        </p>
        <div className="flex justify-center gap-4">
          <a href="https://t.me/SHANNA444" className="bg-blue-600 hover:bg-blue-500 text-white px-8 py-4 rounded-lg font-bold flex items-center gap-2 transition-all">
            Ingyenes Teszt <ArrowRight size={18} />
          </a>
        </div>
      </header>

      {/* --- EREDMÉNYEK (RESULTS DASHBOARD) - EZT KÉRTED! --- */}
      <section id="results" className="py-20 bg-slate-900 border-y border-white/5">
        <div className="max-w-5xl mx-auto px-6">
          <div className="flex items-center justify-between mb-8">
            <div>
              <h2 className="text-2xl font-bold text-white">Napi Teljesítmény Jelentés</h2>
              <p className="text-slate-400 text-sm">Utolsó zárás: 2026. Február 03. 23:00</p>
            </div>
            <div className="text-right">
              <div className="text-3xl font-bold text-green-500">+8.4 egység</div>
              <p className="text-slate-500 text-xs">Napi Profit Index</p>
            </div>
          </div>

          {/* TÁBLÁZAT */}
          <div className="bg-[#0f172a] border border-white/10 rounded-xl overflow-hidden shadow-2xl">
            <div className="grid grid-cols-4 bg-white/5 p-4 text-xs font-bold text-slate-400 uppercase tracking-wider">
              <div className="col-span-2">Mérkőzés / Esemény</div>
              <div className="text-center">Odds</div>
              <div className="text-right">Eredmény</div>
            </div>
            
            {/* Sor 1 */}
            <ResultRow 
              match="Rukh Lviv vs Austria Klagenfurt" 
              time="75. perc - Sniper Signal" 
              odds="1.85" 
              status="WIN" 
            />
            {/* Sor 2 */}
            <ResultRow 
              match="Düzcespor vs Zonguldak" 
              time="82. perc - Sniper Signal" 
              odds="2.10" 
              status="WIN" 
            />
            {/* Sor 3 */}
            <ResultRow 
              match="Sheger Ketema vs Suhul Shire" 
              time="76. perc - Sniper Signal" 
              odds="1.75" 
              status="LOSS" 
            />
            {/* Sor 4 */}
            <ResultRow 
              match="Santos vs Flamengo" 
              time="78. perc - Sniper Signal" 
              odds="1.95" 
              status="WIN" 
            />
             {/* Sor 5 */}
            <div className="p-4 text-center text-xs text-slate-500 bg-white/5">
              ... További 12 mérkőzés a zárt csoportban ...
            </div>
          </div>
          
          <p className="text-center text-xs text-slate-500 mt-6">
            *A táblázat az Onyx AI V4 algoritmus által generált valós jelzéseket tartalmazza. A múltbeli eredmények nem garantálják a jövőt.
          </p>
        </div>
      </section>

      {/* --- RÓLUNK / SZTORI --- */}
      <section id="about" className="py-20 px-6 max-w-4xl mx-auto">
        <h2 className="text-3xl font-bold mb-8">Nem hiszünk a szerencsében.</h2>
        <div className="grid md:grid-cols-2 gap-12 text-slate-400 leading-relaxed">
          <div className="space-y-4">
            <p>
              A sportfogadás 98%-a veszteséges. Miért? Mert az emberek érzelemből döntenek. Fáradtak. Kapzsiak. A fogadóirodák erre építenek.
            </p>
            <p>
              Mi szoftverfejlesztők vagyunk, nem szerencsejátékosok. Évekig elemeztük a piacot, mire rájöttünk: <strong>Az élő fogadásban van egy 30-60 másodperces késés</strong> a valós események és az oddsok frissülése között.
            </p>
          </div>
          <div className="space-y-4">
            <p>
              Az Onyx AI ezt a rést használja ki. A szoftverünk másodpercenként 140+ meccset figyel. Amikor egy meccs statisztikája (nyomás, lövések, szögletek) átlép egy kritikus szintet a 75. percben, a gép jelez.
            </p>
            <div className="flex items-center gap-2 text-white font-bold">
              <Check className="text-blue-500" />
              <span>Nincs érzelem. Csak matematika.</span>
            </div>
          </div>
        </div>
      </section>

      {/* --- JOGI LÁBLÉC --- */}
      <footer className="border-t border-white/5 bg-slate-900 pt-16 pb-8 text-xs text-slate-500">
        <div className="max-w-6xl mx-auto px-6 grid md:grid-cols-4 gap-8 mb-12">
          <div className="col-span-2">
            <h3 className="text-white font-bold mb-4">ONYX FINANCIAL</h3>
            <p className="max-w-xs">
              Professzionális adatelemző szoftverek sportpiaci befektetőknek.
            </p>
          </div>
          <div>
            <h4 className="text-white font-bold mb-4">Jogi Tájékoztatás</h4>
            <ul className="space-y-2">
              <li>Adatvédelmi Irányelvek</li>
              <li>Felhasználási Feltételek</li>
              <li>Kockázati Figyelmeztetés</li>
            </ul>
          </div>
          <div>
            <h4 className="text-white font-bold mb-4">Felelősségteljes Játék</h4>
            <p className="mb-2">18+ | A sportfogadás kockázatos.</p>
            <p>Ha problémád van a szerencsejátékkal, kérj segítséget.</p>
          </div>
        </div>
        <div className="text-center border-t border-white/5 pt-8">
          © 2026 Onyx AI Systems. Minden jog fenntartva.
        </div>
      </footer>
    </div>
  );
}

// Komponens a táblázat soraihoz (Hogy tiszta maradjon a kód)
function ResultRow({ match, time, odds, status }) {
  const isWin = status === 'WIN';
  return (
    <div className="grid grid-cols-4 p-4 border-b border-white/5 hover:bg-white/5 transition-colors items-center">
      <div className="col-span-2">
        <div className="font-bold text-white text-sm">{match}</div>
        <div className="text-xs text-slate-500">{time}</div>
      </div>
      <div className="text-center font-mono text-slate-300">{odds}</div>
      <div className="text-right">
        <span className={`px-2 py-1 rounded text-xs font-bold ${isWin ? 'bg-green-500/10 text-green-400' : 'bg-red-500/10 text-red-400'}`}>
          {status}
        </span>
      </div>
    </div>
  );
}